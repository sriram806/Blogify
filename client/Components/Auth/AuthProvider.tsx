"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AUTH_TOKEN_KEY } from "@/lib/api";

export type AuthUser = {
  _id: string;
  name: string;
  email: string;
  role?: string;
  image?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  bio?: string;
  createdAt?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  greeting: string | null;
  setUser: (user: AuthUser | null) => void;
  setGreeting: (message: string | null) => void;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const API_BASE = process.env.NEXT_PUBLIC_USER_API_URL || "http://localhost:5000/api/v1/users";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;

      const response = await fetch(`${API_BASE}/profile`, {
        method: "GET",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!response.ok) {
        setUser(null);
        return;
      }

      const result = await response.json();
      setUser(result?.data || null);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      await refreshProfile();
      if (mounted) {
        setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [refreshProfile]);

  const value = useMemo(
    () => ({
      user,
      loading,
      greeting,
      setUser,
      setGreeting,
      refreshProfile,
    }),
    [user, loading, greeting, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
