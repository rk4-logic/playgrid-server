export const BOOKING_MESSAGES = {
  CREATED: "Booking created successfully",
  FOUND: "Booking fetched successfully",
  CANCELLED: "Booking cancelled successfully",
  NOT_FOUND: "Booking not found",
  TURF_NOT_FOUND: "Turf not found",
  TURF_INACTIVE: "Turf is currently unavailable",
  SLOT_UNAVAILABLE: "Selected time slot is already booked",
  INVALID_TIME_RANGE: "End time must be after start time",
  INVALID_BOOKING_TIME: "Booking time must be in the future",
  CANNOT_CANCEL: "Booking can no longer be cancelled",
} as const;
