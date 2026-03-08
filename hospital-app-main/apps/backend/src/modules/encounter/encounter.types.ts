import type {
  Encounter,
  NewEncounter,
  ClinicalNote,
  NewClinicalNote,
  ClinicalNoteVersion,
  NewClinicalNoteVersion,
  Diagnosis,
  NewDiagnosis,
  Prescription,
  NewPrescription,
  Vital,
  NewVital,
  DischargeSummary,
  NewDischargeSummary,
} from "../../db/schema/encounter.schema";

/* ======================================================
   ENCOUNTER FILTERS
====================================================== */

export interface EncounterFilters {
  search?: string;
  doctorId?: string;
  departmentId?: string;
  status?: "waiting" | "in_consultation" | "completed" | "cancelled";
  encounterType?: "OPD" | "IPD" | "ER";
  page?: number;
  limit?: number;
}

/* ======================================================
   ENCOUNTER DTOs
====================================================== */

export type CreateEncounterDTO = NewEncounter;

export type UpdateEncounterDTO = Partial<NewEncounter>;

/* ======================================================
   CLINICAL NOTES DTOs
====================================================== */

export type CreateClinicalNoteDTO = NewClinicalNote;

export type UpdateClinicalNoteDTO = {
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  reasonForChange?: string;
};

/* ======================================================
   CLINICAL NOTE VERSION TYPES
====================================================== */

export type ClinicalNoteHistory = ClinicalNoteVersion;

/* ======================================================
   DIAGNOSIS DTOs
====================================================== */

export type CreateDiagnosisDTO = NewDiagnosis;

export type UpdateDiagnosisDTO = Partial<NewDiagnosis>;

/* ======================================================
   PRESCRIPTION DTOs
====================================================== */

export type CreatePrescriptionDTO = NewPrescription;

export type UpdatePrescriptionDTO = Partial<NewPrescription>;

/* ======================================================
   VITALS DTOs
====================================================== */

export type CreateVitalDTO = NewVital;

/* ======================================================
   DISCHARGE SUMMARY DTOs
====================================================== */

export type CreateDischargeSummaryDTO = NewDischargeSummary;

/* ======================================================
   RESPONSE TYPES
====================================================== */

export interface EncounterListResponse {
  data: Encounter[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ClinicalNoteWithHistory extends ClinicalNote {
  versions?: ClinicalNoteVersion[];
}
