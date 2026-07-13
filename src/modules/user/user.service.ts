import { AppError } from "@/shared/errors/AppError.js";
import userRepository from "./user.repository.js";
import type { CreateUserInput } from "./user.validation.js";
import { hashPassword } from "@/shared/utils/password.js";

class UserService {
  async createUser(data: CreateUserInput) {
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError("User already exists", 409);
    }

    const hashedPassword = await hashPassword(data.password);

    return userRepository.create({
      ...data,
      password: hashedPassword,
    });
  }
}

export default new UserService();
