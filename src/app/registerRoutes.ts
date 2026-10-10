import type { Express } from "express";

import userRoutes from "@/modules/user/user.routes.js";
import { turfRoutes } from "@/modules/turf/index.js";
import { venueRoutes } from "@/modules/venue/index.js";
import { authRoutes } from "@/modules/auth/index.js";
import { bookingRoutes } from "@/modules/booking/index.js";
import { sportRoutes } from "@/modules/sports/index.js";
import { amenityRoutes } from "@/modules/amenity/index.js";

const registerRoutes = (app: Express) => {
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/turfs", turfRoutes);
  app.use("/api/v1/venues", venueRoutes);
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/bookings", bookingRoutes);
  app.use("/api/v1/sports", sportRoutes);
  app.use("/api/v1/amenities", amenityRoutes);
};

export default registerRoutes;
