import { useState } from "react";
import { useBautizosPaginated } from "../hooks/useBautizosGet";
import { ColumnDef } from "@tanstack/react-table";
import { BautizoResponse } from "../types/bautizos";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { SimpleCard } from "@/components/simple-card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/data-table";
import { Modal } from "@/components/modal";
import BautizosForm from "./bautizos-form";
import { Badge } from "@/components/ui/badge";
import { useDeleteBautizo } from "../hooks/useBautizosDelete";
import { toast } from "sonner";

const BautizosTable = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useBautizosPaginated({
      page,
      page_size: limit,
    });

  const { mutateAsync: deleteBautizo, isPending: isDeleting } =
    useDeleteBautizo();

  const columns: ColumnDef<BautizoResponse>[] = [
    // --- Miembro ---
    {
      accessorKey: "miembro",
      header: () => <div>Miembro</div>,
      cell: ({ row }) => {
        const miembro = row.original.miembro;
        return (
          <div>
            {miembro.nombres} {miembro.apellidos}
          </div>
        );
      },
    },

    // --- Fecha de bautizo ---
    {
      accessorKey: "fecha_bautizo",
      header: () => <div>Fecha de bautizo</div>,
      cell: ({ row }) => <div>{row.getValue("fecha_bautizo") ?? "-"}</div>,
    },

    // --- Lugar ---
    {
      accessorKey: "lugar_bautizo",
      header: () => <div>Lugar</div>,
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("lugar_bautizo")}</div>
      ),
    },
    // --- Iglesia ---
    {
      accessorKey: "iglesia_bautizo",
      header: () => <div>Iglesia</div>,
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("iglesia_bautizo") || "-"}
        </div>
      ),
    },
    // --- Acciones ---
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const bautizo = row.original;

        return (
          <div className="flex gap-2">
            <Badge
              onClick={() => {
                openEditModal(bautizo.miembro_id);
              }}
              className="hover:cursor-pointer"
              variant="secondary"
            >
              <PencilIcon />
            </Badge>
            <Badge
              onClick={() => {
                openDeleteModal(bautizo.miembro_id);
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

  const openEditModal = (id: number) => {
    setMode("edit");
    setSelectedId(id);
    setOpen(true);
  };

  const openDeleteModal = (id: number) => {
    setSelectedId(id);
    setOpenDelete(true);
  };

  const openCreateModal = () => {
    setMode("create");
    setSelectedId(null);
    setOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteBautizo(selectedId!);
      setOpenDelete(false);
      toast.success("Bautizo eliminado exitosamente");
    } catch (error) {
      toast.error("Error al eliminar el bautizo");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <SimpleCard
        title="Lista de Bautizos"
        actions={
          <>
            <Button onClick={() => openCreateModal()}>
              Crear Bautizo <PlusIcon />
            </Button>
          </>
        }
      >
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          page={page}
          limit={limit}
          total={data?.meta?.total ?? 0}
          onPageChange={setPage}
          onLimitChange={setLimit}
          mode="server"
          loading={isLoading || isFetching}
          error={isError ? error.message : undefined}
          onRetry={() => refetch()}
        />
      </SimpleCard>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title={mode == "create" ? "Registrar nuevo Bautizo" : "Editar bautizo"}
        size="xl"
      >
        <BautizosForm
          id={selectedId ?? undefined}
          mode={mode}
          setOpen={setOpen}
        />
      </Modal>
      <Modal
        open={openDelete}
        onOpenChange={setOpenDelete}
        title="Eliminar bautizo"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <p>¿Seguro que quieres eliminar el bautizo?</p>
          <Button onClick={() => handleDelete()} disabled={isDeleting}>
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default BautizosTable;
