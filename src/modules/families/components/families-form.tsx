import { DatePickerField } from "@/components/form/date-picker";
import { InputField } from "@/components/form/input-field";
import { ToggleGroupField } from "@/components/form/toggle-group-field";
import { HeartIcon, TrashIcon, UserX } from "lucide-react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { familySchema, FamilySchemaType } from "../schemas/family.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useMembers } from "@/modules/members/hooks/useMembersGet";
import { SelectField } from "@/components/form/select-field";
import { useEffect } from "react";
import { useCreateMember } from "@/modules/members/hooks/useMembersCreate";
import { SexoEnum } from "@/modules/members/types/enums";
import { FamiliaCreate, FamiliaMiembroCreate } from "../types/families.types";
import { formatDate } from "@/lib/utils";
import { useCreateFamily } from "../hooks/useFamiliesCreate";
import { useUpdateFamily } from "../hooks/useFamiliesUpdate";
import { toast } from "sonner";
import { useFamilyById } from "../hooks/useFamiliesGet";
import { mapFamiliaResponseToForm } from "../helpers/get-family-mapper";

interface MembersFormProps {
  mode?: "create" | "edit";
  id?: number;
  setOpen: (b: boolean) => void;
}

const FamiliesForm = ({ mode, id, setOpen }: MembersFormProps) => {
  const form = useForm<FamilySchemaType>({
    resolver: zodResolver(familySchema),
    defaultValues: {
      tiene_matrimonio: "no",
      apellidos: "",
      fecha_matrimonio: undefined,
      lugar_matrimonio: "",
    },
  });
  const { setValue, watch, reset } = form;
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "miembros_familia",
  });

  const { mutateAsync: createMemberFn, isPending: isPendingCreateMember } =
    useCreateMember();
  const { mutateAsync: createFamilyFn, isPending: isPendingCreateFamily } =
    useCreateFamily();
  const { mutateAsync: updateFamilyFn, isPending: isPendingUpdateFamily } =
    useUpdateFamily();
  const { data: members, isPending: isPendingMembers } = useMembers(true);
  const { data: family, isLoading: isLoadingFamily } = useFamilyById(id);
  useEffect(() => {
    if (mode === "edit" && family) {
      reset(mapFamiliaResponseToForm(family));
    }
  }, [mode, family, reset]);
  const membersToSelect = members?.map((member) => ({
    value: String(member.id),
    label: member.dni + " " + member.nombres + " " + member.apellidos,
  }));

  const handleSelectMiembro = (index: number, miembroId: number | null) => {
    if (!miembroId) {
      // Si se deselecciona, limpiar y habilitar inputs
      setValue(`miembros_familia.${index}.dni`, "");
      setValue(`miembros_familia.${index}.nombre`, "");
      setValue(`miembros_familia.${index}.apellido`, "");
      setValue(`miembros_familia.${index}.fecha_nacimiento`, undefined);
      return;
    }

    const miembro = members!.find((m) => m.id === miembroId);
    if (!miembro) return;

    // Autocompletar datos
    setValue(`miembros_familia.${index}.dni`, miembro.dni);
    setValue(`miembros_familia.${index}.nombre`, miembro.nombres);
    setValue(`miembros_familia.${index}.apellido`, miembro.apellidos);
    setValue(
      `miembros_familia.${index}.fecha_nacimiento`,
      miembro.fecha_nacimiento
        ? new Date(miembro.fecha_nacimiento ?? "")
        : undefined
    );
  };

  const onSubmit = async (formData: FamilySchemaType) => {
    //MIEMBROS NUEVOS PARA ENVIAR AL BACKEND
    const newMembers = formData.miembros_familia
      ?.filter((mf) => !mf.miembro_id)
      .map((mf) => ({
        nombres: mf.nombre,
        apellidos: mf.apellido,
        dni: mf.dni,
        rol: mf.rol,
        fecha_nacimiento: mf.fecha_nacimiento
          ? formatDate(mf.fecha_nacimiento)
          : null,
      }));

    //MIEMBROS PARA INSERTAR A LA FAMILIA
    const membersToFamilia: FamiliaMiembroCreate[] = formData.miembros_familia
      ?.filter((mf) => mf.miembro_id)
      .map((mf) => ({
        miembro_id: Number(mf.miembro_id ?? ""),
        rol: mf.rol,
      }));
    try {
      //INSERTANDO MIEMBROS NUEVOS
      for (const nm of newMembers) {
        const { rol, ...nmToSend } = nm;

        const { id } = await createMemberFn({
          ...nmToSend,
          es_miembro_externo: true,
          sexo: SexoEnum.M, //AUN NO SE SABE EL GENERO, PROBABLE NO SE NECESITE
          cursos: [],
          ministerios: [],
          cargos: [],
        });

        membersToFamilia.push({
          miembro_id: id,
          rol: nm.rol,
        });
      }

      //DATA PARA CREAR FAMILIA
      const dataToSend: FamiliaCreate = {
        apellidos: formData.apellidos,
        fecha_matrimonio: formatDate(formData.fecha_matrimonio),
        lugar_matrimonio: formData.lugar_matrimonio,
        miembros: membersToFamilia,
      };

      if (mode == "edit") {
        await updateFamilyFn({
          data: dataToSend,
          id: id!,
        });
        toast.success("Familia actualizada correctamente. ");
      } else {
        await createFamilyFn(dataToSend);
        toast.success("Familia creada correctamente. ");
      }

      //EXITO
      setOpen(false);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Error al crear o actualizar familia"
      );
    }
  };
  if (isLoadingFamily) {
    return <div>Cargando ...</div>;
  }
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-4 gap-5 ">
          <InputField name="apellidos" label="Nombre de familia" />
          <ToggleGroupField
            name="tiene_matrimonio"
            label="Tiene matrimonio"
            options={[
              { value: "si", label: "Si", icon: <HeartIcon /> },
              { value: "no", label: "No", icon: <UserX /> },
            ]}
          />
          {form.watch("tiene_matrimonio") == "si" && (
            <>
              <InputField name="lugar_matrimonio" label="Lugar de matrimonio" />
              <DatePickerField
                name="fecha_matrimonio"
                label="Fecha de matrimonio"
              />
            </>
          )}
        </div>

        <div className="flex justify-between mt-5 pt-5">
          <h3 className="text-lg font-semibold">
            Miembros de familia{" "}
            <p className="text-destructive text-xs">
              {form.formState.errors.miembros_familia?.root?.message ||
                form.formState.errors.miembros_familia?.message}
            </p>
          </h3>

          <Button
            onClick={() =>
              append({
                miembro_id: "",
                dni: "",
                nombre: "",
                apellido: "",
                fecha_nacimiento: undefined,
                rol: "",
              })
            }
            type="button"
            variant={"secondary"}
          >
            Agregar miembro
          </Button>
        </div>
        <div className="grid grid-cols-[3fr_2fr_2fr_2fr_2fr_1fr_1fr] gap-3">
          <p>Miembro</p>
          <p>Dni</p>
          <p>Nombre</p>
          <p>Apellido</p>
          <p>Fecha de Nacimiento</p>
          <p>Rol</p>
        </div>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-[3fr_2fr_2fr_2fr_2fr_1fr_1fr] gap-3"
          >
            <SelectField
              className="w-full max-w-[300px]"
              name={`miembros_familia.${index}.miembro_id`}
              options={membersToSelect ?? []}
              isLoading={isPendingMembers}
              onValueChange={(value) =>
                handleSelectMiembro(index, Number(value))
              }
            />
            <InputField
              name={`miembros_familia.${index}.dni`}
              type="number"
              disabled={!!watch(`miembros_familia.${index}.miembro_id`)}
            />
            <InputField
              name={`miembros_familia.${index}.nombre`}
              disabled={!!watch(`miembros_familia.${index}.miembro_id`)}
            />
            <InputField
              name={`miembros_familia.${index}.apellido`}
              disabled={!!watch(`miembros_familia.${index}.miembro_id`)}
            />
            <DatePickerField
              name={`miembros_familia.${index}.fecha_nacimiento`}
              disabled={!!watch(`miembros_familia.${index}.miembro_id`)}
            />

            <ToggleGroupField
              name={`miembros_familia.${index}.rol`}
              options={[
                { value: "hijo", label: "Hijo" },
                { value: "padre", label: "Padre" },
              ]}
            />
            <Button
              onClick={() => remove(index)}
              variant="destructive"
              type="button"
            >
              <TrashIcon />
            </Button>
          </div>
        ))}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={
              isPendingCreateMember ||
              isPendingCreateFamily ||
              isPendingUpdateFamily
            }
          >
            {isPendingCreateMember ||
            isPendingCreateFamily ||
            isPendingUpdateFamily
              ? "Cargando... "
              : "Guardar"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default FamiliesForm;
