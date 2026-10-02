import type { NextFunction, Request, Response } from "express";

import authService from "./auth.service.js";
import { AppError } from "@/shared/errors/AppError.js";

class AuthController {
  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.refresh(req.body.refreshToken);

      res.status(200).json({
        success: true,
        message: "Access token refreshed",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError("Unauthorized", 401);
      }

      const user = await authService.getCurrentUser(req.user.id);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
