import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

const validateRequest =
  <T>(schema: ZodType<T>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(result.error);
    }

    req.body = result.data;

    next();
  };

export default validateRequest;
