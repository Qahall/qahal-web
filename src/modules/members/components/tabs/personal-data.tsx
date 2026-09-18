import { AvatarUploadField } from "@/components/form/avatar-upload-field";
import { InputField } from "@/components/form/input-field";
import { SelectField } from "@/components/form/select-field";
import { ToggleGroupField } from "@/components/form/toggle-group-field";
import { useTypeMembers } from "@/modules/configuration/hooks/useTypeMembersGet";
import { MarsIcon, User2Icon, Users2Icon, VenusIcon } from "lucide-react";

const PersonalData = () => {

  const {data, isLoading} = useTypeMembers();

  const typeMembersToSelect = data?.map((tm)=>({
    value: String(tm.id), label: tm.nombre
  }))

  return (
    <>
      <div className="grid grid-cols-4 gap-5 pt-5">
        <InputField type="number" name="dni" label="DNI" />
        <InputField type="text" name="nombres" label="Nombres" />
        <InputField type="text" name="apellidos" label="Apellidos" />
        <div className="row-span-4">
          <AvatarUploadField name="foto" label="Foto" />
        </div>
        <SelectField
          name="estado_civil"
          label="Estado civil"
          options={[
            { value: "soltero", label: "Soltero" },
            { value: "casado", label: "Casado" },
            { value: "divorciado", label: "Divorciado" },
            { value: "viudo", label: "Viudo" },
          ]}
        />
        <ToggleGroupField
          name="sexo"
          label="Género"
          options={[
            { value: "M", label: "Masculino", icon: <MarsIcon /> },
            { value: "F", label: "Femenino", icon: <VenusIcon /> },
          ]}
        />
        <ToggleGroupField
          name="tiene_hijos"
          label="¿Tiene hijos?"
          options={[
            { value: "si", label: "Si", icon: <Users2Icon /> },
            { value: "no", label: "No", icon: <User2Icon /> },
          ]}
        />

        <SelectField
          name="tipo_miembro_id"
          label="Tipo de miembro"
          isLoading={isLoading}
          options={typeMembersToSelect ?? []}
        />
        <SelectField
          name="grado_instruccion"
          label="Grado de instrucción"
          options={[
            { value: "primaria", label: "Primaria" },
            { value: "secundaria", label: "Secundaria" },
            { value: "superior", label: "Superior" },
          ]}
        />
        <InputField type="text" name="profesion" label="Profesión" />
        <InputField
          type="text"
          name="ocupacion_actual"
          label="Ocupación actual"
        />
      </div>
    </>
  );
};

export default PersonalData;
