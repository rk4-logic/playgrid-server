import { Router } from "express";

import validateRequest from "@/shared/middleware/validateRequest.js";
import authenticate from "@/shared/middleware/authenticate.js";
import amenityController from "./amenity.controller.js";
import { amenityIdSchema, createAmenitySchema } from "./amenity.validation.js";

const router = Router();

router.get("/", amenityController.findAll);

router.post("/", authenticate, validateRequest(createAmenitySchema), amenityController.create);

router.delete("/:id", authenticate, validateRequest(amenityIdSchema), amenityController.delete);

export default router;
