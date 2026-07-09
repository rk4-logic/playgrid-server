import { AppError } from "@/shared/errors/AppError.js";
import userRepository from "./user.repository.js";
import type { CreateUserInput } from "./user.validation.js";

class UserService {
  async createUser(data: CreateUserInput) {
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError("User already exists", 409);
    }

    // TODO:
    // Hash password with bcrypt here

    return userRepository.create(data);
  }
}

export default new UserService();
