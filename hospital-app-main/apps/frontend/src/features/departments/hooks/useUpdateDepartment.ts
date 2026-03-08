import { useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentsApi } from "../api/departments.api";

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      departmentsApi.update(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });
    },
  });
}
