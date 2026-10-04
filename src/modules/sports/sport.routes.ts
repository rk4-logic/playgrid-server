import { Router } from "express";

import sportController from "./sport.controller.js";
import { createSportSchema, sportIdSchema } from "./sport.validation.js";
import validateRequest from "@/shared/middleware/validateRequest.js";
import authenticate from "@/shared/middleware/authenticate.js";

const router = Router();

router.get("/", sportController.findAll);

router.post("/", authenticate, validateRequest(createSportSchema), sportController.create);

router.delete("/:id", authenticate, validateRequest(sportIdSchema), sportController.delete);

export default router;
