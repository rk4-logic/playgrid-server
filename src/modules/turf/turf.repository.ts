import prisma from "@/lib/prisma.js";
import type { CreateTurfInput, ListTurfsQuery, UpdateTurfInput } from "./turf.validation.js";

class TurfRepository {
  async create(ownerId: string, data: CreateTurfInput) {
    return prisma.turf.create({
      data: {
        ownerId,
        venueId: data.venueId,
        name: data.name,
        description: data.description ?? null,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        pricePerHour: data.pricePerHour,
        sports: {
          connect: data.sports.map((id) => ({ id })),
        },
        amenities: {
          connect: data.amenities.map((id) => ({ id })),
        },
      },
      include: {
        sports: true,
        amenities: true,
        venue: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.turf.findUnique({
      where: { id },
      include: {
        sports: true,
        amenities: true,
        venue: true,
        owner: {
          select: {
            id: true,
            fullName: true,
          },
        },
        _count: {
          select: { bookings: true },
        },
      },
    });
  }

  async findByOwnerId(ownerId: string) {
    return prisma.turf.findMany({
      where: { ownerId },
      include: {
        sports: true,
        amenities: true,
        venue: true,
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findPublic(query: ListTurfsQuery) {
    const where = {
      isActive: true,
      venue: { isActive: true },
      ...(query.city
        ? {
            city: {
              contains: query.city,
              mode: "insensitive" as const,
            },
          }
        : {}),
      ...(query.sportId
        ? {
            sports: {
              some: { id: query.sportId },
            },
          }
        : {}),
    };

    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      prisma.turf.findMany({
        where,
        include: {
          sports: true,
          amenities: true,
          venue: {
            select: {
              id: true,
              name: true,
              city: true,
              state: true,
              address: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: query.limit,
      }),
      prisma.turf.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async findVenueOwnership(venueId: string) {
    return prisma.venue.findUnique({
      where: { id: venueId },
      select: {
        id: true,
        ownerId: true,
        isActive: true,
      },
    });
  }

  async countSports(ids: string[]) {
    return prisma.sport.count({
      where: { id: { in: ids } },
    });
  }

  async countAmenities(ids: string[]) {
    return prisma.amenity.count({
      where: { id: { in: ids } },
    });
  }

  async update(id: string, data: UpdateTurfInput) {
    return prisma.turf.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.address !== undefined ? { address: data.address } : {}),
        ...(data.city !== undefined ? { city: data.city } : {}),
        ...(data.state !== undefined ? { state: data.state } : {}),
        ...(data.pincode !== undefined ? { pincode: data.pincode } : {}),
        ...(data.latitude !== undefined ? { latitude: data.latitude } : {}),
        ...(data.longitude !== undefined ? { longitude: data.longitude } : {}),
        ...(data.pricePerHour !== undefined ? { pricePerHour: data.pricePerHour } : {}),
        ...(data.sports !== undefined
          ? { sports: { set: data.sports.map((id) => ({ id })) } }
          : {}),
        ...(data.amenities !== undefined
          ? {
              amenities: {
                set: data.amenities.map((id) => ({ id })),
              },
            }
          : {}),
      },
      include: {
        sports: true,
        amenities: true,
        venue: true,
      },
    });
  }

  async deactivate(id: string) {
    return prisma.turf.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

export default new TurfRepository();
