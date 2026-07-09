import type { Express } from "express";

import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

export function registerMiddlewares(app: Express): void {
  app.use(helmet());

  app.use(cors());

  app.use(compression());

  app.use(cookieParser());

  app.use(express.json());

  app.use(
    express.urlencoded({
      extended: true,
    }),
  );
}
