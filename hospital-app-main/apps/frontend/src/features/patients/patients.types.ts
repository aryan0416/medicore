export interface Patient {
  id: string;
  uhid: string;
  firstName: string;
  lastName?: string;
  gender: "male" | "female" | "other";
  phone?: string;
  createdAt: string;
  isActive: boolean;
}

export interface PaginatedPatientsResponse {
  data: Patient[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
