export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface DepartmentListResponse {
  data: Department[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
