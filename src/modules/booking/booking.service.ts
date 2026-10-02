import { AppError } from "@/shared/errors/AppError.js";

import { BOOKING_MESSAGES } from "./booking.constants.js";
import bookingRepository from "./booking.repository.js";
import type { CreateBookingInput } from "./booking.validation.js";

class BookingService {
  async createBooking(userId: string, data: CreateBookingInput) {
    const turf = await bookingRepository.findTurfById(data.turfId);

    if (!turf) {
      throw new AppError(BOOKING_MESSAGES.TURF_NOT_FOUND, 404);
    }

    if (!turf.isActive) {
      throw new AppError(BOOKING_MESSAGES.TURF_INACTIVE, 400);
    }

    const now = new Date();

    if (data.startTime <= now) {
      throw new AppError(BOOKING_MESSAGES.INVALID_BOOKING_TIME, 400);
    }

    if (data.endTime <= data.startTime) {
      throw new AppError(BOOKING_MESSAGES.INVALID_TIME_RANGE, 400);
    }

    const overlappingBooking = await bookingRepository.findOverlappingBooking(
      data.turfId,
      data.startTime,
      data.endTime,
    );

    if (overlappingBooking) {
      throw new AppError(BOOKING_MESSAGES.SLOT_UNAVAILABLE, 409);
    }

    const durationInHours = (data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60 * 60);

    const totalAmount = durationInHours * turf.pricePerHour;

    return bookingRepository.create(userId, data, totalAmount);
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

    return bookingRepository.cancel(id);
  }
}

export default new BookingService();
