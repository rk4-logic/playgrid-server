import { Router } from "express";

import authenticate from "@/shared/middleware/authenticate.js";
import validateRequest from "@/shared/middleware/validateRequest.js";

import bookingController from "./booking.controller.js";
import {
  bookingAvailabilitySchema,
  bookingIdSchema,
  createBookingSchema,
} from "./booking.validation.js";

const router = Router();

router.use(authenticate);

router.post("/", validateRequest(createBookingSchema), bookingController.createBooking);

router.get(
  "/availability",
  validateRequest(bookingAvailabilitySchema),
  bookingController.getAvailability,
);

router.get("/my", bookingController.getMyBookings);

router.get("/:id", validateRequest(bookingIdSchema), bookingController.getBookingById);

router.patch("/:id/cancel", validateRequest(bookingIdSchema), bookingController.cancelBooking);

export default router;
