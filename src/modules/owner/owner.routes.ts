import { Router } from "express";
import { UserRole } from "@/generated/prisma/enums.js";
import authenticate from "@/shared/middleware/authenticate.js";
import authorize from "@/shared/middleware/authorize.js";
import ownerController from "./owner.controller.js";

const router = Router();

router.get(
  "/dashboard",
  authenticate,
  authorize(UserRole.OWNER, UserRole.ADMIN),
  ownerController.getDashboard,
);

export default router;
