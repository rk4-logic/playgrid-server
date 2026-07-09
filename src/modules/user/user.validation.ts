import { z } from "zod";

export const createUserSchema = z.object({
  fullName: z.string().trim().min(3, "Full name must be at least 3 characters").max(100),

  email: z.email(),

  password: z.string().min(8, "Password must be at least 8 characters").max(100),

  phone: z.string().optional(),

  profileImage: z.url().optional(),
});

export const updateUserSchema = createUserSchema
  .omit({
    email: true,
    password: true,
  })
  .partial();

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
