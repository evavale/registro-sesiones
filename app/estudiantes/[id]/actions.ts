"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { sessionSchema } from "@/lib/validation";

export type FormState = {
  success: boolean;
  message: string;
  errors: Record<string, string[] | undefined>;
  values: { date: string; durationMinutes: string; topic: string; notes: string };
};

function text(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function createSession(
  studentId: number,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const values = {
    date: text(formData, "date"),
    durationMinutes: text(formData, "durationMinutes"),
    topic: text(formData, "topic"),
    notes: text(formData, "notes"),
  };

  const parsed = sessionSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: "", errors: parsed.error.flatten().fieldErrors, values };
  }

  const student = await db.student.findUnique({
    where: { id: studentId },
    select: { id: true },
  });
  if (!student) {
    return { success: false, message: "El estudiante no existe.", errors: {}, values };
  }

  await db.session.create({ data: { studentId, ...parsed.data } });
  revalidatePath(`/estudiantes/${studentId}`);
  revalidatePath("/estudiantes");

  return {
    success: true,
    message: "Sesión guardada.",
    errors: {},
    values: { date: "", durationMinutes: "", topic: "", notes: "" },
  };
}