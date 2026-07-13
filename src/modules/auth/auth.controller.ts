import type { Request, Response } from "express";

import authService from "./auth.service.js";

class AuthController {
  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  }
}

export default new AuthController();
