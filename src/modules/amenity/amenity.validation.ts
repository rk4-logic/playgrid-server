import { z } from "zod";

export const createAmenitySchema = z.object({
  name: z.string().trim().min(2).max(50),
  icon: z.string().trim().max(100).optional(),
});

export const amenityIdSchema = z.object({
  id: z.string().min(1),
});

export type CreateAmenityInput = z.infer<typeof createAmenitySchema>;
