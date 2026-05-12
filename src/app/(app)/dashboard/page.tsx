"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ClipboardList,
  GraduationCap,
  Library,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
  Folder,
  Archive,
  ShieldCheck,
} from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { auditLog } from "@/lib/mock/notifications";
import { users, getUser, entrepreneursIn } from "@/lib/mock/users";
import { cohorts, programs } from "@/lib/mock/programs";
import { workfolders } from "@/lib/mock/workfolders";
import { library } from "@/lib/mock/library";
import { relativeTime, cn } from "@/lib/utils";

export default function DashboardPage() {
  const totalEntrepreneurs = users.filter((u) => u.role === "entrepreneur").length;
  const totalCoaches = users.filter((u) => u.role === "coach").length;
  const activeCohorts = cohorts.filter((c) => c.state === "active").length;
  const totalContent = library.length;

  const totalAssignments = workfolders.reduce((sum, wf) => sum + wf.assignments.length, 0);
  const completedAssignments = workfolders.reduce(
    (sum, wf) => sum + wf.assignments.filter((a) => a.status === "done").length,
    0
  );
  const completionRate = Math.round((completedAssignments / totalAssignments) * 100);

  const aiQuestionsThisWeek = 47;
  const aiQuestionsLastWeek = 32;
  const aiTrend = Math.round(((aiQuestionsThisWeek - aiQuestionsLastWeek) / aiQuestionsLastWeek) * 100);

  const recentLog = auditLog.slice().sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 5);

  return (
    <>
      <Topbar
        title="Dashboard"
        subtitle="Volledig overzicht van het Dockwize Werkmap-platform"
      />
      <div className="space-y-6 p-6">
        {/* Hero stats */}
        <div data-tour="dashboard-kpi" className="grid gap-3 md:grid-cols-4">
          <BigStat
            label="Actieve ondernemers"
            value={totalEntrepreneurs}
            icon={Building2}
            change="+1"
            changeText="deze week"
            trend="up"
          />
          <BigStat
            label="Lopende programma's"
            value={activeCohorts}
            icon={GraduationCap}
            sublabel={`${cohorts.length} cohorts in totaal`}
          />
          <BigStat
            label="Voortgang gemiddeld"
            value={`${completionRate}%`}
            icon={TrendingUp}
            change="+8%"
            changeText="t.o.v. JP6"
            trend="up"
          />
          <BigStat
            label="AI-vragen deze week"
            value={aiQuestionsThisWeek}
            icon={Sparkles}
            change={`+${aiTrend}%`}
            changeText="t.o.v. vorige week"
            trend="up"
            accent
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Programma's voortgang */}
          <Card data-tour="dashboard-progress" className="lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Programma-voortgang</CardTitle>
                <p className="text-[12px] text-[var(--color-ink-3)]">Hoe ver elk lopend cohort is.</p>
              </div>
              <Badge variant="default">Live data</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {cohorts.filter((c) => c.state === "active").map((c) => {
                const program = programs.find((p) => p.id === c.programId)!;
                const members = entrepreneursIn(c.id);
                const cohortFolders = workfolders.filter((wf) => wf.cohortId === c.id);
                const total = cohortFolders.reduce((s, wf) => s + wf.assignments.length, 0);
                const done = cohortFolders.reduce((s, wf) => s + wf.assignments.filter((a) => a.status === "done").length, 0);
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;

                const start = new Date(c.startDate);
                const end = new Date(c.endDate);
                const today = new Date("2026-05-08");
                const timePct = Math.round(((today.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100);

                return (
                  <div key={c.id} className="rounded-[12px] border border-[var(--color-border)] p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-[14px] font-semibold">{c.name}</p>
                          <Badge variant="default">{program.shortName}</Badge>
                        </div>
                        <p className="mt-0.5 text-[11.5px] text-[var(--color-ink-3)]">
                          {members.length} deelnemers · loopt tot {new Date(c.endDate).toLocaleDateString("nl-NL", { day: "numeric", month: "long" })}
                        </p>
                      </div>
                      <div className="flex -space-x-2">
                        {members.slice(0, 5).map((m) => (
                          <div key={m.id} className="rounded-full ring-2 ring-[var(--color-surface)]">
                            <div className={cn("flex size-7 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-semibold text-white", m.gradient ?? "from-zinc-400 to-zinc-600")}>
                              {m.initials ?? m.name[0]}
                            </div>
                          </div>
                        ))}
                        {members.length > 5 && (
                          <div className="flex size-7 items-center justify-center rounded-full bg-[var(--color-surface-2)] text-[10px] font-semibold text-[var(--color-ink-2)] ring-2 ring-[var(--color-surface)]">
                            +{members.length - 5}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div>
                        <div className="mb-1 flex items-center justify-between text-[11px]">
                          <span className="text-[var(--color-ink-3)]">Opdrachten af</span>
                          <span className="font-medium text-[var(--color-ink)]">{pct}%</span>
                        </div>
                        <Progress value={pct} indicatorClassName="bg-[var(--color-accent)]" />
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between text-[11px]">
                          <span className="text-[var(--color-ink-3)]">Tijd verstreken</span>
                          <span className="font-medium text-[var(--color-ink)]">{timePct}%</span>
                        </div>
                        <Progress value={timePct} indicatorClassName="bg-[var(--color-ink)]" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick actions */}
          <div className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-[14px]">Snelle acties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                <QuickAction icon={Users} label="Nieuwe ondernemer toevoegen" href="/admin/users" />
                <QuickAction icon={GraduationCap} label="Cohort openen" href="/admin/cohorts" />
                <QuickAction icon={Library} label="Content publiceren" href="/admin/content" />
                <QuickAction icon={Archive} label="Retentie controleren" href="/admin/retentie" />
                <QuickAction icon={ClipboardList} label="Audit log" href="/admin/audit" />
              </CardContent>
            </Card>

            <Card data-tour="dashboard-ai">
              <CardHeader>
                <CardTitle className="text-[14px]">AI-bibliotheek deze week</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <div className="flex items-baseline justify-between">
                  <p className="text-[28px] font-semibold leading-none tracking-tight">{aiQuestionsThisWeek}</p>
                  <Badge variant="success" className="gap-1"><TrendingUp className="size-2.5" /> +{aiTrend}%</Badge>
                </div>
                <p className="text-[11.5px] text-[var(--color-ink-3)]">Vragen aan de bibliotheek</p>
                <div className="space-y-1.5 pt-2">
                  <p className="text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">Top onderwerpen</p>
                  {[
                    { topic: "Funding & subsidies", count: 14 },
                    { topic: "Pitch architectuur", count: 9 },
                    { topic: "JTBD interviews", count: 7 },
                  ].map((t) => (
                    <div key={t.topic} className="flex items-center justify-between text-[12px]">
                      <span className="text-[var(--color-ink-2)]">{t.topic}</span>
                      <span className="text-[var(--color-ink-3)]">{t.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent activity */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Recente activiteit</CardTitle>
              <p className="text-[12px] text-[var(--color-ink-3)]">Wat er vandaag op het platform gebeurt.</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/audit">Volledige audit log <ArrowRight className="size-3.5" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentLog.map((log) => {
              const actor = getUser(log.actorId);
              return (
                <div key={log.id} className="flex items-start gap-3 rounded-[10px] p-2 hover:bg-[var(--color-surface-2)]/60">
                  {actor && <UserAvatar src={actor.avatar} name={actor.name} size="sm" />}
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px]">
                      <span className="font-semibold text-[var(--color-ink)]">{actor?.name}</span>{" "}
                      <span className="text-[var(--color-ink-3)]">{log.action.replace(/[._]/g, " ")}</span>{" "}
                      <span className="font-medium text-[var(--color-ink-2)]">{log.target}</span>
                    </p>
                    <p className="text-[11px] text-[var(--color-muted)]">{relativeTime(log.timestamp)}</p>
                  </div>
                  <Badge variant="default" className="text-[10px]">{log.targetType}</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Compliance footer */}
        <div className="grid gap-3 md:grid-cols-2">
          <ComplianceItem icon={ShieldCheck} title="AVG compliant" body="EU-data residency, encryptie at-rest, RLS-isolatie per ondernemer" />
          <ComplianceItem icon={Folder} title={`${totalContent} materialen, ${totalCoaches} coaches`} body={`Bibliotheek up-to-date. Laatste publicatie ${relativeTime(library[library.length-1].publishedAt)}.`} />
        </div>
      </div>
    </>
  );
}

function BigStat({
  label,
  value,
  icon: Icon,
  change,
  changeText,
  sublabel,
  trend,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  change?: string;
  changeText?: string;
  sublabel?: string;
  trend?: "up" | "down";
  accent?: boolean;
}) {
  return (
    <Card className={cn("p-5", accent && "bg-gradient-to-br from-[var(--color-ink)] to-[#2a2a28] text-white border-0")}>
      <div className="flex items-center justify-between">
        <p className={cn("text-[11.5px] font-medium uppercase tracking-wider", accent ? "text-white/60" : "text-[var(--color-muted)]")}>{label}</p>
        <Icon className={cn("size-4", accent ? "text-[var(--color-accent)]" : "text-[var(--color-ink-3)]")} />
      </div>
      <p className={cn("mt-2 text-[32px] font-semibold leading-tight tracking-tight", accent ? "text-white" : "text-[var(--color-ink)]")}>{value}</p>
      {change && (
        <p className={cn("mt-1 flex items-center gap-1 text-[11.5px]", accent ? "text-[var(--color-accent)]" : trend === "up" ? "text-[var(--color-success)]" : "text-[var(--color-ink-3)]")}>
          <TrendingUp className="size-3" />
          {change} {changeText && <span className={cn(accent ? "text-white/60" : "text-[var(--color-ink-3)]")}>{changeText}</span>}
        </p>
      )}
      {sublabel && <p className={cn("mt-1 text-[11.5px]", accent ? "text-white/60" : "text-[var(--color-ink-3)]")}>{sublabel}</p>}
    </Card>
  );
}

function QuickAction({ icon: Icon, label, href }: { icon: React.ComponentType<{ className?: string }>; label: string; href: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2.5 rounded-[8px] px-2 py-1.5 text-[13px] text-[var(--color-ink-2)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
    >
      <Icon className="size-4 text-[var(--color-ink-3)]" />
      <span className="flex-1">{label}</span>
      <ArrowRight className="size-3.5 text-[var(--color-muted)] transition-all group-hover:translate-x-0.5 group-hover:text-[var(--color-ink)]" />
    </Link>
  );
}

function ComplianceItem({ icon: Icon, title, body }: { icon: React.ComponentType<{ className?: string }>; title: string; body: string }) {
  return (
    <Card className="flex items-start gap-3 p-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-[8px] bg-[var(--color-surface-2)]">
        <Icon className="size-4 text-[var(--color-ink-2)]" />
      </div>
      <div>
        <p className="text-[13px] font-semibold leading-tight">{title}</p>
        <p className="mt-0.5 text-[11.5px] text-[var(--color-ink-3)]">{body}</p>
      </div>
    </Card>
  );
}
