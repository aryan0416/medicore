/* ======================================================
   ENUM TYPES
====================================================== */

export type EncounterType = "OPD" | "IPD" | "ER";

export type EncounterStatus =
  | "waiting"
  | "in_consultation"
  | "completed"
  | "cancelled";

/* ======================================================
   ENCOUNTER CORE TYPE
====================================================== */

export interface Encounter {
  id: string;

  patientId: string;

  doctorId?: string | null;

  departmentId?: string | null;

  encounterType: EncounterType;

  chiefComplaint?: string | null;

  status: EncounterStatus;

  admittedAt?: string | null;

  dischargedAt?: string | null;

  createdAt: string;

  updatedAt: string;
}

/* ======================================================
   CLINICAL NOTES
====================================================== */

export interface ClinicalNote {
  id: string;

  encounterId: string;

  subjective?: string | null;

  objective?: string | null;

  assessment?: string | null;

  plan?: string | null;

  currentVersion: number;

  createdBy: string;

  createdAt: string;

  updatedAt: string;
}

/* ======================================================
   CLINICAL NOTE VERSION HISTORY
====================================================== */

export interface ClinicalNoteVersion {
  id: string;

  clinicalNoteId: string;

  versionNumber: number;

  subjective?: string | null;

  objective?: string | null;

  assessment?: string | null;

  plan?: string | null;

  changedBy: string;

  reasonForChange?: string | null;

  createdAt: string;
}

/* ======================================================
   DIAGNOSIS
====================================================== */

export interface Diagnosis {
  id: string;

  encounterId: string;

  icdCode?: string | null;

  description?: string | null;

  isPrimary: boolean;

  createdAt: string;

  updatedAt: string;
}

/* ======================================================
   PRESCRIPTIONS
====================================================== */

export interface Prescription {
  id: string;

  encounterId: string;

  medicineId: string;

  dosage?: string | null;

  frequency?: string | null;

  duration?: string | null;

  instructions?: string | null;

  createdAt: string;

  updatedAt: string;
}

/* ======================================================
   VITALS
====================================================== */

export interface Vital {
  id: string;

  encounterId: string;

  temperature?: number | null;

  bpSystolic?: number | null;

  bpDiastolic?: number | null;

  pulse?: number | null;

  respiratoryRate?: number | null;

  spo2?: number | null;

  weight?: number | null;

  recordedBy: string;

  recordedAt: string;

  createdAt: string;

  updatedAt: string;
}

/* ======================================================
   DISCHARGE SUMMARY
====================================================== */

export interface DischargeSummary {
  id: string;

  encounterId: string;

  summary?: string | null;

  advice?: string | null;

  followUpDate?: string | null;

  createdAt: string;

  updatedAt: string;
}

/* ======================================================
   LIST RESPONSE
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

/* ======================================================
   QUERY PARAMS
====================================================== */

export interface EncounterListParams {
  search?: string;

  doctorId?: string;

  departmentId?: string;

  status?: EncounterStatus;

  encounterType?: EncounterType;

  page?: number;

  limit?: number;
}
