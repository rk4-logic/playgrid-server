/* eslint-disable no-console */

import { PrismaClient } from "../src/generated/prisma/client.js";
import { UserRole } from "../src/generated/prisma/enums.js";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

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

const cities = [
  {
    city: "Vadodara",
    state: "Gujarat",
    pincode: "390001",
    areas: ["Alkapuri", "Manjalpur", "Gotri"],
  },
  {
    city: "Ahmedabad",
    state: "Gujarat",
    pincode: "380001",
    areas: ["Navrangpura", "Bopal", "Satellite"],
  },
  {
    city: "Surat",
    state: "Gujarat",
    pincode: "395003",
    areas: ["Adajan", "Vesu", "Piplod"],
  },
  {
    city: "Patna",
    state: "Bihar",
    pincode: "800001",
    areas: ["Boring Road", "Kankarbagh", "Danapur"],
  },
  {
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560001",
    areas: ["Indiranagar", "Whitefield", "HSR Layout"],
  },
  {
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
    areas: ["Dwarka", "Rohini", "Saket"],
  },
  {
    city: "Amritsar",
    state: "Punjab",
    pincode: "143001",
    areas: ["Ranjit Avenue", "Majitha Road", "Lawrence Road"],
  },
  {
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    areas: ["Andheri", "Powai", "Borivali"],
  },
  {
    city: "Pune",
    state: "Maharashtra",
    pincode: "411001",
    areas: ["Baner", "Wakad", "Kharadi"],
  },
  {
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500001",
    areas: ["Gachibowli", "Kukatpally", "Madhapur"],
  },
];

const venueNames = ["ActivePlay Sports Arena", "Urban Sports Hub", "PrimePlay Turf Club"];

const turfProfiles = [
  {
    name: "Football Turf",
    sports: ["Football"],
    price: 1000,
    description: "Artificial football turf for friendly matches and practice sessions.",
    amenities: ["Floodlights", "Drinking Water", "Washroom", "Parking", "First Aid Kit"],
  },
  {
    name: "Box Cricket Arena",
    sports: ["Cricket"],
    price: 1200,
    description: "Enclosed box cricket area for group games and practice sessions.",
    amenities: ["Floodlights", "Drinking Water", "Washroom", "Parking", "Changing Room"],
  },
  {
    name: "Badminton Court 1",
    sports: ["Badminton"],
    price: 400,
    description: "Dedicated badminton court for casual games and training.",
    amenities: ["Drinking Water", "Washroom", "Changing Room", "Parking"],
  },
  {
    name: "Multi-Sport Court",
    sports: ["Basketball", "Volleyball"],
    price: 800,
    description: "Multi-purpose court for basketball, volleyball and group activities.",
    amenities: ["Floodlights", "Drinking Water", "Washroom", "First Aid Kit"],
  },
  {
    name: "Tennis Court",
    sports: ["Tennis"],
    price: 700,
    description: "Tennis court for recreational games and practice sessions.",
    amenities: ["Drinking Water", "Washroom", "Parking", "Floodlights"],
  },
  {
    name: "Pickleball Court",
    sports: ["Pickleball"],
    price: 500,
    description: "Dedicated pickleball court for beginners and experienced players.",
    amenities: ["Drinking Water", "Washroom", "Parking", "First Aid Kit"],
  },
  {
    name: "Squash Court",
    sports: ["Squash"],
    price: 600,
    description: "Indoor squash court for individual practice and competitive games.",
    amenities: ["Changing Room", "Locker Room", "Drinking Water", "Washroom"],
  },
  {
    name: "Premium Football Ground",
    sports: ["Football"],
    price: 1500,
    description: "Premium football playing area suitable for team matches and events.",
    amenities: [
      "Floodlights",
      "Changing Room",
      "Locker Room",
      "Cafe / Canteen",
      "Parking",
      "First Aid Kit",
    ],
  },
  {
    name: "Cricket Practice Nets",
    sports: ["Cricket"],
    price: 700,
    description: "Cricket practice facility for batting, bowling and training sessions.",
    amenities: ["Drinking Water", "Floodlights", "Washroom", "First Aid Kit"],
  },
];

async function main() {
  console.log("🌱 Seeding PlayGrid demo data...");

  // Reuse existing sports and amenities.
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
      update: { icon: amenity.icon },
      create: amenity,
    });
  }

  // Only seed venues for an existing, explicitly privileged account.
  const owner = await prisma.user.findFirst({
    where: {
      role: { in: [UserRole.OWNER, UserRole.ADMIN] },
    },
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true, role: true },
  });

  if (!owner) {
    throw new Error(
      "No OWNER or ADMIN account found. Register your account and promote your development account before running this seed.",
    );
  }

  console.log(`Using ${owner.role} account ${owner.email} for demo venues.`);

  const sportRecords = await prisma.sport.findMany({
    where: { name: { in: sports } },
    select: { id: true, name: true },
  });

  const amenityRecords = await prisma.amenity.findMany({
    where: { name: { in: amenities.map((item) => item.name) } },
    select: { id: true, name: true },
  });

  const sportByName = new Map(sportRecords.map((sport) => [sport.name, sport]));

  const amenityByName = new Map(amenityRecords.map((amenity) => [amenity.name, amenity]));

  let venuesCreated = 0;
  let turfsCreated = 0;

  for (let cityIndex = 0; cityIndex < cities.length; cityIndex++) {
    const city = cities[cityIndex];

    for (let venueIndex = 0; venueIndex < venueNames.length; venueIndex++) {
      const area = city.areas[venueIndex];

      const venueName = `${city.city} ${venueNames[venueIndex]}`;

      const venueAddress = `Demo Address ${venueIndex + 1}, ${area}`;

      const venueData = {
        name: venueName,
        description: `Fictional PlayGrid demo sports venue in ${area}, ${city.city}.`,
        address: venueAddress,
        city: city.city,
        state: city.state,
        pincode: city.pincode,
        latitude: null,
        longitude: null,
        isActive: true,
      };

      // Find-or-create makes reruns safe without requiring a unique
      // database constraint on venue name and city.
      let venue = await prisma.venue.findFirst({
        where: {
          ownerId: owner.id,
          name: venueName,
          city: city.city,
        },
      });

      if (venue) {
        venue = await prisma.venue.update({
          where: { id: venue.id },
          data: venueData,
        });
      } else {
        venue = await prisma.venue.create({
          data: {
            ...venueData,
            ownerId: owner.id,
          },
        });
        venuesCreated++;
      }

      for (let turfIndex = 0; turfIndex < 3; turfIndex++) {
        const profileIndex = (cityIndex * 2 + venueIndex + turfIndex) % turfProfiles.length;

        const profile = turfProfiles[profileIndex];

        // Prefix the profile with the venue number so the three
        // turfs at each venue have distinct names.
        const turfName = `${profile.name} ${turfIndex + 1}`;

        const connectedSports = profile.sports.map((name) => {
          const sport = sportByName.get(name);

          if (!sport) {
            throw new Error(`Sport not found: ${name}`);
          }

          return { id: sport.id };
        });

        const connectedAmenities = profile.amenities.map((name) => {
          const amenity = amenityByName.get(name);

          if (!amenity) {
            throw new Error(`Amenity not found: ${name}`);
          }

          return { id: amenity.id };
        });

        const turfData = {
          name: turfName,
          description: profile.description,
          address: venue.address,
          city: city.city,
          state: city.state,
          pincode: city.pincode,
          latitude: null,
          longitude: null,
          pricePerHour: profile.price,
          isActive: true,
          sports: { set: connectedSports },
          amenities: { set: connectedAmenities },
        };

        const existingTurf = await prisma.turf.findFirst({
          where: {
            venueId: venue.id,
            name: turfName,
          },
          select: { id: true },
        });

        if (existingTurf) {
          await prisma.turf.update({
            where: { id: existingTurf.id },
            data: turfData,
          });
        } else {
          await prisma.turf.create({
            data: {
              ...turfData,
              ownerId: owner.id,
              venueId: venue.id,
              sports: { connect: connectedSports },
              amenities: { connect: connectedAmenities },
            },
          });
          turfsCreated++;
        }
      }
    }

    console.log(`✅ Seeded venues for ${city.city}`);
  }

  const totalVenues = await prisma.venue.count({
    where: { ownerId: owner.id },
  });

  const totalTurfs = await prisma.turf.count({
    where: { ownerId: owner.id },
  });

  console.log("🎉 PlayGrid demo seed completed.");
  console.log(`New venues created: ${venuesCreated}`);
  console.log(`New turfs created: ${turfsCreated}`);
  console.log(`Total venues for this owner: ${totalVenues}`);
  console.log(`Total turfs for this owner: ${totalTurfs}`);
  console.log("Note: all seeded venues and addresses are fictional demo data.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
