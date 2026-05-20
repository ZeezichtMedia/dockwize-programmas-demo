"use client";

import * as React from "react";
import { useDroppable } from "@dnd-kit/core";
import { ChevronLeft, ChevronRight, Clock, MapPin, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GradientAvatar } from "@/components/user-pill";
import { UserAvatar } from "@/components/ui/avatar";
import { getUser } from "@/lib/mock/users";
import { eventsForCohort } from "@/lib/mock/notifications";
import { HOUR_SLOTS, isSameDay, isToday, weekDays } from "@/lib/mock/planner";
import { cn } from "@/lib/utils";

const DAY_NAMES = ["ma", "di", "wo", "do", "vr"];

export interface PlannedSession {
  id: string;
  entrepreneurId: string;
  coachId: string;
  day: string; // YYYY-MM-DD
  hour: number;
  durationMin: number;
  location?: string;
  reason?: string;
  source: "proposal" | "planner_drop";
}

interface PlannerWeekProps {
  refDate: Date;
  onShiftWeek: (delta: number) => void;
  onToday: () => void;
  plannedSessions: PlannedSession[];
  onRemoveSession?: (id: string) => void;
  cohortId?: string;
  readOnly?: boolean;
}

export function PlannerWeek({
  refDate,
  onShiftWeek,
  onToday,
  plannedSessions,
  onRemoveSession,
  cohortId,
  readOnly,
}: PlannerWeekProps) {
  const days = React.useMemo(() => weekDays(refDate), [refDate]);
  const cohortEvents = cohortId ? eventsForCohort(cohortId) : [];

  const weekStart = days[0];
  const weekEnd = days[4];
  const headerLabel = `${weekStart.toLocaleDateString("nl-NL", { day: "numeric", month: "short" })} – ${weekEnd.toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}`;

  return (
    <div className="flex h-full flex-col bg-[var(--color-bg)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2">
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon-sm" onClick={() => onShiftWeek(-1)} aria-label="Vorige week">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="secondary" size="sm" onClick={onToday}>
            Vandaag
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onShiftWeek(1)} aria-label="Volgende week">
            <ChevronRight className="size-4" />
          </Button>
          <p className="ml-2 text-[13.5px] font-semibold tracking-tight">{headerLabel}</p>
        </div>
        <div className="flex items-center gap-3 text-[10.5px] text-[var(--color-ink-3)]">
          <LegendDot color="bg-blue-500" label="1-op-1" />
          <LegendDot color="bg-[var(--color-ink)]" label="Groepssessie" />
          <LegendDot color="bg-red-500" label="Deadline" />
        </div>
      </div>

      {/* Day headers */}
      <div className="grid border-b border-[var(--color-border)] bg-[var(--color-surface)]" style={{ gridTemplateColumns: "60px repeat(5, 1fr)" }}>
        <div />
        {days.map((d, i) => (
          <div
            key={d.toISOString()}
            className={cn(
              "border-l border-[var(--color-border)] px-2.5 py-2 text-center",
              isToday(d) && "bg-[var(--color-accent-soft)]/40"
            )}
          >
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
              {DAY_NAMES[i]}
            </p>
            <p className={cn("text-[18px] font-semibold leading-none", isToday(d) && "text-[var(--color-ink)]")}>
              {d.getDate()}
            </p>
            <p className="mt-0.5 text-[10px] text-[var(--color-ink-3)]">
              {d.toLocaleDateString("nl-NL", { month: "short" })}
            </p>
          </div>
        ))}
      </div>

      {/* Grid body */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid" style={{ gridTemplateColumns: "60px repeat(5, 1fr)" }}>
          {HOUR_SLOTS.map((hour, hourIdx) => (
            <React.Fragment key={hour}>
              <div className="border-b border-r border-[var(--color-border)] px-1 py-1 text-right">
                <p className="text-[10px] font-medium text-[var(--color-muted)]">{hour}:00</p>
              </div>
              {days.map((day, dayIdx) => {
                const sessions = plannedSessions.filter(
                  (s) =>
                    s.day === day.toISOString().slice(0, 10) && s.hour === hour
                );
                const groupEvents = cohortEvents.filter((e) => {
                  const eDate = new Date(e.start);
                  return isSameDay(eDate, day) && eDate.getHours() === hour;
                });
                return (
                  <PlannerCell
                    key={`${day.toISOString()}-${hour}`}
                    day={day}
                    hour={hour}
                    sessions={sessions}
                    groupEvents={groupEvents}
                    onRemoveSession={onRemoveSession}
                    readOnly={readOnly}
                    isLastRow={hourIdx === HOUR_SLOTS.length - 1}
                    isLastCol={dayIdx === days.length - 1}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlannerCell({
  day,
  hour,
  sessions,
  groupEvents,
  onRemoveSession,
  readOnly,
  isLastRow,
  isLastCol,
}: {
  day: Date;
  hour: number;
  sessions: PlannedSession[];
  groupEvents: ReturnType<typeof eventsForCohort>;
  onRemoveSession?: (id: string) => void;
  readOnly?: boolean;
  isLastRow: boolean;
  isLastCol: boolean;
}) {
  const dayKey = day.toISOString().slice(0, 10);
  const dropId = `slot:${dayKey}:${hour}`;
  const { isOver, setNodeRef } = useDroppable({
    id: dropId,
    data: { kind: "slot", day: dayKey, hour },
    disabled: readOnly,
  });

  const today = isToday(day);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative min-h-[64px] border-l border-[var(--color-border)] transition-colors",
        !isLastRow && "border-b",
        today && "bg-[var(--color-accent-soft)]/15",
        isOver && "bg-[var(--color-accent)]/40 ring-2 ring-inset ring-[var(--color-ink)]"
      )}
    >
      {/* Group events first (immovable) */}
      {groupEvents.map((ev) => (
        <div
          key={ev.id}
          className="absolute inset-x-1 top-1 rounded-[6px] bg-[var(--color-ink)] px-1.5 py-1 text-[10px] text-white shadow-sm"
        >
          <p className="flex items-center gap-1 truncate font-semibold">
            <Sparkles className="size-2.5" />
            {ev.title}
          </p>
          {ev.location && (
            <p className="mt-0.5 flex items-center gap-1 truncate text-[9px] text-white/70">
              <MapPin className="size-2.5" /> {ev.location}
            </p>
          )}
        </div>
      ))}

      {/* Planned 1-on-1's */}
      <div className={cn("flex flex-col gap-1 p-1", groupEvents.length > 0 && "pt-8")}>
        {sessions.map((s) => (
          <SessionTile key={s.id} session={s} onRemove={readOnly ? undefined : onRemoveSession} />
        ))}
      </div>

      {/* Empty hint when isOver */}
      {isOver && sessions.length === 0 && groupEvents.length === 0 && (
        <div className="absolute inset-2 flex items-center justify-center rounded-[6px] border-2 border-dashed border-[var(--color-ink)] bg-white/60 text-[10.5px] font-medium text-[var(--color-ink)]">
          Drop hier
        </div>
      )}
    </div>
  );
}

function SessionTile({
  session,
  onRemove,
}: {
  session: PlannedSession;
  onRemove?: (id: string) => void;
}) {
  const ent = getUser(session.entrepreneurId);
  const coach = getUser(session.coachId);
  if (!ent) return null;

  const isProposal = session.source === "proposal";

  return (
    <div
      className={cn(
        "group relative rounded-[6px] border bg-white p-1.5 shadow-sm transition-all hover:shadow-md",
        isProposal
          ? "border-blue-300 bg-blue-50/80"
          : "border-[var(--color-accent)] bg-[var(--color-accent-soft)]/50"
      )}
    >
      <div className="flex items-center gap-1.5">
        <GradientAvatar
          initials={ent.initials ?? ent.name[0]}
          gradient={ent.gradient ?? "from-zinc-400 to-zinc-600"}
          size="sm"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-semibold">{ent.name.split(" ")[0]}</p>
          <div className="flex items-center gap-1 text-[9px] text-[var(--color-ink-3)]">
            <Clock className="size-2" />
            {session.hour}:00 · {session.durationMin}m
          </div>
        </div>
        {coach && <UserAvatar src={coach.avatar} name={coach.name} size="xs" />}
      </div>
      {onRemove && (
        <button
          onClick={() => onRemove(session.id)}
          className="absolute -right-1 -top-1 hidden size-4 items-center justify-center rounded-full bg-[var(--color-ink)] text-white shadow-md group-hover:flex"
          aria-label="Verwijder"
        >
          <X className="size-2.5" />
        </button>
      )}
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className={cn("size-1.5 rounded-full", color)} />
      {label}
    </span>
  );
}
