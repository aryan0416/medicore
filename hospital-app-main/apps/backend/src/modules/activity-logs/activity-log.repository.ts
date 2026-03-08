import { db } from "../../db";
import type { DB } from "../../db";

import {
  activityLogs,
  type NewActivityLog,
} from "../../db/schema/activity-logs.schema";

type Executor = DB;

function getExecutor(tx?: Executor): Executor {
  return tx ?? db;
}

export async function createActivityLog(data: NewActivityLog, tx?: Executor) {
  const executor = getExecutor(tx);

  const [log] = await executor.insert(activityLogs).values(data).returning();

  return log;
}
