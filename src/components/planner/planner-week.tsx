"use client";

import * as React from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { ChevronLeft, ChevronRight, Clock, MapPin, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientAvatar } from "@/components/user-pill";
import { UserAvatar } from "@/components/ui/avatar";
import { getUser } from "@/lib/mock/users";
import { eventsForCohort } from "@/lib/mock/notifications";
import {
  HOUR_SLOTS,
  isSameDay,
  isSameMonth,
  isToday,
  monthGridDays,
  weekDays,
  fullMonthLabel,
} from "@/lib/mock/planner";
import { cn } from "@/lib/utils";

const DAY_NAMES_SHORT = ["ma", "di", "wo", "do", "vr"];
const DAY_NAMES_MONTH = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

export type PlannerView = "week" | "month";

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
  view: PlannerView;
  onViewChange: (v: PlannerView) => void;
  onShift: (delta: number) => void;
  onToday: () => void;
  plannedSessions: PlannedSession[];
  onRemoveSession?: (id: string) => void;
  onOpenSession?: (id: string) => void;
  cohortId?: string;
  readOnly?: boolean;
}

export function PlannerWeek({
  refDate,
  view,
  onViewChange,
  onShift,
  onToday,
  plannedSessions,
  onRemoveSession,
  onOpenSession,
  cohortId,
  readOnly,
}: PlannerWeekProps) {
  const days = React.useMemo(() => weekDays(refDate), [refDate]);
  const monthDays = React.useMemo(() => monthGridDays(refDate), [refDate]);
  const cohortEvents = cohortId ? eventsForCohort(cohortId) : [];

  const headerLabel =
    view === "week"
      ? `${days[0].toLocaleDateString("nl-NL", { day: "numeric", month: "short" })} – ${days[4].toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}`
      : fullMonthLabel(refDate);

  return (
    <div className="flex h-full flex-col bg-[var(--color-bg)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2">
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon-sm" onClick={() => onShift(-1)} aria-label="Vorige">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="secondary" size="sm" onClick={onToday}>
            Vandaag
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onShift(1)} aria-label="Volgende">
            <ChevronRight className="size-4" />
          </Button>
          <p className="ml-2 text-[13.5px] font-semibold tracking-tight">{headerLabel}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 text-[10.5px] text-[var(--color-ink-3)] md:flex">
            <LegendDot color="bg-blue-500" label="1-op-1" />
            <LegendDot color="bg-[var(--color-ink)]" label="Groepssessie" />
          </div>
          <ViewToggle view={view} onChange={onViewChange} />
        </div>
      </div>

      {view === "week" ? (
        <WeekGrid
          days={days}
          plannedSessions={plannedSessions}
          cohortEvents={cohortEvents}
          onRemoveSession={readOnly ? undefined : onRemoveSession}
          onOpenSession={onOpenSession}
          readOnly={readOnly}
        />
      ) : (
        <MonthGrid
          days={monthDays}
          monthOf={refDate}
          plannedSessions={plannedSessions}
          cohortEvents={cohortEvents}
          onOpenSession={onOpenSession}
          readOnly={readOnly}
        />
      )}
    </div>
  );
}

function ViewToggle({ view, onChange }: { view: PlannerView; onChange: (v: PlannerView) => void }) {
  return (
    <div className="inline-flex items-center rounded-[8px] border border-[var(--color-border)] bg-[var(--color-surface)] p-0.5">
      {(["week", "month"] as PlannerView[]).map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={cn(
            "rounded-[6px] px-2.5 py-1 text-[11.5px] font-medium transition-colors",
            view === v
              ? "bg-[var(--color-ink)] text-white"
              : "text-[var(--color-ink-2)] hover:text-[var(--color-ink)]"
          )}
        >
          {v === "week" ? "Week" : "Maand"}
        </button>
      ))}
    </div>
  );
}

function WeekGrid({
  days,
  plannedSessions,
  cohortEvents,
  onRemoveSession,
  onOpenSession,
  readOnly,
}: {
  days: Date[];
  plannedSessions: PlannedSession[];
  cohortEvents: ReturnType<typeof eventsForCohort>;
  onRemoveSession?: (id: string) => void;
  onOpenSession?: (id: string) => void;
  readOnly?: boolean;
}) {
  return (
    <>
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
              {DAY_NAMES_SHORT[i]}
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

      <div className="flex-1 overflow-y-auto">
        <div className="grid" style={{ gridTemplateColumns: "60px repeat(5, 1fr)" }}>
          {HOUR_SLOTS.map((hour, hourIdx) => (
            <React.Fragment key={hour}>
              <div className="border-b border-r border-[var(--color-border)] px-1 py-1 text-right">
                <p className="text-[10px] font-medium text-[var(--color-muted)]">{hour}:00</p>
              </div>
              {days.map((day, dayIdx) => {
                const sessions = plannedSessions.filter(
                  (s) => s.day === day.toISOString().slice(0, 10) && s.hour === hour
                );
                const groupEvents = cohortEvents.filter((e) => {
                  const eDate = new Date(e.start);
                  return isSameDay(eDate, day) && eDate.getHours() === hour;
                });
                return (
                  <WeekCell
                    key={`${day.toISOString()}-${hour}`}
                    day={day}
                    hour={hour}
                    sessions={sessions}
                    groupEvents={groupEvents}
                    onRemoveSession={onRemoveSession}
                    onOpenSession={onOpenSession}
                    readOnly={readOnly}
                    isLastRow={hourIdx === HOUR_SLOTS.length - 1}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}

function WeekCell({
  day,
  hour,
  sessions,
  groupEvents,
  onRemoveSession,
  onOpenSession,
  readOnly,
  isLastRow,
}: {
  day: Date;
  hour: number;
  sessions: PlannedSession[];
  groupEvents: ReturnType<typeof eventsForCohort>;
  onRemoveSession?: (id: string) => void;
  onOpenSession?: (id: string) => void;
  readOnly?: boolean;
  isLastRow: boolean;
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

      <div className={cn("flex flex-col gap-1 p-1", groupEvents.length > 0 && "pt-8")}>
        {sessions.map((s) => (
          <SessionTile
            key={s.id}
            session={s}
            onRemove={readOnly ? undefined : onRemoveSession}
            onOpen={onOpenSession}
          />
        ))}
      </div>

      {isOver && sessions.length === 0 && groupEvents.length === 0 && (
        <div className="absolute inset-2 flex items-center justify-center rounded-[6px] border-2 border-dashed border-[var(--color-ink)] bg-white/60 text-[10.5px] font-medium text-[var(--color-ink)]">
          Drop hier
        </div>
      )}
    </div>
  );
}

function MonthGrid({
  days,
  monthOf,
  plannedSessions,
  cohortEvents,
  onOpenSession,
  readOnly,
}: {
  days: Date[];
  monthOf: Date;
  plannedSessions: PlannedSession[];
  cohortEvents: ReturnType<typeof eventsForCohort>;
  onOpenSession?: (id: string) => void;
  readOnly?: boolean;
}) {
  return (
    <>
      <div
        className="grid border-b border-[var(--color-border)] bg-[var(--color-surface)]"
        style={{ gridTemplateColumns: "repeat(7, 1fr)" }}
      >
        {DAY_NAMES_MONTH.map((d) => (
          <div key={d} className="border-l border-[var(--color-border)] px-2 py-1.5 text-center first:border-l-0">
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-muted)]">{d}</p>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div
          className="grid h-full"
          style={{ gridTemplateColumns: "repeat(7, 1fr)", gridAutoRows: "minmax(110px, 1fr)" }}
        >
          {days.map((day) => {
            const dayKey = day.toISOString().slice(0, 10);
            const sessions = plannedSessions.filter((s) => s.day === dayKey);
            const groupEvents = cohortEvents.filter((e) => isSameDay(new Date(e.start), day));
            return (
              <MonthCell
                key={dayKey}
                day={day}
                monthOf={monthOf}
                sessions={sessions}
                groupEvents={groupEvents}
                onOpenSession={onOpenSession}
                readOnly={readOnly}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

function MonthCell({
  day,
  monthOf,
  sessions,
  groupEvents,
  onOpenSession,
  readOnly,
}: {
  day: Date;
  monthOf: Date;
  sessions: PlannedSession[];
  groupEvents: ReturnType<typeof eventsForCohort>;
  onOpenSession?: (id: string) => void;
  readOnly?: boolean;
}) {
  const dayKey = day.toISOString().slice(0, 10);
  const dropId = `day:${dayKey}`;
  const { isOver, setNodeRef } = useDroppable({
    id: dropId,
    data: { kind: "slot", day: dayKey, hour: 14 }, // standaard 14:00 bij maand-drop
    disabled: readOnly,
  });

  const today = isToday(day);
  const inMonth = isSameMonth(day, monthOf);
  const visibleSessions = sessions.slice(0, 2);
  const remaining = sessions.length - visibleSessions.length;
  const showGroupEvent = groupEvents[0];

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative flex flex-col gap-1 border-b border-l border-[var(--color-border)] p-1.5 transition-colors",
        !inMonth && "bg-[var(--color-surface-2)]/30",
        today && "bg-[var(--color-accent-soft)]/20",
        isOver && "bg-[var(--color-accent)]/40 ring-2 ring-inset ring-[var(--color-ink)]"
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "inline-flex size-5 items-center justify-center rounded-full text-[11px] font-semibold",
            today && "bg-[var(--color-ink)] text-white",
            !today && !inMonth && "text-[var(--color-muted)]",
            !today && inMonth && "text-[var(--color-ink)]"
          )}
        >
          {day.getDate()}
        </span>
        {(sessions.length > 0 || groupEvents.length > 0) && (
          <span className="text-[9px] font-medium text-[var(--color-muted)]">
            {sessions.length + groupEvents.length}
          </span>
        )}
      </div>

      {showGroupEvent && (
        <div className="rounded-[4px] bg-[var(--color-ink)] px-1.5 py-0.5 text-[9.5px] font-medium text-white">
          <p className="flex items-center gap-1 truncate">
            <Sparkles className="size-2.5" /> {showGroupEvent.title}
          </p>
        </div>
      )}

      {visibleSessions.map((s) => (
        <MonthSessionPill key={s.id} session={s} onOpen={onOpenSession} />
      ))}

      {remaining > 0 && (
        <p className="mt-auto text-[9.5px] font-medium text-[var(--color-ink-3)]">
          +{remaining} meer
        </p>
      )}

      {isOver && (
        <div className="pointer-events-none absolute inset-1 flex items-center justify-center rounded-[6px] border-2 border-dashed border-[var(--color-ink)] bg-white/60 text-[10px] font-medium text-[var(--color-ink)]">
          Drop hier
        </div>
      )}
    </div>
  );
}

function MonthSessionPill({
  session,
  onOpen,
}: {
  session: PlannedSession;
  onOpen?: (id: string) => void;
}) {
  const ent = getUser(session.entrepreneurId);
  if (!ent) return null;
  return (
    <button
      type="button"
      onClick={() => onOpen?.(session.id)}
      className="flex items-center gap-1.5 rounded-[4px] border border-blue-200 bg-blue-50/80 px-1 py-0.5 text-left hover:border-blue-400 hover:shadow-sm"
    >
      <span
        className={cn(
          "flex size-3.5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[7px] font-bold text-white",
          ent.gradient ?? "from-zinc-400 to-zinc-600"
        )}
      >
        {ent.initials ?? ent.name[0]}
      </span>
      <span className="truncate text-[9.5px] font-medium text-[var(--color-ink)]">
        {session.hour}:00 {ent.name.split(" ")[0]}
      </span>
    </button>
  );
}

function SessionTile({
  session,
  onRemove,
  onOpen,
}: {
  session: PlannedSession;
  onRemove?: (id: string) => void;
  onOpen?: (id: string) => void;
}) {
  const ent = getUser(session.entrepreneurId);
  const coach = getUser(session.coachId);
  const downPosRef = React.useRef<{ x: number; y: number } | null>(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `session:${session.id}`,
    data: { kind: "session", sessionId: session.id },
    disabled: !onRemove, // read-only = niet versleepbaar
  });

  if (!ent) return null;

  const isProposal = session.source === "proposal";

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      data-session-id={session.id}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        opacity: isDragging ? 0.35 : 1,
        touchAction: "none",
      }}
      onMouseDown={(e) => {
        downPosRef.current = { x: e.clientX, y: e.clientY };
      }}
      onClick={(e) => {
        const start = downPosRef.current;
        downPosRef.current = null;
        if (start) {
          const dx = e.clientX - start.x;
          const dy = e.clientY - start.y;
          if (Math.hypot(dx, dy) >= 6) return;
        }
        onOpen?.(session.id);
      }}
      className={cn(
        "group relative cursor-grab rounded-[6px] border bg-white p-1.5 shadow-sm transition-all hover:shadow-md active:cursor-grabbing",
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
          onClick={(e) => {
            e.stopPropagation();
            onRemove(session.id);
          }}
          onMouseDown={(e) => e.stopPropagation()}
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
