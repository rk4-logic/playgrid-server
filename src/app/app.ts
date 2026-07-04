import express from "express";

const app = express();

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "PlayGrid API is running 🚀",
  });
});

export default app;