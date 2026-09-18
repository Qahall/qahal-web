import { Modal } from "@/components/modal";
import { SimpleCard } from "@/components/simple-card";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useFamiliesPaginated } from "../hooks/useFamiliesGet";
import { ColumnDef } from "@tanstack/react-table";
import { FamiliaResponse } from "../types/families.types";
import FamiliesForm from "./families-form";
import { Badge } from "@/components/ui/badge";
import { useDeleteFamily } from "../hooks/useFamiliesDelete";
import { toast } from "sonner";

const FamiliesTable = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [orderBy, _setOrderBy] = useState("nombres");
  const [orderDir, _setOrderDir] = useState("desc");

  const { data, isLoading, isFetching, isError, error, refetch } =
    useFamiliesPaginated({
      page,
      page_size: limit,
      order_by: orderBy,
      order_dir: orderDir,
      filters: undefined,
    });

  const { mutateAsync: deleteFamily, isPending: isDeleting } =
    useDeleteFamily();

  const columns: ColumnDef<FamiliaResponse>[] = [
    // --- Nombre de familia ---
    {
      accessorKey: "apellidos",
      header: () => <div>Nombre de familia</div>,
      cell: ({ row }) => <div>{row.getValue("apellidos") ?? "-"}</div>,
    },

    // --- Fecha de matrimonio ---
    {
      accessorKey: "fecha_matrimonio",
      header: () => <div>Fecha de matrimonio</div>,
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("fecha_matrimonio")}</div>
      ),
    },
    // --- Acciones ---
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const familia = row.original;

        return (
          <div className="flex gap-2">
            <Badge
              onClick={() => {
                openEditModal(familia.id);
              }}
              className="hover:cursor-pointer"
              variant="secondary"
            >
              <PencilIcon />
            </Badge>
            <Badge
              onClick={() => {
                openDeleteModal(familia.id);
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
      await deleteFamily(selectedId!);
      setOpenDelete(false);
      toast.success("Familia eliminada exitosamente");
    } catch (error) {
      toast.error("Error al eliminar la familia");
    }
  };
  return (
    <div className="p-6 space-y-4">
      <SimpleCard
        title="Lista de Familias"
        actions={
          <>
            <Button onClick={() => openCreateModal()}>
              Crear Familia <PlusIcon />
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
        title={mode == "create" ? "Registrar nueva familia" : "Editar familia"}
        size="xxl"
      >
        <FamiliesForm
          id={selectedId ?? undefined}
          mode={mode}
          setOpen={setOpen}
        />
      </Modal>
      <Modal
        open={openDelete}
        onOpenChange={setOpenDelete}
        title="Eliminar familia"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <p>¿Seguro que quieres eliminar la familia?</p>
          <Button onClick={() => handleDelete()} disabled={isDeleting}>
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default FamiliesTable;
