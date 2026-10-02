import type { Express } from "express";

import userRoutes from "@/modules/user/user.routes.js";
import { turfRoutes } from "@/modules/turf/index.js";
import { venueRoutes } from "@/modules/venue/index.js";
import { authRoutes } from "@/modules/auth/index.js";

const registerRoutes = (app: Express) => {
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/turfs", turfRoutes);
  app.use("/api/v1/venues", venueRoutes);
  app.use("/api/v1/auth", authRoutes);
};

export default registerRoutes;
