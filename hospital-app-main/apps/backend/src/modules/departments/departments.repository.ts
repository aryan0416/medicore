import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { db } from "../../db";
import { departments, NewDepartment } from "../../db/schema";

/* ======================================================
   TYPES
====================================================== */

export interface DepartmentFilters {
  search?: string;
  page?: number;
  limit?: number;
}

/* ======================================================
   CREATE
====================================================== */

export async function createDepartment(data: NewDepartment) {
  const [department] = await db.insert(departments).values(data).returning();

  return department;
}

/* ======================================================
   READ
====================================================== */

export async function getDepartmentById(id: string) {
  const [department] = await db
    .select()
    .from(departments)
    .where(eq(departments.id, id))
    .limit(1);

  return department ?? null;
}

export async function listDepartments(filters: DepartmentFilters) {
  const { search, page = 1, limit = 10 } = filters;

  const offset = (page - 1) * limit;

  const conditions = [];

  if (search) {
    conditions.push(ilike(departments.name, `%${search}%`));
  }

  const whereClause = conditions.length ? and(...conditions) : undefined;

  const [{ total }] = await db
    .select({
      total: sql<number>`count(*)`,
    })
    .from(departments)
    .where(whereClause);

  const data = await db
    .select()
    .from(departments)
    .where(whereClause)
    .orderBy(desc(departments.createdAt))
    .limit(limit)
    .offset(offset);

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

/* ======================================================
   UPDATE
====================================================== */

export async function updateDepartment(
  id: string,
  data: Partial<NewDepartment>,
) {
  const [updated] = await db
    .update(departments)
    .set(data)
    .where(eq(departments.id, id))
    .returning();

  return updated ?? null;
}

/* ======================================================
   DELETE (Soft Delete Alternative)
====================================================== */

export async function deleteDepartment(id: string) {
  const [deleted] = await db
    .delete(departments)
    .where(eq(departments.id, id))
    .returning();

  return deleted ?? null;
}
