import { useQuery } from "@tanstack/react-query";
import { departmentsApi } from "../api/departments.api";

export function useDepartment(id: string) {
  return useQuery({
    queryKey: ["department", id],
    queryFn: () => departmentsApi.get(id),
    enabled: !!id,
  });
}
