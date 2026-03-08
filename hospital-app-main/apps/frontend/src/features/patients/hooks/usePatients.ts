import { useQuery } from "@tanstack/react-query";
import { patientsApi } from "../api/patients.api";

export function usePatients(params: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["patients", params],
    queryFn: () => patientsApi.list(params),
    placeholderData: (previousData) => previousData,
  });
}
