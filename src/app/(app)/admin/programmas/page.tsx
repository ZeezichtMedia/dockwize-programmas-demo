"use client";

import { Plus } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { programs, cohorts } from "@/lib/mock/programs";
import { entrepreneursIn } from "@/lib/mock/users";
import { library } from "@/lib/mock/library";

export default function ProgramsPage() {
  return (
    <>
      <Topbar
        title="Programma's"
        subtitle={`${programs.length} programma's bij Dockwize`}
        action={<Button size="sm"><Plus className="size-4" /> Nieuw programma</Button>}
      />
      <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
        {programs.map((p) => {
          const programCohorts = cohorts.filter((c) => c.programId === p.id);
          const memberCount = programCohorts.reduce((sum, c) => sum + entrepreneursIn(c.id).length, 0);
          const materials = library.filter((l) => l.programId === p.id).length;
          return (
            <Card key={p.id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[15px] font-semibold tracking-tight">{p.shortName}</h3>
                  <p className="mt-0.5 text-[11.5px] text-[var(--color-ink-3)]">{p.duration}</p>
                </div>
                <Badge variant={p.active ? "success" : "default"}>{p.active ? "Actief" : "Pauze"}</Badge>
              </div>
              <p className="mt-3 line-clamp-3 text-[12.5px] text-[var(--color-ink-2)]">{p.description}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <Stat label="Cohorts" value={programCohorts.length} />
                <Stat label="Deelnemers" value={memberCount} />
                <Stat label="Materialen" value={materials} />
              </div>
              <p className="mt-4 text-[10.5px] uppercase tracking-wider text-[var(--color-muted)]">Modules</p>
              <ol className="mt-1 space-y-0.5">
                {p.modules.slice(0, 4).map((m, i) => (
                  <li key={m} className="text-[12px] text-[var(--color-ink-2)]">
                    <span className="font-medium text-[var(--color-ink-3)]">{i + 1}.</span> {m}
                  </li>
                ))}
                {p.modules.length > 4 && (
                  <li className="text-[11px] text-[var(--color-muted)]">+ {p.modules.length - 4} meer…</li>
                )}
              </ol>
            </Card>
          );
        })}
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[8px] bg-[var(--color-surface-2)] p-2">
      <p className="text-[16px] font-semibold leading-tight">{value}</p>
      <p className="text-[10px] text-[var(--color-muted)]">{label}</p>
    </div>
  );
}
