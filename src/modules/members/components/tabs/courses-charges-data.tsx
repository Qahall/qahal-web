import { DatePickerField } from "@/components/form/date-picker";
import { SelectField } from "@/components/form/select-field";
import { Button } from "@/components/ui/button";
import { Control, useFieldArray } from "react-hook-form";
import { useCourses } from "@/modules/configuration/hooks/useCoursesGet";
import { useMinistries } from "@/modules/configuration/hooks/useMinistriesGet";
import { useCharges } from "@/modules/configuration/hooks/useChargesGet";
import { TrashIcon } from "lucide-react";
import { MemberSchemaType } from "../../schemas/member-schema";

interface CoursesChargesDataProps {
  control: Control<MemberSchemaType>;
}

const CoursesChargesData = ({ control }: CoursesChargesDataProps) => {
  const {
    fields: fieldsCourse,
    append: appendCourse,
    remove: removeCourse,
  } = useFieldArray({
    control: control,
    name: "cursos",
  });
  const {
    fields: fieldsMinistry,
    append: appendMinistry,
    remove: removeMinistry,
  } = useFieldArray({
    control: control,
    name: "ministerios",
  });
  const {
    fields: fieldsCharge,
    append: appendCharge,
    remove: removeCharge,
  } = useFieldArray({
    control: control,
    name: "cargos",
  });

  const { data: courses, isLoading: isLoadingCourses } = useCourses();
  const coursesToSelect = courses?.map((course) => ({
    value: String(course.id),
    label: course.nombre,
  }));

  const { data: ministries, isLoading: isLoadingMinistries } = useMinistries();
  const ministriesToSelect = ministries?.map((minis) => ({
    value: String(minis.id),
    label: minis.nombre,
  }));

  const { data: charges, isLoading: isLoadingCharges } = useCharges();
  const chargesToSelect = charges?.map((charge) => ({
    value: String(charge.id),
    label: charge.nombre,
  }));

  return (
    <div className="grid grid-cols-[3fr_2fr_3fr] mt-5 divide-x divide-border">
      <div className="space-y-3 px-2">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">Cursos</h3>
          <Button
            onClick={() =>
              appendCourse({ curso_id: "", fecha_culminacion: new Date() })
            }
            type="button"
            variant={"secondary"}
          >
            Agregar curso
          </Button>
        </div>
        <div className="grid grid-cols-[2fr_2fr_1fr] gap-3">
          <p>Nombre</p>
          <p>Fecha de Culminación</p>
        </div>
        {fieldsCourse.map((field, index) => (
          <div key={field.id} className="grid grid-cols-[2fr_2fr_1fr] gap-3">
            <SelectField
              name={`cursos.${index}.curso_id`}
              options={coursesToSelect ?? []}
              isLoading={isLoadingCourses}
            />

            <DatePickerField name={`cursos.${index}.fecha_culminacion`} />

            <Button
              onClick={() => removeCourse(index)}
              variant="destructive"
              type="button"
            >
              <TrashIcon />
            </Button>
          </div>
        ))}
      </div>
      <div className="space-y-3 px-2">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">Cargos</h3>
          <Button
            onClick={() => appendCharge({ cargo_id: "" })}
            type="button"
            variant={"secondary"}
          >
            Agregar Cargo
          </Button>
        </div>
        <div className="grid grid-cols-[2fr_1fr] gap-3">
          <p>Nombre</p>
        </div>
        {fieldsCharge.map((field, index) => (
          <div key={field.id} className="grid grid-cols-[2fr_1fr] gap-3">
            <SelectField
              name={`cargos.${index}.cargo_id`}
              options={chargesToSelect ?? []}
              isLoading={isLoadingCharges}
            />

            <Button
              onClick={() => removeCharge(index)}
              variant="destructive"
              type="button"
            >
              <TrashIcon />
            </Button>
          </div>
        ))}
      </div>
      <div className="space-y-3 px-2">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">Ministerios</h3>
          <Button
            onClick={() => appendMinistry({ ministerio_id: "", cargo: "" })}
            type="button"
            variant={"secondary"}
          >
            Agregar ministerio
          </Button>
        </div>
        <div className="grid grid-cols-[2fr_2fr_1fr] gap-3">
          <p>Nombre</p>
          <p>Cargo en el ministerio</p>
        </div>
        {fieldsMinistry.map((field, index) => (
          <div key={field.id} className="grid grid-cols-[2fr_2fr_1fr] gap-3">
            <SelectField
              name={`ministerios.${index}.ministerio_id`}
              options={ministriesToSelect ?? []}
              isLoading={isLoadingMinistries}
            />

            <SelectField
              name={`ministerios.${index}.cargo`}
              options={[
                { value: "presidente", label: "Presidente" },
                { value: "vice_presidente", label: "Vice Presidente" },
                { value: "tesorero", label: "Tesorero" },
                { value: "secretario", label: "Secretario" },
                { value: "servidor", label: "Servidor" },
              ]}
            />

            <Button
              onClick={() => removeMinistry(index)}
              variant="destructive"
              type="button"
            >
              <TrashIcon />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesChargesData;
