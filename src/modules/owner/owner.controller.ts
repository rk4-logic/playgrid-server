import type { NextFunction, Request, Response } from "express";
import { AppError } from "@/shared/errors/AppError.js";
import ownerService from "./owner.service.js";

class OwnerController {
  async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError("Unauthorized", 401);
      }

      const dashboard = await ownerService.getDashboard(req.user.id, req.user.role);

      res.status(200).json({
        success: true,
        data: dashboard,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new OwnerController();
