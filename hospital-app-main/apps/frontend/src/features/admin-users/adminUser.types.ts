export interface AdminUser {
  departmentName: string;
  id: string;
  email: string;
  fullName: string | null;
  departmentId: string | null;
  isActive: "true" | "false";
  createdAt: string;
  updatedAt: string;
}

export interface AdminUsersListResponse {
  data: AdminUser[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/* ======================================================
   UPDATE OPERATIONS
====================================================== */

export interface AssignDepartmentInput {
  departmentId: string;
}

export interface AssignRoleInput {
  roleId: string;
}

export interface UpdateUserStatusInput {
  isActive: "true" | "false";
}
