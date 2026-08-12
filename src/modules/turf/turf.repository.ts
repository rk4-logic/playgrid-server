import prisma from "@/lib/prisma.js";
import type { CreateTurfInput } from "./turf.validation.js";

class TurfRepository {
  async create(ownerId: string, data: CreateTurfInput) {
    return prisma.turf.create({
      data: {
        ownerId,

        name: data.name,
        description: data.description ?? null,

        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,

        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,

        sports: {
          connect: data.sports.map((id) => ({ id })),
        },

        amenities: {
          connect: data.amenities.map((id) => ({ id })),
        },
      },

      include: {
        sports: true,
        amenities: true,
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.turf.findUnique({
      where: { id },
      include: {
        sports: true,
        amenities: true,
      },
    });
  }

  async findByOwnerId(ownerId: string) {
    return prisma.turf.findMany({
      where: { ownerId },

      include: {
        sports: true,
        amenities: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

export default new TurfRepository();
