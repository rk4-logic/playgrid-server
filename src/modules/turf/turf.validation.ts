import { z } from "zod";

const sportsSchema = z
  .array(z.string().cuid())
  .min(1, "At least one sport is required")
  .refine((ids) => new Set(ids).size === ids.length, "Duplicate sports are not allowed");

const amenitiesSchema = z
  .array(z.string().cuid())
  .refine((ids) => new Set(ids).size === ids.length, "Duplicate amenities are not allowed");

export const createTurfSchema = z.object({
  venueId: z.string().cuid(),
  name: z.string().trim().min(3).max(100),
  description: z.string().trim().max(500).optional(),
  address: z.string().trim().min(5).max(300),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100),
  pincode: z.string().trim().length(6),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  pricePerHour: z.number().positive(),
  sports: sportsSchema,
  amenities: amenitiesSchema.default([]),
});

export const updateTurfSchema = z
  .object({
    name: z.string().trim().min(3).max(100).optional(),
    description: z.string().trim().max(500).optional(),
    address: z.string().trim().min(5).max(300).optional(),
    city: z.string().trim().min(2).max(100).optional(),
    state: z.string().trim().min(2).max(100).optional(),
    pincode: z.string().trim().length(6).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    pricePerHour: z.number().positive().optional(),
    sports: sportsSchema.optional(),
    amenities: amenitiesSchema.optional(),
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    "Provide at least one field to update",
  );

export const listTurfsQuerySchema = z.object({
  city: z.string().trim().min(1).max(100).optional(),
  sportId: z.string().cuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export type CreateTurfInput = z.infer<typeof createTurfSchema>;
export type UpdateTurfInput = z.infer<typeof updateTurfSchema>;
export type ListTurfsQuery = z.infer<typeof listTurfsQuerySchema>;
