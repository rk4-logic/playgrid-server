import { AppError } from "@/shared/errors/AppError.js";
import venueRepository from "./venue.repository.js";
import type { CreateVenueInput, UpdateVenueInput } from "./venue.validation.js";

class VenueService {
  async createVenue(ownerId: string, data: CreateVenueInput) {
    await venueRepository.create(ownerId, data);
  }

  async getVenueById(id: string) {
    const venue = await venueRepository.findById(id);

    if (!venue) {
      throw new AppError("Venue not found", 404);
    }

    return venue;
  }

  async getMyVenues(ownerId: string) {
    return venueRepository.findByOwnerId(ownerId);
  }

  async updateVenue(id: string, ownerId: string, data: UpdateVenueInput) {
    const venue = await venueRepository.findById(id);

    if (!venue) {
      throw new AppError("Venue not found", 404);
    }

    if (venue.ownerId !== ownerId) {
      throw new AppError("You do not own this venue", 403);
    }

    return venueRepository.update(id, data);
  }

  async deleteVenue(id: string, ownerId: string) {
    const venue = await venueRepository.findById(id);

    if (!venue) {
      throw new AppError("Venue not found", 404);
    }

    if (venue.ownerId !== ownerId) {
      throw new AppError("You do not own this venue", 403);
    }

    await venueRepository.delete(id);
  }
}

export default new VenueService();
