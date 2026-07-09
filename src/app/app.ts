import express from "express";

import { registerMiddlewares } from "./registerMiddlewares.js";
import registerRoutes from "./registerRoutes.js";
import { errorHandler } from "@/shared/middleware/errorHandler.js";
import { notFoundHandler } from "@/shared/middleware/notFoundHandler.js";

const app = express();

registerMiddlewares(app);

registerRoutes(app);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
