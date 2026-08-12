import { Router } from "express";

import { UserRole } from "@/generated/prisma/enums.js";
import authenticate from "@/shared/middleware/authenticate.js";
import authorize from "@/shared/middleware/authorize.js";
import validateRequest from "@/shared/middleware/validateRequest.js";

import turfController from "./turf.controller.js";
import { createTurfSchema } from "./turf.validation.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(UserRole.OWNER, UserRole.ADMIN),
  validateRequest(createTurfSchema),
  turfController.create,
);

router.get(
  "/mine",
  authenticate,
  authorize(UserRole.OWNER, UserRole.ADMIN),
  turfController.getMyTurfs,
);

router.get("/:id", turfController.getById);

export default router;
