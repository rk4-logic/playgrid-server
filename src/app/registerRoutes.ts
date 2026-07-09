import type { Express } from "express";

import userRoutes from "@/modules/user/user.routes.js";

const registerRoutes = (app: Express) => {
  app.use("/api/v1/users", userRoutes);
};

export default registerRoutes;
