import { ColumnDef } from "@tanstack/react-table";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

import { DataTable } from "@/components/tables/data-table";
import { SimpleCard } from "@/components/simple-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/modal";
import { ConfigurationBase } from "../types/configuration.types";
import { toast } from "sonner";

interface Props<T extends ConfigurationBase> {
  title: string;
  useQuery: () => {
    data?: T[];
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
  };
  useDelete: () => {
    mutateAsync: (id: number) => Promise<unknown>;
    isPending: boolean;
  };
  Form: React.ComponentType<{
    mode: "create" | "edit";
    setOpen: (open: boolean) => void;
    dataEdit?: T;
    configuration: string;
  }>;
  label: string;
}

export function GenericConfigurationTable<
  T extends ConfigurationBase & { id: number }
>({ title, useQuery, useDelete, Form, label }: Props<T>) {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery();
  const { mutateAsync: deleteItem, isPending: isDeleting } = useDelete();

  const [dataEdit, setDataEdit] = useState<T | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  const openEditModal = (item: T) => {
    setMode("edit");
    setDataEdit(item);
    setOpen(true);
  };

  const openDeleteModal = (item: T) => {
    setItemToDelete(item);
    setOpenDelete(true);
  };

  const openCreateModal = () => {
    setMode("create");
    setDataEdit(null);
    setOpen(true);
  };

  const columns: ColumnDef<T>[] = [
    {
      accessorKey: "nombre",
      header: () => <div>Nombre</div>,
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("nombre")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Badge
            onClick={() => openEditModal(row.original)}
            className="hover:cursor-pointer"
            variant="secondary"
          >
            <PencilIcon />
          </Badge>
          <Badge
            onClick={() => openDeleteModal(row.original)}
            className="hover:cursor-pointer"
            variant="destructive"
          >
            <TrashIcon />
          </Badge>
        </div>
      ),
    },
  ];

  const handleDelete = async () => {
    try {
      await deleteItem(itemToDelete!.id);
      setOpenDelete(false);
      toast.success("Registro eliminado exitosamente");
    } catch (error) {
      toast.error("Error al eliminar el registro");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <SimpleCard
        title={title}
        actions={
          <Button onClick={openCreateModal}>
            Registrar nuevo <PlusIcon />
          </Button>
        }
      >
        <DataTable
          columns={columns}
          data={data ?? []}
          mode="server"
          loading={isLoading || isFetching}
          error={isError ? error?.message : undefined}
          onRetry={refetch}
        />
      </SimpleCard>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title={mode === "create" ? "Registrar" : "Editar"}
        size="sm"
      >
        <Form
          mode={mode}
          setOpen={setOpen}
          dataEdit={dataEdit ?? undefined}
          configuration={label}
        />
      </Modal>

      <Modal
        open={openDelete}
        onOpenChange={setOpenDelete}
        title="Eliminar registro"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <p>¿Seguro que quieres eliminar este registro?</p>
          <Button onClick={() => handleDelete()} disabled={isDeleting}>
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
