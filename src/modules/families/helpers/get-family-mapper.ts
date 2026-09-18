import { parseLocalDate } from "@/lib/utils";
import { FamilySchemaType } from "../schemas/family.schema";
import { FamiliaResponse } from "../types/families.types";

export const mapFamiliaResponseToForm = (
  data: FamiliaResponse
): FamilySchemaType => {

  return {
    // 🔵 Campo del formulario
    tiene_matrimonio:
      data.fecha_matrimonio && data.lugar_matrimonio ? "si" : "no",

    apellidos: data.apellidos,

    // 🔵 Convertir strings → Date | undefined
    fecha_matrimonio: data.fecha_matrimonio
      ? new Date(data.fecha_matrimonio)
      : undefined,

    lugar_matrimonio: data.lugar_matrimonio ?? undefined,

    // 🔵 Transformación de miembros
    miembros_familia: data.miembros_asociados.map((m) => {
      const miembro = m.miembro; // MiembroResponse | null

      return {
        miembro_id: String(m.miembro_id),
        dni: miembro?.dni ?? "",
        nombre: miembro?.nombres ?? "",
        apellido: miembro?.apellidos ?? "",
        fecha_nacimiento: parseLocalDate(miembro?.fecha_nacimiento ?? ""),
        rol: m.rol ?? "",
      };
    }),
  };
};
