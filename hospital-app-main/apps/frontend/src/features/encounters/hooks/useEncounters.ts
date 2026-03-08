"use client";

import { useQuery } from "@tanstack/react-query";
import { encountersApi } from "../api/encounter.api";

/* ======================================================
   TYPES
====================================================== */

export interface EncounterListParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface Encounter {
  id: string;

  patient: {
    id: string;
    firstName: string;
    lastName: string;
    uhid: string;
  };

  doctorId?: string | null;
  departmentId?: string | null;

  encounterType: "OPD" | "IPD" | "ER";

  chiefComplaint?: string | null;

  status: "waiting" | "in_consultation" | "completed" | "cancelled";

  createdAt: string;
}

export interface EncounterListResponse {
  data: Encounter[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/* ======================================================
   HOOK
====================================================== */

export function useEncounters(params?: EncounterListParams) {
  const query = useQuery<EncounterListResponse>({
    queryKey: ["encounters", params],
    queryFn: () => encountersApi.list(params),
    staleTime: 30 * 1000, // 30 seconds
  });

  return {
    encounters: query.data?.data ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
  };
}
