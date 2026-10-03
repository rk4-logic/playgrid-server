import { Prisma } from "@/generated/prisma/client.js";
import { AppError } from "@/shared/errors/AppError.js";

import { BOOKING_MESSAGES } from "./booking.constants.js";
import bookingRepository from "./booking.repository.js";
import type { CreateBookingInput } from "./booking.validation.js";

class BookingService {
  async createBooking(userId: string, data: CreateBookingInput) {
    const now = new Date();

    if (data.startTime <= now) {
      throw new AppError(BOOKING_MESSAGES.INVALID_BOOKING_TIME, 400);
    }

    if (data.endTime <= data.startTime) {
      throw new AppError(BOOKING_MESSAGES.INVALID_TIME_RANGE, 400);
    }

    try {
      const booking = await bookingRepository.createBookingAtomic(userId, data);

      if (!booking) {
        throw new AppError(BOOKING_MESSAGES.TURF_NOT_FOUND, 404);
      }

      return booking;
    } catch (error) {
      if (error instanceof Error && error.message === "BOOKING_SLOT_UNAVAILABLE") {
        throw new AppError(BOOKING_MESSAGES.SLOT_UNAVAILABLE, 409);
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
        throw new AppError(BOOKING_MESSAGES.SLOT_UNAVAILABLE, 409);
      }

      throw error;
    }
  }

  async getBookingById(id: string, userId: string) {
    const booking = await bookingRepository.findById(id);

    if (!booking) {
      throw new AppError(BOOKING_MESSAGES.NOT_FOUND, 404);
    }

    if (booking.userId !== userId) {
      throw new AppError("You do not have access to this booking", 403);
    }

    return booking;
  }

  async getMyBookings(userId: string) {
    return bookingRepository.findByUserId(userId);
  }

  async cancelBooking(id: string, userId: string) {
    const booking = await bookingRepository.findById(id);

    if (!booking) {
      throw new AppError(BOOKING_MESSAGES.NOT_FOUND, 404);
    }

    if (booking.userId !== userId) {
      throw new AppError("You do not have access to this booking", 403);
    }

    if (booking.status === "CANCELLED") {
      throw new AppError(BOOKING_MESSAGES.CANNOT_CANCEL, 400);
    }

    if (booking.startTime <= new Date()) {
      throw new AppError(BOOKING_MESSAGES.CANNOT_CANCEL, 400);
    }

    return bookingRepository.cancel(id);
  }

  async getAvailability(turfId: string, date: Date) {
    const turf = await bookingRepository.findTurfById(turfId);

    if (!turf) {
      throw new AppError(BOOKING_MESSAGES.TURF_NOT_FOUND, 404);
    }

    if (!turf.isActive) {
      throw new AppError(BOOKING_MESSAGES.TURF_INACTIVE, 400);
    }

    const bookings = await bookingRepository.findBookingsForDate(turfId, date);

    return {
      turf: {
        id: turf.id,
        name: turf.name,
        pricePerHour: turf.pricePerHour,
      },
      date,
      bookings,
    };
  }
}

export default new BookingService();
