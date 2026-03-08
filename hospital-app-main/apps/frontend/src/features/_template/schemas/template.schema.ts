import { z } from "zod";

export const createTemplateSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const updateTemplateSchema = z.object({
  name: z.string().optional(),
});

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
