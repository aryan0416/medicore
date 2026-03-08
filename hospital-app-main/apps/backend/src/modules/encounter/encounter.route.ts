import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/permission.middleware";

import {
  createEncounterController,
  getEncounterController,
  listEncountersController,
  startConsultationController,
  completeEncounterController,
  cancelEncounterController,
  createClinicalNoteController,
  updateClinicalNoteController,
  getClinicalNoteHistoryController,
  addDiagnosisController,
  addPrescriptionController,
  recordVitalsController,
  createDischargeSummaryController,
} from "./encounter.controller";

const router = Router();

/* ======================================================
   ENCOUNTERS
====================================================== */

router.post(
  "/",
  authenticate,
  requirePermission("encounter.create"),
  createEncounterController,
);

router.get(
  "/",
  authenticate,
  requirePermission("encounter.read"),
  listEncountersController,
);

router.get(
  "/:id",
  authenticate,
  requirePermission("encounter.read"),
  getEncounterController,
);

router.patch(
  "/:id/start-consultation",
  authenticate,
  requirePermission("encounter.update"),
  startConsultationController,
);

router.patch(
  "/:id/complete",
  authenticate,
  requirePermission("encounter.update"),
  completeEncounterController,
);

router.patch(
  "/:id/cancel",
  authenticate,
  requirePermission("encounter.update"),
  cancelEncounterController,
);

/* ======================================================
   CLINICAL NOTES
====================================================== */

router.post(
  "/clinical-notes",
  authenticate,
  requirePermission("encounter.update"),
  createClinicalNoteController,
);

router.patch(
  "/clinical-notes/:id",
  authenticate,
  requirePermission("encounter.update"),
  updateClinicalNoteController,
);

router.get(
  "/clinical-notes/:id/history",
  authenticate,
  requirePermission("encounter.read"),
  getClinicalNoteHistoryController,
);

/* ======================================================
   DIAGNOSIS
====================================================== */

router.post(
  "/diagnoses",
  authenticate,
  requirePermission("encounter.update"),
  addDiagnosisController,
);

/* ======================================================
   PRESCRIPTIONS
====================================================== */

router.post(
  "/prescriptions",
  authenticate,
  requirePermission("encounter.update"),
  addPrescriptionController,
);

/* ======================================================
   VITALS
====================================================== */

router.post(
  "/vitals",
  authenticate,
  requirePermission("encounter.update"),
  recordVitalsController,
);

/* ======================================================
   DISCHARGE
====================================================== */

router.post(
  "/discharge",
  authenticate,
  requirePermission("encounter.update"),
  createDischargeSummaryController,
);

export default router;
