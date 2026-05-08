"use client";

import { Plus } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UserAvatar } from "@/components/ui/avatar";
import { GradientAvatar } from "@/components/user-pill";
import { cohorts, programs } from "@/lib/mock/programs";
import { entrepreneursIn, getUser } from "@/lib/mock/users";
import { workfolders } from "@/lib/mock/workfolders";
import { cn } from "@/lib/utils";

export default function CohortsPage() {
  return (
    <>
      <Topbar
        title="Cohorts"
        subtitle="Beheer alle lopende, geplande en afgeronde cohorts"
        action={<Button size="sm"><Plus className="size-4" /> Nieuw cohort</Button>}
      />
      <div className="space-y-4 p-6">
        {cohorts.map((c) => {
          const program = programs.find((p) => p.id === c.programId)!;
          const members = entrepreneursIn(c.id);
          const manager = getUser(c.managerId);
          const folders = workfolders.filter((wf) => wf.cohortId === c.id);
          const total = folders.reduce((s, wf) => s + wf.assignments.length, 0);
          const done = folders.reduce((s, wf) => s + wf.assignments.filter((a) => a.status === "done").length, 0);
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          return (
            <Card key={c.id} className="p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[16px] font-semibold tracking-tight">{c.name}</h3>
                    <Badge variant="default">{program.shortName}</Badge>
                    <Badge variant={c.state === "active" ? "info" : c.state === "archived" ? "default" : "soft"}>
                      {c.state === "active" ? "Lopend" : c.state === "archived" ? "Afgerond" : "Komt eraan"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[12px] text-[var(--color-ink-3)]">
                    {new Date(c.startDate).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}
                    {" tot "}
                    {new Date(c.endDate).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  {manager && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[11px] text-[var(--color-muted)]">Coördinator:</span>
                      <UserAvatar src={manager.avatar} name={manager.name} size="xs" />
                      <span className="text-[12px] font-medium">{manager.name}</span>
                    </div>
                  )}
                </div>
                <div className="md:max-w-sm md:flex-1">
                  <p className="mb-1 flex items-center justify-between text-[11px]">
                    <span className="text-[var(--color-ink-3)]">Voortgang</span>
                    <span className="font-medium">{pct}% ({done}/{total} opdrachten)</span>
                  </p>
                  <Progress value={pct} indicatorClassName="bg-[var(--color-accent)]" />
                  <div className="mt-3 flex items-center gap-2">
                    <p className="text-[11px] text-[var(--color-muted)]">{members.length} ondernemers:</p>
                    <div className="flex -space-x-2">
                      {members.slice(0, 6).map((m) => (
                        <div key={m.id} className="rounded-full ring-2 ring-[var(--color-surface)]">
                          <div className={cn("flex size-7 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-semibold text-white", m.gradient ?? "from-zinc-400 to-zinc-600")}>
                            {m.initials ?? m.name[0]}
                          </div>
                        </div>
                      ))}
                      {members.length > 6 && (
                        <div className="flex size-7 items-center justify-center rounded-full bg-[var(--color-surface-2)] text-[10px] font-semibold text-[var(--color-ink-2)] ring-2 ring-[var(--color-surface)]">
                          +{members.length - 6}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
