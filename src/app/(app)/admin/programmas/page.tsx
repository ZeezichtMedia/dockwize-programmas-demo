"use client";

import * as React from "react";
import { Plus, Sliders, Save } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { programs, cohorts } from "@/lib/mock/programs";
import { entrepreneursIn } from "@/lib/mock/users";
import { library } from "@/lib/mock/library";
import {
  kpiSets,
  statusLabel,
  statusTone,
  formatKpiValue,
  formatKpiTarget,
  type KpiTarget,
} from "@/lib/mock/kpis";
import { cn } from "@/lib/utils";

export default function ProgramsPage() {
  const [editing, setEditing] = React.useState<{ programId: string; kpiId: string } | null>(null);
  const [overrides, setOverrides] = React.useState<Record<string, Record<string, number>>>({});

  const getKpis = (programId: string): KpiTarget[] => {
    const set = kpiSets.find((s) => s.programId === programId);
    if (!set) return [];
    const overrideForProgram = overrides[programId] ?? {};
    return set.kpis.map((k) => (overrideForProgram[k.id] !== undefined ? { ...k, target: overrideForProgram[k.id] } : k));
  };

  const editingTarget = editing
    ? getKpis(editing.programId).find((k) => k.id === editing.kpiId)
    : null;

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
          const kpis = getKpis(p.id);

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
                <Stat label="Groepen" value={programCohorts.length} />
                <Stat label="Deelnemers" value={memberCount} />
                <Stat label="Materialen" value={materials} />
              </div>

              {kpis.length > 0 && (
                <div className="mt-4 border-t border-[var(--color-border)] pt-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[10.5px] uppercase tracking-wider text-[var(--color-muted)] flex items-center gap-1">
                      <Sliders className="size-3" /> KPI-targets
                    </p>
                    <span className="text-[10px] text-[var(--color-muted)]">{kpis.length} targets</span>
                  </div>
                  <div className="space-y-1">
                    {kpis.map((k) => {
                      const tone = statusTone[k.status];
                      return (
                        <button
                          key={k.id}
                          onClick={() => setEditing({ programId: p.id, kpiId: k.id })}
                          className="group flex w-full items-center justify-between gap-2 rounded-[6px] px-2 py-1.5 text-left transition-colors hover:bg-[var(--color-surface-2)]"
                        >
                          <div className="min-w-0 flex items-center gap-2">
                            <span className={cn("size-1.5 shrink-0 rounded-full", tone.dot)} />
                            <span className="truncate text-[12px] text-[var(--color-ink-2)]">{k.label}</span>
                          </div>
                          <div className="flex shrink-0 items-baseline gap-1">
                            <span className="text-[12px] font-semibold">{formatKpiValue(k)}</span>
                            <span className="text-[10px] text-[var(--color-muted)]">/ {formatKpiTarget(k)}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

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

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          {editing && editingTarget && (
            <KpiEditDialogContent
              kpi={editingTarget}
              programName={programs.find((p) => p.id === editing.programId)?.shortName ?? ""}
              onSave={(newTarget) => {
                setOverrides((prev) => ({
                  ...prev,
                  [editing.programId]: {
                    ...(prev[editing.programId] ?? {}),
                    [editing.kpiId]: newTarget,
                  },
                }));
                setEditing(null);
              }}
              onCancel={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function KpiEditDialogContent({
  kpi,
  programName,
  onSave,
  onCancel,
}: {
  kpi: KpiTarget;
  programName: string;
  onSave: (newTarget: number) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = React.useState(kpi.target.toString());
  const tone = statusTone[kpi.status];

  return (
    <>
      <DialogHeader>
        <DialogTitle>Target aanpassen</DialogTitle>
        <DialogDescription>
          {programName} · {kpi.label}
        </DialogDescription>
      </DialogHeader>

      {kpi.description && (
        <p className="text-[13px] text-[var(--color-ink-2)]">{kpi.description}</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
          <p className="text-[10.5px] uppercase tracking-wider text-[var(--color-muted)]">Huidige waarde</p>
          <p className="mt-1 text-[22px] font-semibold">{formatKpiValue(kpi)}</p>
          <p className={cn("text-[11px] font-medium", tone.text)}>{statusLabel[kpi.status]}</p>
        </div>
        <div className="rounded-[10px] border border-[var(--color-border)] p-3">
          <p className="text-[10.5px] uppercase tracking-wider text-[var(--color-muted)]">Nieuw target</p>
          <div className="mt-1 flex items-baseline gap-1">
            <Input
              type="number"
              step={kpi.unit === "rating" ? "0.1" : "1"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="h-8 max-w-[80px] text-[18px] font-semibold"
            />
            <span className="text-[12px] text-[var(--color-muted)]">{unitLabel(kpi.unit)}</span>
          </div>
          <p className="text-[11px] text-[var(--color-ink-3)]">
            {kpi.higherIsBetter ? "Hoger = beter" : "Lager = beter"}
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button variant="secondary" onClick={onCancel}>Annuleren</Button>
        <Button onClick={() => onSave(parseFloat(value) || kpi.target)}>
          <Save className="size-4" /> Opslaan
        </Button>
      </DialogFooter>
    </>
  );
}

function unitLabel(unit: KpiTarget["unit"]): string {
  switch (unit) {
    case "percentage": return "%";
    case "rating": return "/ 5";
    case "hours": return "uur";
    case "count": return "max";
  }
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[8px] bg-[var(--color-surface-2)] p-2">
      <p className="text-[16px] font-semibold leading-tight">{value}</p>
      <p className="text-[10px] text-[var(--color-muted)]">{label}</p>
    </div>
  );
}
