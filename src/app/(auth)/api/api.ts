// lib/api.ts
import axios from "axios";
export const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: false,
});

// attach token for later calls
api.interceptors.request.use(cfg => {
  const t = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

// protected example
// const me = await api.get("/user");
export async function getUser() {
  const res = await api.get("/api/user");
  return res.data;
}

export async function logout() {
  await api.post("/logout");
  localStorage.removeItem("token");
}