import { parseLocalDate } from "@/lib/utils";
import { getMemberPhotoUrl } from "@/lib/supabase";
import { MemberSchemaType } from "../schemas/member-schema";
import { MiembroResponse } from "../types/members.types";

export const mapMiembroResponseToForm = (
  data: MiembroResponse
): MemberSchemaType => {
  return {
    dni: data.dni ?? "",
    nombres: data.nombres ?? "",
    apellidos: data.apellidos ?? "",
    estado_civil: data.estado_civil ?? "soltero",
    sexo: data.sexo ?? "M",
    tiene_hijos: data.tiene_hijos ? (data.tiene_hijos ? "si" : "no") : "no",

    celular: data.celular ?? undefined,
    email: data.email ?? "",
    zona: data.zona_id ? String(data.zona_id) : "",
    direccion: data.domicilio ?? "",
    pais: data.pais_nacimiento ?? "",
    ciudad: data.ciudad_nacimiento ?? "",
    provincia: data.provincia_nacimiento ?? "",
    distrito: data.distrito_nacimiento ?? "",

    fecha_nacimiento: parseLocalDate(data.fecha_nacimiento ?? ""),

    tipo_miembro_id: data.tipo_miembro_id ? String(data.tipo_miembro_id) : "",
    grado_instruccion: data.grado_instruccion ?? "",
    profesion: data.profesion ?? "",
    ocupacion_actual: data.ocupacion_actual ?? "",

    fecha_conversion: parseLocalDate(data.fecha_conversion ?? ""),
    iglesia_conversion: data.iglesia_conversion ?? "",
    lugar_conversion: data.lugar_conversion ?? "",

    fecha_bautismo_espiritu: parseLocalDate(data.fecha_bautismo_espiritu ?? ""),
    iglesia_bautismo_espiritu: data.iglesia_bautismo_espiritu ?? "",
    lugar_bautismo_espiritu: data.lugar_bautismo_espiritu ?? "",

    fecha_transferencia: parseLocalDate(data.fecha_transferencia ?? ""),
    iglesia_transferencia: data.iglesia_transferencia ?? "",
    lugar_transferencia: data.lugar_transferencia ?? "",

    cursos: (data.cursos ?? []).map((curso) => ({
      curso_id: curso.curso_id ? String(curso.curso_id) : "",
      fecha_culminacion: parseLocalDate(curso.fecha_culminacion ?? ""),
    })),
    cargos: (data.cargos ?? []).map((cargo) => ({
      cargo_id: cargo.cargo_id ? String(cargo.cargo_id) : "",
    })),
    ministerios: (data.ministerios ?? []).map((min) => ({
      ministerio_id: min.ministerio_id ? String(min.ministerio_id) : "",
      cargo: min.cargo ?? "",
    })),
    fecha_bautizo: parseLocalDate(data.bautizo?.fecha_bautizo ?? ""),
    iglesia_bautizo: data.bautizo?.iglesia_bautizo ?? "",
    lugar_bautizo: data.bautizo?.lugar_bautizo ?? "",
    foto: getMemberPhotoUrl(data.foto_url),
  } as MemberSchemaType;
};
