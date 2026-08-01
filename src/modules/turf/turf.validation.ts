import { z } from "zod";

export const createTurfSchema = z.object({
  name: z.string().trim().min(3).max(100),

  description: z.string().trim().max(500).optional(),

  address: z.string().trim().min(5),

  city: z.string().trim().min(2),

  state: z.string().trim().min(2),

  pincode: z.string().trim().length(6),

  latitude: z.number().optional(),

  longitude: z.number().optional(),

  sports: z.array(z.string().cuid()).min(1, "At least one sport is required"),

  amenities: z.array(z.string().cuid()).default([]),
});

export type CreateTurfInput = z.infer<typeof createTurfSchema>;
