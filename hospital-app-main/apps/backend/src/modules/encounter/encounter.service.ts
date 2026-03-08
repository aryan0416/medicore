import { db } from "../../db";

import {
  createEncounter,
  getEncounterById,
  listEncounters,
  updateEncounter,
  createClinicalNote,
  updateClinicalNote,
  createClinicalNoteVersion,
  getClinicalNoteByEncounter,
  getClinicalNoteHistory,
  addDiagnosis,
  addPrescription,
  recordVitals,
  createDischargeSummary,
} from "./encounter.repository";

import type {
  CreateEncounterDTO,
  UpdateEncounterDTO,
  CreateClinicalNoteDTO,
  UpdateClinicalNoteDTO,
  CreateDiagnosisDTO,
  CreatePrescriptionDTO,
  CreateVitalDTO,
  CreateDischargeSummaryDTO,
  EncounterFilters,
} from "./encounter.types";

/* ======================================================
   ENCOUNTERS
====================================================== */

export async function createEncounterService(data: CreateEncounterDTO) {
  return createEncounter(data);
}

export async function getEncounterService(id: string) {
  return getEncounterById(id);
}

export async function listEncountersService(filters: EncounterFilters) {
  return listEncounters(filters);
}

export async function startConsultationService(
  encounterId: string,
  doctorId: string,
) {
  return updateEncounter(encounterId, {
    doctorId,
    status: "in_consultation",
  });
}

export async function completeEncounterService(encounterId: string) {
  return updateEncounter(encounterId, {
    status: "completed",
    dischargedAt: new Date(),
  });
}

export async function cancelEncounterService(encounterId: string) {
  return updateEncounter(encounterId, {
    status: "cancelled",
  });
}

/* ======================================================
   CLINICAL NOTES
====================================================== */

export async function createClinicalNoteService(data: CreateClinicalNoteDTO) {
  return createClinicalNote(data);
}

/*
   NOTE VERSIONING
   Every update creates a history snapshot
*/

export async function updateClinicalNoteService(
  noteId: string,
  payload: UpdateClinicalNoteDTO,
  userId: string,
) {
  return db.transaction(async (tx) => {
    const existing = await tx.query.clinicalNotes.findFirst({
      where: (notes, { eq }) => eq(notes.id, noteId),
    });

    if (!existing) {
      throw new Error("Clinical note not found");
    }

    const newVersion = existing.currentVersion + 1;

    await createClinicalNoteVersion(
      {
        clinicalNoteId: existing.id,
        versionNumber: existing.currentVersion,
        subjective: existing.subjective,
        objective: existing.objective,
        assessment: existing.assessment,
        plan: existing.plan,
        changedBy: userId,
        reasonForChange: payload.reasonForChange ?? null,
      },
      tx,
    );

    const updated = await updateClinicalNote(
      noteId,
      {
        subjective: payload.subjective ?? existing.subjective,
        objective: payload.objective ?? existing.objective,
        assessment: payload.assessment ?? existing.assessment,
        plan: payload.plan ?? existing.plan,
        currentVersion: newVersion,
      },
      tx,
    );

    return updated;
  });
}

export async function getClinicalNoteHistoryService(noteId: string) {
  return getClinicalNoteHistory(noteId);
}

export async function getClinicalNoteByEncounterService(encounterId: string) {
  return getClinicalNoteByEncounter(encounterId);
}

/* ======================================================
   DIAGNOSIS
====================================================== */

export async function addDiagnosisService(data: CreateDiagnosisDTO) {
  return addDiagnosis(data);
}

/* ======================================================
   PRESCRIPTIONS
====================================================== */

export async function addPrescriptionService(data: CreatePrescriptionDTO) {
  return addPrescription(data);
}

/* ======================================================
   VITALS
====================================================== */

export async function recordVitalsService(data: CreateVitalDTO) {
  return recordVitals(data);
}

/* ======================================================
   DISCHARGE SUMMARY
====================================================== */

export async function createDischargeSummaryService(
  data: CreateDischargeSummaryDTO,
) {
  return createDischargeSummary(data);
}
