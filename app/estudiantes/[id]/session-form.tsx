"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createSession, type FormState } from "./actions";

const initialState: FormState = {
  success: false,
  message: "",
  errors: {},
  values: { date: "", durationMinutes: "", topic: "", notes: "" },
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Guardando..." : "Guardar sesión"}
    </button>
  );
}

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages || messages.length === 0) return null;
  return <span className="error">{messages[0]}</span>;
}

export default function SessionForm({ studentId }: { studentId: number }) {
  const [state, formAction] = useFormState(createSession.bind(null, studentId), initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} noValidate>
      <label>
        Fecha
        <input type="date" name="date" defaultValue={state.values.date} />
        <FieldError messages={state.errors.date} />
      </label>
      <label>
        Duración (minutos)
        <input type="text" inputMode="numeric" name="durationMinutes" defaultValue={state.values.durationMinutes} />
        <FieldError messages={state.errors.durationMinutes} />
      </label>
      <label>
        Tema
        <input type="text" name="topic" defaultValue={state.values.topic} />
        <FieldError messages={state.errors.topic} />
      </label>
      <label>
        Notas (opcional)
        <textarea name="notes" rows={3} defaultValue={state.values.notes} />
        <FieldError messages={state.errors.notes} />
      </label>
      <SubmitButton />
      {state.message && (
        <p className={state.success ? "ok" : "error"}>{state.message}</p>
      )}
    </form>
  );
}