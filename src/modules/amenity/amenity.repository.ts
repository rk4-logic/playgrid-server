import prisma from "@/lib/prisma.js";

import type { CreateAmenityInput } from "./amenity.validation.js";

class AmenityRepository {
  async create(data: CreateAmenityInput) {
    return prisma.amenity.create({
      data: {
        name: data.name,
        icon: data.icon ?? null,
      },
    });
  }

  async findAll() {
    return prisma.amenity.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async findById(id: string) {
    return prisma.amenity.findUnique({
      where: {
        id,
      },
    });
  }

  async findByName(name: string) {
    return prisma.amenity.findUnique({
      where: {
        name,
      },
    });
  }

  async delete(id: string) {
    return prisma.amenity.delete({
      where: {
        id,
      },
    });
  }
}

export default new AmenityRepository();
