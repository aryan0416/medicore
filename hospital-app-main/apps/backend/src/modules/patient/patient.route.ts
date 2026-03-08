import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/permission.middleware";
import { validate } from "../../middleware/validate.middleware";

import {
  createPatientController,
  getPatientsController,
  getPatientByIdController,
  updatePatientController,
  deletePatientController,
} from "./patient.controller";

import { createPatientSchema, updatePatientSchema } from "./patient.validation";

const router = Router();

/* ======================================================
   LIST PATIENTS
   GET /api/patients
====================================================== */

router.get(
  "/",
  authenticate,
  requirePermission("patient.read"),
  getPatientsController,
);

/* ======================================================
   GET SINGLE PATIENT
   GET /api/patients/:id
====================================================== */

router.get(
  "/:id",
  authenticate,
  requirePermission("patient.read"),
  getPatientByIdController,
);

/* ======================================================
   CREATE PATIENT
   POST /api/patients
====================================================== */

router.post(
  "/",
  authenticate,
  requirePermission("patient.create"),
  validate(createPatientSchema),
  createPatientController,
);

/* ======================================================
   UPDATE PATIENT
   PUT /api/patients/:id
====================================================== */

router.put(
  "/:id",
  authenticate,
  requirePermission("patient.update"),
  validate(updatePatientSchema),
  updatePatientController,
);

/* ======================================================
   SOFT DELETE PATIENT
   DELETE /api/patients/:id
====================================================== */

router.delete(
  "/:id",
  authenticate,
  requirePermission("patient.delete"),
  deletePatientController,
);

export default router;
