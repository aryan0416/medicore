"use client";

import { useQuery } from "@tanstack/react-query";
import { encountersApi } from "../api/encounter.api";

/* ======================================================
   TYPES
====================================================== */

export interface EncounterDetail {
  id: string;

  patient: {
    id: string;
    firstName: string;
    lastName: string;
    uhid: string;
  };

  encounterType: "OPD" | "IPD" | "ER";

  chiefComplaint?: string;

  status: "waiting" | "in_consultation" | "completed" | "cancelled";

  createdAt: string;

  notes?: {
      versions: string;
      plan: string;
      assessment: string;
      objective: string;
      subjective: string;
      updatedAt: string; id: string; content: string; createdAt: string 
}[];

  diagnoses?: {
      icdCode: string;
      createdAt: string | Date; id: string; code: string; description: string 
}[];

  prescriptions?: {
      createdAt: string | Date; id: string; medication: string; dosage: string 
}[];

  vitals?: {
      createdAt: string | Date; id: string; type: string; value: number; unit: string 
}[];

  dischargeSummaries?: { id: string; summary: string; createdAt: string }[];
}

/* ======================================================
   HOOK
====================================================== */

export function useEncounter(id: string) {
  const query = useQuery<EncounterDetail>({
    queryKey: ["encounter", id],
    queryFn: () => encountersApi.get(id),
    enabled: !!id,
  });

  return {
    encounter: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}
