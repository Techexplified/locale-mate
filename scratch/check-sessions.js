import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const sessions = await prisma.session.findMany();
  console.log("Sessions found:", sessions.length);
  for (const session of sessions) {
    console.log(`Shop: ${session.shop}, ID: ${session.id}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
