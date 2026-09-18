import z from "zod";

export const bautizoSchema = z.object({
    miembro_id: z.string().min(1, { message: "El miembro es requerido" }),
    fecha_bautizo: z.date({ required_error: "La fecha del bautizo es requerida" }),
    lugar_bautizo: z.string().min(1, { message: "El lugar del bautizo es requerido" }),
    iglesia_bautizo: z.string().optional().nullable(),
});

export type BautizoSchemaType = z.infer<typeof bautizoSchema>;
