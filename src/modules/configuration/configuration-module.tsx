import ConfigurationForm from "./components/configuration-form";
import { GenericConfigurationTable } from "./components/configuration-table";
import { useCharges } from "./hooks/useChargesGet";
import { useCourses } from "./hooks/useCoursesGet";
import { useMinistries } from "./hooks/useMinistriesGet";
import { useTypeMembers } from "./hooks/useTypeMembersGet";
import { useZones } from "./hooks/useZonesGet";
import {
  useDeleteCharge,
  useDeleteCourse,
  useDeleteMinistry,
  useDeleteTypeMember,
  useDeleteZone,
} from "./hooks/useDeleteConfiguration";

const ConfigurationModule = () => {
  return (
    <div className="grid grid-cols-2">
      <GenericConfigurationTable
        title="Lista de Cargos"
        useQuery={useCharges}
        useDelete={useDeleteCharge}
        Form={ConfigurationForm}
        label="cargos"
      />
      <GenericConfigurationTable
        title="Lista de Cursos"
        useQuery={useCourses}
        useDelete={useDeleteCourse}
        Form={ConfigurationForm}
        label="cursos"
      />
      <GenericConfigurationTable
        title="Lista de Ministerios"
        useQuery={useMinistries}
        useDelete={useDeleteMinistry}
        Form={ConfigurationForm}
        label="ministerios"
      />
      <GenericConfigurationTable
        title="Lista de Tipos de miembro"
        useQuery={useTypeMembers}
        useDelete={useDeleteTypeMember}
        Form={ConfigurationForm}
        label="tipos-miembro"
      />
      <GenericConfigurationTable
        title="Lista de Zonas"
        useQuery={useZones}
        useDelete={useDeleteZone}
        Form={ConfigurationForm}
        label="zonas"
      />
    </div>
  );
};

export default ConfigurationModule;
