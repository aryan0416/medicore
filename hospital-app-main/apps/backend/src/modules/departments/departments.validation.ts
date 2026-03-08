import { z } from "zod";

/* ======================================================
   CREATE
====================================================== */

export const createDepartmentSchema = z.object({
  name: z
    .string()
    .min(2, "Department name must be at least 2 characters")
    .max(255),

  code: z
    .string()
    .min(2, "Department code must be at least 2 characters")
    .max(50)
    .regex(/^[A-Z0-9_]+$/, "Code must be uppercase letters or numbers"),

  description: z.string().optional(),
});

/* ======================================================
   UPDATE
====================================================== */

export const updateDepartmentSchema = z.object({
  name: z
    .string()
    .min(2, "Department name must be at least 2 characters")
    .max(255)
    .optional(),

  code: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[A-Z0-9_]+$/, "Code must be uppercase letters or numbers")
    .optional(),

  description: z.string().optional(),
});

/* ======================================================
   QUERY FILTERS
====================================================== */

export const departmentQuerySchema = z.object({
  search: z.string().optional(),

  page: z.string().transform(Number).optional(),

  limit: z.string().transform(Number).optional(),
});
