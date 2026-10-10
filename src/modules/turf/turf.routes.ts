import { Router } from "express";
import { UserRole } from "@/generated/prisma/enums.js";
import authenticate from "@/shared/middleware/authenticate.js";
import authorize from "@/shared/middleware/authorize.js";
import validateRequest from "@/shared/middleware/validateRequest.js";
import turfController from "./turf.controller.js";
import { createTurfSchema, updateTurfSchema } from "./turf.validation.js";

const router = Router();

// Specific routes must come before the dynamic "/:id" route.
router.get(
  "/mine",
  authenticate,
  authorize(UserRole.OWNER, UserRole.ADMIN),
  turfController.getMyTurfs,
);

// Public endpoints
router.get("/", turfController.listPublic);
router.get("/:id", turfController.getById);

// Owner/admin endpoints
router.post(
  "/",
  authenticate,
  authorize(UserRole.OWNER, UserRole.ADMIN),
  validateRequest(createTurfSchema),
  turfController.create,
);

router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.OWNER, UserRole.ADMIN),
  validateRequest(updateTurfSchema),
  turfController.update,
);

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.OWNER, UserRole.ADMIN),
  turfController.delete,
);

export default router;
