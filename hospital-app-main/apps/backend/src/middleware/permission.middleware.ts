import { NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware";
import { db } from "../db";
import { userRoles, rolePermissions, permissions } from "../db/schema";
import { eq, inArray } from "drizzle-orm";
import {
  UnauthorizedError,
  ForbiddenError,
  AppError,
} from "../errors/http-error";
import { ERROR_CODES } from "../errors/error-codes";

export function requirePermission(permissionCode: string) {
  return async (req: AuthenticatedRequest, _res: any, next: NextFunction) => {
    try {
      if (!req.user) throw new UnauthorizedError();

      // SuperAdmin has all permissions implicitly
      if (req.user.roles.includes("SuperAdmin")) {
        return next();
      }

      if (!req.user.permissions || req.user.permissions.length === 0) {
        throw new ForbiddenError("No permissions assigned");
      }

      if (!req.user.permissions.includes(permissionCode)) {
        throw new ForbiddenError("You do not have permission to perform this action");
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
