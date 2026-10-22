import { AppError } from "@/shared/errors/AppError.js";
import { UserRole } from "@/generated/prisma/enums.js";
import venueRepository from "./venue.repository.js";
import type { CreateVenueInput, UpdateVenueInput } from "./venue.validation.js";

class VenueService {
  async createVenue(ownerId: string, data: CreateVenueInput) {
    return venueRepository.create(ownerId, data);
  }

  async getVenueById(id: string) {
    const venue = await venueRepository.findById(id);

    if (!venue) {
      throw new AppError("Venue not found", 404);
    }

    return venue;
  }

  async getMyVenues(ownerId: string, role: UserRole) {
    return role === UserRole.ADMIN
      ? venueRepository.findAll()
      : venueRepository.findByOwnerId(ownerId);
  }

  async updateVenue(id: string, ownerId: string, role: UserRole, data: UpdateVenueInput) {
    const venue = await venueRepository.findById(id);

    if (!venue) {
      throw new AppError("Venue not found", 404);
    }

    if (venue.ownerId !== ownerId && role !== UserRole.ADMIN) {
      throw new AppError("You do not own this venue", 403);
    }

    return venueRepository.update(id, data);
  }

  async deleteVenue(id: string, ownerId: string, role: UserRole) {
    const venue = await venueRepository.findById(id);

    if (!venue) {
      throw new AppError("Venue not found", 404);
    }

    if (venue.ownerId !== ownerId && role !== UserRole.ADMIN) {
      throw new AppError("You do not own this venue", 403);
    }

    await venueRepository.delete(id);
  }
}

export default new VenueService();
