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

// Public: inspect available slots before logging in.
router.get(
  "/availability",
  validateRequest(bookingAvailabilitySchema, "query"),
  bookingController.getAvailability,
);

// All routes below this point require authentication.
router.use(authenticate);

router.post("/", validateRequest(createBookingSchema), bookingController.createBooking);

router.get("/mine", bookingController.getMyBookings);

router.get("/:id", validateRequest(bookingIdSchema), bookingController.getBookingById);

router.patch("/:id/cancel", validateRequest(bookingIdSchema), bookingController.cancelBooking);

export default router;
