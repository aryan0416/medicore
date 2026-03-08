import {
  pgTable,
  uuid,
  varchar,
  text,
  date,
  timestamp,
  boolean,
  index,
  uniqueIndex,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* ======================================================
   COMMON TIMESTAMPS (Like schema/app.ts)
====================================================== */

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

/* ======================================================
   ENUMS
====================================================== */

export const genderEnum = pgEnum("gender", ["male", "female", "other"]);

/* ======================================================
   PATIENTS
====================================================== */

export const patients = pgTable(
  "patients",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    uhid: varchar("uhid", { length: 20 }).notNull(),

    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }),

    gender: genderEnum("gender").notNull(),

    dob: date("dob"),

    phone: varchar("phone", { length: 20 }),

    address: text("address"),

    bloodGroup: varchar("blood_group", { length: 10 }),

    isActive: boolean("is_active").default(true).notNull(),

    ...timestamps,
  },
  (table) => ({
    uhidUnique: uniqueIndex("patients_uhid_unique").on(table.uhid),

    phoneIndex: index("patients_phone_idx").on(table.phone),

    createdAtIndex: index("patients_created_at_idx").on(table.createdAt),
  }),
);

/* ======================================================
   PATIENT CONTACTS
====================================================== */

export const patientContacts = pgTable(
  "patient_contacts",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    patientId: uuid("patient_id")
      .notNull()
      .references(() => patients.id, { onDelete: "cascade" }),

    name: varchar("name", { length: 100 }),
    relation: varchar("relation", { length: 100 }),
    phone: varchar("phone", { length: 20 }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    patientIndex: index("patient_contacts_patient_id_idx").on(table.patientId),
  }),
);

/* ======================================================
   INSURANCE DETAILS
====================================================== */

export const insuranceDetails = pgTable(
  "insurance_details",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    patientId: uuid("patient_id")
      .notNull()
      .references(() => patients.id, { onDelete: "cascade" }),

    provider: varchar("provider", { length: 150 }),
    policyNumber: varchar("policy_number", { length: 100 }),
    validUntil: date("valid_until"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    patientIndex: index("insurance_patient_id_idx").on(table.patientId),
  }),
);

/* ======================================================
   RELATIONS
====================================================== */

export const patientsRelations = relations(patients, ({ many }) => ({
  contacts: many(patientContacts),
  insurance: many(insuranceDetails),
}));

export const patientContactsRelations = relations(
  patientContacts,
  ({ one }) => ({
    patient: one(patients, {
      fields: [patientContacts.patientId],
      references: [patients.id],
    }),
  }),
);

export const insuranceRelations = relations(insuranceDetails, ({ one }) => ({
  patient: one(patients, {
    fields: [insuranceDetails.patientId],
    references: [patients.id],
  }),
}));

/* ======================================================
   TYPES (Important)
====================================================== */

export type Patient = typeof patients.$inferSelect;
export type NewPatient = typeof patients.$inferInsert;

export type PatientContact = typeof patientContacts.$inferSelect;
export type NewPatientContact = typeof patientContacts.$inferInsert;

export type InsuranceDetails = typeof insuranceDetails.$inferSelect;
export type NewInsuranceDetails = typeof insuranceDetails.$inferInsert;
