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