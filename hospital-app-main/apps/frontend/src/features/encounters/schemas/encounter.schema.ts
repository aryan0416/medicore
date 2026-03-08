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
  departmentId: z
    .string()
    .uuid("Invalid department ID")
    .optional()
    .or(z.literal("")),

  chiefComplaint: z
    .string()
    .max(1000, "Chief complaint too long")
    .optional()
    .or(z.literal("")),

  status: encounterStatusEnum.optional(),
});

/* ======================================================
   QUERY FILTERS (ENCOUNTER LIST)
====================================================== */

export const encounterQuerySchema = z.object({
  search: z.string().optional(),

  doctorId: z.string().uuid().optional(),

  departmentId: z.string().uuid().optional(),

  status: encounterStatusEnum.optional(),

  encounterType: encounterTypeEnum.optional(),

  page: z.number().optional(),

  limit: z.number().optional(),
});

/* ======================================================
   CLINICAL NOTE
====================================================== */

export const clinicalNoteSchema = z.object({
  encounterId: z.string().uuid("Invalid encounter ID"),

  subjective: z.string().optional(),

  objective: z.string().optional(),

  assessment: z.string().optional(),

  plan: z.string().optional(),
});

/* ======================================================
   UPDATE CLINICAL NOTE
====================================================== */

export const updateClinicalNoteSchema = z.object({
  subjective: z.string().optional(),

  objective: z.string().optional(),

  assessment: z.string().optional(),

  plan: z.string().optional(),

  reasonForChange: z.string().max(500, "Reason too long").optional(),
});

/* ======================================================
   DIAGNOSIS
====================================================== */

export const diagnosisSchema = z.object({
  encounterId: z.string().uuid(),

  icdCode: z.string().max(50).optional(),

  description: z.string().optional(),

  isPrimary: z.boolean().optional(),
});

/* ======================================================
   PRESCRIPTION
====================================================== */

export const prescriptionSchema = z.object({
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

export const vitalSchema = z.object({
  encounterId: z.string().uuid(),

  temperature: z.coerce.number().optional(),

  bpSystolic: z.coerce.number().optional(),

  bpDiastolic: z.coerce.number().optional(),

  pulse: z.coerce.number().optional(),

  respiratoryRate: z.coerce.number().optional(),

  spo2: z.coerce.number().optional(),

  weight: z.coerce.number().optional(),
});

/* ======================================================
   DISCHARGE SUMMARY
====================================================== */

export const dischargeSummarySchema = z.object({
  encounterId: z.string().uuid(),

  summary: z.string().optional(),

  advice: z.string().optional(),

  followUpDate: z.string().datetime().optional(),
});

/* ======================================================
   TYPES
====================================================== */

export type CreateEncounterFormValues = z.infer<typeof createEncounterSchema>;

export type UpdateEncounterFormValues = z.infer<typeof updateEncounterSchema>;

export type EncounterQueryValues = z.infer<typeof encounterQuerySchema>;

export type ClinicalNoteFormValues = z.infer<typeof clinicalNoteSchema>;

export type UpdateClinicalNoteFormValues = z.infer<
  typeof updateClinicalNoteSchema
>;

export type DiagnosisFormValues = z.infer<typeof diagnosisSchema>;

export type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;

export type VitalFormValues = z.infer<typeof vitalSchema>;

export type DischargeSummaryFormValues = z.infer<typeof dischargeSummarySchema>;
