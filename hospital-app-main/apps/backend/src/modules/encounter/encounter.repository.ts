import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { db } from "../../db";
import type { DB } from "../../db";

import {
  encounters,
  clinicalNotes,
  clinicalNoteVersions,
  diagnoses,
  prescriptions,
  vitals,
  dischargeSummaries,
  type NewEncounter,
  type NewClinicalNote,
  type NewClinicalNoteVersion,
  type NewDiagnosis,
  type NewPrescription,
  type NewVital,
  type NewDischargeSummary,
} from "../../db/schema/encounter.schema";

import { EncounterFilters } from "./encounter.types";

/* ======================================================
   INTERNAL EXECUTOR
====================================================== */

type Executor = DB;

function getExecutor(tx?: Executor): Executor {
  return tx ?? db;
}

/* ======================================================
   ENCOUNTER
====================================================== */

export async function createEncounter(data: NewEncounter, tx?: Executor) {
  const executor = getExecutor(tx);

  const [encounter] = await executor
    .insert(encounters)
    .values(data)
    .returning();

  return encounter;
}

export async function getEncounterById(id: string) {
  return db.query.encounters.findFirst({
    where: eq(encounters.id, id),

    with: {
      patient: {
        columns: {
          id: true,
          firstName: true,
          lastName: true,
          uhid: true,
        },
      },

      notes: true,
      diagnoses: true,
      prescriptions: true,
      vitals: true,
      dischargeSummaries: true,
    },
  });
}

export async function listEncounters(filters: EncounterFilters) {
  const {
    search,
    doctorId,
    departmentId,
    status,
    encounterType,
    page = 1,
    limit = 10,
  } = filters;

  const offset = (page - 1) * limit;

  const conditions = [];

  if (search) {
    conditions.push(ilike(encounters.chiefComplaint, `%${search}%`));
  }

  if (doctorId) {
    conditions.push(eq(encounters.doctorId, doctorId));
  }

  if (departmentId) {
    conditions.push(eq(encounters.departmentId, departmentId));
  }

  if (status) {
    conditions.push(eq(encounters.status, status));
  }

  if (encounterType) {
    conditions.push(eq(encounters.encounterType, encounterType));
  }

  const whereClause = conditions.length ? and(...conditions) : undefined;

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(encounters)
    .where(whereClause);

  const data = await db.query.encounters.findMany({
    where: whereClause,
    orderBy: (encounters, { desc }) => [desc(encounters.createdAt)],
    limit,
    offset,

    with: {
      patient: {
        columns: {
          id: true,
          firstName: true,
          lastName: true,
          uhid: true,
        },
      },
    },
  });
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function updateEncounter(
  id: string,
  data: Partial<NewEncounter>,
  tx?: Executor,
) {
  const executor = getExecutor(tx);

  const [updated] = await executor
    .update(encounters)
    .set(data)
    .where(eq(encounters.id, id))
    .returning();

  return updated;
}

/* ======================================================
   CLINICAL NOTES
====================================================== */

export async function createClinicalNote(data: NewClinicalNote, tx?: Executor) {
  const executor = getExecutor(tx);

  const [note] = await executor.insert(clinicalNotes).values(data).returning();

  return note;
}

export async function getClinicalNoteByEncounter(encounterId: string) {
  return db.query.clinicalNotes.findFirst({
    where: eq(clinicalNotes.encounterId, encounterId),
  });
}

export async function updateClinicalNote(
  id: string,
  data: Partial<NewClinicalNote>,
  tx?: Executor,
) {
  const executor = getExecutor(tx);

  const [updated] = await executor
    .update(clinicalNotes)
    .set(data)
    .where(eq(clinicalNotes.id, id))
    .returning();

  return updated;
}

/* ======================================================
   CLINICAL NOTE VERSIONS
====================================================== */

export async function createClinicalNoteVersion(
  data: NewClinicalNoteVersion,
  tx?: Executor,
) {
  const executor = getExecutor(tx);

  const [version] = await executor
    .insert(clinicalNoteVersions)
    .values(data)
    .returning();

  return version;
}

export async function getClinicalNoteHistory(noteId: string) {
  return db
    .select()
    .from(clinicalNoteVersions)
    .where(eq(clinicalNoteVersions.clinicalNoteId, noteId))
    .orderBy(desc(clinicalNoteVersions.versionNumber));
}

/* ======================================================
   DIAGNOSIS
====================================================== */

export async function addDiagnosis(data: NewDiagnosis, tx?: Executor) {
  const executor = getExecutor(tx);

  const [diagnosis] = await executor.insert(diagnoses).values(data).returning();

  return diagnosis;
}

/* ======================================================
   PRESCRIPTIONS
====================================================== */

export async function addPrescription(data: NewPrescription, tx?: Executor) {
  const executor = getExecutor(tx);

  const [prescription] = await executor
    .insert(prescriptions)
    .values(data)
    .returning();

  return prescription;
}

/* ======================================================
   VITALS
====================================================== */

export async function recordVitals(data: NewVital, tx?: Executor) {
  const executor = getExecutor(tx);

  const [vital] = await executor.insert(vitals).values(data).returning();

  return vital;
}

/* ======================================================
   DISCHARGE SUMMARY
====================================================== */

export async function createDischargeSummary(
  data: NewDischargeSummary,
  tx?: Executor,
) {
  const executor = getExecutor(tx);

  const [summary] = await executor
    .insert(dischargeSummaries)
    .values(data)
    .returning();

  return summary;
}
