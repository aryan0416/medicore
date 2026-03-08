import { ErrorCode, ERROR_CODES } from "./error-codes";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly isOperational: boolean;
  public readonly metadata?: unknown;

  constructor(
    message: string,
    statusCode: number,
    code: ErrorCode = ERROR_CODES.INTERNAL_SERVER_ERROR,
    metadata?: unknown,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.code = code;
    this.metadata = metadata;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
