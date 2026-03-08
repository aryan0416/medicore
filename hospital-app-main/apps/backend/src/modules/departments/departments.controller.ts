import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";

import {
  createDepartment,
  updateDepartment,
  deleteDepartment,
  listDepartments,
  getDepartment,
  type DepartmentFilters,
} from "./departments.service";

import { UnauthorizedError, NotFoundError } from "../../errors/http-error";

/* ======================================================
   CREATE
====================================================== */

export async function createDepartmentController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new UnauthorizedError();

    const department = await createDepartment(req.body);

    res.status(201).json({
      success: true,
      data: department,
    });
  } catch (error) {
    next(error);
  }
}

/* ======================================================
   LIST
====================================================== */

export async function getDepartmentsController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { search, page, limit } = req.query;

    const filters: DepartmentFilters = {
      search: typeof search === "string" ? search : undefined,
      page: typeof page === "string" ? Number(page) : 1,
      limit: typeof limit === "string" ? Number(limit) : 10,
    };

    const result = await listDepartments(filters);

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

export async function getDepartmentByIdController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const department = await getDepartment(id);

    if (!department) {
      throw new NotFoundError("Department not found");
    }

    res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    next(error);
  }
}

/* ======================================================
   UPDATE
====================================================== */

export async function updateDepartmentController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new UnauthorizedError();

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const updated = await updateDepartment(id, req.body);

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

export async function deleteDepartmentController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new UnauthorizedError();

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    await deleteDepartment(id);

    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
