/* ======================================================
   CREATE DTO
====================================================== */

export interface CreateTemplateDTO {
  name: string;
  description?: string;
}

/* ======================================================
   UPDATE DTO
====================================================== */

export interface UpdateTemplateDTO {
  name?: string;
  description?: string;
}

/* ======================================================
   LIST QUERY DTO
====================================================== */

export interface ListTemplateQuery {
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}
