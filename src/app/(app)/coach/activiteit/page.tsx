"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  FileUp,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Folder,
  ShieldCheck,
  Filter,
} from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/avatar";
import { GradientAvatar } from "@/components/user-pill";
import { useUser } from "@/lib/auth-context";
import { getFoldersForCoach } from "@/lib/mock/workfolders";
import { getUser } from "@/lib/mock/users";
import { auditForCoach } from "@/lib/mock/notifications";
import { relativeTime, cn } from "@/lib/utils";
import type { AuditEntry } from "@/lib/types";

const iconForAction = (action: string) => {
  if (action.startsWith("file")) return FileUp;
  if (action.startsWith("chat")) return MessageSquare;
  if (action.startsWith("assignment")) return CheckCircle2;
  if (action.startsWith("ai")) return Sparkles;
  return Activity;
};

const labelForAction = (e: AuditEntry): string => {
  switch (e.action) {
    case "file.uploaded": return "uploadde";
    case "chat.posted": return "plaatste";
    case "assignment.submitted": return "leverde in";
    case "ai.queried": return "vroeg de bibliotheek";
    case "feedback.posted": return "kreeg feedback van jou op";
    default: return e.action.replace(/\./g, " ");
  }
};

export default function CoachAuditPage() {
  const user = useUser();
  const coachId = user.role === "coach" ? user.id : "u_hans";
  const coach = getUser(coachId)!;
  const folders = getFoldersForCoach(coachId);
  const entrepreneurs = folders
    .map((f) => getUser(f.entrepreneurId)!)
    .filter(Boolean);
  const entrepreneurIds = entrepreneurs.map((e) => e.id);

  const [filterId, setFilterId] = React.useState<string | null>(null);
  const events = auditForCoach(coachId, entrepreneurIds, filterId ?? undefined);

  return (
    <>
      <Topbar
        title="Activiteit van mijn ondernemers"
        subtitle={`${coach.name} · ${folders.length} ondernemers`}
      />
      <div className="space-y-4 p-6">
        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Filter className="size-3.5 text-[var(--color-muted)] mr-1" />
          <FilterChip active={filterId === null} onClick={() => setFilterId(null)}>
            Iedereen ({events.length === 0 && filterId === null ? auditForCoach(coachId, entrepreneurIds).length : auditForCoach(coachId, entrepreneurIds).length})
          </FilterChip>
          {entrepreneurs.map((e) => {
            const count = auditForCoach(coachId, entrepreneurIds, e.id).length;
            return (
              <FilterChip key={e.id} active={filterId === e.id} onClick={() => setFilterId(e.id === filterId ? null : e.id)}>
                {e.name.split(" ")[0]} ({count})
              </FilterChip>
            );
          })}
        </div>

        {/* Events list */}
        {events.length === 0 ? (
          <Card className="p-10 text-center">
            <Activity className="mx-auto size-8 text-[var(--color-ink-3)]" />
            <p className="mt-3 text-[14px] font-medium">Geen activiteit gevonden</p>
            <p className="mt-1 text-[12px] text-[var(--color-ink-3)]">Pas je filter aan om meer te zien.</p>
          </Card>
        ) : (
          <Card className="overflow-hidden p-0">
            {events.map((e, idx) => {
              const actor = getUser(e.actorId);
              const ent = e.entrepreneurId ? getUser(e.entrepreneurId) : null;
              const Icon = iconForAction(e.action);
              const isSelf = actor?.id === e.entrepreneurId;
              return (
                <Link
                  key={e.id}
                  href={ent ? `/coach/${ent.id}` : "#"}
                  className={cn(
                    "group flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-[var(--color-surface-2)]/60",
                    idx !== events.length - 1 && "border-b border-[var(--color-border)]"
                  )}
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-2)]">
                    <Icon className="size-4 text-[var(--color-ink-2)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {ent && (
                        <GradientAvatar
                          initials={ent.initials ?? ent.name[0]}
                          gradient={ent.gradient ?? "from-zinc-400 to-zinc-600"}
                          size="sm"
                        />
                      )}
                      <p className="text-[13px]">
                        <span className="font-semibold text-[var(--color-ink)]">
                          {isSelf ? ent?.name : actor?.name.split(" ")[0]}
                        </span>{" "}
                        <span className="text-[var(--color-ink-3)]">{labelForAction(e)}</span>{" "}
                        <span className="font-medium text-[var(--color-ink-2)]">{e.target}</span>
                      </p>
                    </div>
                    <p className="mt-0.5 text-[11px] text-[var(--color-muted)]">
                      {relativeTime(e.timestamp)} · {new Date(e.timestamp).toLocaleString("nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      {e.meta?.folder && ` · map: ${e.meta.folder}`}
                    </p>
                  </div>
                  <ArrowRight className="mt-2 size-3.5 shrink-0 text-[var(--color-muted)] transition-all group-hover:translate-x-0.5 group-hover:text-[var(--color-ink)]" />
                </Link>
              );
            })}
          </Card>
        )}

        {/* Privacy notice */}
        <div className="flex items-start gap-3 rounded-[12px] bg-[var(--color-surface-2)] p-4">
          <ShieldCheck className="size-4 shrink-0 text-[var(--color-ink-3)] mt-0.5" />
          <p className="text-[12px] text-[var(--color-ink-2)]">
            <span className="font-medium text-[var(--color-ink)]">Wat je hier ziet:</span> alleen activiteit van ondernemers waar jij coach van bent. Collega-coaches en hun ondernemers zijn niet zichtbaar. Joanne en Pascal zien wel een uitgebreidere audit log voor compliance.
          </p>
        </div>
      </div>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-[11.5px] font-medium transition-colors",
        active
          ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
          : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-2)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]"
      )}
    >
      {children}
    </button>
  );
}
