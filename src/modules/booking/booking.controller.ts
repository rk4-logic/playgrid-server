import type { Request, Response } from "express";

import bookingService from "./booking.service.js";

class BookingController {
  async createBooking(req: Request, res: Response) {
    const booking = await bookingService.createBooking(req.user!.id, req.body);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  }

  async getBookingById(req: Request, res: Response) {
    const booking = await bookingService.getBookingById(req.params.id as string, req.user!.id);

    res.status(200).json({
      success: true,
      data: booking,
    });
  }

  async getMyBookings(req: Request, res: Response) {
    const bookings = await bookingService.getMyBookings(req.user!.id);

    res.status(200).json({
      success: true,
      data: bookings,
    });
  }

  async cancelBooking(req: Request, res: Response) {
    const booking = await bookingService.cancelBooking(req.params.id as string, req.user!.id);

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  }

  async getAvailability(req: Request, res: Response) {
    const availability = await bookingService.getAvailability(
      req.query.turfId as string,
      new Date(req.query.date as string),
    );

    res.status(200).json({
      success: true,
      data: availability,
    });
  }
}

export default new BookingController();
