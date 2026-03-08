import { clientApiFetch } from "./clientFetch";
import { serverApiFetch } from "./serverFetch";

interface ListParams {
  search?: string;
  page?: number;
  limit?: number;
}

function buildQuery(params?: ListParams) {
  if (!params) return "";

  const query = new URLSearchParams();

  if (params.search) query.append("search", params.search);
  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));

  const q = query.toString();
  return q ? `?${q}` : "";
}

export function createCrudApi(module: string) {
  return {
    list: (params?: ListParams) =>
      clientApiFetch(`/api/${module}${buildQuery(params)}`),

    get: (id: string) => clientApiFetch(`/api/${module}/${id}`),

    create: (payload: unknown) =>
      clientApiFetch(`/api/${module}`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    update: (id: string, payload: unknown) =>
      clientApiFetch(`/api/${module}/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      }),

    remove: (id: string) =>
      clientApiFetch(`/api/${module}/${id}`, {
        method: "DELETE",
      }),

    // optional SSR support
    listServer: (params?: ListParams) =>
      serverApiFetch(`/api/${module}${buildQuery(params)}`),

    getServer: (id: string) => serverApiFetch(`/api/${module}/${id}`),
  };
}
