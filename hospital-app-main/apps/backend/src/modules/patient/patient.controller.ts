import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import {
  createPatientService,
  updatePatientService,
  deletePatientService,
  listPatientsService,
  type PatientSortKey,
} from "./patient.service";
import { NotFoundError, UnauthorizedError } from "../../errors/http-error";
import { getPatientById } from "./patient.repository";

/* ======================================================
   CREATE
====================================================== */

export async function createPatientController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new UnauthorizedError();

    const patient = await createPatientService(req.body, req.user.id);

    res.status(201).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
}

/* ======================================================
   LIST
====================================================== */

export async function getPatientsController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { search, page, limit, sort, order } = req.query;

    const allowedSort: PatientSortKey[] = [
      "createdAt",
      "firstName",
      "lastName",
      "uhid",
    ];

    const safeSort =
      typeof sort === "string" && allowedSort.includes(sort as PatientSortKey)
        ? (sort as PatientSortKey)
        : undefined;

    const result = await listPatientsService({
      search: typeof search === "string" ? search : undefined,
      page: typeof page === "string" ? Number(page) : 1,
      limit: typeof limit === "string" ? Number(limit) : 10,
      sort: safeSort,
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

export async function getPatientByIdController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const patient = await getPatientById(id);

    if (!patient) {
      throw new NotFoundError("Patient not found");
    }

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
}

/* ======================================================
   UPDATE
====================================================== */

export async function updatePatientController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new UnauthorizedError();

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updated = await updatePatientService(
      id,
      req.body,
      req.user.id,
    );

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

export async function deletePatientController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new UnauthorizedError();

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await deletePatientService(id, req.user.id);

    res.status(200).json({
      success: true,
      message: "Patient deactivated successfully",
    });
  } catch (error) {
    next(error);
  }
}
