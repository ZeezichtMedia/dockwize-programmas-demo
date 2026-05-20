"use client";

import * as React from "react";
import { ArrowRight, Check, Compass, Lightbulb, Rocket, Sprout, Target, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  lifePhases,
  phaseToneClass,
  type LifePhaseId,
} from "@/lib/mock/lifephases";
import { cn } from "@/lib/utils";

const phaseIcons: Record<LifePhaseId, React.ComponentType<{ className?: string }>> = {
  idee: Lightbulb,
  validatie: Compass,
  mvp: Sprout,
  eerste_klanten: Target,
  opschaling: Users,
  groei: Rocket,
};

interface LifePhaseTrackProps {
  current: LifePhaseId;
  signals?: string[];
  nextStep?: string;
  entrepreneurName?: string;
  compact?: boolean;
}

/**
 * Toont de levensfase-stairs van Dockwize. Compact = horizontale strip
 * met alleen punten. Full = punten + tekst + signalen + volgende stap.
 */
export function LifePhaseTrack({ current, signals, nextStep, entrepreneurName, compact }: LifePhaseTrackProps) {
  const currentIdx = lifePhases.findIndex((p) => p.id === current);
  const currentPhase = lifePhases[currentIdx];
  const nextPhase = lifePhases[currentIdx + 1];
  const tone = phaseToneClass[currentPhase.tone];

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {lifePhases.map((p, i) => {
          const reached = i <= currentIdx;
          const isCurrent = i === currentIdx;
          const t = phaseToneClass[p.tone];
          const Icon = phaseIcons[p.id];
          return (
            <React.Fragment key={p.id}>
              <div
                className={cn(
                  "flex size-6 items-center justify-center rounded-full transition-all",
                  isCurrent ? `${t.bg} ${t.text} ring-2 ring-offset-1 ${t.ring}` : reached ? `${t.bg} ${t.text}` : "bg-[var(--color-surface-2)] text-[var(--color-muted)]"
                )}
                title={p.label}
              >
                {reached && !isCurrent ? <Check className="size-3" strokeWidth={3} /> : <Icon className="size-3" />}
              </div>
              {i < lifePhases.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 transition-colors",
                    reached && i < currentIdx ? "bg-[var(--color-ink)]" : "bg-[var(--color-border)]"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
            <Compass className="size-3" /> Levensfase van {entrepreneurName ?? "de ondernemer"}
          </p>
          <p className="mt-1 text-[16px] font-semibold tracking-tight">{currentPhase.label}</p>
          <p className="mt-0.5 text-[12.5px] text-[var(--color-ink-3)]">{currentPhase.description}</p>
        </div>
        <Badge variant="default" className={cn("shrink-0 border", tone.bg, tone.text)}>
          Fase {currentIdx + 1} van {lifePhases.length}
        </Badge>
      </div>

      {/* Stairs / progress */}
      <div className="mb-5 flex items-center gap-1">
        {lifePhases.map((p, i) => {
          const reached = i <= currentIdx;
          const isCurrent = i === currentIdx;
          const t = phaseToneClass[p.tone];
          const Icon = phaseIcons[p.id];
          return (
            <React.Fragment key={p.id}>
              <div className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full transition-all",
                    isCurrent
                      ? `${t.bg} ${t.text} ring-4 ${t.ring} shadow-[var(--shadow-md)]`
                      : reached
                      ? `${t.bg} ${t.text}`
                      : "bg-[var(--color-surface-2)] text-[var(--color-muted)]"
                  )}
                  title={p.label}
                >
                  {reached && !isCurrent ? (
                    <Check className="size-4" strokeWidth={3} />
                  ) : (
                    <Icon className="size-4" />
                  )}
                </div>
                <p
                  className={cn(
                    "text-center text-[10.5px] font-medium",
                    isCurrent ? "text-[var(--color-ink)]" : reached ? "text-[var(--color-ink-2)]" : "text-[var(--color-muted)]"
                  )}
                >
                  {p.shortLabel}
                </p>
              </div>
              {i < lifePhases.length - 1 && (
                <div className="-mt-5 h-0.5 flex-1">
                  <div
                    className={cn(
                      "h-full transition-colors",
                      i < currentIdx ? "bg-[var(--color-ink)]" : "bg-[var(--color-border)]"
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Signals + next step */}
      <div className="grid gap-3 sm:grid-cols-2">
        {signals && signals.length > 0 && (
          <div className="rounded-[10px] border border-[var(--color-border)] p-3">
            <p className="mb-1.5 flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
              <Check className="size-3" /> Signalen op dit niveau
            </p>
            <ul className="space-y-1">
              {signals.map((s, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[12px] text-[var(--color-ink-2)]">
                  <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", tone.dot)} />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {nextStep && (
          <div className="rounded-[10px] border border-[var(--color-border)] bg-[var(--color-accent-soft)]/40 p-3">
            <p className="mb-1.5 flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-ink-2)]">
              <ArrowRight className="size-3" /> Volgende stap
              {nextPhase && (
                <Badge variant="default" className="ml-auto text-[9.5px]">
                  Naar {nextPhase.shortLabel}
                </Badge>
              )}
            </p>
            <p className="text-[12.5px] leading-relaxed text-[var(--color-ink-2)]">{nextStep}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
