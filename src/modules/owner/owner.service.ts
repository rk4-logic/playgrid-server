import prisma from "@/lib/prisma.js";
import { UserRole } from "@/generated/prisma/enums.js";

class OwnerService {
  async getDashboard(userId: string, role: UserRole) {
    const isAdmin = role === UserRole.ADMIN;

    const venueWhere = isAdmin ? {} : { ownerId: userId };
    const turfWhere = isAdmin ? {} : { ownerId: userId };

    const bookingWhere = isAdmin ? {} : { turf: { is: { ownerId: userId } } };

    const now = new Date();

    const [
      totalVenues,
      activeVenues,
      totalTurfs,
      activeTurfs,
      totalBookings,
      upcomingBookings,
      cancelledBookings,
      confirmedBookingValue,
      upcoming,
      recentBookings,
      venues,
    ] = await Promise.all([
      prisma.venue.count({ where: venueWhere }),
      prisma.venue.count({
        where: { ...venueWhere, isActive: true },
      }),
      prisma.turf.count({ where: turfWhere }),
      prisma.turf.count({
        where: { ...turfWhere, isActive: true },
      }),
      prisma.booking.count({ where: bookingWhere }),
      prisma.booking.count({
        where: {
          ...bookingWhere,
          status: { in: ["PENDING", "CONFIRMED"] },
          startTime: { gt: now },
        },
      }),
      prisma.booking.count({
        where: { ...bookingWhere, status: "CANCELLED" },
      }),
      prisma.booking.aggregate({
        where: { ...bookingWhere, status: "CONFIRMED" },
        _sum: { totalAmount: true },
      }),
      prisma.booking.findMany({
        where: {
          ...bookingWhere,
          status: { in: ["PENDING", "CONFIRMED"] },
          startTime: { gt: now },
        },
        orderBy: { startTime: "asc" },
        take: 10,
        include: {
          user: {
            select: { id: true, fullName: true, email: true },
          },
          turf: {
            select: {
              id: true,
              name: true,
              venue: { select: { id: true, name: true } },
            },
          },
        },
      }),
      prisma.booking.findMany({
        where: bookingWhere,
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          user: {
            select: { id: true, fullName: true, email: true },
          },
          turf: {
            select: {
              id: true,
              name: true,
              venue: { select: { id: true, name: true } },
            },
          },
        },
      }),
      prisma.venue.findMany({
        where: venueWhere,
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          city: true,
          state: true,
          isActive: true,
          _count: { select: { turfs: true } },
        },
      }),
    ]);

    return {
      stats: {
        totalVenues,
        activeVenues,
        totalTurfs,
        activeTurfs,
        totalBookings,
        upcomingBookings,
        cancelledBookings,
        confirmedBookingValue: confirmedBookingValue._sum.totalAmount ?? 0,
      },
      upcomingBookings: upcoming,
      recentBookings,
      venues,
    };
  }
}

export default new OwnerService();
