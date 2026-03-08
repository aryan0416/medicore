import { useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentsApi } from "../api/departments.api";

interface CreateDepartmentPayload {
  name: string;
  description?: string;
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDepartmentPayload) => departmentsApi.create(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });
    },
  });
}
