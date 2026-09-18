import z from "zod";

export const diezmoSchema = z.object({
  miembro_id: z.string().min(1, { message: "El miembro es requerido" }),
  fecha_diezmo: z.date({ required_error: "La fecha del diezmo es requerida" }),
  monto: z.string().min(1, { message: "El monto es requerido" }),
  meses_correspondientes: z
    .array(
      z.object({
        mes: z.string().min(1, "El mes es requerido"),
        monto: z.string().min(1, "El monto es requerido"),
      })
    )
    .min(1, "Debe agregar al menos un mes"),
  anio_correspondiente: z.string(),
  servicio: z.string().min(1, "El servicio que se dio el diezmo es requerido"),
}).superRefine((data, ctx) => {
  const totalMonto = parseFloat(data.monto || "0");
  const sumMonths = data.meses_correspondientes.reduce(
    (acc, curr) => acc + (parseFloat(curr.monto || "0")),
    0
  );

  if (Math.abs(totalMonto - sumMonths) > 0.01) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `La suma de los montos mensuales (${sumMonths.toFixed(
        2
      )}) debe ser igual al monto total (${totalMonto.toFixed(2)})`,
      path: ["meses_correspondientes"],
    });
  }
});

export type DiezmoSchemaType = z.infer<typeof diezmoSchema>;