import type { Request, Response } from "express";

import { SPORT_MESSAGES } from "./sport.constants.js";
import sportService from "./sport.service.js";

class SportController {
  async create(req: Request, res: Response) {
    const sport = await sportService.create(req.body);

    res.status(201).json({
      success: true,
      message: SPORT_MESSAGES.CREATED,
      data: sport,
    });
  }

  async findAll(_req: Request, res: Response) {
    const sports = await sportService.findAll();

    res.status(200).json({
      success: true,
      message: SPORT_MESSAGES.FOUND,
      data: sports,
    });
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;

    await sportService.delete(id);

    res.status(200).json({
      success: true,
      message: SPORT_MESSAGES.DELETED,
    });
  }
}

export default new SportController();
