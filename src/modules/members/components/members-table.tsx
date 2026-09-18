import { SimpleCard } from "@/components/simple-card";
import {
  CodeIcon,
  DownloadIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { DataTable } from "@/components/tables/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/tables/column-header";
import { useState } from "react";
import { Schema } from "./members-filters";
import { MiembroResponse } from "../types/members.types";
import { useMembersPaginated } from "../hooks/useMembersGet";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PrintCards from "./print-cards/print-cards";
import MembersForm from "./members-form";
import { useDeleteMember } from "../hooks/useMembersDelete";
import xlsx from "json-as-xlsx";
import { toast } from "sonner";
import { useAssignCodeMember, useAssignCodes } from "../hooks/useAssignCodes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTypeMembers } from "@/modules/configuration/hooks/useTypeMembersGet";

interface MembersTableProps {
  filters: Schema | null;
}

const MembersTable = ({ filters }: MembersTableProps) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [orderBy, setOrderBy] = useState("nombres");
  const [orderDir, setOrderDir] = useState("desc");

  const { data, isLoading, isFetching, isError, error, refetch } =
    useMembersPaginated({
      page,
      page_size: limit,
      order_by: orderBy,
      order_dir: orderDir,
      filters: {
        ...filters,
        es_miembro_externo: 0,
      },
    });
  const { mutateAsync: deleteMember, isPending: isDeleting } =
    useDeleteMember();

  const columns: ColumnDef<MiembroResponse>[] = [
    // --- Selección ---
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    // --- Código ---
    {
      accessorKey: "codigo",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Código"
          onSetOrderBy={setOrderBy}
          onSetOrderDir={setOrderDir}
        />
      ),
      cell: ({ row }) => <div>{row.getValue("codigo") ?? "-"}</div>,
    },

    // --- Nombres ---
    {
      accessorKey: "nombres",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Nombres"
          onSetOrderBy={setOrderBy}
          onSetOrderDir={setOrderDir}
        />
      ),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("nombres")}</div>
      ),
    },

    // --- Apellidos ---
    {
      accessorKey: "apellidos",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Apellidos"
          onSetOrderBy={setOrderBy}
          onSetOrderDir={setOrderDir}
        />
      ),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("apellidos")}</div>
      ),
    },

    // --- Email ---
    {
      accessorKey: "email",
      header: () => <div>Email</div>,
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email") ?? "-"}</div>
      ),
    },

    // --- Domicilio ---
    {
      accessorKey: "domicilio",
      header: () => <div>Domicilio</div>,
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("domicilio") ?? "-"}</div>
      ),
    },

    // --- Celular ---
    {
      accessorKey: "celular",
      header: () => <div>Celular</div>,
      cell: ({ row }) => <div>{row.getValue("celular") ?? "-"}</div>,
    },

    // --- Acciones ---
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const miembro = row.original;

        return (
          <div className="flex gap-2">
            <Badge
              onClick={() => {
                openEditModal(miembro.id);
              }}
              className="hover:cursor-pointer"
              variant="secondary"
            >
              <PencilIcon />
            </Badge>
            <Badge
              onClick={() => {
                setSelectedId(miembro.id);
                setOpenAssignCodeMember(true);
              }}
              className="hover:cursor-pointer"
              variant="secondary"
            >
              <CodeIcon />
            </Badge>
            <Badge
              onClick={() => {
                setSelectedId(miembro.id);
                setOpenDelete(true);
              }}
              className="hover:cursor-pointer"
              variant="destructive"
            >
              <TrashIcon />
            </Badge>
          </div>
        );
      },
    },
  ];

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAssignCodes, setOpenAssignCodes] = useState(false);
  const [openAssignCodeMember, setOpenAssignCodeMember] = useState(false);
  const [selectedRows, setSelectedRows] = useState<MiembroResponse[]>([]);
  const [selectedTypeMember, setSelectedTypeMember] = useState<number | null>(
    null
  );

  const openEditModal = (id: number) => {
    setMode("edit");
    setSelectedId(id);
    setOpen(true);
  };

  const openCreateModal = () => {
    setMode("create");
    setSelectedId(null);
    setOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteMember(selectedId!);
      setOpenDelete(false);
      toast.success("Miembro eliminado correctamente");
    } catch (error) {
      toast.error("Error al eliminar miembro");
    }
  };

  const handleAssignCodes = async () => {
    try {
      await assignCodes(selectedTypeMember!);
      setOpenAssignCodes(false);
      toast.success("Códigos asignados correctamente");
    } catch (error) {
      toast.error("Error al asignar códigos");
    }
  };

  const handleAssignCodeMember = async () => {
    try {
      await assignCodeMember(selectedId!);
      setOpenAssignCodeMember(false);
      toast.success("Código asignado correctamente");
    } catch (error) {
      toast.error("Error al asignar código");
    }
  };

  const { mutateAsync: assignCodes, isPending: isAssigningCodes } =
    useAssignCodes();
  const { mutateAsync: assignCodeMember, isPending: isAssigningCodeMember } =
    useAssignCodeMember();
  const { data: typeMembers } = useTypeMembers();
  const typeMembersOptions =
    typeMembers?.map((typeMember) => ({
      value: typeMember.id,
      label: typeMember.nombre,
    })) ?? [];

  //data para exportar excel
  const dataToExcel = [
    {
      sheet: "Miembros",
      columns: [
        { label: "Código", value: "codigo" },
        { label: "Nombres", value: "nombres" },
        { label: "Apellidos", value: "apellidos" },
        { label: "Email", value: "email" },
        { label: "Domicilio", value: "domicilio" },
        { label: "Celular", value: "celular" },
      ],
      content: (data?.data ?? []) as any[],
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <SimpleCard
        title="Lista de Miembros de la iglesia"
        actions={
          <>
            <Button
              onClick={() => setOpenAssignCodes(true)}
              variant="secondary"
            >
              Asignar Códigos
            </Button>
            <PrintCards members={selectedRows} />
            <Button onClick={() => xlsx(dataToExcel)} variant="excel">
              Exportar a Excel <DownloadIcon />
            </Button>
            <Button onClick={() => openCreateModal()}>
              Registrar Miembro Nuevo <PlusIcon />
            </Button>
          </>
        }
      >
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          page={page}
          limit={limit}
          total={data?.meta.total ?? 0}
          onPageChange={setPage}
          onLimitChange={setLimit}
          mode="server"
          loading={isLoading || isFetching}
          error={isError ? error.message : undefined}
          onRetry={() => refetch()}
          onSelectionChange={(data) => {
            setSelectedRows(data);
          }}
        />
      </SimpleCard>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title={mode == "create" ? "Registrar nuevo Miembro" : "Editar miembro"}
        size="xxl"
      >
        <MembersForm
          id={selectedId ?? undefined}
          mode={mode}
          setOpen={setOpen}
        />
      </Modal>
      <Modal
        open={openDelete}
        onOpenChange={setOpenDelete}
        title="Eliminar miembro"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <p>¿Seguro que quieres eliminar el miembro?</p>
          <Button onClick={() => handleDelete()} disabled={isDeleting}>
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </div>
      </Modal>
      <Modal
        open={openAssignCodes}
        onOpenChange={setOpenAssignCodes}
        title="Asignar códigos"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <p>Selecciona el tipo de miembro</p>
          <div>
            <Select
              value={String(selectedTypeMember)}
              onValueChange={(value) => setSelectedTypeMember(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tipo de miembro" />
              </SelectTrigger>
              <SelectContent>
                {typeMembersOptions.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => handleAssignCodes()}
            disabled={isAssigningCodes}
          >
            {isAssigningCodes ? "Asignando..." : "Asignar"}
          </Button>
        </div>
      </Modal>
      <Modal
        open={openAssignCodeMember}
        onOpenChange={setOpenAssignCodeMember}
        title="Asignar código"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <p>¿Seguro que quieres asignar el código?</p>
          <Button
            onClick={() => handleAssignCodeMember()}
            disabled={isAssigningCodeMember}
          >
            {isAssigningCodeMember ? "Asignando..." : "Asignar"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default MembersTable;
