import { Router } from "express";

import authenticate from "@/shared/middleware/authenticate.js";
import validateRequest from "@/shared/middleware/validateRequest.js";

import authController from "./auth.controller.js";
import { loginSchema, refreshTokenSchema } from "./auth.validation.js";

const router = Router();

router.post("/login", validateRequest(loginSchema), authController.login);

router.post("/refresh", validateRequest(refreshTokenSchema), authController.refresh);

router.get("/me", authenticate, authController.me);

export default router;
