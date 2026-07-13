import { Router } from "express";

import validateRequest from "@/shared/middleware/validateRequest.js";

import authController from "./auth.controller.js";
import { loginSchema } from "./auth.validation.js";

const router = Router();

router.post("/login", validateRequest(loginSchema), authController.login);

export default router;
