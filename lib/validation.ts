import { z } from "zod";

function isRealDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export const sessionSchema = z.object({
  date: z
    .string()
    .refine(isRealDate, "Ingresa una fecha válida con formato YYYY-MM-DD."),
  durationMinutes: z
    .string()
    .trim()
    .regex(/^\d+$/, "La duración debe ser un número entero.")
    .transform(Number)
    .pipe(
      z
        .number()
        .min(15, "La duración mínima es 15 minutos.")
        .max(180, "La duración máxima es 180 minutos.")
    ),
  topic: z
    .string()
    .trim()
    .min(1, "El tema es obligatorio.")
    .max(120, "El tema no puede superar los 120 caracteres."),
  notes: z
    .string()
    .max(500, "Las notas no pueden superar los 500 caracteres.")
    .optional()
    .transform((value) => (value === undefined || value.trim() === "" ? null : value.trim())),
});

export type SessionInput = z.infer<typeof sessionSchema>;