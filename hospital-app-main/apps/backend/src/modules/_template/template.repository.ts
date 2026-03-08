import { eq } from "drizzle-orm";
import { db } from "../../db";
import type { DB } from "../../db";

/**
 * Import your table + insert type here
 *
 * Example:
 * import { users, type NewUser } from "../../db/schema/user.schema"
 */
import { tableName, type NewTableName } from "../../db/schema/table.schema";

/* ======================================================
   TYPES
====================================================== */

type Executor = DB;

/**
 * Allows repository functions to run
 * inside transactions when tx is provided.
 */
function getExecutor(tx?: Executor): Executor {
  return tx ?? db;
}

/* ======================================================
   CREATE
====================================================== */

export async function createRecord(data: NewTableName, tx?: Executor) {
  const executor = getExecutor(tx);

  const [record] = await executor.insert(tableName).values(data).returning();

  return record;
}

/* ======================================================
   READ
====================================================== */

export async function getRecordById(id: string) {
  return db.query.tableName.findFirst({
    where: eq(tableName.id, id),
  });
}

/**
 * Optional list function
 */
export async function listRecords() {
  return db.select().from(tableName);
}

/* ======================================================
   UPDATE
====================================================== */

export async function updateRecord(
  id: string,
  data: Partial<NewTableName>,
  tx?: Executor,
) {
  const executor = getExecutor(tx);

  const [updated] = await executor
    .update(tableName)
    .set(data)
    .where(eq(tableName.id, id))
    .returning();

  return updated;
}

/* ======================================================
   SOFT DELETE
====================================================== */

export async function softDeleteRecord(id: string, tx?: Executor) {
  const executor = getExecutor(tx);

  await executor
    .update(tableName)
    .set({ isActive: false })
    .where(eq(tableName.id, id));
}
