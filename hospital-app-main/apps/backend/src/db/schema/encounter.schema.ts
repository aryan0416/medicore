import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { patients } from "./patient.schema";
import { users } from "./rbac";

/* ======================================================
   SHARED TIMESTAMPS
====================================================== */

const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

/* ======================================================
   ENUMS
====================================================== */

export const encounterTypeEnum = pgEnum("encounter_type", ["OPD", "IPD", "ER"]);

export const encounterStatusEnum = pgEnum("encounter_status", [
  "waiting",
  "in_consultation",
  "completed",
  "cancelled",
]);

/* ======================================================
   ENCOUNTERS
====================================================== */

export const encounters = pgTable("encounters", {
  id: uuid("id").defaultRandom().primaryKey(),

  patientId: uuid("patient_id")
    .notNull()
    .references(() => patients.id, { onDelete: "restrict" }),

  doctorId: uuid("doctor_id").references(() => users.id, {
    onDelete: "restrict",
  }),

  departmentId: uuid("department_id"),

  encounterType: encounterTypeEnum("encounter_type").notNull(),

  chiefComplaint: text("chief_complaint"),

  status: encounterStatusEnum("status").default("waiting").notNull(),

  admittedAt: timestamp("admitted_at"),

  dischargedAt: timestamp("discharged_at"),

  ...timestamps,
});

/* ======================================================
   CLINICAL NOTES (LATEST VERSION)
====================================================== */

export const clinicalNotes = pgTable("clinical_notes", {
  id: uuid("id").defaultRandom().primaryKey(),

  encounterId: uuid("encounter_id")
    .notNull()
    .references(() => encounters.id, { onDelete: "cascade" }),

  subjective: text("subjective"),
  objective: text("objective"),
  assessment: text("assessment"),
  plan: text("plan"),

  currentVersion: integer("current_version").default(1).notNull(),

  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),

  ...timestamps,
});

/* ======================================================
   CLINICAL NOTE VERSION HISTORY
====================================================== */

export const clinicalNoteVersions = pgTable("clinical_note_versions", {
  id: uuid("id").defaultRandom().primaryKey(),

  clinicalNoteId: uuid("clinical_note_id")
    .notNull()
    .references(() => clinicalNotes.id, { onDelete: "cascade" }),

  versionNumber: integer("version_number").notNull(),

  subjective: text("subjective"),
  objective: text("objective"),
  assessment: text("assessment"),
  plan: text("plan"),

  changedBy: uuid("changed_by")
    .notNull()
    .references(() => users.id),

  reasonForChange: text("reason_for_change"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ======================================================
   DIAGNOSES
====================================================== */

export const diagnoses = pgTable("diagnoses", {
  id: uuid("id").defaultRandom().primaryKey(),

  encounterId: uuid("encounter_id")
    .notNull()
    .references(() => encounters.id, { onDelete: "cascade" }),

  icdCode: varchar("icd_code", { length: 50 }),

  description: text("description"),

  isPrimary: boolean("is_primary").default(false),

  ...timestamps,
});

/* ======================================================
   PRESCRIPTIONS
====================================================== */

export const prescriptions = pgTable("prescriptions", {
  id: uuid("id").defaultRandom().primaryKey(),

  encounterId: uuid("encounter_id")
    .notNull()
    .references(() => encounters.id, { onDelete: "cascade" }),

  medicineId: uuid("medicine_id").notNull(),

  dosage: varchar("dosage", { length: 100 }),
  frequency: varchar("frequency", { length: 100 }),
  duration: varchar("duration", { length: 100 }),

  instructions: text("instructions"),

  ...timestamps,
});

/* ======================================================
   VITALS
====================================================== */

export const vitals = pgTable("vitals", {
  id: uuid("id").defaultRandom().primaryKey(),

  encounterId: uuid("encounter_id")
    .notNull()
    .references(() => encounters.id, { onDelete: "cascade" }),

  temperature: numeric("temperature", { mode: "number" }),

  bpSystolic: integer("bp_systolic"),
  bpDiastolic: integer("bp_diastolic"),

  pulse: integer("pulse"),
  respiratoryRate: integer("respiratory_rate"),

  spo2: integer("spo2"),

  weight: numeric("weight", { mode: "number" }),

  recordedBy: uuid("recorded_by")
    .notNull()
    .references(() => users.id),

  recordedAt: timestamp("recorded_at").defaultNow().notNull(),

  ...timestamps,
});

/* ======================================================
   DISCHARGE SUMMARIES
====================================================== */

export const dischargeSummaries = pgTable("discharge_summaries", {
  id: uuid("id").defaultRandom().primaryKey(),

  encounterId: uuid("encounter_id")
    .notNull()
    .references(() => encounters.id, { onDelete: "cascade" }),

  summary: text("summary"),

  advice: text("advice"),

  followUpDate: timestamp("follow_up_date"),

  ...timestamps,
});

/* ======================================================
   RELATIONS
====================================================== */

export const encountersRelations = relations(encounters, ({ one, many }) => ({
  patient: one(patients, {
    fields: [encounters.patientId],
    references: [patients.id],
  }),

  doctor: one(users, {
    fields: [encounters.doctorId],
    references: [users.id],
  }),

  notes: many(clinicalNotes),
  diagnoses: many(diagnoses),
  prescriptions: many(prescriptions),
  vitals: many(vitals),
  dischargeSummaries: many(dischargeSummaries),
}));

export const clinicalNotesRelations = relations(
  clinicalNotes,
  ({ one, many }) => ({
    encounter: one(encounters, {
      fields: [clinicalNotes.encounterId],
      references: [encounters.id],
    }),
    versions: many(clinicalNoteVersions),
  }),
);

export const clinicalNoteVersionsRelations = relations(
  clinicalNoteVersions,
  ({ one }) => ({
    clinicalNote: one(clinicalNotes, {
      fields: [clinicalNoteVersions.clinicalNoteId],
      references: [clinicalNotes.id],
    }),
  }),
);

export const diagnosesRelations = relations(diagnoses, ({ one }) => ({
  encounter: one(encounters, {
    fields: [diagnoses.encounterId],
    references: [encounters.id],
  }),
}));

export const prescriptionsRelations = relations(prescriptions, ({ one }) => ({
  encounter: one(encounters, {
    fields: [prescriptions.encounterId],
    references: [encounters.id],
  }),
}));

export const vitalsRelations = relations(vitals, ({ one }) => ({
  encounter: one(encounters, {
    fields: [vitals.encounterId],
    references: [encounters.id],
  }),
}));

export const dischargeSummaryRelations = relations(
  dischargeSummaries,
  ({ one }) => ({
    encounter: one(encounters, {
      fields: [dischargeSummaries.encounterId],
      references: [encounters.id],
    }),
  }),
);

/* ======================================================
   TYPES
====================================================== */

export type Encounter = typeof encounters.$inferSelect;
export type NewEncounter = typeof encounters.$inferInsert;

export type ClinicalNote = typeof clinicalNotes.$inferSelect;
export type NewClinicalNote = typeof clinicalNotes.$inferInsert;

export type ClinicalNoteVersion = typeof clinicalNoteVersions.$inferSelect;
export type NewClinicalNoteVersion = typeof clinicalNoteVersions.$inferInsert;

export type Diagnosis = typeof diagnoses.$inferSelect;
export type NewDiagnosis = typeof diagnoses.$inferInsert;

export type Prescription = typeof prescriptions.$inferSelect;
export type NewPrescription = typeof prescriptions.$inferInsert;

export type Vital = typeof vitals.$inferSelect;
export type NewVital = typeof vitals.$inferInsert;

export type DischargeSummary = typeof dischargeSummaries.$inferSelect;
export type NewDischargeSummary = typeof dischargeSummaries.$inferInsert;
