import { api } from "src/lib/api";

export const fetchUsers = async (page: number = 1, perPage: number = 10) => {
  const response = await api.get(`/users?page=${page}&per_page=${perPage}`);
  return response.data;
};

export const fetchAllUsers = async () => {
  const response = await api.get('/users?per_page=100'); // Assuming large per_page to get all
  return response.data.data || response.data; // Assuming response has data array
};

export const createUser = async (userData: any) => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const updateUser = async (userId: number, userData: any) => {
  const response = await api.put(`/users/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (userId: number) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

export const assignRole = async (userId: number, role: string) => {
  const response = await api.post(`/users/${userId}/assign-role`, { role: role });
  return response.data;
};