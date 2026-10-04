import { AppError } from "@/shared/errors/AppError.js";

import { AMENITY_MESSAGES } from "./amenity.constants.js";
import amenityRepository from "./amenity.repository.js";
import type { CreateAmenityInput } from "./amenity.validation.js";

class AmenityService {
  async create(data: CreateAmenityInput) {
    const existingAmenity = await amenityRepository.findByName(data.name);

    if (existingAmenity) {
      throw new AppError(AMENITY_MESSAGES.ALREADY_EXISTS, 409);
    }

    return amenityRepository.create(data);
  }

  async findAll() {
    return amenityRepository.findAll();
  }

  async delete(id: string) {
    const amenity = await amenityRepository.findById(id);

    if (!amenity) {
      throw new AppError(AMENITY_MESSAGES.NOT_FOUND, 404);
    }

    return amenityRepository.delete(id);
  }
}

export default new AmenityService();
