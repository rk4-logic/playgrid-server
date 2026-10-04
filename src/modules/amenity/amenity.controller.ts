import type { Request, Response } from "express";

import { AMENITY_MESSAGES } from "./amenity.constants.js";
import amenityService from "./amenity.service.js";

class AmenityController {
  async create(req: Request, res: Response) {
    const amenity = await amenityService.create(req.body);

    res.status(201).json({
      success: true,
      message: AMENITY_MESSAGES.CREATED,
      data: amenity,
    });
  }

  async findAll(_req: Request, res: Response) {
    const amenities = await amenityService.findAll();

    res.status(200).json({
      success: true,
      message: AMENITY_MESSAGES.FOUND,
      data: amenities,
    });
  }

  async delete(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    await amenityService.delete(id);

    res.status(200).json({
      success: true,
      message: AMENITY_MESSAGES.DELETED,
    });
  }
}

export default new AmenityController();
