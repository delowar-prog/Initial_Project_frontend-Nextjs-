import { api } from "src/lib/api";
import Cookies from "js-cookie";

interface registerPayload {
  name: string,
  email: string,
  password: string,
  phone: string,
  address: string,
}

export const register = async (payload: registerPayload) => {
  const response = await api.post("/register", payload);
  if (response.data?.token) {
    Cookies.set("token", response.data?.token); //
    Cookies.set("user", JSON.stringify(response.data.user));
  }
  return response.data;
};

// =========================
// LOGIN
// =========================
export async function login(email: string, password: string) {
  try {
    const response = await api.post("/login", { email, password });
    const { token, user } = response.data;

    // ✅ কুকি ও লোকালস্টোরেজে ডেটা সেট করো
    Cookies.set("token", token);
    Cookies.set("user", JSON.stringify(user));

    return user;
  } catch (error: any) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
}

// =========================
// LOGOUT
// =========================
export async function logout() {
  try {
    await api.post("/logout"); // optional, যদি backend logout endpoint থাকে
  } catch (error) {
    console.warn("Logout API failed (ignored):", error);
  }

  // ✅ ক্লায়েন্ট সাইডে সব কিছু রিমুভ করো
  Cookies.remove("token");
  Cookies.remove("user");
}

// =========================
// GET CURRENT USER
// =========================
export function getUser() {
  try {
    const storedUser =  Cookies.get("user");
    if (!storedUser) return null;
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
}


// =========================
// CHECK IF LOGGED IN
// =========================
export function isAuthenticated(): boolean {
  const token = Cookies.get("token");
  return !!token;
}