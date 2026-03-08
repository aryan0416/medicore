import { useQuery } from "@tanstack/react-query";
import { templatesApi } from "../api/template.api";

export function useTemplate(id: string) {
  return useQuery({
    queryKey: ["template", id],
    queryFn: () => templatesApi.get(id),
  });
}
