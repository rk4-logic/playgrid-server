import type { NextFunction, Request, Response } from "express";

import { AppError } from "@/shared/errors/AppError.js";
import { UserRole } from "@/generated/prisma/enums.js";

export default function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError("Forbidden", 403));
    }

    next();
  };
}
