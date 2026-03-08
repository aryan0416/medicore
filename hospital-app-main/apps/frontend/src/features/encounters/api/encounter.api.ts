import { createCrudApi } from "@/lib/api/crud";
import { clientApiFetch } from "@/lib/api/clientFetch";

/* ======================================================
   BASE CRUD API
====================================================== */

export const encountersApi = createCrudApi("encounters");

/* ======================================================
   ENCOUNTER LIFECYCLE ACTIONS
====================================================== */

export const startConsultation = async (encounterId: string) => {
  return clientApiFetch(`/api/encounters/${encounterId}/start-consultation`, {
    method: "PATCH",
  });
};

export const completeEncounter = async (encounterId: string) => {
  return clientApiFetch(`/api/encounters/${encounterId}/complete`, {
    method: "PATCH",
  });
};

export const cancelEncounter = async (encounterId: string) => {
  return clientApiFetch(`/api/encounters/${encounterId}/cancel`, {
    method: "PATCH",
  });
};

/* ======================================================
   CLINICAL NOTES
====================================================== */

export const createClinicalNote = async (payload: {
  encounterId: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
}) => {
  return clientApiFetch("/api/encounters/clinical-notes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateClinicalNote = async (
  noteId: string,
  payload: {
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
    reasonForChange?: string;
  },
) => {
  return clientApiFetch(`/api/encounters/clinical-notes/${noteId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};

export const getClinicalNoteHistory = async (noteId: string) => {
  return clientApiFetch(`/api/encounters/clinical-notes/${noteId}/history`);
};

/* ======================================================
   DIAGNOSIS
====================================================== */

export const createDiagnosis = async (payload: {
  encounterId: string;
  icdCode?: string;
  description?: string;
  isPrimary?: boolean;
}) => {
  return clientApiFetch("/api/encounters/diagnoses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

/* ======================================================
   PRESCRIPTIONS
====================================================== */

export const createPrescription = async (payload: {
  encounterId: string;
  medicineId: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
}) => {
  return clientApiFetch("/api/encounters/prescriptions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

/* ======================================================
   VITALS
====================================================== */

export const createVital = async (payload: {
  encounterId: string;
  temperature?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
  pulse?: number;
  respiratoryRate?: number;
  spo2?: number;
  weight?: number;
}) => {
  return clientApiFetch("/api/encounters/vitals", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

/* ======================================================
   DISCHARGE SUMMARY
====================================================== */

export const createDischargeSummary = async (payload: {
  encounterId: string;
  summary?: string;
  advice?: string;
  followUpDate?: string;
}) => {
  return clientApiFetch("/api/encounters/discharge", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
