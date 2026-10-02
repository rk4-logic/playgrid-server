import { z } from "zod";

export const createBookingSchema = z
  .object({
    turfId: z.string().min(1),

    bookingDate: z.coerce.date(),

    startTime: z.coerce.date(),

    endTime: z.coerce.date(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export const bookingIdSchema = z.object({
  id: z.string().min(1),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
