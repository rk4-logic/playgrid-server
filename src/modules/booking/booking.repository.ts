import prisma from "@/lib/prisma.js";

import type { CreateBookingInput } from "./booking.validation.js";

class BookingRepository {
  async findTurfById(turfId: string) {
    return prisma.turf.findUnique({
      where: { id: turfId },
    });
  }

  async findOverlappingBooking(turfId: string, startTime: Date, endTime: Date) {
    return prisma.booking.findFirst({
      where: {
        turfId,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
        startTime: {
          lt: endTime,
        },
        endTime: {
          gt: startTime,
        },
      },
    });
  }

  async create(userId: string, data: CreateBookingInput, totalAmount: number) {
    return prisma.booking.create({
      data: {
        userId,
        turfId: data.turfId,
        bookingDate: data.bookingDate,
        startTime: data.startTime,
        endTime: data.endTime,
        totalAmount,
      },
    });
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
