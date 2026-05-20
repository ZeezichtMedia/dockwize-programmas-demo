"use client";

import { CalendarClock, Plus, Sparkles, UserCheck } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { coaches, getUser } from "@/lib/mock/users";
import { workfolders } from "@/lib/mock/workfolders";
import { getCoachProfile } from "@/lib/mock/coach-skills";
import { programs } from "@/lib/mock/programs";
import { cn } from "@/lib/utils";

function fmt(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("nl-NL", { day: "numeric", month: "long" });
}

export default function CoachesPage() {
  const awayCount = coaches.filter((c) => c.availability?.status === "away").length;
  const jouwProgramma = programs.find((p) => p.id === "p_jouw");

  return (
    <>
      <Topbar
        title="Coaches"
        subtitle={`${coaches.length} actieve coaches${awayCount > 0 ? ` · ${awayCount} afwezig` : ""}`}
        action={<Button size="sm"><Plus className="size-4" /> Nieuwe coach</Button>}
      />
      <div className="space-y-4 p-6">
        {coaches.map((c) => {
          const assigned = workfolders.filter((wf) => wf.coachId === c.id).length;
          const isAway = c.availability?.status === "away";
          const cover = c.availability?.coverageBy ? getUser(c.availability.coverageBy) : null;
          const profile = getCoachProfile(c.id);

          return (
            <Card key={c.id} className={cn("p-5", isAway && "border-amber-200 bg-amber-50/30")}>
              <div className="flex items-start gap-4">
                <UserAvatar src={c.avatar} name={c.name} size="xl" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[16px] font-semibold tracking-tight">{c.name}</p>
                    {isAway && (
                      <Badge variant="soft" className="gap-1 text-[9.5px] border-amber-200 bg-amber-100 text-amber-900">
                        <CalendarClock className="size-2.5" /> Afwezig
                      </Badge>
                    )}
                    <Badge variant="default">{assigned} ondernemers</Badge>
                  </div>
                  <p className="text-[12.5px] text-[var(--color-ink-3)]">{c.jobTitle}</p>
                  {profile && (
                    <p className="mt-1 text-[12.5px] text-[var(--color-ink-2)]">{profile.tagline}</p>
                  )}
                </div>
              </div>

              {isAway && (
                <div className="mt-3 rounded-[10px] border border-amber-200 bg-white p-3">
                  <p className="text-[11.5px] font-medium text-amber-900">
                    {c.availability?.awayFrom && fmt(c.availability.awayFrom)}
                    {c.availability?.awayFrom && " tot "}
                    {fmt(c.availability?.awayUntil)}
                    {c.availability?.reason && ` · ${c.availability.reason}`}
                  </p>
                  {cover && (
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <UserCheck className="size-3 text-blue-600" />
                      <p className="text-[11.5px] text-[var(--color-ink-2)]">
                        Waargenomen door <strong>{cover.name}</strong>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {profile && (
                <>
                  {/* Skills */}
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-2 flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
                        <Sparkles className="size-2.5" /> Kerncompetenties
                      </p>
                      <div className="space-y-1.5">
                        {profile.skills.slice(0, 5).map((s) => (
                          <SkillBar key={s.label} skill={s} />
                        ))}
                      </div>
                    </div>

                    {/* Module-fit */}
                    <div>
                      <p className="mb-2 flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
                        Fit per module ({jouwProgramma?.shortName})
                      </p>
                      <div className="space-y-1">
                        {jouwProgramma?.modules.map((m) => {
                          const score = profile.moduleMatch[m] ?? 0;
                          return <ModuleScore key={m} module={m} score={score} />;
                        })}
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="secondary">Bekijk profiel</Button>
                <Button size="sm" variant="ghost">Toewijzen aan ondernemer</Button>
                {isAway ? (
                  <Button size="sm" variant="ghost">Waarnemer wijzigen</Button>
                ) : (
                  <Button size="sm" variant="ghost">Afwezig melden</Button>
                )}
              </div>
            </Card>
          );
        })}

        <div className="rounded-[12px] bg-[var(--color-surface-2)] p-4">
          <p className="text-[12px] text-[var(--color-ink-2)]">
            <span className="font-medium text-[var(--color-ink)]">Hoe werkt dit later:</span> match-scores worden automatisch berekend uit geleverde sessies, ondernemer-ratings en NPS per module. Voor de demo zijn ze handmatig ingevuld zodat het narratief klopt.
          </p>
        </div>
      </div>
    </>
  );
}

function SkillBar({ skill }: { skill: { label: string; level: number } }) {
  return (
    <div className="flex items-center gap-2">
      <p className="w-[140px] shrink-0 text-[11.5px] text-[var(--color-ink-2)]">{skill.label}</p>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={cn(
              "size-2 rounded-full",
              n <= skill.level ? "bg-[var(--color-ink)]" : "bg-[var(--color-border)]"
            )}
          />
        ))}
      </div>
    </div>
  );
}

function ModuleScore({ module, score }: { module: string; score: number }) {
  const tone =
    score >= 85
      ? { bg: "bg-emerald-50", text: "text-emerald-700", bar: "bg-emerald-500" }
      : score >= 65
      ? { bg: "bg-[var(--color-accent-soft)]", text: "text-[var(--color-ink-2)]", bar: "bg-[var(--color-accent)]" }
      : { bg: "bg-amber-50", text: "text-amber-700", bar: "bg-amber-400" };

  return (
    <div className="flex items-center gap-2">
      <p className="w-[140px] shrink-0 truncate text-[11.5px] text-[var(--color-ink-2)]">{module}</p>
      <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
        <div className={cn("absolute inset-y-0 left-0 transition-all", tone.bar)} style={{ width: `${score}%` }} />
      </div>
      <span className={cn("w-8 shrink-0 text-right text-[11px] font-semibold", tone.text)}>{score}</span>
    </div>
  );
}
