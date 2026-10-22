import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import SessionForm from "./session-form";

export const dynamic = "force-dynamic";

function dayNumber(date: string): number {
  const [year, month, day] = date.split("-").map(Number);
  return Date.UTC(year, month - 1, day) / 86400000;
}

export default async function EstudiantePage({ params }: { params: { id: string } }) {
  if (!/^\d+$/.test(params.id)) notFound();
  const id = Number(params.id);
  if (id > 2147483647) notFound();

  const student = await db.student.findUnique({
    where: { id },
    include: { sessions: { orderBy: [{ date: "desc" }, { id: "desc" }] } },
  });
  if (!student) notFound();

  const now = new Date();
const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000;

const sessions = [...student.sessions].sort((a, b) => {
  const diff = Math.abs(dayNumber(a.date) - today) - Math.abs(dayNumber(b.date) - today);
  if (diff !== 0) return diff;
  return b.date.localeCompare(a.date) || b.id - a.id;
});

  return (
    <>
      <p>
        <Link href="/estudiantes">← Volver a estudiantes</Link>
      </p>
      <h2>
        {student.firstName} {student.lastName} ({student.course})
      </h2>

      <h3>Sesiones</h3>
      {sessions.length === 0 ? (
        <p>Todavía no hay sesiones registradas.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Duración</th>
              <th>Tema</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id}>
                <td>{s.date}</td>
                <td>{s.durationMinutes} min</td>
                <td>{s.topic}</td>
                <td>{s.notes ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Nueva sesión</h3>
      <SessionForm studentId={student.id} />
    </>
  );
}