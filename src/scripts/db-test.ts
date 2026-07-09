/* eslint-disable no-console */

import prisma from "../lib/prisma.js";

async function main() {
  console.log("🚀 Testing database connection...");

  const users = await prisma.user.findMany();

  console.log("✅ Connected successfully!");
  console.log(users);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
