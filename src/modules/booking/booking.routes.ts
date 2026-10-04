import { Router } from "express";

import validateRequest from "@/shared/middleware/validateRequest.js";
import authenticate from "@/shared/middleware/authenticate.js";

import bookingController from "./booking.controller.js";
import {
  bookingAvailabilitySchema,
  bookingIdSchema,
  createBookingSchema,
} from "./booking.validation.js";

const router = Router();

/**
 * Public
 *
 * Players should be able to inspect availability before
 * being forced to log in.
 */
router.get(
  "/availability",
  validateRequest(bookingAvailabilitySchema),
  bookingController.getAvailability,
);

/**
 * Authenticated booking actions
 */
router.use(authenticate);

router.post("/", validateRequest(createBookingSchema), bookingController.createBooking);

router.get("/my", bookingController.getMyBookings);

router.get("/:id", validateRequest(bookingIdSchema), bookingController.getBookingById);

router.patch("/:id/cancel", validateRequest(bookingIdSchema), bookingController.cancelBooking);

export default router;
