"use client";

import { CalendarClock, Plus, UserCheck } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { coaches, getUser } from "@/lib/mock/users";
import { workfolders } from "@/lib/mock/workfolders";
import { cn } from "@/lib/utils";

function fmt(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("nl-NL", { day: "numeric", month: "long" });
}

export default function CoachesPage() {
  const awayCount = coaches.filter((c) => c.availability?.status === "away").length;

  return (
    <>
      <Topbar
        title="Coaches"
        subtitle={`${coaches.length} actieve coaches${awayCount > 0 ? ` · ${awayCount} afwezig` : ""}`}
        action={<Button size="sm"><Plus className="size-4" /> Nieuwe coach</Button>}
      />
      <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
        {coaches.map((c) => {
          const assigned = workfolders.filter((wf) => wf.coachId === c.id).length;
          const isAway = c.availability?.status === "away";
          const cover = c.availability?.coverageBy ? getUser(c.availability.coverageBy) : null;
          return (
            <Card key={c.id} className={cn("p-5", isAway && "border-amber-200 bg-amber-50/30")}>
              <div className="flex items-start gap-3">
                <UserAvatar src={c.avatar} name={c.name} size="lg" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[14.5px] font-semibold">{c.name}</p>
                    {isAway && (
                      <Badge variant="soft" className="gap-1 text-[9.5px] border-amber-200 bg-amber-100 text-amber-900">
                        <CalendarClock className="size-2.5" /> Afwezig
                      </Badge>
                    )}
                  </div>
                  <p className="text-[12px] text-[var(--color-ink-3)]">{c.jobTitle}</p>
                </div>
                <Badge variant="default">{assigned} ondernemers</Badge>
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

              {c.bio && <p className="mt-3 text-[12px] text-[var(--color-ink-2)]">{c.bio}</p>}
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="secondary" className="flex-1">Bekijk profiel</Button>
                {isAway ? (
                  <Button size="sm" variant="ghost">Waarnemer wijzigen</Button>
                ) : (
                  <Button size="sm" variant="ghost">Afwezig melden</Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
