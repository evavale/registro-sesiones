# Registro de sesiones

Registro pequeño de sesiones de apoyo escolar: lista de estudiantes con su cantidad de sesiones, detalle por estudiante y sesiones con validación en el servidor.

**Stack:** Next.js 14 (App Router), TypeScript, Prisma + SQLite, Zod, Jest.

## Cómo levantarlo

Requiere Node.js 20 o superior.

```bash
npm install
npx prisma migrate deploy
npx prisma db seed
npm run dev
npm test
```

La app queda en http://localhost:3000.

## Decisiones

- **Schema:** en `prisma/schema.prisma`; la migración está en `prisma/migrations/`.
- **Fecha:** se guarda como texto `YYYY-MM-DD`. Es una fecha de calendario sin hora, así se evitan problemas de zona horaria y el orden alfabético coincide con el cronológico.
- **Notas vacías:** se guardan como `null`, no como texto vacío.
- **Validación:** el formulario envía texto y la server action lo valida con Zod en `lib/validation.ts`. La duración de una sesión se acepta solo si es un entero (regex de dígitos) entre 15 y 180, y la fecha debe existir en el calendario (se rechaza `2026-02-30`).
- **Orden de sesiones:** de la más cercana a la fecha actual a la más lejana, si hay dos a igual distancia, la más reciente va primero.
- **404:** ids inexistentes, no numéricos o fuera del rango de un entero responden 404.
- **`.env`:** se incluye en el repo porque solo contiene la ruta de la base SQLite local, sin secretos, para que el proyecto levante con los comandos de arriba.
- **Prisma 6:** se fija la versión 6 por estabilidad con el seed y la configuración actual.
