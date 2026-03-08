import { clientApiFetch } from "@/lib/api/clientFetch";

import type {
  AssignDepartmentInput,
  AssignRoleInput,
  UpdateUserStatusInput,
} from "../adminUser.types";

// CREATE USER (INVITE)
export async function createAdminUser(payload: {
  email: string;
  fullName?: string;
}) {
  return clientApiFetch(`/api/admin/users`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
} 

/* ======================================================
   LIST USERS
====================================================== */

export async function listAdminUsers(params?: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();

  if (params?.search) query.append("search", params.search);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));

  const q = query.toString();

  return clientApiFetch(`/api/admin/users${q ? `?${q}` : ""}`);
}

/* ======================================================
   GET USER
====================================================== */

export async function getAdminUser(id: string) {
  return clientApiFetch(`/api/admin/users/${id}`);
}

/* ======================================================
   ASSIGN DEPARTMENT
====================================================== */

export async function assignUserDepartment(
  id: string,
  payload: AssignDepartmentInput,
) {
  return clientApiFetch(`/api/admin/users/${id}/department`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/* ======================================================
   ASSIGN ROLE
====================================================== */

export async function assignUserRole(id: string, payload: AssignRoleInput) {
  return clientApiFetch(`/api/admin/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/* ======================================================
   UPDATE STATUS
====================================================== */

export async function updateUserStatus(
  id: string,
  payload: UpdateUserStatusInput,
) {
  return clientApiFetch(`/api/admin/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
