"use client";

import * as React from "react";
import { Bell, HelpCircle, Search } from "lucide-react";
import { RoleSwitcher } from "@/components/role-switcher";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useUser } from "@/lib/auth-context";
import { notificationsForUser } from "@/lib/mock/notifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationsList } from "./notifications-list";

export function Topbar({ title, subtitle, action }: { title?: string; subtitle?: string; action?: React.ReactNode }) {
  const user = useUser();
  const notifs = notificationsForUser(user.id);
  const unread = notifs.filter((n) => !n.read).length;

  return (
    <header className="glass sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[var(--color-border)] px-5">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        {title && (
          <div className="min-w-0">
            <h1 className="truncate text-[15px] font-semibold tracking-tight text-[var(--color-ink)]">
              {title}
            </h1>
            {subtitle && (
              <p className="truncate text-[11.5px] text-[var(--color-ink-3)]">{subtitle}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[var(--color-muted)]" />
          <Input
            placeholder="Zoek bestanden, deelnemers, materialen…"
            className="h-9 w-[280px] pl-9 text-[13px]"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-[var(--color-border)] bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--color-muted)] md:inline-block">
            ⌘K
          </kbd>
        </div>

        {action}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative flex size-9 items-center justify-center rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-2)] transition-all hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]">
              <Bell className="size-4" />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[var(--color-danger)] text-[9px] font-semibold text-white">
                  {unread}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[380px] p-0">
            <NotificationsList items={notifs.slice(0, 6)} />
          </DropdownMenuContent>
        </DropdownMenu>

        <button className="hidden size-9 items-center justify-center rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-2)] transition-all hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)] md:flex">
          <HelpCircle className="size-4" />
        </button>

        <RoleSwitcher />
      </div>
    </header>
  );
}
