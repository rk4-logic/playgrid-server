import type { NextFunction, Request, Response } from "express";
import { AppError } from "@/shared/errors/AppError.js";
import { createVenueSchema, updateVenueSchema } from "./venue.validation.js";
import venueService from "./venue.service.js";

class VenueController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError("Unauthorized", 401);
      }

      const data = createVenueSchema.parse(req.body);

      const venue = await venueService.createVenue(req.user.id, data);

      res.status(201).json({
        success: true,
        message: "Venue created successfully",
        data: venue,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        throw new AppError("Invalid Venue ID", 400);
      }

      const venue = await venueService.getVenueById(id);

      res.status(200).json({
        success: true,
        data: venue,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMine(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError("Unauthorized", 401);
      }

      const venues = await venueService.getMyVenues(req.user.id);

      res.status(200).json({
        success: true,
        data: venues,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError("Unauthorized", 401);
      }

      const { id } = req.params;

      if (!id || typeof id !== "string") {
        throw new AppError("Invalid Venue ID", 400);
      }

      const data = updateVenueSchema.parse(req.body);

      const venue = await venueService.updateVenue(id, req.user.id, data);

      res.status(200).json({
        success: true,
        message: "Venue updated successfully",
        data: venue,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError("Unauthorized", 401);
      }

      const { id } = req.params;

      if (!id || typeof id !== "string") {
        throw new AppError("Invalid Venue ID", 400);
      }

      await venueService.deleteVenue(id, req.user.id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new VenueController();
