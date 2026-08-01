import type { NextFunction, Request, Response } from "express";

import { AppError } from "@/shared/errors/AppError.js";

import turfService from "./turf.service.js";

class TurfController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError("Unauthorized", 401);
      }

      const turf = await turfService.createTurf(req.user.id, req.body);

      res.status(201).json({
        success: true,
        message: "Turf created successfully",
        data: turf,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        throw new AppError("Invalid or missing Turf ID", 400);
      }

      const turf = await turfService.getTurfbyId(id);

      res.status(200).json({
        success: true,
        data: turf,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new TurfController();
