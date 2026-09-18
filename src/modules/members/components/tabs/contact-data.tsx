import { DatePickerField } from "@/components/form/date-picker";
import { InputField } from "@/components/form/input-field";
import { SelectField } from "@/components/form/select-field";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { useZones } from "@/modules/configuration/hooks/useZonesGet";
import { CakeIcon, MessageSquareIcon } from "lucide-react";

const ContactData = () => {
  const { data, isLoading } = useZones();

  const zonesToSelect = data?.map((zone) => ({
    value: String(zone.id),
    label: zone.nombre,
  }));
  return (
    <>
      <div className="grid grid-cols-4 gap-5 pt-5">
        <div className="row-span-2 grid grid-rows-subgrid gap-5">
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>
                <MessageSquareIcon className="w-5 h-5 text-amber-600" />{" "}
                Contacto
              </ItemTitle>
            </ItemContent>
          </Item>
        </div>
        <InputField type="number" name="celular" label="Celular" />
        <InputField type="email" name="email" label="Email" />
        <SelectField
          name="zona"
          label="Zona(Donde vive)"
          isLoading={isLoading}
          options={zonesToSelect ?? []}
        />
        <div className="col-span-3 grid grid-cols-subgrid gap-5">
          <InputField type="text" name="direccion" label="Dirección" />
        </div>

        <div className="row-span-2 grid grid-rows-subgrid gap-5">
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>
                <CakeIcon className="w-5 h-5 text-blue-600" /> Nacimiento
              </ItemTitle>
            </ItemContent>
          </Item>
        </div>
        <DatePickerField name="fecha_nacimiento" label="Fecha de nacimiento" />
        <InputField
          type="text"
          name="pais"
          label="Pais"
          className="uppercase"
        />
        <InputField
          type="text"
          name="ciudad"
          label="Ciudad"
          className="uppercase"
        />
        <InputField
          type="text"
          name="provincia"
          label="Provincia"
          className="uppercase"
        />
        <InputField
          type="text"
          name="distrito"
          label="Distrito"
          className="uppercase"
        />
      </div>
    </>
  );
};

export default ContactData;
