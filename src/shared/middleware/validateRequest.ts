import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

const validateRequest =
  <T>(schema: ZodType<T>, target: "body" | "query" = "body") =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(target === "query" ? req.query : req.body);

    if (!result.success) {
      return next(result.error);
    }

    if (target === "body") {
      req.body = result.data;
    }

    next();
  };

export default validateRequest;
