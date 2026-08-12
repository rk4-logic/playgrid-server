import type { Express } from "express";

import userRoutes from "@/modules/user/user.routes.js";
import { turfRoutes } from "@/modules/turf/index.js";

const registerRoutes = (app: Express) => {
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/turfs", turfRoutes);
};

export default registerRoutes;
