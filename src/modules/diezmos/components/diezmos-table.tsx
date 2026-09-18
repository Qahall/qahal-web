import { useState } from "react";
import { useDiezmosPaginated } from "../hooks/useDiezmosGet";
import { ColumnDef } from "@tanstack/react-table";
import { DiezmoResponse } from "../types/diezmos.types";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { SimpleCard } from "@/components/simple-card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/data-table";
import { Modal } from "@/components/modal";
import DiezmosForm from "./diezmos-form";
import { Badge } from "@/components/ui/badge";
import { useDeleteDiezmo } from "../hooks/useDiezmosDelete";
import { toast } from "sonner";

const DiezmosTable = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [orderBy, _setOrderBy] = useState("nombres");
  const [orderDir, _setOrderDir] = useState("desc");

  const { data, isLoading, isFetching, isError, error, refetch } =
    useDiezmosPaginated({
      page,
      page_size: limit,
      order_by: orderBy,
      order_dir: orderDir,
      filters: undefined,
    });

  const { mutateAsync: deleteDiezmo, isPending: isDeleting } =
    useDeleteDiezmo();

  const columns: ColumnDef<DiezmoResponse>[] = [
    // --- Miembro ---
    {
      accessorKey: "miembro",
      header: () => <div>Miembro</div>,
      cell: ({ row }) => (
        <div>
          {row.original.miembro.nombres + " " + row.original.miembro.apellidos}
        </div>
      ),
    },
    // --- Fecha de diezmo ---
    {
      accessorKey: "fecha_diezmo",
      header: () => <div>Fecha de diezmo</div>,
      cell: ({ row }) => <div>{row.getValue("fecha_diezmo") ?? "-"}</div>,
    },

    // --- Monto ---
    {
      accessorKey: "monto",
      header: () => <div>Monto</div>,
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("monto")}</div>
      ),
    },
    // --- Meses correspondientes  ---
    {
      accessorKey: "meses_diezmo",
      header: () => <div>Meses correspondientes</div>,
      cell: ({ row }) => {
        const mesesCorrespondientes = row.original.meses_diezmo;
        return (
          <div className="capitalize">
            {mesesCorrespondientes.map(
              (mc: { mes_correspondiente: string; monto_mes: string }) => (
                <p>{mc.mes_correspondiente}</p>
              )
            )}
          </div>
        );
      },
    },
    // --- Acciones ---
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const diezmo = row.original;

        return (
          <div className="flex gap-2">
            <Badge
              onClick={() => {
                openEditModal(diezmo.id);
              }}
              className="hover:cursor-pointer"
              variant="secondary"
            >
              <PencilIcon />
            </Badge>
            <Badge
              onClick={() => {
                openDeleteModal(diezmo.id);
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
      await deleteDiezmo(selectedId!);
      setOpenDelete(false);
      toast.success("Diezmo eliminado exitosamente");
    } catch (error) {
      toast.error("Error al eliminar el diezmo");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <SimpleCard
        title="Lista de Diezmos"
        actions={
          <>
            <Button onClick={() => openCreateModal()}>
              Crear Diezmo <PlusIcon />
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
        title={mode == "create" ? "Registrar nuevo Diezmo" : "Editar diezmo"}
        size="xl"
      >
        <DiezmosForm
          id={selectedId ?? undefined}
          mode={mode}
          setOpen={setOpen}
        />
      </Modal>
      <Modal
        open={openDelete}
        onOpenChange={setOpenDelete}
        title="Eliminar diezmo"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <p>¿Seguro que quieres eliminar el diezmo?</p>
          <Button onClick={() => handleDelete()} disabled={isDeleting}>
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default DiezmosTable;
