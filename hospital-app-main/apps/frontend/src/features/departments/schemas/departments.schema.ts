import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z
    .string()
    .min(2, "Department name must be at least 2 characters")
    .max(255),

  code: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[A-Z0-9_]+$/, "Code must be uppercase letters or numbers"),

  description: z.string().optional(),
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;