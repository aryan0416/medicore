import { useQuery } from "@tanstack/react-query";

import { listAdminUsers } from "../api/adminUsers.api";

/* ======================================================
   TYPES
====================================================== */

interface Params {
  search?: string;
  page?: number;
  limit?: number;
}

/* ======================================================
   HOOK
====================================================== */

export function useAdminUsers(params: Params) {
  return useQuery({
    queryKey: ["admin-users", params],

    queryFn: () => listAdminUsers(params),

    placeholderData: (previousData) => previousData,
  });
}
