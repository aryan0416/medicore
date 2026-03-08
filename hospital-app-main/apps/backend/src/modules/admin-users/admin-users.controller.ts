import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";

import {
  listUsersService,
  getUserService,
  updateUserDepartmentService,
  updateUserStatusService,
  assignRoleService,
} from "./admin-users.service";
import { supabaseAdmin } from "../../config/supabase";
import { NotFoundError, UnauthorizedError } from "../../errors/http-error";

// CREATE USER (INVITE)

export async function createAdminUserController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new UnauthorizedError();

    const { email, fullName } = req.body;

    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      {
        data: {
          full_name: fullName,
        },
      },
    );

    if (error) throw error;

    res.status(201).json({
      success: true,
      data,
      message: "User invited successfully",
    });
  } catch (error) {
    next(error);
  }
}


/* ======================================================
   LIST USERS
====================================================== */

export async function getUsersController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { search, page, limit } = req.query;

    const result = await listUsersService({
      search: typeof search === "string" ? search : undefined,
      page: typeof page === "string" ? Number(page) : 1,
      limit: typeof limit === "string" ? Number(limit) : 10,
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
   GET USER
====================================================== */

export async function getUserByIdController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const user = await getUserService(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

/* ======================================================
   ASSIGN DEPARTMENT
====================================================== */

export async function assignDepartmentController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new UnauthorizedError();

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const { departmentId } = req.body;

    const updated = await updateUserDepartmentService(id, departmentId);

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

/* ======================================================
   ASSIGN ROLE
====================================================== */

export async function assignRoleController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new UnauthorizedError();

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const { roleId } = req.body;

    const assignment = await assignRoleService(id, roleId);

    res.status(200).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
}

/* ======================================================
   UPDATE STATUS
====================================================== */

export async function updateUserStatusController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new UnauthorizedError();

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const { isActive } = req.body;

    const updated = await updateUserStatusService(id, isActive);

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}
