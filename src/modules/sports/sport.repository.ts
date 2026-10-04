import prisma from "@/lib/prisma.js";

import type { CreateSportInput } from "./sport.validation.js";

class SportRepository {
  async create(data: CreateSportInput) {
    return prisma.sport.create({
      data: {
        name: data.name,
      },
    });
  }

  async findAll() {
    return prisma.sport.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async findById(id: string) {
    return prisma.sport.findUnique({
      where: {
        id,
      },
    });
  }

  async findByName(name: string) {
    return prisma.sport.findUnique({
      where: {
        name,
      },
    });
  }

  async delete(id: string) {
    return prisma.sport.delete({
      where: {
        id,
      },
    });
  }
}

export default new SportRepository();
