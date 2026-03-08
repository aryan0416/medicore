import { z } from "zod";

/* ======================================================
   ENUMS
====================================================== */

export const encounterTypeEnum = z.enum(["OPD", "IPD", "ER"]);

export const encounterStatusEnum = z.enum([
  "waiting",
  "in_consultation",
  "completed",
  "cancelled",
]);

/* ======================================================
   CREATE ENCOUNTER
====================================================== */

export const createEncounterSchema = z.object({
  patientId: z.string().uuid("Invalid patient ID"),

  departmentId: z.string().uuid("Invalid department ID").optional(),

  encounterType: encounterTypeEnum,

  chiefComplaint: z.string().max(1000, "Chief complaint too long").optional(),
});

/* ======================================================
   UPDATE ENCOUNTER
====================================================== */

export const updateEncounterSchema = z.object({
  departmentId: z.string().uuid().optional(),

  chiefComplaint: z.string().max(1000).optional(),

  status: encounterStatusEnum.optional(),
});

/* ======================================================
   QUERY FILTERS
====================================================== */

export const encounterQuerySchema = z.object({
  search: z.string().optional(),

  doctorId: z.string().uuid().optional(),

  departmentId: z.string().uuid().optional(),

  status: encounterStatusEnum.optional(),

  encounterType: encounterTypeEnum.optional(),

  page: z.string().transform(Number).optional(),

  limit: z.string().transform(Number).optional(),
});

/* ======================================================
   CLINICAL NOTES
====================================================== */

export const createClinicalNoteSchema = z.object({
  encounterId: z.string().uuid("Invalid encounter ID"),

  subjective: z.string().optional(),

  objective: z.string().optional(),

  assessment: z.string().optional(),

  plan: z.string().optional(),
});

export const updateClinicalNoteSchema = z.object({
  subjective: z.string().optional(),

  objective: z.string().optional(),

  assessment: z.string().optional(),

  plan: z.string().optional(),

  reasonForChange: z.string().max(500).optional(),
});

/* ======================================================
   DIAGNOSIS
====================================================== */

export const createDiagnosisSchema = z.object({
  encounterId: z.string().uuid(),

  icdCode: z.string().max(50).optional(),

  description: z.string().optional(),

  isPrimary: z.boolean().optional(),
});

/* ======================================================
   PRESCRIPTION
====================================================== */

export const createPrescriptionSchema = z.object({
  encounterId: z.string().uuid(),

  medicineId: z.string().uuid(),

  dosage: z.string().max(100).optional(),

  frequency: z.string().max(100).optional(),

  duration: z.string().max(100).optional(),

  instructions: z.string().optional(),
});

/* ======================================================
   VITALS
====================================================== */

export const createVitalSchema = z.object({
  encounterId: z.string().uuid(),

  temperature: z.number().optional(),

  bpSystolic: z.number().optional(),

  bpDiastolic: z.number().optional(),

  pulse: z.number().optional(),

  respiratoryRate: z.number().optional(),

  spo2: z.number().optional(),

  weight: z.number().optional(),
});

/* ======================================================
   DISCHARGE SUMMARY
====================================================== */

export const createDischargeSummarySchema = z.object({
  encounterId: z.string().uuid(),

  summary: z.string().optional(),

  advice: z.string().optional(),

  followUpDate: z.string().datetime().optional(),
});
