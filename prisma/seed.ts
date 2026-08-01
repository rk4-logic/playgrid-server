/* eslint-disable no-console */
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const sports = [
  "Football",
  "Cricket",
  "Badminton",
  "Tennis",
  "Volleyball",
  "Basketball",
  "Pickleball",
  "Squash",
];

const amenities = [
  { name: "Parking", icon: "car" },
  { name: "Washroom", icon: "bath" },
  { name: "Floodlights", icon: "lightbulb" },
  { name: "Drinking Water", icon: "cup-soda" },
  { name: "Changing Room", icon: "door-closed" },
  { name: "Locker Room", icon: "lock" },
  { name: "Cafe / Canteen", icon: "coffee" },
  { name: "First Aid Kit", icon: "first-aid" },
];

async function main() {
  console.log("🌱 Seeding database...");

  for (const name of sports) {
    await prisma.sport.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: { name: amenity.name },
      update: {
        icon: amenity.icon,
      },
      create: amenity,
    });
  }

  console.log("✅ Database seeded successfully");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
