import { AppError } from "@/shared/errors/AppError.js";
import userRepository from "../user/user.repository.js";
import turfRepository from "./turf.repository.js";
import type { CreateTurfInput } from "./turf.validation.js";
import { TURF_ERRORS } from "./turf.constants.js";

class TurfService {
  async createTurf(ownerId: string, data: CreateTurfInput) {
    const owner = await userRepository.findById(ownerId);

    if (!owner) {
      throw new AppError("Owner not found", 404);
    }

    return turfRepository.create(ownerId, data);
  }

  async getTurfbyId(id: string) {
    const turf = await turfRepository.findById(id);

    if (!turf) {
      throw new AppError(TURF_ERRORS.NOT_FOUND, 404);
    }

    return turf;
  }
}

export default new TurfService();
