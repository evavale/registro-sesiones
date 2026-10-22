import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EstudiantesPage() {
  const students = await db.student.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    include: { _count: { select: { sessions: true } } },
  });

  return (
    <>
      <h2>Estudiantes</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Curso</th>
            <th>Sesiones</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>
                <Link href={`/estudiantes/${s.id}`}>{s.firstName}</Link>
              </td>
              <td>{s.lastName}</td>
              <td>{s.course}</td>
              <td>{s._count.sessions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}