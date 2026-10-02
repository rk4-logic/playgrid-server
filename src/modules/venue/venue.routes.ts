import Router from "express";
import { UserRole } from "@/generated/prisma/enums.js";
import authenticate from "@/shared/middleware/authenticate.js";
import authorize from "@/shared/middleware/authorize.js";
import validateRequest from "@/shared/middleware/validateRequest.js";

import venueController from "./venue.controller.js";
import { createVenueSchema, updateVenueSchema } from "./venue.validation.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(UserRole.OWNER, UserRole.ADMIN),
  validateRequest(createVenueSchema),
  venueController.create,
);

router.get(
  "/mine",
  authenticate,
  authorize(UserRole.OWNER, UserRole.ADMIN),
  venueController.getMine,
);

router.get("/:id", venueController.getById);

router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.OWNER, UserRole.ADMIN),
  validateRequest(updateVenueSchema),
  venueController.update,
);

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.OWNER, UserRole.ADMIN),
  venueController.delete,
);

export default router;
