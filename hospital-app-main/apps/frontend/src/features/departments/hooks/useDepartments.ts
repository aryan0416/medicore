import { useQuery } from "@tanstack/react-query";
import { departmentsApi } from "../api/departments.api";

interface Params {
  search?: string;
  page?: number;
  limit?: number;
}

export function useDepartments(params: Params) {
  return useQuery({
    queryKey: ["departments", params],
    queryFn: () => departmentsApi.list(params),
  });
}
