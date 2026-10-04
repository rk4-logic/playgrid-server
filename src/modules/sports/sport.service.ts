import { AppError } from "@/shared/errors/AppError.js";

import { SPORT_MESSAGES } from "./sport.constants.js";
import sportRepository from "./sport.repository.js";
import type { CreateSportInput } from "./sport.validation.js";

class SportService {
  async create(data: CreateSportInput) {
    const existingSport = await sportRepository.findByName(data.name);

    if (existingSport) {
      throw new AppError(SPORT_MESSAGES.ALREADY_EXISTS, 409);
    }

    return sportRepository.create(data);
  }

  async findAll() {
    return sportRepository.findAll();
  }

  async delete(id: string) {
    const sport = await sportRepository.findById(id);

    if (!sport) {
      throw new AppError(SPORT_MESSAGES.NOT_FOUND, 404);
    }

    return sportRepository.delete(id);
  }
}

export default new SportService();
