import { z } from "zod";

export const createPatientSchema = z.object({
  patient: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().optional(),
    gender: z.enum(["male", "female", "other"]),
    dob: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    bloodGroup: z.string().optional(),
  }),
  contact: z
    .object({
      name: z.string().min(1),
      relation: z.string().min(1),
      phone: z.string().min(1),
    })
    .optional(),
  insurance: z
    .object({
      provider: z.string().min(1),
      policyNumber: z.string().min(1),
      validUntil: z.string().min(1),
    })
    .optional(),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
