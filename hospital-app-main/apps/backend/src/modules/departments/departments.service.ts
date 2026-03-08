import { NewDepartment } from "../../db/schema";
import { AppError } from "../../errors/app-error";
import * as repo from "./departments.repository";

/* ======================================================
   TYPES
====================================================== */

export interface DepartmentFilters {
  search?: string;
  page?: number;
  limit?: number;
}

/* ======================================================
   CREATE
====================================================== */

export async function createDepartment(data: NewDepartment) {
  // Basic validation safeguard (extra layer beyond Zod)
  if (!data.name || !data.code) {
    throw new AppError("Department name and code are required", 400);
  }

  // Check duplicate code
  const existing = await repo.listDepartments({
    search: data.code,
    page: 1,
    limit: 1,
  });

  if (
    existing.data.some((d) => d.code.toLowerCase() === data.code.toLowerCase())
  ) {
    throw new AppError("Department code already exists", 409);
  }

  return repo.createDepartment(data);
}

/* ======================================================
   READ
====================================================== */

export async function getDepartment(id: string) {
  const department = await repo.getDepartmentById(id);

  if (!department) {
    throw new AppError("Department not found", 404);
  }

  return department;
}

export async function listDepartments(filters: DepartmentFilters) {
  return repo.listDepartments(filters);
}

/* ======================================================
   UPDATE
====================================================== */

export async function updateDepartment(
  id: string,
  data: Partial<NewDepartment>,
) {
  const department = await repo.getDepartmentById(id);

  if (!department) {
    throw new AppError("Department not found", 404);
  }

  if (data.code) {
    const existing = await repo.listDepartments({
      search: data.code,
      page: 1,
      limit: 1,
    });

    const duplicate = existing.data.find(
      (d) => d.code.toLowerCase() === data.code?.toLowerCase() && d.id !== id,
    );

    if (duplicate) {
      throw new AppError("Department code already exists", 409);
    }
  }

  return repo.updateDepartment(id, data);
}

/* ======================================================
   DELETE
====================================================== */

export async function deleteDepartment(id: string) {
  const department = await repo.getDepartmentById(id);

  if (!department) {
    throw new AppError("Department not found", 404);
  }

  return repo.deleteDepartment(id);
}
