import { AppError } from "@/shared/errors/AppError.js";
import { hashPassword } from "@/shared/utils/password.js";

import userRepository from "./user.repository.js";
import type { CreateUserInput } from "./user.validation.js";

class UserService {
  async createUser(data: CreateUserInput) {
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError("User already exists", 409);
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export default new UserService();
