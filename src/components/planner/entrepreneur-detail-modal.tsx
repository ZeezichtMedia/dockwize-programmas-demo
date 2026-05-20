"use client";

import * as React from "react";
import {
  Activity,
  Building2,
  CalendarPlus,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  Folder,
  Mail,
  MessageSquare,
  Phone,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UserAvatar } from "@/components/ui/avatar";
import { GradientAvatar } from "@/components/user-pill";
import { getUser } from "@/lib/mock/users";
import { getFolderForEntrepreneur } from "@/lib/mock/workfolders";
import { getCohort, getProgram } from "@/lib/mock/programs";
import { proposalsForEntrepreneur } from "@/lib/mock/sessions";
import { auditLog } from "@/lib/mock/notifications";
import { plannerStatusTone } from "@/lib/mock/planner";
import { cn, relativeTime } from "@/lib/utils";
import type { PlannerEntrepreneur } from "@/lib/mock/planner";

interface EntrepreneurDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entrepreneur: PlannerEntrepreneur | null;
  onPlan?: (entrepreneurId: string) => void;
}

export function EntrepreneurDetailModal({
  open,
  onOpenChange,
  entrepreneur,
  onPlan,
}: EntrepreneurDetailModalProps) {
  if (!entrepreneur) return null;

  const { user, status, reason } = entrepreneur;
  const coach = user.coachId ? getUser(user.coachId) : null;
  const folder = getFolderForEntrepreneur(user.id);
  const cohort = user.cohortId ? getCohort(user.cohortId) : null;
  const program = cohort ? getProgram(cohort.programId) : null;
  const proposals = proposalsForEntrepreneur(user.id);
  const recentActivity = auditLog
    .filter((e) => e.entrepreneurId === user.id)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 4);

  const tone = plannerStatusTone[status];

  const total = folder?.assignments.length ?? 0;
  const done = folder?.assignments.filter((a) => a.status === "done").length ?? 0;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;
  const submitted = folder?.assignments.find((a) => a.status === "submitted");
  const inProgress = folder?.assignments.find((a) => a.status === "in_progress");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[640px] p-0">
        {/* Hero */}
        <div className="rounded-t-[20px] bg-gradient-to-br from-[var(--color-surface-2)] to-white p-6">
          <DialogHeader>
            <div className="flex items-start gap-4">
              <GradientAvatar
                initials={user.initials ?? user.name[0]}
                gradient={user.gradient ?? "from-zinc-400 to-zinc-600"}
                size="xl"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <DialogTitle className="text-[20px]">{user.name}</DialogTitle>
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full border bg-white px-2 py-0.5 text-[10.5px] font-medium", tone.text)}>
                    <span className={cn("size-1.5 rounded-full", tone.dot)} />
                    {reason}
                  </span>
                </div>
                <DialogDescription className="mt-1">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="size-3" /> {user.company} · {user.jobTitle}
                  </span>
                </DialogDescription>
                {user.bio && (
                  <p className="mt-2 line-clamp-2 text-[12.5px] text-[var(--color-ink-2)]">{user.bio}</p>
                )}
              </div>
            </div>
          </DialogHeader>

          {/* Quick contact row */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Button variant={onPlan ? "accent" : "secondary"} size="sm" onClick={() => onPlan?.(user.id)}>
              <CalendarPlus className="size-3.5" /> Plan 1-op-1
            </Button>
            <Button variant="secondary" size="sm">
              <MessageSquare className="size-3.5" /> Bericht
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href={`mailto:${user.email}`}>
                <Mail className="size-3.5" /> Mail
              </a>
            </Button>
            <Button variant="ghost" size="sm">
              <ExternalLink className="size-3.5" /> Werkmap
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 pb-6">
          {/* Programma + Coach */}
          <div className="grid gap-2 sm:grid-cols-2">
            <InfoBlock icon={Folder} label="Programma">
              {program && cohort ? (
                <div>
                  <p className="text-[13px] font-semibold">{program.shortName}</p>
                  <p className="text-[11px] text-[var(--color-ink-3)]">{cohort.name}</p>
                </div>
              ) : (
                <p className="text-[12px] text-[var(--color-muted)]">Geen programma toegewezen</p>
              )}
            </InfoBlock>

            <InfoBlock icon={Sparkles} label="Coach">
              {coach ? (
                <div className="flex items-center gap-2">
                  <UserAvatar src={coach.avatar} name={coach.name} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold">{coach.name}</p>
                    <p className="truncate text-[11px] text-[var(--color-ink-3)]">{coach.jobTitle}</p>
                  </div>
                </div>
              ) : (
                <p className="text-[12px] text-[var(--color-muted)]">Geen coach toegewezen</p>
              )}
            </InfoBlock>
          </div>

          {/* Voortgang */}
          {folder && (
            <InfoBlock icon={TrendingUp} label="Voortgang">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold">{progress}% afgerond</p>
                <p className="text-[10.5px] text-[var(--color-ink-3)]">
                  {done} van {total} opdrachten
                </p>
              </div>
              <Progress value={progress} className="mt-1.5 h-1.5" indicatorClassName="bg-[var(--color-accent)]" />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {submitted && (
                  <Badge variant="soft" className="gap-1 text-[9.5px]">
                    <FileCheck2 className="size-2.5" /> Wacht op feedback: {submitted.title}
                  </Badge>
                )}
                {inProgress && (
                  <Badge variant="info" className="gap-1 text-[9.5px]">
                    <Activity className="size-2.5" /> Mee bezig: {inProgress.title}
                  </Badge>
                )}
              </div>
            </InfoBlock>
          )}

          {/* Sessievoorstellen */}
          {proposals.length > 0 && (
            <InfoBlock icon={Clock} label="Sessievoorstellen">
              <div className="space-y-1.5">
                {proposals.slice(0, 2).map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-[6px] bg-[var(--color-surface-2)] px-2 py-1.5">
                    <div className="min-w-0">
                      <p className="truncate text-[12px]">
                        {new Date(p.acceptedSlot ?? p.primarySlot).toLocaleDateString("nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <p className="truncate text-[10.5px] text-[var(--color-ink-3)]">{p.location}</p>
                    </div>
                    <Badge variant={p.status === "accepted" ? "success" : "soft"} className="text-[9.5px]">
                      {p.status === "accepted" ? "Bevestigd" : p.status === "proposed" ? "Voorgesteld" : "Alternatief"}
                    </Badge>
                  </div>
                ))}
              </div>
            </InfoBlock>
          )}

          {/* Recente activiteit */}
          {recentActivity.length > 0 && (
            <InfoBlock icon={Activity} label="Recente activiteit">
              <div className="space-y-1">
                {recentActivity.map((e) => (
                  <div key={e.id} className="flex items-center justify-between text-[11.5px]">
                    <span className="line-clamp-1">
                      <span className="text-[var(--color-ink-2)]">{actionLabel(e.action)}</span>{" "}
                      <span className="font-medium text-[var(--color-ink)]">{e.target}</span>
                    </span>
                    <span className="ml-2 shrink-0 text-[10.5px] text-[var(--color-muted)]">
                      {relativeTime(e.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </InfoBlock>
          )}

          {/* Footer with HubSpot quick action */}
          <div className="flex items-center justify-between rounded-[10px] bg-[var(--color-surface-2)] px-3 py-2 text-[11px] text-[var(--color-ink-2)]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3 text-[var(--color-success)]" />
              Gesynchroniseerd met HubSpot
            </span>
            <button className="flex items-center gap-1 underline-offset-2 hover:underline">
              Open in HubSpot <ExternalLink className="size-2.5" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoBlock({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[10px] border border-[var(--color-border)] p-3">
      <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
        <Icon className="size-2.5" /> {label}
      </p>
      {children}
    </div>
  );
}

function actionLabel(action: string): string {
  const map: Record<string, string> = {
    "file.uploaded": "Uploadde",
    "assignment.submitted": "Leverde in",
    "feedback.posted": "Kreeg feedback op",
    "ai.queried": "Vroeg de bibliotheek over",
    "chat.posted": "Plaatste",
    "user.created": "Toegevoegd",
    "user.assigned_to_cohort": "Gekoppeld aan",
    "user.assigned_coach": "Coach toegewezen",
  };
  return map[action] ?? action.replace(/[._]/g, " ");
}
