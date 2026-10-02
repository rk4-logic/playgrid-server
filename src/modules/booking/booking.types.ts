import type { BookingStatus } from "@/generated/prisma/enums.js";

export type BookingResponse = {
  id: string;
  userId: string;
  turfId: string;
  bookingDate: Date;
  startTime: Date;
  endTime: Date;
  totalAmount: number;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
};
