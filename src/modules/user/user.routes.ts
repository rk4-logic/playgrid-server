import { Router } from "express";

import validateRequest from "@/shared/middleware/validateRequest.js";
import userController from "./user.controller.js";
import { createUserSchema } from "./user.validation.js";

const router = Router();

router.post("/", validateRequest(createUserSchema), userController.createUser);

export default router;
