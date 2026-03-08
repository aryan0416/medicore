"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { encountersApi } from "../api/encounter.api";

/* ======================================================
   TYPES
====================================================== */

export interface CreateEncounterPayload {
  patientId: string;
  departmentId?: string;
  encounterType: "OPD" | "IPD" | "ER";
  chiefComplaint?: string;
}

/* ======================================================
   HOOK
====================================================== */

export function useCreateEncounter() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateEncounterPayload) => {
      return encountersApi.create(payload);
    },

    onSuccess: () => {
      /**
       * Invalidate encounter lists so doctor dashboard refreshes
       */
      queryClient.invalidateQueries({
        queryKey: ["encounters"],
      });
    },
  });

  return {
    createEncounter: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
}
