import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdminUser } from "../api/adminUsers.api";

export function useCreateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdminUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },
  });
}
