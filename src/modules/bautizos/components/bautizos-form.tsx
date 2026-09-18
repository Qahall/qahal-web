import { FormProvider, useForm } from "react-hook-form";
import { bautizoSchema, BautizoSchemaType } from "../schemas/bautizo-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectField } from "@/components/form/select-field";
import { useMembers } from "@/modules/members/hooks/useMembersGet";
import { DatePickerField } from "@/components/form/date-picker";
import { InputField } from "@/components/form/input-field";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useBautizoById } from "../hooks/useBautizosGet";
import { BautizoCreate } from "../types/bautizos";
import { formatDate, parseLocalDate } from "@/lib/utils";
import { useCreateBautizo } from "../hooks/useBautizosCreate";
import { useUpdateBautizo } from "../hooks/useBautizosUpdate";
import { toast } from "sonner";

interface BautizosFormProps {
  id: number | undefined;
  mode: string;
  setOpen: (b: boolean) => void;
}

const BautizosForm = ({ id, mode, setOpen }: BautizosFormProps) => {
  const form = useForm<BautizoSchemaType>({
    resolver: zodResolver(bautizoSchema),
    defaultValues: {
      fecha_bautizo: parseLocalDate(new Date().toISOString().split("T")[0]),
      miembro_id: "",
      lugar_bautizo: "",
      iglesia_bautizo: "",
    },
  });
  const { reset } = form;
  const { data: bautizo, isLoading } = useBautizoById(id);
  const { mutateAsync: createBautizo, isPending: isLoadingCreateBautizo } =
    useCreateBautizo();
  const { mutateAsync: updateBautizo, isPending: isLoadingUpdateBautizo } =
    useUpdateBautizo();

  useEffect(() => {
    if (mode === "edit" && bautizo) {
      reset({
        fecha_bautizo: parseLocalDate(bautizo.fecha_bautizo),
        miembro_id: String(bautizo.miembro_id),
        lugar_bautizo: bautizo.lugar_bautizo,
        iglesia_bautizo: bautizo.iglesia_bautizo ?? "",
      });
    }
  }, [mode, bautizo, reset]);

  const { data: members, isLoading: isLoadingMembers } = useMembers();
  const membersToSelect = members?.map((member) => ({
    value: String(member.id),
    label: member.nombres + " " + member.apellidos,
  }));

  const onSubmit = async (dataForm: BautizoSchemaType) => {
    try {
      const dataToSend = {
        ...dataForm,
        miembro_id: Number(dataForm.miembro_id),
        fecha_bautizo: formatDate(dataForm.fecha_bautizo),
        // Ensure strings are sent, handle empty strings as null if backend prefers, or keep as string
        lugar_bautizo: dataForm.lugar_bautizo,
        iglesia_bautizo: dataForm.iglesia_bautizo || null,
      } as BautizoCreate;

      if (mode === "edit") {
        await updateBautizo({
          data: dataToSend,
          id: id!,
        });
        toast.success("Bautizo actualizado correctamente.");
      } else {
        await createBautizo(dataToSend);
        toast.success("Bautizo creado correctamente.");
      }
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al crear o actualizar bautizo"
      );
    }
  };

  if (isLoading) {
    return <div>Cargando ...</div>;
  }
  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-5 mb-5">
            <SelectField
              name="miembro_id"
              label="Miembro"
              options={membersToSelect ?? []}
              isLoading={isLoadingMembers}
            />
            <DatePickerField name="fecha_bautizo" label="Fecha de bautizo" />
            <InputField name="lugar_bautizo" label="Lugar de bautizo" />
            <InputField name="iglesia_bautizo" label="Iglesia de bautizo" />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoadingCreateBautizo || isLoadingUpdateBautizo}
            >
              {isLoadingCreateBautizo || isLoadingUpdateBautizo
                ? "Cargando... "
                : "Guardar"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default BautizosForm;
