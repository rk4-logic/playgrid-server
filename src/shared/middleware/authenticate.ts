import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { AppError } from "@/shared/errors/AppError.js";
import { env } from "@/config/env.js";
import type { AuthTokenPayload } from "@/types/auth.types.js";
import { AUTH_MESSAGES } from "@/modules/auth/auth.constants.js";

export default function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return next(new AppError(AUTH_MESSAGES.UNAUTHORIZED, 401));
  }

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthTokenPayload;

    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    next();
  } catch {
    next(new AppError(AUTH_MESSAGES.UNAUTHORIZED, 401));
  }
}
