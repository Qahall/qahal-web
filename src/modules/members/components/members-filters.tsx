import { InputField } from "@/components/form/input-field";
import { SelectField } from "@/components/form/select-field";
import { SimpleCard } from "@/components/simple-card";
import { Button } from "@/components/ui/button";
import { useTypeMembers } from "@/modules/configuration/hooks/useTypeMembersGet";
import { useZones } from "@/modules/configuration/hooks/useZonesGet";
import { zodResolver } from "@hookform/resolvers/zod";
import { BrushCleaningIcon, SearchIcon } from "lucide-react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

const schema = z.object({
  dni: z.string().optional(),
  nombre: z.string().optional(),
  tipo_miembro_id: z.string().optional(),
  es_padre_o_madre: z.string().optional(),
  zona_id: z.string().optional(),
});

export type Schema = z.infer<typeof schema>;

interface MembersFiltersProps {
  setFilters: (d: Schema | null) => void;
}

const MembersFilters = ({ setFilters }: MembersFiltersProps) => {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      dni: "",
      nombre: "",
      tipo_miembro_id: "",
      es_padre_o_madre: "",
      zona_id: "",
    },
  });

  const { data: typeMembers, isLoading: isLoadingTypeMembers } =
    useTypeMembers();
  const { data: zones, isLoading: isLoadingZones } = useZones()

  const typeMembersToSelect = typeMembers?.map((tm) => ({
    value: String(tm.id),
    label: tm.nombre,
  }));

  const zonesToSelect = zones?.map((zone) => ({
    value: String(zone.id),
    label: zone.nombre,
  }));

  const onSubmit: SubmitHandler<Schema> = (data: Schema) => {
    const cleaned: Schema = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== "")
    );
    setFilters(cleaned);
  };
  return (
    <>
      <SimpleCard title="Filtros">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-5">
              <InputField name="dni" label="DNI" type="number" />
              <InputField name="nombre" label="Nombre" />
              <SelectField
                name="tipo_miembro_id"
                label="Tipo de miembro"
                options={typeMembersToSelect ?? []}
                isLoading={isLoadingTypeMembers}
              />
              <SelectField
                name="es_padre_o_madre"
                label="Padre o madre"
                options={[
                  { value: "madre", label: "Madre" },
                  { value: "padre", label: "Padre" },
                ]}
              />
              <SelectField
                name="zona_id"
                label="Zona"
                options={zonesToSelect ?? []}
                isLoading={isLoadingZones}
              />
            </div>
            <div className="flex gap-5 justify-center mt-5">
              <Button
                variant={"secondary"}
                onClick={() => {
                  form.reset();
                  setFilters(null);
                }}
                type="button"
              >
                Limpiar <BrushCleaningIcon />
              </Button>
              <Button type="submit">
                Filtrar <SearchIcon />
              </Button>
            </div>
          </form>
        </FormProvider>
      </SimpleCard>
    </>
  );
};

export default MembersFilters;
