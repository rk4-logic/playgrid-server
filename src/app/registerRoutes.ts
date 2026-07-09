import type { Express } from "express";

export function registerRoutes(app: Express): void {
  app.get("/health", (_req, res) => {
    res.status(200).json({
      success: true,
      message: "PlayGrid API is running 🚀",
    });
  });
}
