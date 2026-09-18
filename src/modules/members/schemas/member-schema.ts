import z from "zod";

export const memberSchema = z.object({
  // -------- DATOS PERSONALES --------
  dni: z
    .string()
    .min(8, "El DNI debe tener 8 dígitos")
    .max(8, "El DNI debe tener 8 dígitos"),
  nombres: z
    .string()
    .trim()
    .min(1, "Los nombres son obligatorios"),
  apellidos: z
    .string()
    .trim()
    .min(1, "Los apellidos son obligatorios"),

  foto: z.any().optional(), // AvatarUploadField (archivo o string)

  estado_civil: z.enum(["soltero", "casado", "divorciado", "viudo"], {
    required_error: "Seleccione estado civil",
  }),

  sexo: z.enum(["M", "F"], {
    required_error: "Seleccione un género",
  }),

  tiene_hijos: z.enum(["si", "no"], {
    required_error: "Seleccione una opción",
  }),

  tipo_miembro_id: z.string({ required_error: "El tipo de miembro es requerido" }).min(1, "Seleccione un tipo de miembro"),

  grado_instruccion: z.enum(["primaria", "secundaria", "superior", ""], {
    required_error: "Seleccione un grado de instrucción",
  }).optional(),

  profesion: z.string().optional(),
  ocupacion_actual: z.string().optional(),

  // -------- CONTACTO Y NACIMIENTO--------
  celular: z
    .string()
    .min(9, "El celular debe tener 9 dígitos")
    .max(9, "El celular debe tener 9 dígitos").optional(),
  email: z.string().trim().optional().refine((val) => !val || z.string().email().safeParse(val).success, {
    message: "Correo inválido",
  }),

  zona: z.string().optional(),

  direccion: z.string().optional(),

  fecha_nacimiento: z
    .date({
      required_error: "Seleccione la fecha de nacimiento",
    })
    .nullable().optional(),
  pais: z.string().optional(),
  ciudad: z.string().optional(),
  provincia: z.string().optional(),
  distrito: z.string().optional(),

  // -------- CONVERSIÓN --------
  fecha_conversion: z.date().optional().nullable(),
  iglesia_conversion: z.string().optional(),
  lugar_conversion: z.string().optional(),

  // -------- BAUTISMO DEL ESPÍRITU SANTO --------
  fecha_bautismo_espiritu: z.date().optional().nullable(),
  iglesia_bautismo_espiritu: z.string().optional(),
  lugar_bautismo_espiritu: z.string().optional(),

  // -------- TRANSFERENCIA --------
  fecha_transferencia: z.date().optional().nullable(),
  iglesia_transferencia: z.string().optional(),
  lugar_transferencia: z.string().optional(),

  // -------- BAUTIZO EN AGUA --------
  fecha_bautizo: z.date().optional().nullable(),
  lugar_bautizo: z.string().optional(),
  iglesia_bautizo: z.string().optional(),

  // -------- CURSOS CARGOS Y MINISTERIOS --------
  cursos: z.array(
    z.object({
      curso_id: z.string().min(1, { message: "Debe seleccionar un curso" }),
      fecha_culminacion: z.date(),
    })
  ).optional(),
  ministerios: z.array(
    z.object({
      ministerio_id: z
        .string()
        .min(1, { message: "Debe seleccionar un ministerio" }),
      cargo: z
        .string()
        .min(1, { message: "Debe seleccionar el cargo ocupado" }),
    })
  ).optional(),
  cargos: z.array(
    z.object({
      cargo_id: z
        .string()
        .min(1, { message: "Debe seleccionar el cargo ocupado" }),
    })
  ).optional(),
});

export type MemberSchemaType = z.infer<typeof memberSchema>;
