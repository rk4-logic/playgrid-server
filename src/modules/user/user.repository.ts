import prisma from "@/lib/prisma.js";
import type { CreateUserInput, UpdateUserInput } from "./user.validation.js";

class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: CreateUserInput) {
    const createData = {
      ...data,
      phone: data.phone ?? null,
      profileImage: data.profileImage ?? null,
    };

    return prisma.user.create({
      data: createData,
    });
  }

  async update(id: string, data: UpdateUserInput) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Record<string, string | null>;

    return prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        ...(data.phone !== undefined ? { phone: data.phone ?? null } : {}),
        ...(data.profileImage !== undefined ? { profileImage: data.profileImage ?? null } : {}),
      },
    });
  }

  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }
}

export default new UserRepository();
