import { AppError } from "@/shared/errors/AppError.js";
import { verifyPassword } from "@/shared/utils/password.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@/shared/utils/jwt.js";

import userRepository from "../user/user.repository.js";

import { AUTH_MESSAGES } from "./auth.constants.js";
import type { LoginInput } from "./auth.validation.js";

class AuthService {
  async login(data: LoginInput) {
    const user = await userRepository.findByEmail(data.email);

    if (!user) {
      throw new AppError(AUTH_MESSAGES.INVALID_CREDENTIALS, 401);
    }

    const isPasswordValid = await verifyPassword(user.password, data.password);

    if (!isPasswordValid) {
      throw new AppError(AUTH_MESSAGES.INVALID_CREDENTIALS, 401);
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = verifyRefreshToken(refreshToken);

      if (typeof payload === "string" || typeof payload.sub !== "string") {
        throw new AppError(AUTH_MESSAGES.INVALID_TOKEN, 401);
      }

      const user = await userRepository.findById(payload.sub);

      if (!user) {
        throw new AppError(AUTH_MESSAGES.INVALID_TOKEN, 401);
      }

      const accessToken = generateAccessToken(user.id, user.role);

      return {
        accessToken,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(AUTH_MESSAGES.INVALID_TOKEN, 401);
    }
  }

  async getCurrentUser(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return this.sanitizeUser(user);
  }

  private sanitizeUser(user: {
    id: string;
    fullName: string;
    email: string;
    password: string;
    phone: string | null;
    profileImage: string | null;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
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

export default new AuthService();
