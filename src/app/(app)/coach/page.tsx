"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, AlertCircle, CheckCircle2, Clock, MessageSquareReply, Search } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@/lib/auth-context";
import { getFoldersForCoach } from "@/lib/mock/workfolders";
import { getUser, coaches } from "@/lib/mock/users";
import { GradientAvatar } from "@/components/user-pill";
import { relativeTime } from "@/lib/utils";

export default function CoachPage() {
  const user = useUser();
  // If not coach, fallback to Hans
  const coachId = user.role === "coach" ? user.id : "u_hans";
  const coach = getUser(coachId)!;
  const folders = getFoldersForCoach(coachId);

  const [search, setSearch] = React.useState("");

  const stats = {
    total: folders.length,
    needsFeedback: folders.filter((f) =>
      f.assignments.some((a) => a.status === "submitted")
    ).length,
    inactive: folders.filter((f) => {
      const lastFile = f.files.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))[0];
      if (!lastFile) return true;
      return Date.now() - new Date(lastFile.uploadedAt).getTime() > 7 * 24 * 60 * 60 * 1000;
    }).length,
    avgProgress: Math.round(
      folders.reduce((sum, f) => {
        const done = f.assignments.filter((a) => a.status === "done").length;
        return sum + (done / f.assignments.length) * 100;
      }, 0) / Math.max(folders.length, 1)
    ),
  };

  const list = folders
    .map((f) => {
      const ent = getUser(f.entrepreneurId)!;
      const done = f.assignments.filter((a) => a.status === "done").length;
      const progress = Math.round((done / f.assignments.length) * 100);
      const open = f.assignments.find((a) => a.status === "submitted" || a.status === "in_progress");
      const lastFile = f.files.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))[0];
      const lastActivity = lastFile?.uploadedAt ?? f.assignments[0]?.createdAt;
      return { folder: f, ent, progress, open, lastActivity, needsFeedback: f.assignments.some((a) => a.status === "submitted") };
    })
    .filter((row) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        row.ent.name.toLowerCase().includes(q) ||
        row.ent.company?.toLowerCase().includes(q) ||
        row.open?.title.toLowerCase().includes(q)
      );
    });

  return (
    <>
      <Topbar
        title="Mijn ondernemers"
        subtitle={`${coach.name} · ${folders.length} actieve werkmappen`}
      />
      <div className="space-y-6 p-6">
        {/* Stats */}
        <div data-tour="coach-stats" className="grid gap-3 md:grid-cols-4">
          <StatCard label="Actieve ondernemers" value={stats.total} icon="•" tone="default" />
          <StatCard
            label="Wacht op feedback"
            value={stats.needsFeedback}
            icon={<AlertCircle className="size-4" />}
            tone={stats.needsFeedback > 0 ? "warning" : "default"}
          />
          <StatCard
            label="Inactief 7+ dagen"
            value={stats.inactive}
            icon={<Clock className="size-4" />}
            tone={stats.inactive > 0 ? "danger" : "default"}
          />
          <StatCard
            label="Gem. voortgang"
            value={`${stats.avgProgress}%`}
            icon={<CheckCircle2 className="size-4" />}
            tone="success"
          />
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[var(--color-muted)]" />
            <Input
              placeholder="Zoek op naam, bedrijf of opdracht…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* List */}
        <Card data-tour="coach-list" className="overflow-hidden p-0">
          <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)] px-5 py-2.5">
            <div className="grid grid-cols-[1fr_140px_180px_140px_60px] items-center gap-4 text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
              <span>Ondernemer</span>
              <span>Voortgang</span>
              <span>Open opdracht</span>
              <span>Laatste activiteit</span>
              <span></span>
            </div>
          </div>
          <div>
            {list.map(({ folder, ent, progress, open, lastActivity, needsFeedback }) => (
              <Link
                key={folder.id}
                href={`/coach/${ent.id}`}
                className="grid grid-cols-[1fr_140px_180px_140px_60px] items-center gap-4 border-b border-[var(--color-border)] px-5 py-3.5 last:border-0 transition-colors hover:bg-[var(--color-surface-2)]/60"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <GradientAvatar initials={ent.initials ?? ent.name[0]} gradient={ent.gradient ?? "from-zinc-400 to-zinc-600"} size="md" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-[13.5px] font-semibold text-[var(--color-ink)]">{ent.name}</p>
                      {needsFeedback && (
                        <Badge variant="soft" className="gap-1 text-[9.5px]">
                          <MessageSquareReply className="size-2.5" /> Feedback nodig
                        </Badge>
                      )}
                    </div>
                    <p className="truncate text-[11.5px] text-[var(--color-ink-3)]">{ent.company} · {ent.jobTitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={progress} className="h-1.5 max-w-[80px]" indicatorClassName="bg-[var(--color-ink)]" />
                  <span className="text-[11px] font-medium text-[var(--color-ink-2)]">{progress}%</span>
                </div>
                <div>
                  {open ? (
                    <p className="line-clamp-1 text-[12px] text-[var(--color-ink-2)]">{open.title}</p>
                  ) : (
                    <p className="text-[12px] text-[var(--color-muted)]">—</p>
                  )}
                </div>
                <p className="text-[11.5px] text-[var(--color-ink-3)]">{lastActivity ? relativeTime(lastActivity) : "—"}</p>
                <div className="flex justify-end">
                  <ArrowRight className="size-4 text-[var(--color-muted)]" />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  tone: "default" | "success" | "danger" | "warning";
}) {
  const tones = {
    default: "text-[var(--color-ink-3)]",
    success: "text-[var(--color-success)]",
    danger: "text-[var(--color-danger)]",
    warning: "text-amber-600",
  };
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-[11.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">{label}</p>
        <div className={tones[tone]}>{icon}</div>
      </div>
      <p className="mt-2 text-[28px] font-semibold leading-tight tracking-tight text-[var(--color-ink)]">{value}</p>
    </Card>
  );
}
