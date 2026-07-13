import { AppError } from "@/shared/errors/AppError.js";
import { verifyPassword } from "@/shared/utils/password.js";
import { generateAccessToken, generateRefreshToken } from "@/shared/utils/jwt.js";

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
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
      accessToken,
      refreshToken,
    };
  }
}

export default new AuthService();
