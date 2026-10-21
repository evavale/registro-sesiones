import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.session.deleteMany();
  await prisma.student.deleteMany();

  const ana = await prisma.student.create({
    data: { firstName: "Ana", lastName: "Rojas", course: "5 basico" },
  });
  await prisma.student.create({
    data: { firstName: "Bruno", lastName: "Soto", course: "6 basico" },
  });
  await prisma.student.create({
    data: { firstName: "Carla", lastName: "Diaz", course: "1 medio" },
  });
  await prisma.student.create({
    data: { firstName: "Diego", lastName: "Munoz", course: "2 medio" },
  });
  const elena = await prisma.student.create({
    data: { firstName: "Elena", lastName: "Fuentes", course: "7 basico" },
  });

  await prisma.session.create({
    data: { studentId: ana.id, date: "2026-10-15", durationMinutes: 60, topic: "Fracciones" },
  });
  await prisma.session.create({
    data: { studentId: elena.id, date: "2026-10-02", durationMinutes: 45, topic: "Comprension lectora" },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());