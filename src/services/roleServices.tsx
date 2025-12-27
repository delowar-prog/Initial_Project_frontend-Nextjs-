import { api } from "src/lib/api";

export const fetchRoles = async (page: number = 1, perPage: number = 10) => {
  const response = await api.get(`/roles?page=${page}&per_page=${perPage}`);
  return response.data;
};

export const deleteRole = async (id: number) => {
  const response = await api.delete(`/roles/${id}`);
  return response.data;
};
