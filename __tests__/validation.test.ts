import { sessionSchema } from "@/lib/validation";

const valido = {
  date: "2026-10-15",
  durationMinutes: "60",
  topic: "Fracciones",
  notes: "",
};

function parse(cambios: Partial<typeof valido>) {
  return sessionSchema.safeParse({ ...valido, ...cambios });
}

describe("sessionSchema", () => {
  test("acepta una sesión válida y convierte notas vacías o ausentes en null", () => {
    const result = parse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        date: "2026-10-15",
        durationMinutes: 60,
        topic: "Fracciones",
        notes: null,
      });
    }
    const sinNotes = sessionSchema.safeParse({
      date: "2026-10-15",
      durationMinutes: "60",
      topic: "Fracciones",
    });
    expect(sinNotes.success).toBe(true);
  });

  test("duración: acepta 15 y 180, rechaza 14 y 181", () => {
    expect(parse({ durationMinutes: "15" }).success).toBe(true);
    expect(parse({ durationMinutes: "180" }).success).toBe(true);
    expect(parse({ durationMinutes: "14" }).success).toBe(false);
    expect(parse({ durationMinutes: "181" }).success).toBe(false);
  });

  test("duración: rechaza decimales, texto, negativos y vacío", () => {
    for (const valor of ["60.5", "abc", "-30", ""]) {
      expect(parse({ durationMinutes: valor }).success).toBe(false);
    }
  });

  test("fecha: exige formato YYYY-MM-DD y un día real de calendario", () => {
    expect(parse({ date: "2026-02-28" }).success).toBe(true);
    for (const valor of ["2026-02-30", "2026-13-01", "15-10-2026", "2026-1-5", ""]) {
      expect(parse({ date: valor }).success).toBe(false);
    }
  });

  test("tema y notas: respetan los límites de largo", () => {
    expect(parse({ topic: "a".repeat(120) }).success).toBe(true);
    expect(parse({ topic: "a".repeat(121) }).success).toBe(false);
    expect(parse({ topic: "   " }).success).toBe(false);
    expect(parse({ notes: "a".repeat(500) }).success).toBe(true);
    expect(parse({ notes: "a".repeat(501) }).success).toBe(false);
  });
});