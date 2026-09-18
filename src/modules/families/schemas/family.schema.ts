import z from "zod";

export const familySchema = z
  .object({
    tiene_matrimonio: z.string(),

    apellidos: z
      .string()
      .trim()
      .min(1, { message: "El nombre de familia es requerido" }),

    fecha_matrimonio: z.date().optional(),
    lugar_matrimonio: z.string().optional(),

    miembros_familia: z
      .array(
        z.object({
          miembro_id: z.string().optional(),
          dni: z
            .string()
            .min(8, "El DNI debe tener 8 dígitos")
            .max(8, "El DNI debe tener 8 dígitos"),
          nombre: z.string().trim().min(1, { message: "El nombre es requerido" }),
          apellido: z
            .string()
            .trim()
            .min(1, { message: "El apellido es requerido" }),
          fecha_nacimiento: z.date().optional(),
          rol: z.string({required_error:"El rol es requerido"}).trim().min(1, { message: "El rol es requerido" }),
        })
      )
      .min(2, { message: "La familia debe tener al menos 2 miembros" }),
  })
  .superRefine((data, ctx) => {
    // 🔵 Validación condicional del matrimonio
    if (data.tiene_matrimonio === "si") {
      if (!data.fecha_matrimonio) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La fecha de matrimonio es requerida",
          path: ["fecha_matrimonio"],
        });
      }

      if (!data.lugar_matrimonio || data.lugar_matrimonio.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El lugar de matrimonio es requerido",
          path: ["lugar_matrimonio"],
        });
      }
    }
  });

export type FamilySchemaType = z.infer<typeof familySchema>;
