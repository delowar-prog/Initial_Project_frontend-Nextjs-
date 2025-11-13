"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getUser, logout } from "../services/authService";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    const storedUser = getUser();

    if (storedUser) {
      setUser(storedUser);

      // ✅ যদি ইউজার লগইন করা অবস্থায় login/register পেজে যায়, redirect করো
      if (isAuthPage) {
        router.push("/dashboard");
      }
    } else {
      // ✅ লগইন না করা অবস্থায় অন্য পেজে গেলে login এ রিডাইরেক্ট করো
      if (!isAuthPage) {
        router.push("/login");
      }
    }
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.warn("Logout failed");
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
