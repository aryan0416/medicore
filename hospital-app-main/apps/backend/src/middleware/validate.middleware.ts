import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { ValidationError } from "../errors/http-error";
import { formatZodError } from "../utils/zod-error-parser";

export const validate =
  (schema: ZodSchema, p0: string) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const formatted = formatZodError(result.error);
      return next(new ValidationError("Invalid request data", formatted));
    }

    req.body = result.data;
    next();
  };
