export interface Template {
  id: string;
  name: string;
  createdAt?: string;
}

export interface CreateTemplateInput {
  name: string;
}

export interface UpdateTemplateInput {
  name?: string;
}
