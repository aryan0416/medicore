import { and, count, eq, gte, lte } from "drizzle-orm";
import { db } from "../../db";
import type { DB } from "../../db";
import {
  patients,
  patientContacts,
  insuranceDetails,
  type NewPatient,
  type NewPatientContact,
  type NewInsuranceDetails,
} from "../../db/schema/patient.schema";

/* ======================================================
   TYPES
====================================================== */

type Executor = DB;

function getExecutor(tx?: Executor): Executor {
  return tx ?? db;
}

/* ======================================================
   CREATE
====================================================== */

export async function createPatient(data: NewPatient, tx?: Executor) {
  const executor = getExecutor(tx);
  const [patient] = await executor.insert(patients).values(data).returning();
  return patient;
}

export async function createPatientContact(
  data: NewPatientContact,
  tx?: Executor,
) {
  const executor = getExecutor(tx);
  const [contact] = await executor
    .insert(patientContacts)
    .values(data)
    .returning();
  return contact;
}

export async function createInsuranceDetails(
  data: NewInsuranceDetails,
  tx?: Executor,
) {
  const executor = getExecutor(tx);
  const [insurance] = await executor
    .insert(insuranceDetails)
    .values(data)
    .returning();
  return insurance;
}

/* ======================================================
   READ
====================================================== */

export async function getPatientById(id: string) {
  return db.query.patients.findFirst({
    where: and(eq(patients.id, id), eq(patients.isActive, true)),
    with: {
      contacts: true,
      insurance: true,
    },
  });
}

export async function findByPhone(phone: string) {
  return db.query.patients.findFirst({
    where: and(eq(patients.phone, phone), eq(patients.isActive, true)),
  });
}

export async function countPatientsByYear(year: number) {
  const start = new Date(`${year}-01-01T00:00:00.000Z`);
  const end = new Date(`${year}-12-31T23:59:59.999Z`);

  const [{ total }] = await db
    .select({ total: count() })
    .from(patients)
    .where(
      and(
        eq(patients.isActive, true),
        gte(patients.createdAt, start),
        lte(patients.createdAt, end),
      ),
    );

  return total;
}

/* ======================================================
   UPDATE
====================================================== */

export async function updatePatient(
  id: string,
  data: Partial<NewPatient>,
  tx?: Executor,
) {
  const executor = getExecutor(tx);
  const [updated] = await executor
    .update(patients)
    .set(data)
    .where(eq(patients.id, id))
    .returning();
  return updated;
}

/* ======================================================
   SOFT DELETE
====================================================== */

export async function softDeletePatient(id: string, tx?: Executor) {
  const executor = getExecutor(tx);
  await executor
    .update(patients)
    .set({ isActive: false })
    .where(eq(patients.id, id));
}
