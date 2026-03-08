import { and, desc, eq, ilike, or, sql, asc } from "drizzle-orm";
import { db } from "../../db";
import {
  createPatient,
  createPatientContact,
  createInsuranceDetails,
  findByPhone,
  updatePatient,
  softDeletePatient,
  getPatientById,
  countPatientsByYear,
} from "./patient.repository";
import type {
  NewPatient,
  NewPatientContact,
  NewInsuranceDetails,
} from "../../db/schema/patient.schema";
import { patients } from "../../db/schema/patient.schema";
import { logActivity } from "../activity-logs/activity-log.service";
import {
  ValidationError,
  ConflictError,
  NotFoundError,
} from "../../errors/http-error";

/* ======================================================
   SORT SAFETY
====================================================== */

export type PatientSortKey = "createdAt" | "firstName" | "lastName" | "uhid";

interface ListPatientsParams {
  search?: string;
  page?: number;
  limit?: number;
  sort?: PatientSortKey;
  order?: "asc" | "desc";
}

/* ======================================================
   HELPERS
====================================================== */

function generateUHID(year: number, count: number) {
  const padded = String(count + 1).padStart(5, "0");
  return `HSP${year}${padded}`;
}

function validateDOB(dob?: string | Date | null) {
  if (!dob) return;

  const date = new Date(dob);

  if (isNaN(date.getTime())) {
    throw new ValidationError("Invalid DOB format");
  }

  if (date > new Date()) {
    throw new ValidationError("DOB cannot be in the future");
  }
}

/* ======================================================
   CREATE
====================================================== */

export async function createPatientService(
  data: {
    patient: NewPatient;
    contact?: NewPatientContact;
    insurance?: NewInsuranceDetails;
  },
  currentUserId: string,
) {
  return db.transaction(async (tx) => {
    validateDOB(data.patient.dob);

    if (data.patient.phone) {
      const existing = await findByPhone(data.patient.phone);
      if (existing) {
        throw new ConflictError("Patient with this phone already exists");
      }
    }

    const year = new Date().getFullYear();
    const count = await countPatientsByYear(year);
    const uhid = generateUHID(year, count);

    const patient = await createPatient({ ...data.patient, uhid }, tx);

    if (data.contact) {
      await createPatientContact(
        { ...data.contact, patientId: patient.id },
        tx,
      );
    }

    if (data.insurance) {
      await createInsuranceDetails(
        { ...data.insurance, patientId: patient.id },
        tx,
      );
    }

    await logActivity(
      {
        userId: currentUserId,
        module: "patient",
        action: "create",
        entityType: "patient",
        entityId: patient.id,
      },
      tx,
    );

    return patient;
  });
}

/* ======================================================
   UPDATE
====================================================== */

export async function updatePatientService(
  id: string,
  updates: Partial<NewPatient>,
  currentUserId: string,
) {
  return db.transaction(async (tx) => {
    const existing = await getPatientById(id);

    if (!existing || !existing.isActive) {
      throw new NotFoundError("Patient not found or inactive");
    }

    if (updates.dob) {
      validateDOB(updates.dob);
    }

    const updated = await updatePatient(id, updates, tx);

    await logActivity(
      {
        userId: currentUserId,
        module: "patient",
        action: "update",
        entityType: "patient",
        entityId: id,
      },
      tx,
    );

    return updated;
  });
}

/* ======================================================
   DELETE (SOFT)
====================================================== */

export async function deletePatientService(id: string, currentUserId: string) {
  return db.transaction(async (tx) => {
    const existing = await getPatientById(id);

    if (!existing) {
      throw new NotFoundError("Patient not found");
    }

    if (!existing.isActive) {
      throw new ConflictError("Patient already inactive");
    }

    await softDeletePatient(id, tx);

    await logActivity(
      {
        userId: currentUserId,
        module: "patient",
        action: "delete",
        entityType: "patient",
        entityId: id,
      },
      tx,
    );

    return { success: true };
  });
}

/* ======================================================
   LIST
====================================================== */

export async function listPatientsService(params: ListPatientsParams) {
  const {
    search,
    page = 1,
    limit = 10,
    sort = "createdAt",
    order = "desc",
  } = params;

  const currentPage = Math.max(1, page);
  const limitPerPage = Math.min(Math.max(1, limit), 50);
  const offset = (currentPage - 1) * limitPerPage;

  const filters = [];
  filters.push(eq(patients.isActive, true));

  if (search?.trim()) {
    filters.push(
      or(
        ilike(patients.firstName, `%${search.trim()}%`),
        ilike(patients.lastName, `%${search.trim()}%`),
        ilike(patients.uhid, `%${search.trim()}%`),
        ilike(patients.phone, `%${search.trim()}%`),
      ),
    );
  }

  const whereClause = and(...filters);

  return db.transaction(async (tx) => {
    const [{ total }] = await tx
      .select({ total: sql<number>`count(*)` })
      .from(patients)
      .where(whereClause);

    const data = await tx
      .select()
      .from(patients)
      .where(whereClause)
      .orderBy(order === "asc" ? asc(patients[sort]) : desc(patients[sort]))
      .limit(limitPerPage)
      .offset(offset);

    return {
      data,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: Number(total),
        totalPages: Math.ceil(Number(total) / limitPerPage),
      },
    };
  });
}
