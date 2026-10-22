import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <p>
        Este registro permite ver a los estudiantes de apoyo escolar, cuántas
        sesiones lleva cada uno y anotar nuevas sesiones.
      </p>
      <Link href="/estudiantes">Ver lista de estudiantes</Link>
    </>
  );
}