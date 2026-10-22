import { AppError } from "@/shared/errors/AppError.js";
import { UserRole } from "@/generated/prisma/enums.js";
import turfRepository from "./turf.repository.js";
import type { CreateTurfInput, ListTurfsQuery, UpdateTurfInput } from "./turf.validation.js";
import { TURF_ERRORS } from "./turf.constants.js";

class TurfService {
  private async validateCatalogSelections(sports: string[], amenities: string[]) {
    if (sports.length > 0) {
      const count = await turfRepository.countSports(sports);
      if (count !== sports.length) {
        throw new AppError("One or more selected sports do not exist", 400);
      }
    }

    if (amenities.length > 0) {
      const count = await turfRepository.countAmenities(amenities);
      if (count !== amenities.length) {
        throw new AppError("One or more selected amenities do not exist", 400);
      }
    }
  }

  private async assertVenueAccess(venueId: string, userId: string, role: UserRole) {
    const venue = await turfRepository.findVenueOwnership(venueId);

    if (!venue) {
      throw new AppError("Venue not found", 404);
    }

    if (venue.ownerId !== userId && role !== UserRole.ADMIN) {
      throw new AppError("You do not own this venue", 403);
    }

    if (!venue.isActive) {
      throw new AppError("Cannot manage turfs for an inactive venue", 400);
    }

    return venue;
  }

  async createTurf(userId: string, role: UserRole, data: CreateTurfInput) {
    const venue = await this.assertVenueAccess(data.venueId, userId, role);
    await this.validateCatalogSelections(data.sports, data.amenities);

    return turfRepository.create(venue.ownerId, data);
  }

  async getTurfById(id: string) {
    const turf = await turfRepository.findById(id);

    if (!turf || !turf.isActive || !turf.venue.isActive) {
      throw new AppError(TURF_ERRORS.NOT_FOUND, 404);
    }

    return turf;
  }

  async getOwnerTurfs(ownerId: string, role: UserRole) {
    return role === UserRole.ADMIN
      ? turfRepository.findAll()
      : turfRepository.findByOwnerId(ownerId);
  }

  async getPublicTurfs(query: ListTurfsQuery) {
    return turfRepository.findPublic(query);
  }

  async updateTurf(id: string, ownerId: string, role: UserRole, data: UpdateTurfInput) {
    const turf = await turfRepository.findById(id);

    if (!turf) {
      throw new AppError(TURF_ERRORS.NOT_FOUND, 404);
    }

    if (turf.ownerId !== ownerId && role !== UserRole.ADMIN) {
      throw new AppError("You do not own this turf", 403);
    }

    if (!turf.isActive) {
      throw new AppError("This turf is inactive", 400);
    }

    if (data.sports !== undefined || data.amenities !== undefined) {
      await this.validateCatalogSelections(
        data.sports ?? turf.sports.map((sport) => sport.id),
        data.amenities ?? turf.amenities.map((amenity) => amenity.id),
      );
    }

    return turfRepository.update(id, data);
  }

  async deleteTurf(id: string, ownerId: string, role: UserRole) {
    const turf = await turfRepository.findById(id);

    if (!turf) {
      throw new AppError(TURF_ERRORS.NOT_FOUND, 404);
    }

    if (turf.ownerId !== ownerId && role !== UserRole.ADMIN) {
      throw new AppError("You do not own this turf", 403);
    }

    if (!turf.isActive) {
      throw new AppError("This turf is already inactive", 400);
    }

    // Preserve booking history by deactivating instead of deleting the row.
    await turfRepository.deactivate(id);
  }
}

export default new TurfService();
