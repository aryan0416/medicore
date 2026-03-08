import { useQuery } from "@tanstack/react-query";
import { templatesApi } from "../api/template.api";

export function useTemplates(params: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["templates", params],
    queryFn: () => templatesApi.list(params),
    placeholderData: (previousData) => previousData,
  });
}
