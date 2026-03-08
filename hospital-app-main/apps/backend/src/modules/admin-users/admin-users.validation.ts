import { z } from "zod";

/* ======================================================
   ASSIGN DEPARTMENT
====================================================== */

export const assignDepartmentSchema = z.object({
  departmentId: z.string().uuid("Invalid department ID"),
});

/* ======================================================
   ASSIGN ROLE
====================================================== */

export const assignRoleSchema = z.object({
  roleId: z.string().uuid("Invalid role ID"),
});

/* ======================================================
   UPDATE USER STATUS
====================================================== */

export const updateUserStatusSchema = z.object({
  isActive: z.string().refine((value) => value === "true" || value === "false", {
    message: "Status must be 'true' or 'false'",
  }),
});
