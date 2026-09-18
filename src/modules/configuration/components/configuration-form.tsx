import { InputField } from "@/components/form/input-field";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import {
  useCreateCharge,
  useCreateMinistry,
  useCreateCourse,
  useCreateZone,
  useCreateTypeMember,
} from "../hooks/useCreateConfiguration";
import {
  useUpdateCharge,
  useUpdateCourse,
  useUpdateMinistry,
  useUpdateTypeMember,
  useUpdateZone,
} from "../hooks/useUpdateConfiguration";
import { toast } from "sonner";
import { ConfigurationResponse } from "../types/configuration.types";

const schema = z.object({
  nombre: z.string(),
});

type schemaType = z.infer<typeof schema>;

interface ConfigurationFormProps {
  mode?: "create" | "edit";
  dataEdit?: ConfigurationResponse;
  setOpen: (b: boolean) => void;
  configuration: string;
}

const ConfigurationForm = ({
  mode,
  dataEdit,
  setOpen,
  configuration,
}: ConfigurationFormProps) => {
  const form = useForm<schemaType>();

  const { mutateAsync: createCharge, isPending: creatingCharge } =
    useCreateCharge();
  const { mutateAsync: createZone, isPending: creatingZone } = useCreateZone();
  const { mutateAsync: createCourse, isPending: creatingCourse } =
    useCreateCourse();
  const { mutateAsync: createTypeMember, isPending: creatingTypeMember } =
    useCreateTypeMember();
  const { mutateAsync: createMinistry, isPending: creatingMinistry } =
    useCreateMinistry();

  const { mutateAsync: updateCharge, isPending: updatingCharge } =
    useUpdateCharge();
  const { mutateAsync: updateZone, isPending: updatingZone } = useUpdateZone();
  const { mutateAsync: updateCourse, isPending: updatingCourse } =
    useUpdateCourse();
  const { mutateAsync: updateTypeMember, isPending: updatingTypeMember } =
    useUpdateTypeMember();
  const { mutateAsync: updateMinistry, isPending: updatingMinistry } =
    useUpdateMinistry();

  useEffect(() => {
    if (mode === "edit" && dataEdit) {
      form.reset({
        nombre: dataEdit.nombre,
      });
    }
  }, [mode, dataEdit, form.reset]);

  type ConfigurationType =
    | "cargos"
    | "cursos"
    | "ministerios"
    | "tipos-miembro"
    | "zonas";

  const createMap = {
    cargos: createCharge,
    cursos: createCourse,
    ministerios: createMinistry,
    "tipos-miembro": createTypeMember,
    zonas: createZone,
  } as const;

  const updateMap = {
    cargos: updateCharge,
    cursos: updateCourse,
    ministerios: updateMinistry,
    "tipos-miembro": updateTypeMember,
    zonas: updateZone,
  } as const;
  const onSubmit = async (data: schemaType) => {
    try {
      if (mode === "edit" && !dataEdit?.id) {
        throw new Error("ID no encontrado para edición");
      }

      if (mode === "edit") {
        const updateFn = updateMap[configuration as ConfigurationType];

        await updateFn({
          id: dataEdit!.id,
          data: {
            nombre: data.nombre,
          },
        });

        toast.success("Registro actualizado correctamente");
      } else {
        const createFn = createMap[configuration as ConfigurationType];

        await createFn({
          nombre: data.nombre,
        });

        toast.success("Registro creado correctamente");
      }

      setOpen(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error al guardar la configuración"
      );
    }
  };

  const loading =
    creatingCharge ||
    creatingCourse ||
    creatingMinistry ||
    creatingTypeMember ||
    creatingZone ||
    updatingCourse ||
    updatingCharge ||
    updatingMinistry ||
    updatingTypeMember ||
    updatingZone;
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <InputField name="nombre" label="Nombre" />
        <div className="flex justify-end mt-5">
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ConfigurationForm;
