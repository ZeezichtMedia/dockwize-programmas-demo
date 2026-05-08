"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { useAuth } from "@/lib/auth-context";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (user === null) {
      // Wait for auth provider to hydrate from localStorage
      const t = setTimeout(() => {
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("dockwize_demo_user");
          if (!stored) router.replace("/login");
        }
      }, 60);
      return () => clearTimeout(t);
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-bg)]">
        <div className="text-[13px] text-[var(--color-ink-3)]">Laden…</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg)]">
      <Sidebar role={user.role} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
