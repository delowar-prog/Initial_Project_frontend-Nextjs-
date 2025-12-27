"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getUser, logout } from "../services/authService";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { api } from "src/lib/api";

interface User {
  id: number;
  name: string;
  email: string;
}

interface MeResponse extends User {
  roles: string[];
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  me: MeResponse | null;
  loading: boolean;
  can: (permission: string) => boolean;
  canAny: (permissions: string[]) => boolean;
  handleLogout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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

  useEffect(() => {
    (async () => {
      try {
         const res = await api.get<MeResponse>("/me"); // token/cookie configured
        setMe(res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🚦 permission helpers
  const permissionSet = useMemo(
    () => new Set(me?.permissions ?? []),
    [me]
  );
  const can = (permission: string): boolean =>
    permissionSet.has(permission);

  const canAny = (permissions: string[]): boolean =>
    permissions.some((p) => permissionSet.has(p));

  return (
    <AuthContext.Provider value={{user, setUser, me, loading, can, canAny, handleLogout, }}>
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
