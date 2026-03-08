import type { DB } from "../../db";
import { createActivityLog } from "./activity-log.repository";

/* ======================================================
   TYPES
====================================================== */

interface LogActivityParams {
  userId: string;
  module: string;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}

/* ======================================================
   CORE LOG FUNCTION
====================================================== */

/**
 * Logs activity.
 *
 * Must be called inside service layer.
 * Should receive tx when inside transaction.
 */
export async function logActivity(params: LogActivityParams, tx?: DB) {
  if (!params.userId) {
    throw new Error("logActivity: userId required");
  }

  if (!params.module) {
    throw new Error("logActivity: module required");
  }

  if (!params.action) {
    throw new Error("logActivity: action required");
  }

  return createActivityLog(
    {
      userId: params.userId,
      module: params.module,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      metadata: params.metadata ?? null,
      ipAddress: params.ipAddress ?? null,
    },
    tx,
  );
}
