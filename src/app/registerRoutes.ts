import type { Express } from "express";

import userRoutes from "@/modules/user/user.routes.js";
import { turfRoutes } from "@/modules/turf/index.js";
import { venueRoutes } from "@/modules/venue/index.js";

const registerRoutes = (app: Express) => {
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/turfs", turfRoutes);
  app.use("/api/v1/venues", venueRoutes);
};

export default registerRoutes;
