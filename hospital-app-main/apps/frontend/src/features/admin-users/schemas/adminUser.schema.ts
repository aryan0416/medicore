import { z } from "zod";

/* ======================================================
   ASSIGN DEPARTMENT
====================================================== */

export const assignDepartmentSchema = z.object({
  departmentId: z.string().uuid("Invalid department ID"),
});

export type AssignDepartmentInput = z.infer<typeof assignDepartmentSchema>;

/* ======================================================
   ASSIGN ROLE
====================================================== */

export const assignRoleSchema = z.object({
  roleId: z.string().uuid("Invalid role ID"),
});

export type AssignRoleInput = z.infer<typeof assignRoleSchema>;

/* ======================================================
   UPDATE USER STATUS
====================================================== */

export const updateUserStatusSchema = z.object({
  isActive: z.boolean({
    message: "Status must be 'true' or 'false'",
  }),
});

export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
