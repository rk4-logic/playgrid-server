import prisma from "@/lib/prisma.js";
import { Prisma } from "@/generated/prisma/client.js";

import type { CreateBookingInput } from "./booking.validation.js";

class BookingRepository {
  async createBookingAtomic(userId: string, data: CreateBookingInput) {
    return prisma.$transaction(
      async (tx) => {
        const turf = await tx.turf.findUnique({
          where: {
            id: data.turfId,
          },
        });

        if (!turf) {
          return null;
        }

        if (!turf.isActive) {
          return null;
        }

        const overlappingBooking = await tx.booking.findFirst({
          where: {
            turfId: data.turfId,
            status: {
              in: ["PENDING", "CONFIRMED"],
            },
            startTime: {
              lt: data.endTime,
            },
            endTime: {
              gt: data.startTime,
            },
          },
        });

        if (overlappingBooking) {
          throw new Error("BOOKING_SLOT_UNAVAILABLE");
        }

        const durationInHours =
          (data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60 * 60);

        const totalAmount = durationInHours * turf.pricePerHour;

        return tx.booking.create({
          data: {
            userId,
            turfId: data.turfId,
            bookingDate: data.bookingDate,
            startTime: data.startTime,
            endTime: data.endTime,
            totalAmount,
          },
        });
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  async findById(id: string) {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        turf: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
            pricePerHour: true,
            venue: {
              select: {
                id: true,
                name: true,
                address: true,
              },
            },
          },
        },
      },
    });
  }

  async findByUserId(userId: string) {
    return prisma.booking.findMany({
      where: {
        userId,
      },
      include: {
        turf: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
            pricePerHour: true,
            venue: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
    });
  }

  async cancel(id: string) {
    return prisma.booking.update({
      where: { id },
      data: {
        status: "CANCELLED",
      },
    });
  }
}

export default new BookingRepository();
