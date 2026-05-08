"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarPlus,
  ClipboardCheck,
  GraduationCap,
  MessageSquareReply,
  Plus,
  Sparkles,
  Upload,
  Users,
} from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@/lib/auth-context";
import { cohorts, programs } from "@/lib/mock/programs";
import { entrepreneursIn, getUser } from "@/lib/mock/users";
import { workfolders } from "@/lib/mock/workfolders";
import { libraryByProgram } from "@/lib/mock/library";
import { eventsForCohort } from "@/lib/mock/notifications";
import { cn, relativeTime } from "@/lib/utils";

export default function ProgramManagerPage() {
  const user = useUser();
  // Imro is programmamanager voor Jouw Programma. Andere PM's zouden andere cohorts hebben.
  const myCohorts = cohorts.filter((c) => c.managerId === user.id || c.managerId === "u_imro");
  const myPrograms = Array.from(new Set(myCohorts.map((c) => c.programId)))
    .map((id) => programs.find((p) => p.id === id)!)
    .filter(Boolean);

  const totalDeelnemers = myCohorts.reduce((s, c) => s + entrepreneursIn(c.id).length, 0);
  const allFolders = workfolders.filter((wf) => myCohorts.some((c) => c.id === wf.cohortId));
  const submittedAwaiting = allFolders.flatMap((wf) =>
    wf.assignments.filter((a) => a.status === "submitted").map((a) => ({ wf, a }))
  );
  const inactiveCount = allFolders.filter((wf) => {
    const last = wf.files.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))[0];
    if (!last) return true;
    return Date.now() - new Date(last.uploadedAt).getTime() > 7 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <>
      <Topbar
        title="Programma-management"
        subtitle={`${user.name} · ${myPrograms.length} programma's, ${totalDeelnemers} deelnemers`}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              <CalendarPlus className="size-4" /> Sessie plannen
            </Button>
            <Button size="sm">
              <Upload className="size-4" /> Content publiceren
            </Button>
          </div>
        }
      />
      <div className="space-y-6 p-6">
        {/* KPI's */}
        <div data-tour="pm-kpi" className="grid gap-3 md:grid-cols-4">
          <KPI label="Mijn cohorts" value={myCohorts.length} icon={Users} />
          <KPI label="Actieve deelnemers" value={totalDeelnemers} icon={GraduationCap} />
          <KPI
            label="Wacht op coach-feedback"
            value={submittedAwaiting.length}
            icon={MessageSquareReply}
            tone={submittedAwaiting.length > 0 ? "warning" : "default"}
          />
          <KPI
            label="7+ dagen inactief"
            value={inactiveCount}
            icon={ClipboardCheck}
            tone={inactiveCount > 0 ? "warning" : "default"}
          />
        </div>

        {/* Programma's */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card data-tour="pm-cohorts" className="lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Mijn lopende cohorts</CardTitle>
                <p className="text-[12px] text-[var(--color-ink-3)]">Voortgang en aankomende sessies per cohort.</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {myCohorts.filter((c) => c.state === "active").map((c) => {
                const program = programs.find((p) => p.id === c.programId)!;
                const cohortFolders = workfolders.filter((wf) => wf.cohortId === c.id);
                const total = cohortFolders.reduce((s, wf) => s + wf.assignments.length, 0);
                const done = cohortFolders.reduce((s, wf) => s + wf.assignments.filter((a) => a.status === "done").length, 0);
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                const events = eventsForCohort(c.id).slice(0, 2);
                return (
                  <div key={c.id} className="rounded-[12px] border border-[var(--color-border)] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-[14px] font-semibold">{c.name}</p>
                          <Badge variant="default">{program.shortName}</Badge>
                        </div>
                        <p className="mt-0.5 text-[11.5px] text-[var(--color-ink-3)]">
                          {entrepreneursIn(c.id).length} deelnemers · {libraryByProgram(program.id).length} materialen gepubliceerd
                        </p>
                      </div>
                      <Button asChild variant="ghost" size="sm">
                        <Link href="/admin/cohorts">
                          Open <ArrowRight className="size-3.5" />
                        </Link>
                      </Button>
                    </div>
                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between text-[11px]">
                        <span className="text-[var(--color-ink-3)]">Programma-voortgang</span>
                        <span className="font-medium">{pct}%</span>
                      </div>
                      <Progress value={pct} indicatorClassName="bg-[var(--color-accent)]" />
                    </div>
                    {events.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        <p className="text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">Komt eraan</p>
                        {events.map((ev) => (
                          <div key={ev.id} className="flex items-center gap-2 text-[12px]">
                            <Badge variant={ev.type === "deadline" ? "danger" : "default"} className="text-[10px]">
                              {ev.type === "session" ? "Sessie" : ev.type === "deadline" ? "Deadline" : "Event"}
                            </Badge>
                            <span className="truncate text-[var(--color-ink-2)]">{ev.title}</span>
                            <span className="ml-auto text-[var(--color-muted)]">
                              {new Date(ev.start).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Acties */}
          <div data-tour="pm-actions" className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-[14px]">Wacht op actie</CardTitle>
                <p className="text-[11.5px] text-[var(--color-ink-3)]">Wat alleen jij als programmamanager kan oppakken.</p>
              </CardHeader>
              <CardContent className="space-y-1.5">
                <ActionRow icon={Upload} label="Sessie 6 voorbereiding klaarzetten" desc="Module Financiën, nog 4 dagen" />
                <ActionRow icon={CalendarPlus} label="Sessie 7 plannen (Pitch)" desc="Datum nog te bepalen" />
                <ActionRow icon={Sparkles} label="Bibliotheek: 1 video reviewen" desc="Hans uploadde 'Pitch Architectuur'" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[14px]">Mijn programma's</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {myPrograms.map((p) => (
                  <Link
                    key={p.id}
                    href="/admin/programmas"
                    className="group flex items-center gap-2.5 rounded-[8px] px-2 py-1.5 transition-colors hover:bg-[var(--color-surface-2)]"
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-[6px] bg-[var(--color-accent-soft)]">
                      <GraduationCap className="size-3.5 text-[var(--color-ink)]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12.5px] font-medium">{p.shortName}</p>
                      <p className="truncate text-[10.5px] text-[var(--color-ink-3)]">
                        {libraryByProgram(p.id).length} materialen · {p.modules.length} modules
                      </p>
                    </div>
                    <ArrowRight className="size-3.5 text-[var(--color-muted)] transition-all group-hover:translate-x-0.5 group-hover:text-[var(--color-ink)]" />
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Inleveringen */}
        {submittedAwaiting.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent ingeleverd, wacht op coach</CardTitle>
              <p className="text-[12px] text-[var(--color-ink-3)]">
                Deelnemers die op feedback wachten. Stuur de coach een herinnering als het lang duurt.
              </p>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {submittedAwaiting.slice(0, 5).map(({ wf, a }) => {
                const ent = getUser(wf.entrepreneurId)!;
                const coach = getUser(wf.coachId)!;
                return (
                  <div key={a.id} className="flex items-center gap-3 rounded-[10px] border border-[var(--color-border)] p-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium">{a.title}</p>
                      <p className="text-[11.5px] text-[var(--color-ink-3)]">
                        Door <span className="font-medium text-[var(--color-ink-2)]">{ent.name}</span> · ingeleverd {relativeTime(a.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="soft" className="text-[10px]">Coach: {coach.name.split(" ")[0]}</Badge>
                      <Button size="sm" variant="ghost">Stuur herinnering</Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}

function KPI({
  label,
  value,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "default" | "warning";
}) {
  return (
    <Card className={cn("p-5", tone === "warning" && "border-amber-200 bg-amber-50/40")}>
      <div className="flex items-center justify-between">
        <p className="text-[11.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">{label}</p>
        <Icon className={cn("size-4", tone === "warning" ? "text-amber-600" : "text-[var(--color-ink-3)]")} />
      </div>
      <p className="mt-2 text-[28px] font-semibold leading-tight tracking-tight">{value}</p>
    </Card>
  );
}

function ActionRow({ icon: Icon, label, desc }: { icon: React.ComponentType<{ className?: string }>; label: string; desc: string }) {
  return (
    <button className="flex w-full items-start gap-2.5 rounded-[8px] p-2 text-left transition-colors hover:bg-[var(--color-surface-2)]">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-2)]">
        <Icon className="size-3.5 text-[var(--color-ink-2)]" />
      </div>
      <div>
        <p className="text-[12.5px] font-medium">{label}</p>
        <p className="text-[10.5px] text-[var(--color-ink-3)]">{desc}</p>
      </div>
    </button>
  );
}
