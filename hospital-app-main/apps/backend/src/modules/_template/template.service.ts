import { db } from "../../db";
import {
  createTemplate,
  updateTemplate,
  softDeleteTemplate,
  getTemplateById,
} from "./template.repository";

import { logActivity } from "../activity-logs/activity-log.service";

import {
  ValidationError,
  ConflictError,
  NotFoundError,
} from "../../errors/http-error";

/* ======================================================
   TYPES
====================================================== */

export interface ListTemplatesParams {
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

/* ======================================================
   CREATE
====================================================== */

export async function createTemplateService(data: any, currentUserId: string) {
  return db.transaction(async (tx) => {
    // 🔹 Business validation
    if (!data) {
      throw new ValidationError("Invalid data");
    }

    const record = await createTemplate(data, tx);

    await logActivity(
      {
        userId: currentUserId,
        module: "<module>",
        action: "create",
        entityType: "<module>",
        entityId: record.id,
      },
      tx,
    );

    return record;
  });
}

/* ======================================================
   UPDATE
====================================================== */

export async function updateTemplateService(
  id: string,
  updates: any,
  currentUserId: string,
) {
  return db.transaction(async (tx) => {
    const existing = await getTemplateById(id);

    if (!existing) {
      throw new NotFoundError("Record not found");
    }

    const updated = await updateTemplate(id, updates, tx);

    await logActivity(
      {
        userId: currentUserId,
        module: "<module>",
        action: "update",
        entityType: "<module>",
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

export async function deleteTemplateService(id: string, currentUserId: string) {
  return db.transaction(async (tx) => {
    const existing = await getTemplateById(id);

    if (!existing) {
      throw new NotFoundError("Record not found");
    }

    await softDeleteTemplate(id, tx);

    await logActivity(
      {
        userId: currentUserId,
        module: "<module>",
        action: "delete",
        entityType: "<module>",
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

export async function listTemplatesService(params: ListTemplatesParams) {
  const { search, page = 1, limit = 10 } = params;

  const currentPage = Math.max(1, page);
  const limitPerPage = Math.min(Math.max(1, limit), 50);

  return {
    data: [],
    pagination: {
      page: currentPage,
      limit: limitPerPage,
      total: 0,
      totalPages: 0,
    },
  };
}
