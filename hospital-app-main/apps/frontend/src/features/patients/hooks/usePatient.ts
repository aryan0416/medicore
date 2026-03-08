import { useQuery } from "@tanstack/react-query";
import { patientsApi } from "../api/patients.api";

export function usePatient(id: string) {
  return useQuery({
    queryKey: ["patient", id],
    queryFn: () => patientsApi.get(id),
  });
}
