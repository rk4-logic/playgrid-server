import type { Request, Response, NextFunction } from "express";
import userService from "./user.service.js";

class UserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userService.createUser(req.body);

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
