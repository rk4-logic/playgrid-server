import jwt, { type SignOptions } from "jsonwebtoken";

import { env } from "@/config/env.js";

export function generateAccessToken(userId: string, role: string) {
  return jwt.sign(
    {
      sub: userId,
      role,
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    },
  );
}

export function generateRefreshToken(userId: string) {
  return jwt.sign(
    {
      sub: userId,
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    },
  );
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
}
