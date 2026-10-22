import { Prisma } from "@/generated/prisma/client.js";
import { AppError } from "@/shared/errors/AppError.js";

import { BOOKING_MESSAGES } from "./booking.constants.js";
import bookingRepository from "./booking.repository.js";
import type { CreateBookingInput } from "./booking.validation.js";

function createHourlySlots(date: Date) {
  const slots: {
    startTime: Date;
    endTime: Date;
  }[] = [];

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  for (let hour = 6; hour < 23; hour += 1) {
    slots.push({
      startTime: new Date(Date.UTC(year, month, day, hour)),
      endTime: new Date(Date.UTC(year, month, day, hour + 1)),
    });
  }

  return slots;
}

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
    if (!Number.isFinite(date.getTime())) {
      throw new AppError("Invalid booking date", 400);
    }

    const now = new Date();

    if (date.getTime() < Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())) {
      throw new AppError("Booking date cannot be in the past", 400);
    }

    const turf = await bookingRepository.findTurfById(turfId);

    if (!turf) {
      throw new AppError(BOOKING_MESSAGES.TURF_NOT_FOUND, 404);
    }

    if (!turf.isActive) {
      throw new AppError(BOOKING_MESSAGES.TURF_INACTIVE, 400);
    }

    const bookings = await bookingRepository.findBookingsForDate(turfId, date);

    const slots = createHourlySlots(date);

    const availableSlots = slots
      .filter(({ startTime, endTime }) => {
        if (startTime <= now) {
          return false;
        }

        return !bookings.some(
          (booking) => booking.startTime < endTime && booking.endTime > startTime,
        );
      })
      .map(({ startTime, endTime }) => ({
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        price: turf.pricePerHour,
      }));

    return {
      turf: {
        id: turf.id,
        name: turf.name,
        pricePerHour: turf.pricePerHour,
      },
      date: date.toISOString(),
      availableSlots,
      bookings,
    };
  }
}

export default new BookingService();
