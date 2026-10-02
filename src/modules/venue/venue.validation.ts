import { z } from "zod";

export const createVenueSchema = z.object({
  name: z.string().trim().min(3, "Venue name must be at least 3 characters").max(150),

  description: z.string().trim().max(1000).optional(),

  address: z.string().trim().min(5).max(300),

  city: z.string().trim().min(2).max(100),

  state: z.string().trim().min(2).max(100),

  pincode: z.string().trim().min(4).max(10),

  latitude: z.number().min(-90).max(90).optional(),

  longitude: z.number().min(-180).max(180).optional(),
});

export const updateVenueSchema = createVenueSchema.partial();

export type CreateVenueInput = z.infer<typeof createVenueSchema>;
export type UpdateVenueInput = z.infer<typeof updateVenueSchema>;
