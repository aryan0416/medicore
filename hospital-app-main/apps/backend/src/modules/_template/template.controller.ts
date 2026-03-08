import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";

import {
  createTemplateService,
  updateTemplateService,
  deleteTemplateService,
  listTemplatesService,
} from "./template.service";

import { getTemplateById } from "./template.repository";

import { NotFoundError, UnauthorizedError } from "../../errors/http-error";

/* ======================================================
   CREATE
====================================================== */

export async function createTemplateController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new UnauthorizedError();

    const record = await createTemplateService(req.body, req.user.id);

    res.status(201).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
}

/* ======================================================
   LIST
====================================================== */

export async function getTemplatesController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { search, page, limit, sort, order } = req.query;

    const result = await listTemplatesService({
      search: typeof search === "string" ? search : undefined,
      page: typeof page === "string" ? Number(page) : 1,
      limit: typeof limit === "string" ? Number(limit) : 10,
      sort: typeof sort === "string" ? sort : undefined,
      order: order === "asc" ? "asc" : "desc",
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

/* ======================================================
   GET SINGLE
====================================================== */

export async function getTemplateByIdController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const record = await getTemplateById(id);

    if (!record) {
      throw new NotFoundError("Record not found");
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
}

/* ======================================================
   UPDATE
====================================================== */

export async function updateTemplateController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new UnauthorizedError();

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const updated = await updateTemplateService(id, req.body, req.user.id);

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

/* ======================================================
   DELETE
====================================================== */

export async function deleteTemplateController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new UnauthorizedError();

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    await deleteTemplateService(id, req.user.id);

    res.status(200).json({
      success: true,
      message: "Record deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
