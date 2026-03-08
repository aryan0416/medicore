import { useQuery } from "@tanstack/react-query";

export function useTemplate(id: string) {
  return useQuery({
    queryKey: ["admin-template", id],
    queryFn: async () => {
      // Stub implementation since templatesApi is removed
      return { id, name: "Placeholder Template" };
    },
    enabled: !!id,
  });
}
