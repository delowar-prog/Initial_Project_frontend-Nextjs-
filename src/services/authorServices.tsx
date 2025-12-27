import { api } from "src/lib/api";

export const fetchAuthors = async (page: number = 1, perPage: number = 10) => {
  const response = await api.get(`/authors?page=${page}&per_page=${perPage}`);
  return response.data;
};

export const fetchAuthor = async (id: number) => {
  const response = await api.get(`/authors/${id}`);
  return response.data;
};

export const createAuthor = async (data: { name: string; bio: string }) => {
  const response = await api.post('/authors', data);
  return response.data;
};

export const updateAuthor = async (id: number, data: { name: string; bio: string }) => {
  const response = await api.put(`/authors/${id}`, data);
  return response.data;
};

export const deleteAuthor = async (id: number) => {
  const response = await api.delete(`/authors/${id}`);
  return response.data;
};