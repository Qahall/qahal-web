import { DatePickerField } from "@/components/form/date-picker";
import { InputField } from "@/components/form/input-field";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { Cross, Flame, RefreshCw, Waves } from "lucide-react";

const EclesiasticData = () => {
  return (
    <div className="grid grid-cols-4 gap-5 mt-5">
      {/* Conversión */}
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>
            <Cross className="w-5 h-5 text-blue-600" /> Conversión
          </ItemTitle>
        </ItemContent>
      </Item>
      <DatePickerField name="fecha_conversion" label="Fecha de conversión" />
      <InputField
        name="iglesia_conversion"
        label="Iglesia donde se convirtió"
      />
      <InputField name="lugar_conversion" label="Lugar de conversión" />

      {/* Bautismo del Espíritu Santo */}
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>
            <Flame className="w-5 h-5 text-purple-600" /> Bautismo del Espíritu
            Santo
          </ItemTitle>
        </ItemContent>
      </Item>
      <DatePickerField
        name="fecha_bautismo_espiritu"
        label="Fecha del bautismo del Espíritu Santo"
      />
      <InputField
        name="iglesia_bautismo_espiritu"
        label="Iglesia del bautismo"
      />
      <InputField
        name="lugar_bautismo_espiritu"
        label="Lugar del bautismo del Espíritu Santo"
      />

      {/* Transferencia */}
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>
            <RefreshCw className="w-5 h-5 text-amber-600" /> Transferencia
          </ItemTitle>
        </ItemContent>
      </Item>
      <DatePickerField
        name="fecha_transferencia"
        label="Fecha de transferencia"
      />
      <InputField
        name="iglesia_transferencia"
        label="Iglesia de transferencia"
      />
      <InputField name="lugar_transferencia" label="Lugar de transferencia" />

      {/* Bautizo en agua */}
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>
            <Waves className="w-5 h-5 text-teal-600" /> Bautismo en agua
          </ItemTitle>
        </ItemContent>
      </Item>
      <DatePickerField name="fecha_bautizo" label="Fecha de bautizo en agua" />
      <InputField name="lugar_bautizo" label="Lugar de bautizo" />
      <InputField name="iglesia_bautizo" label="Iglesia donde fue bautizado" />
    </div>
  );
};

export default EclesiasticData;
