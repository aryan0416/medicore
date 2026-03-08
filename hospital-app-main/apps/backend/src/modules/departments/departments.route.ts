import { Router } from "express";

import {
  createDepartmentController,
  getDepartmentsController,
  getDepartmentByIdController,
  updateDepartmentController,
  deleteDepartmentController,
} from "./departments.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/permission.middleware";
import { validate } from "../../middleware/validate.middleware";

import {
  createDepartmentSchema,
  updateDepartmentSchema,
} from "./departments.validation";

const router = Router();

/* ======================================================
   CREATE
====================================================== */

router.post(
  "/",
  authenticate,
  requirePermission("department.create"),
  validate(createDepartmentSchema, "body"),
  createDepartmentController,
);

/* ======================================================
   LIST
====================================================== */

router.get(
  "/",
  authenticate,
  requirePermission("department.read"),
  getDepartmentsController,
);

/* ======================================================
   GET SINGLE
====================================================== */

router.get(
  "/:id",
  authenticate,
  requirePermission("department.read"),
  getDepartmentByIdController,
);

/* ======================================================
   UPDATE
====================================================== */

router.put(
  "/:id",
  authenticate,
  requirePermission("department.update"),
  validate(updateDepartmentSchema, "body"),
  updateDepartmentController,
);

/* ======================================================
   DELETE
====================================================== */

router.delete(
  "/:id",
  authenticate,
  requirePermission("department.delete"),
  deleteDepartmentController,
);

export default router;
