"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { users, getUser } from "./mock/users";
import type { User } from "./types";

interface AuthContextValue {
  user: User | null;
  setUserId: (id: string) => void;
  signIn: (id: string) => void;
  signOut: () => void;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "dockwize_demo_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserIdState] = React.useState<string | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored || !getUser(stored)) return;
    // Hydrate from localStorage on mount
    queueMicrotask(() => setUserIdState(stored));
  }, []);

  const setUserId = React.useCallback((id: string) => {
    setUserIdState(id);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, id);
  }, []);

  const signIn = React.useCallback(
    (id: string) => {
      setUserId(id);
      const u = getUser(id);
      if (!u) return;
      const home = getHomeRoute(u);
      router.push(home);
    },
    [setUserId, router]
  );

  const signOut = React.useCallback(() => {
    setUserIdState(null);
    if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
    router.push("/login");
  }, [router]);

  const user = userId ? getUser(userId) ?? null : null;

  return (
    <AuthContext.Provider value={{ user, setUserId, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useUser(): User {
  const { user } = useAuth();
  if (!user) {
    // Demo fallback: pretend Marleen is logged in if nothing yet
    return users.find((u) => u.id === "u_marleen")!;
  }
  return user;
}

export function getHomeRoute(user: User): string {
  switch (user.role) {
    case "entrepreneur":
      return "/werkmap";
    case "coach":
      return "/coach";
    case "admin":
      return "/admin";
    case "program_manager":
      return "/programma-manager";
    case "super_admin":
      return "/dashboard";
    default:
      return "/werkmap";
  }
}
