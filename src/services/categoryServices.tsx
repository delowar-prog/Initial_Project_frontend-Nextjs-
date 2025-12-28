import { api } from "src/lib/api";

export const fetchCategories = async (page: number = 1, perPage: number = 10) => {
  const response = await api.get(`/categories?page=${page}&perpage=${perPage}`);
  return response.data;
};

export const fetchCategory = async (id: number) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

export const createCategory = async (data: { name: string; description: string }) => {
  const response = await api.post('/categories', data);
  return response.data;
};

export const updateCategory = async (id: number, data: { name: string; description: string }) => {
  const response = await api.put(`/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id: number) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};