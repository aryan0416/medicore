import { useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentsApi } from "../api/departments.api";

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => departmentsApi.remove(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });
    },
  });
}
