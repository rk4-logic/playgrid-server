import type { NextFunction, Request, Response } from "express";
import { AppError } from "@/shared/errors/AppError.js";
import turfService from "./turf.service.js";
import { listTurfsQuerySchema } from "./turf.validation.js";

function getTurfId(id: string | string[] | undefined): string {
  if (typeof id !== "string" || id.trim().length === 0) {
    throw new AppError("Invalid or missing Turf ID", 400);
  }

  return id;
}

class TurfController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AppError("Unauthorized", 401);

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

  async listPublic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = listTurfsQuerySchema.safeParse(req.query);

      if (!parsed.success) {
        throw new AppError("Invalid turf filters or pagination values", 400);
      }

      const result = await turfService.getPublicTurfs(parsed.data);

      res.status(200).json({
        success: true,
        data: result.items,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getTurfId(req.params.id);

      const turf = await turfService.getTurfById(id);

      res.status(200).json({ success: true, data: turf });
    } catch (error) {
      next(error);
    }
  }

  async getMyTurfs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AppError("Unauthorized", 401);

      const turfs = await turfService.getOwnerTurfs(req.user.id);

      res.status(200).json({ success: true, data: turfs });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AppError("Unauthorized", 401);

      const id = getTurfId(req.params.id);

      const turf = await turfService.updateTurf(id, req.user.id, req.body);

      res.status(200).json({
        success: true,
        message: "Turf updated successfully",
        data: turf,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AppError("Unauthorized", 401);

      const id = getTurfId(req.params.id);

      await turfService.deleteTurf(id, req.user.id);

      res.status(200).json({
        success: true,
        message: "Turf deactivated successfully. Booking history has been preserved.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new TurfController();
