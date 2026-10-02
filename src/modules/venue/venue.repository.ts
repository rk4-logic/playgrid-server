import prisma from "@/lib/prisma.js";
import type { CreateVenueInput, UpdateVenueInput } from "./venue.validation.js";

class VenueRepository {
  async create(ownerId: string, data: CreateVenueInput) {
    const normalizedData = {
      ...data,
      description: data.description ?? null,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
    };

    return prisma.venue.create({
      data: {
        ...normalizedData,
        ownerId,
      },
    });
  }

  async findById(id: string) {
    return prisma.venue.findUnique({
      where: { id },
      include: {
        turfs: {
          include: {
            sports: true,
            amenities: true,
          },
        },
      },
    });
  }

  async findByOwnerId(ownerId: string) {
    return prisma.venue.findMany({
      where: { ownerId },
      include: {
        turfs: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async update(id: string, data: UpdateVenueInput) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Record<string, string | number | null>;

    return prisma.venue.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    return prisma.venue.delete({
      where: { id },
    });
  }
}

export default new VenueRepository();
