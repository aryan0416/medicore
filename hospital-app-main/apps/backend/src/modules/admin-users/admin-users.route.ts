import { Router } from "express";

import {
  getUsersController,
  getUserByIdController,
  assignDepartmentController,
  assignRoleController,
  updateUserStatusController,
  createAdminUserController,
} from "./admin-users.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/permission.middleware";
import { validate } from "../../middleware/validate.middleware";

import {
  assignDepartmentSchema,
  assignRoleSchema,
  updateUserStatusSchema,
} from "./admin-users.validation";

const router = Router();

// CREATE USER (INVITE) 
router.post(
  "/",
  authenticate,
  requirePermission("admin.user.update"),
  createAdminUserController,
);

/* ======================================================
   LIST USERS
====================================================== */

router.get(
  "/",
  authenticate,
  requirePermission("admin.user.read"),
  getUsersController,
);

/* ======================================================
   GET USER
====================================================== */

router.get(
  "/:id",
  authenticate,
  requirePermission("admin.user.read"),
  getUserByIdController,
);

/* ======================================================
   ASSIGN DEPARTMENT
====================================================== */

router.patch(
  "/:id/department",
  authenticate,
  requirePermission("admin.user.update"),
  validate(assignDepartmentSchema, "body"),
  assignDepartmentController,
);

/* ======================================================
   ASSIGN ROLE
====================================================== */

router.patch(
  "/:id/role",
  authenticate,
  requirePermission("admin.user.update"),
  validate(assignRoleSchema, "body"),
  assignRoleController,
);

/* ======================================================
   UPDATE STATUS
====================================================== */

router.patch(
  "/:id/status",
  authenticate,
  requirePermission("admin.user.update"),
  validate(updateUserStatusSchema, "body"),
  updateUserStatusController,
);

export default router;
