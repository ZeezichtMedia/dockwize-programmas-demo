"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Archive,
  ClipboardList,
  Folder,
  Library,
  ShieldCheck,
  Users,
  Zap,
  Plus,
  Building2,
  GraduationCap,
} from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { entrepreneursIn, getUser, users } from "@/lib/mock/users";
import { cohorts, programs } from "@/lib/mock/programs";
import { workfolders } from "@/lib/mock/workfolders";
import { auditLog } from "@/lib/mock/notifications";
import { library } from "@/lib/mock/library";
import { relativeTime, cn } from "@/lib/utils";

export default function AdminPage() {
  const totalEntrepreneurs = users.filter((u) => u.role === "entrepreneur").length;
  const activeCohorts = cohorts.filter((c) => c.state === "active").length;
  const totalPrograms = programs.filter((p) => p.active).length;
  const recentLog = auditLog.slice().sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 6);
  const inactiveCount = workfolders.filter((wf) => {
    const last = wf.files.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))[0];
    if (!last) return true;
    return Date.now() - new Date(last.uploadedAt).getTime() > 7 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <>
      <Topbar
        title="Admin overzicht"
        subtitle="Beheer ondernemers, programma's en content"
        action={
          <Button size="sm">
            <Plus className="size-4" /> Nieuwe ondernemer
          </Button>
        }
      />
      <div className="space-y-6 p-6">
        {/* Hero stat */}
        <div data-tour="admin-kpi" className="grid gap-3 md:grid-cols-4">
          <KPICard
            label="Actieve ondernemers"
            value={totalEntrepreneurs}
            icon={Building2}
            change="+1 deze week"
            changeTone="positive"
          />
          <KPICard
            label="Actieve cohorts"
            value={activeCohorts}
            icon={Users}
            change="3 lopend, 1 starts in juni"
          />
          <KPICard
            label="Programma's"
            value={totalPrograms}
            icon={GraduationCap}
          />
          <KPICard
            label="7+ dagen inactief"
            value={inactiveCount}
            icon={AlertTriangle}
            tone={inactiveCount > 0 ? "warning" : "default"}
            change={`${inactiveCount} ondernemer${inactiveCount === 1 ? "" : "s"} aandacht`}
            changeTone="warning"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recente activiteit */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between gap-2">
              <div>
                <CardTitle>Recente activiteit</CardTitle>
                <p className="text-[12px] text-[var(--color-ink-3)]">Wat er vandaag gebeurd is in alle programma's.</p>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/audit">Volledige audit log <ArrowRight className="size-3.5" /></Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentLog.map((log) => {
                const actor = getUser(log.actorId);
                const Icon = iconForAction(log.action);
                return (
                  <div key={log.id} className="flex items-start gap-3 rounded-[10px] p-2 hover:bg-[var(--color-surface-2)]/60">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-2)]">
                      <Icon className="size-3.5 text-[var(--color-ink-2)]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12.5px]">
                        <span className="font-semibold text-[var(--color-ink)]">{actor?.name.split(" ")[0]}</span>{" "}
                        <span className="text-[var(--color-ink-3)]">{labelForAction(log.action)}</span>{" "}
                        <span className="font-medium text-[var(--color-ink-2)]">{log.target}</span>
                      </p>
                      <p className="text-[11px] text-[var(--color-muted)]">{relativeTime(log.timestamp)}</p>
                    </div>
                    {actor && <UserAvatar src={actor.avatar} name={actor.name} size="xs" />}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Need attention */}
          <Card>
            <CardHeader>
              <CardTitle>Vraagt aandacht</CardTitle>
              <p className="text-[12px] text-[var(--color-ink-3)]">Acties die niemand anders oppakt.</p>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <ActionRow
                icon={Archive}
                label="Retentie: 9 mappen JP5"
                description="Worden over 14 dagen gearchiveerd"
                tone="warning"
                href="/admin/retentie"
              />
              <ActionRow
                icon={ShieldCheck}
                label="Rechten-review JP6"
                description="Wachten op coach-toewijzing voor 2 nieuwe deelnemers"
                tone="info"
                href="/admin/rechten"
              />
              <ActionRow
                icon={AlertTriangle}
                label="Omar al 9 dagen inactief"
                description="Geen uploads meer sinds 29 april. Even checken?"
                tone="danger"
                href="/admin/users"
              />
            </CardContent>
          </Card>
        </div>

        {/* Programma's */}
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2">
            <CardTitle>Programma's</CardTitle>
            <Button variant="ghost" size="sm">Beheer alle programma's <ArrowRight className="size-3.5" /></Button>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {programs.slice(0, 6).map((p) => {
              const programCohorts = cohorts.filter((c) => c.programId === p.id && c.state === "active");
              const memberCount = programCohorts.reduce((sum, c) => sum + entrepreneursIn(c.id).length, 0);
              return (
                <div
                  key={p.id}
                  className="group relative overflow-hidden rounded-[12px] border border-[var(--color-border)] p-4 transition-all hover:border-[var(--color-border-strong)]"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-semibold leading-tight">{p.shortName}</p>
                      <p className="mt-0.5 text-[11px] text-[var(--color-ink-3)]">{p.duration}</p>
                    </div>
                    <Badge variant="default" className="shrink-0">{programCohorts.length} actief</Badge>
                  </div>
                  <p className="mt-2 line-clamp-2 text-[12px] text-[var(--color-ink-2)]">{p.description}</p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-[var(--color-ink-3)]">
                    <Users className="size-3" /> {memberCount} deelnemers
                    <span>·</span>
                    <Library className="size-3" /> {library.filter((l) => l.programId === p.id).length} materialen
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function KPICard({
  label,
  value,
  icon: Icon,
  change,
  changeTone,
  tone = "default",
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  change?: string;
  changeTone?: "positive" | "warning";
  tone?: "default" | "warning";
}) {
  return (
    <Card className={cn("p-5", tone === "warning" && "border-amber-200 bg-amber-50/40")}>
      <div className="flex items-center justify-between">
        <p className="text-[11.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">{label}</p>
        <Icon className={cn("size-4", tone === "warning" ? "text-amber-600" : "text-[var(--color-ink-3)]")} />
      </div>
      <p className="mt-2 text-[28px] font-semibold leading-tight tracking-tight text-[var(--color-ink)]">{value}</p>
      {change && (
        <p className={cn("mt-1 text-[11px]", changeTone === "positive" ? "text-[var(--color-success)]" : changeTone === "warning" ? "text-amber-600" : "text-[var(--color-ink-3)]")}>
          {change}
        </p>
      )}
    </Card>
  );
}

function ActionRow({
  icon: Icon,
  label,
  description,
  tone,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  tone: "warning" | "info" | "danger";
  href: string;
}) {
  const tones = {
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    danger: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-[10px] border border-transparent p-2 transition-colors hover:bg-[var(--color-surface-2)]/60"
    >
      <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-full border", tones[tone])}>
        <Icon className="size-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[12.5px] font-medium text-[var(--color-ink)]">{label}</p>
        <p className="text-[11px] text-[var(--color-ink-3)]">{description}</p>
      </div>
      <ArrowRight className="size-3.5 shrink-0 text-[var(--color-muted)] transition-all group-hover:translate-x-0.5 group-hover:text-[var(--color-ink)]" />
    </Link>
  );
}

function iconForAction(action: string) {
  if (action.startsWith("user")) return Users;
  if (action.startsWith("file")) return Folder;
  if (action.startsWith("feedback")) return Activity;
  if (action.startsWith("library")) return Library;
  if (action.startsWith("retention")) return Archive;
  if (action.startsWith("session")) return Zap;
  if (action.startsWith("permission") || action.startsWith("user.assigned")) return ShieldCheck;
  return ClipboardList;
}

function labelForAction(action: string) {
  const map: Record<string, string> = {
    "user.created": "voegde toe",
    "user.assigned_to_cohort": "koppelde",
    "user.assigned_coach": "wees coach toe aan",
    "file.uploaded": "uploadde",
    "feedback.posted": "gaf feedback op",
    "library.published": "publiceerde",
    "retention.scheduled": "plande retentie voor",
    "session.scheduled": "plande sessie",
  };
  return map[action] ?? action;
}
