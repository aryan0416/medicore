import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/permission.middleware";
import { validate } from "../../middleware/validate.middleware";

import {
  createTemplateController,
  getTemplatesController,
  getTemplateByIdController,
  updateTemplateController,
  deleteTemplateController,
} from "./template.controller";

import {
  createTemplateSchema,
  updateTemplateSchema,
} from "./template.validation";

const router = Router();

/* ======================================================
   LIST ENTITIES
   GET /api/<module>
====================================================== */

router.get(
  "/",
  authenticate,
  requirePermission("<module>.read"),
  getTemplatesController,
);

/* ======================================================
   GET SINGLE ENTITY
   GET /api/<module>/:id
====================================================== */

router.get(
  "/:id",
  authenticate,
  requirePermission("<module>.read"),
  getTemplateByIdController,
);

/* ======================================================
   CREATE ENTITY
   POST /api/<module>
====================================================== */

router.post(
  "/",
  authenticate,
  requirePermission("<module>.create"),
  validate(createTemplateSchema),
  createTemplateController,
);

/* ======================================================
   UPDATE ENTITY
   PUT /api/<module>/:id
====================================================== */

router.put(
  "/:id",
  authenticate,
  requirePermission("<module>.update"),
  validate(updateTemplateSchema),
  updateTemplateController,
);

/* ======================================================
   SOFT DELETE ENTITY
   DELETE /api/<module>/:id
====================================================== */

router.delete(
  "/:id",
  authenticate,
  requirePermission("<module>.delete"),
  deleteTemplateController,
);

export default router;
