import { formatDate } from "@/lib/utils";
import { MemberSchemaType } from "../schemas/member-schema";
import { MiembroCreate } from "../types/members.types";

export const mapFormToMemberCreate = (
  dataForm: MemberSchemaType
): MiembroCreate => {
  return {
    nombres: dataForm.nombres,
    apellidos: dataForm.apellidos,
    dni: dataForm.dni,
    sexo: dataForm.sexo,
    fecha_nacimiento: formatDate(dataForm.fecha_nacimiento),

    pais_nacimiento: dataForm.pais?.toUpperCase(),
    ciudad_nacimiento: dataForm.ciudad?.toUpperCase(),
    provincia_nacimiento: dataForm.provincia?.toUpperCase(),
    distrito_nacimiento: dataForm.distrito?.toUpperCase(),

    zona_id: dataForm.zona ? parseInt(dataForm.zona, 10) : null,
    domicilio: dataForm.direccion,
    celular: dataForm.celular,
    email: dataForm.email,
    foto_url: dataForm.foto ? dataForm.foto : null,

    tipo_miembro_id: dataForm.tipo_miembro_id
      ? parseInt(dataForm.tipo_miembro_id, 10)
      : null,
    grado_instruccion: dataForm.grado_instruccion
      ? (dataForm.grado_instruccion as any)
      : null,
    profesion: dataForm.profesion ?? null,
    ocupacion_actual: dataForm.ocupacion_actual ?? null,

    estado_civil: dataForm.estado_civil as any,
    tiene_hijos: dataForm.tiene_hijos === "si",

    fecha_conversion: formatDate(dataForm.fecha_conversion),
    iglesia_conversion: dataForm.iglesia_conversion ?? null,
    lugar_conversion: dataForm.lugar_conversion ?? null,

    fecha_bautismo_espiritu: formatDate(dataForm.fecha_bautismo_espiritu),
    iglesia_bautismo_espiritu: dataForm.iglesia_bautismo_espiritu ?? null,
    lugar_bautismo_espiritu: dataForm.lugar_bautismo_espiritu ?? null,

    fecha_transferencia: formatDate(dataForm.fecha_transferencia),
    iglesia_transferencia: dataForm.iglesia_transferencia ?? null,
    lugar_transferencia: dataForm.lugar_transferencia ?? null,

    es_miembro_externo: false,

    cursos: (dataForm.cursos ?? []).map((curso) => ({
      curso_id: parseInt(curso.curso_id, 10),
      fecha_culminacion: formatDate(curso.fecha_culminacion),
    })),
    cargos: (dataForm.cargos ?? []).map((cargo) => ({
      cargo_id: parseInt(cargo.cargo_id, 10),
    })),
    ministerios: (dataForm.ministerios ?? []).map((min) => ({
      ministerio_id: parseInt(min.ministerio_id, 10),
      cargo: min.cargo as any,
    })),
    bautizo:
      dataForm.fecha_bautizo ||
        dataForm.lugar_bautizo ||
        dataForm.iglesia_bautizo
        ? {
          fecha_bautizo: formatDate(dataForm.fecha_bautizo),
          iglesia_bautizo: dataForm.iglesia_bautizo ?? null,
          lugar_bautizo: dataForm.lugar_bautizo ?? null,
        }
        : null,
  } as MiembroCreate;
};
