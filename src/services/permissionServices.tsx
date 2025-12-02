import { api } from "src/lib/api";

export const permissions = async (page: number = 1, perPage: number = 10) => {
  const response = await api.get(`/permissions?page=${page}&per_page=${perPage}`);
  return response.data;
};

export const fetchAllPermissions = async () => {
  const response = await api.get('/permissions?per_page=100'); // Assuming large per_page to get all
  return response.data.data || response.data; // Assuming response has data array
};
