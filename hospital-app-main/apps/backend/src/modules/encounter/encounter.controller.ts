import { Request, Response } from "express";

import {
  createEncounterService,
  getEncounterService,
  listEncountersService,
  startConsultationService,
  completeEncounterService,
  cancelEncounterService,
  createClinicalNoteService,
  updateClinicalNoteService,
  getClinicalNoteHistoryService,
  addDiagnosisService,
  addPrescriptionService,
  recordVitalsService,
  createDischargeSummaryService,
} from "./encounter.service";

/* ======================================================
   ENCOUNTERS
====================================================== */

export async function createEncounterController(req: Request, res: Response) {
  const encounter = await createEncounterService(req.body);

  res.status(201).json(encounter);
}

export async function getEncounterController(req: Request, res: Response) {
  const { id } = req.params;

  const encounter = await getEncounterService(
    Array.isArray(id) ? id[0] : id,
  );

  res.json(encounter);
}

export async function listEncountersController(req: Request, res: Response) {
  const result = await listEncountersService(req.query as any);

  res.json(result);
}

export async function startConsultationController(req: Request, res: Response) {
  const { id } = req.params;

  const doctorId = req.user?.id;

  const encounter = await startConsultationService(
    Array.isArray(id) ? id[0] : id,
    doctorId as string,
  );

  res.json(encounter);
}

export async function completeEncounterController(req: Request, res: Response) {
  const { id } = req.params;

  const encounter = await completeEncounterService(
    Array.isArray(id) ? id[0] : id,
  );

  res.json(encounter);
}

export async function cancelEncounterController(req: Request, res: Response) {
  const { id } = req.params;

  const encounter = await cancelEncounterService(
    Array.isArray(id) ? id[0] : id,
  );

  res.json(encounter);
}

/* ======================================================
   CLINICAL NOTES
====================================================== */

export async function createClinicalNoteController(
  req: Request,
  res: Response,
) {
  const note = await createClinicalNoteService({
    ...req.body,
    createdBy: req.user?.id,
  });

  res.status(201).json(note);
}

export async function updateClinicalNoteController(
  req: Request,
  res: Response,
) {
  const { id } = req.params;

  const updated = await updateClinicalNoteService(
    Array.isArray(id) ? id[0] : id,
    req.body,
    req.user?.id as string,
  );

  res.json(updated);
}

export async function getClinicalNoteHistoryController(
  req: Request,
  res: Response,
) {
  const { id } = req.params;

  const history = await getClinicalNoteHistoryService(
    Array.isArray(id) ? id[0] : id,
  );

  res.json(history);
}

/* ======================================================
   DIAGNOSIS
====================================================== */

export async function addDiagnosisController(req: Request, res: Response) {
  const diagnosis = await addDiagnosisService(req.body);

  res.status(201).json(diagnosis);
}

/* ======================================================
   PRESCRIPTIONS
====================================================== */

export async function addPrescriptionController(req: Request, res: Response) {
  const prescription = await addPrescriptionService(req.body);

  res.status(201).json(prescription);
}

/* ======================================================
   VITALS
====================================================== */

export async function recordVitalsController(req: Request, res: Response) {
  const vital = await recordVitalsService({
    ...req.body,
    recordedBy: req.user?.id,
  });

  res.status(201).json(vital);
}

/* ======================================================
   DISCHARGE SUMMARY
====================================================== */

export async function createDischargeSummaryController(
  req: Request,
  res: Response,
) {
  const summary = await createDischargeSummaryService(req.body);

  res.status(201).json(summary);
}
