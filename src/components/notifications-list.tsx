"use client";

import { CheckCheck, FolderOpen, MessageSquare, Calendar, Library, Bell, FileCheck2 } from "lucide-react";
import { UserAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getUser } from "@/lib/mock/users";
import { relativeTime, cn } from "@/lib/utils";
import type { Notification } from "@/lib/types";

const icons = {
  assignment: FileCheck2,
  feedback: MessageSquare,
  chat: MessageSquare,
  library: Library,
  system: Bell,
  session: Calendar,
} as const;

export function NotificationsList({ items }: { items: Notification[] }) {
  if (items.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-[13px] text-[var(--color-ink-3)]">Geen meldingen.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-3 py-2.5">
        <p className="text-[12px] font-semibold tracking-tight">Meldingen</p>
        <button className="flex items-center gap-1 text-[11px] text-[var(--color-ink-3)] hover:text-[var(--color-ink)]">
          <CheckCheck className="size-3" /> Alle gelezen
        </button>
      </div>
      <div className="max-h-[420px] overflow-y-auto py-1">
        {items.map((n) => {
          const Icon = icons[n.type] ?? Bell;
          const from = n.fromUserId ? getUser(n.fromUserId) : null;
          return (
            <button
              key={n.id}
              className={cn(
                "flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[var(--color-surface-2)]",
                !n.read && "bg-[var(--color-accent-soft)]/40"
              )}
            >
              {from ? (
                <UserAvatar src={from.avatar} name={from.name} size="sm" />
              ) : (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-2)]">
                  <Icon className="size-4 text-[var(--color-ink-2)]" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-[12.5px] font-medium text-[var(--color-ink)]">{n.title}</p>
                  {!n.read && <span className="size-1.5 shrink-0 rounded-full bg-[var(--color-info)]" />}
                </div>
                <p className="line-clamp-2 text-[11.5px] text-[var(--color-ink-3)]">{n.body}</p>
                <p className="mt-0.5 text-[10.5px] text-[var(--color-muted)]">{relativeTime(n.createdAt)}</p>
              </div>
            </button>
          );
        })}
      </div>
      <div className="border-t border-[var(--color-border)] p-2">
        <button className="w-full rounded-[8px] py-2 text-center text-[12px] text-[var(--color-ink-2)] transition-colors hover:bg-[var(--color-surface-2)]">
          Alle meldingen bekijken
        </button>
      </div>
    </div>
  );
}
