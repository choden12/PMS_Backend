import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const pass = await bcrypt.hash("123456", 10);
  const user = await prisma.user.upsert({
    where: { email: "tandin@example.com" },
    update: {},
    create: {
      name: "Tandin Yuzer",
      email: "tandin@example.com",
      passwordHash: pass,
      bio: "Experienced project manager...",
      skills: ["Project Planning", "Budgeting"]
    }
  });

  const p1 = await prisma.project.create({
    data: {
      title: "Website Redesign",
      description: "Redesign main site",
      progress: 65,
      dueDate: new Date("2025-12-15"),
      teamSize: 5,
      ownerId: user.id
    }
  });

  const p2 = await prisma.project.create({
    data: {
      title: "Mobile App Development",
      progress: 42,
      dueDate: new Date("2025-11-01"),
      teamSize: 8,
      ownerId: user.id
    }
  });

  await prisma.task.createMany({
    data: [
      { title: "Implement user authentication API", projectId: p1.id, priority: "HIGH", status: "IN_PROGRESS", dueDate: new Date(Date.now() + 24 * 3600 * 1000), assigneeId: user.id },
      { title: "Fix database connection pooling", projectId: p2.id, priority: "MEDIUM", status: "PENDING", dueDate: new Date() },
      { title: "Code review for payment module", projectId: p1.id, priority: "LOW", status: "COMPLETED", dueDate: new Date() }
    ]
  });

  console.log("Seeded ✅");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
