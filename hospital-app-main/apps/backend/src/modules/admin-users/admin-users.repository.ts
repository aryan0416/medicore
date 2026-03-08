import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { db } from "../../db";

import {
  users,
  roles,
  userRoles,
  departments,
} from "../../db/schema/rbac";

/* ======================================================
   LIST USERS
====================================================== */

export async function listUsers({
  search,
  page = 1,
  limit = 10,
}: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  const offset = (page - 1) * limit;

  const conditions = [];

  if (search) {
    conditions.push(ilike(users.email, `%${search}%`));
  }

  const whereClause = conditions.length ? and(...conditions) : undefined;

  const [{ total }] = await db
    .select({
      total: sql<number>`count(*)`,
    })
    .from(users)
    .where(whereClause);

  const data = await db
    .select({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      isActive: users.isActive,
      departmentId: users.departmentId,
    })
    .from(users)
    .where(whereClause)
    .orderBy(desc(users.createdAt))
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
   GET USER
====================================================== */

export async function getUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return user ?? null;
}

/* ======================================================
   UPDATE USER DEPARTMENT
====================================================== */

export async function updateUserDepartment(
  userId: string,
  departmentId: string,
) {
  const [updated] = await db
    .update(users)
    .set({
      departmentId,
    })
    .where(eq(users.id, userId))
    .returning();

  return updated ?? null;
}

/* ======================================================
   UPDATE USER STATUS
====================================================== */

export async function updateUserStatus(userId: string, isActive: string) {
  const [updated] = await db
    .update(users)
    .set({
      isActive,
    })
    .where(eq(users.id, userId))
    .returning();

  return updated ?? null;
}

/* ======================================================
   ASSIGN ROLE
====================================================== */

export async function assignRole(userId: string, roleId: string) {
  const [assignment] = await db
    .insert(userRoles)
    .values({
      userId,
      roleId,
    })
    .returning();

  return assignment;
}
