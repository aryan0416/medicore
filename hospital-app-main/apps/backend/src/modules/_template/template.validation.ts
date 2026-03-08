import { z } from "zod";

/* ======================================================
   CREATE
====================================================== */

export const createTemplateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

/* ======================================================
   UPDATE
====================================================== */

export const updateTemplateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

/* ======================================================
   TYPES
====================================================== */

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
