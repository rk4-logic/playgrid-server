import { z } from "zod";

export const createSportSchema = z.object({
  name: z.string().trim().min(2).max(50),
});

export const sportIdSchema = z.object({
  id: z.string().min(1),
});

export type CreateSportInput = z.infer<typeof createSportSchema>;
