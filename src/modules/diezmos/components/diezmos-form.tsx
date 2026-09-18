import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { diezmoSchema, DiezmoSchemaType } from "../schemas/diezmo.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectField } from "@/components/form/select-field";
import { useMembers } from "@/modules/members/hooks/useMembersGet";
import { DatePickerField } from "@/components/form/date-picker";
import { InputField } from "@/components/form/input-field";
import { TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useDiezmoById } from "../hooks/useDiezmosGet";
import { DiezmoCreate } from "../types/diezmos.types";
import { formatDate, parseLocalDate } from "@/lib/utils";
import { useCreateDiezmo } from "../hooks/useDiezmosCreate";
import { useUpdateDiezmo } from "../hooks/useDiezmosUpdate";
import { toast } from "sonner";

interface DiezmosFormProps {
  id: number | undefined;
  mode: string;
  setOpen: (b: boolean) => void;
}

const DiezmosForm = ({ id, mode, setOpen }: DiezmosFormProps) => {
  const form = useForm<DiezmoSchemaType>({
    resolver: zodResolver(diezmoSchema),
    defaultValues: {
      fecha_diezmo: parseLocalDate(new Date().toISOString().split("T")[0]),
      miembro_id: "",
      monto: "",
      servicio: "",
      anio_correspondiente: new Date().getFullYear().toString(),
      meses_correspondientes: [],
    },
  });
  const { reset, control } = form; // Get control

  const { fields, append, remove } = useFieldArray({
    control,
    name: "meses_correspondientes",
  });

  const { data: diezmo, isLoading } = useDiezmoById(id);
  const { mutateAsync: createDiezmo, isPending: isLoadingCreateDiezmo } =
    useCreateDiezmo();
  const { mutateAsync: updateDiezmo, isPending: isLoadingUpdateDiezmo } =
    useUpdateDiezmo();

  useEffect(() => {
    if (mode === "edit" && diezmo) {
      reset({
        fecha_diezmo: parseLocalDate(diezmo.fecha_diezmo),
        miembro_id: String(diezmo.miembro_id),
        monto: diezmo.monto.toString(),
        servicio: diezmo.servicio,
        anio_correspondiente:
          diezmo.meses_diezmo.length > 0
            ? diezmo.meses_diezmo[0].mes_correspondiente.split("-")[0]
            : new Date().getFullYear().toString(),
        meses_correspondientes: diezmo.meses_diezmo.map((mes: any) => ({
          mes: mes.mes_correspondiente.split("-")[1],
          monto: String(mes.monto_mes),
        })),
      });
    }
  }, [mode, diezmo, reset]);

  const { data: members, isLoading: isLoadingMembers } = useMembers();
  const membersToSelect = members?.map((member) => ({
    value: String(member.id),
    label: member.nombres + " " + member.apellidos,
  }));

  const monthsOptions = [
    { value: "01", label: "Enero" },
    { value: "02", label: "Febrero" },
    { value: "03", label: "Marzo" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Mayo" },
    { value: "06", label: "Junio" },
    { value: "07", label: "Julio" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ];

  const buildYearOptions = () => {
    const years = [];
    for (
      let i = new Date().getFullYear() - 2;
      i <= new Date().getFullYear();
      i++
    ) {
      years.push({ value: String(i), label: String(i) });
    }
    return years;
  };

  const onSubmit = async (dataForm: DiezmoSchemaType) => {
    try {
      const dataToSend = {
        ...dataForm,
        miembro_id: Number(dataForm.miembro_id),
        monto: Number(dataForm.monto),
        fecha_diezmo: formatDate(dataForm.fecha_diezmo),
        meses_correspondientes: dataForm.meses_correspondientes.map((mes) => ({
          mes_correspondiente: dataForm.anio_correspondiente + "-" + mes.mes,
          monto_mes: Number(mes.monto),
        })),
      } as DiezmoCreate;

      if (mode === "edit") {
        await updateDiezmo({
          data: dataToSend,
          id: id!,
        });
        toast.success("Diezmo actualizado correctamente. ");
      } else {
        await createDiezmo(dataToSend);
        toast.success("Diezmo creado correctamente. ");
      }
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al crear o actualizar diezmo"
      );
    }
  };

  const servicio = form.watch("servicio");

  const isDateDisabled = (date: Date) => {
    if (["aymara", "central", "adoracion"].includes(servicio)) {
      return date.getDay() !== 0; // 0 is Sunday
    }
    if (servicio === "oracion") {
      return date.getDay() !== 2; // 2 is Tuesday
    }
    return false;
  };

  if (isLoading) {
    return <div>Cargando ...</div>;
  }
  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 gap-5 mb-5">
            <SelectField
              name="miembro_id"
              label="Miembro"
              options={membersToSelect ?? []}
              isLoading={isLoadingMembers}
            />
            <SelectField
              name="servicio"
              label="Servicio"
              options={[
                {
                  value: "aymara",
                  label: "Aymara",
                },
                {
                  value: "central",
                  label: "Central",
                },
                {
                  value: "adoracion",
                  label: "Adoración",
                },
                {
                  value: "oracion",
                  label: "Oración",
                },
              ]}
            />
            <DatePickerField
              name="fecha_diezmo"
              label="Fecha de diezmo"
              disabledDays={isDateDisabled}
              disabled={
                form.watch("servicio") === "" ||
                form.watch("servicio") === undefined
              }
            />
            <InputField
              type="number"
              name="monto"
              label="Monto"
              step="0.01"
              min="0"
            />
            <SelectField
              name="anio_correspondiente"
              label="Año correspondiente"
              options={buildYearOptions()}
            />
          </div>

          <div className="space-y-3 mb-5 border p-4 rounded-md">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Desglose Mensual</h3>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => append({ mes: "", monto: "" })}
              >
                Agregar Mes
              </Button>
            </div>

            {form.formState.errors.meses_correspondientes?.root && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.meses_correspondientes.root.message}
              </p>
            )}

            <div className="grid grid-cols-[1fr_1fr_auto] gap-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="contents" // Use contents to keep grid layout
                >
                  <SelectField
                    name={`meses_correspondientes.${index}.mes`}
                    options={monthsOptions}
                    placeholder="Seleccionar Mes"
                  />
                  <InputField
                    type="number"
                    name={`meses_correspondientes.${index}.monto`}
                    step="0.01"
                    min="0"
                    placeholder="Monto"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                    className="mt-1" // Align with inputs
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoadingCreateDiezmo || isLoadingUpdateDiezmo}
            >
              {isLoadingCreateDiezmo || isLoadingUpdateDiezmo
                ? "Cargando... "
                : "Guardar"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default DiezmosForm;
