import { AppError } from "./app-error";
import { ERROR_CODES } from "./error-codes";

export class ValidationError extends AppError {
  constructor(message: string, metadata?: unknown) {
    super(message, 400, ERROR_CODES.VALIDATION_ERROR, metadata);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, ERROR_CODES.NOT_FOUND);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, ERROR_CODES.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403, ERROR_CODES.FORBIDDEN);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409, ERROR_CODES.CONFLICT);
  }
}
export { AppError };

