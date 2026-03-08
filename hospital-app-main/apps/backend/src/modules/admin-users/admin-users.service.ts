import * as repo from "./admin-users.repository";

import { AppError } from "../../errors/app-error";


import { getDepartmentById } from "../departments/departments.repository";

/* ======================================================
   TYPES
====================================================== */

export interface AdminUserFilters {
  search?: string;
  page?: number;
  limit?: number;
}

/* ======================================================
   LIST USERS
====================================================== */

export async function listUsersService(filters: AdminUserFilters) {
  return repo.listUsers(filters);
}

/* ======================================================
   GET USER
====================================================== */

export async function getUserService(userId: string) {
  const user = await repo.getUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
}

/* ======================================================
   UPDATE USER DEPARTMENT
====================================================== */

export async function updateUserDepartmentService(
  userId: string,
  departmentId: string,
) {
  const user = await repo.getUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const department = await getDepartmentById(departmentId);

  if (!department) {
    throw new AppError("Department not found", 404);
  }

  return repo.updateUserDepartment(userId, departmentId);
}

/* ======================================================
   UPDATE USER STATUS
====================================================== */

export async function updateUserStatusService(
  userId: string,
  isActive: string,
) {
  const user = await repo.getUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (isActive !== "true" && isActive !== "false") {
    throw new AppError("Invalid status value", 400);
  }

  return repo.updateUserStatus(userId, isActive);
}

/* ======================================================
   ASSIGN ROLE
====================================================== */

export async function assignRoleService(userId: string, roleId: string) {
  const user = await repo.getUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return repo.assignRole(userId, roleId);
}
