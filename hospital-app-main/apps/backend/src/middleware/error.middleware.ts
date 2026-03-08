import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";
import { ERROR_CODES } from "../errors/error-codes";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
      metadata: err.metadata ?? null,
    });
  }

  console.error("UNHANDLED ERROR:", err);

  return res.status(500).json({
    success: false,
    code: ERROR_CODES.INTERNAL_SERVER_ERROR,
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : String(err),
  });
}
