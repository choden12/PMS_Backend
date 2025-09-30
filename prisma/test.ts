import { prisma } from "../src/index";

async function main() {
  const users = await prisma.user.findMany();
  console.log(users);
}

main()
  .then(() => console.log("Prisma test complete"))
  .finally(() => prisma.$disconnect());
