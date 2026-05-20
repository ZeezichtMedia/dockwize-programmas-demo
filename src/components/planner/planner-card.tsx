"use client";

import * as React from "react";
import { useDraggable } from "@dnd-kit/core";
import type { CSSProperties } from "react";
import { GradientAvatar } from "@/components/user-pill";
import { UserAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getUser } from "@/lib/mock/users";
import { plannerStatusTone } from "@/lib/mock/planner";
import type { PlannerEntrepreneur } from "@/lib/mock/planner";
import { cn } from "@/lib/utils";

interface PlannerCardProps {
  entrepreneur: PlannerEntrepreneur;
  selected?: boolean;
  onSelectToggle?: (id: string) => void;
  onSelectRange?: (id: string) => void;
  onOpenDetail?: (id: string) => void;
  disabled?: boolean;
  compact?: boolean;
}

export function PlannerCard({
  entrepreneur,
  selected,
  onSelectToggle,
  onSelectRange,
  onOpenDetail,
  disabled,
  compact = false,
}: PlannerCardProps) {
  const { user, status, reason } = entrepreneur;
  const coach = user.coachId ? getUser(user.coachId) : null;
  const tone = plannerStatusTone[status];

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `entrepreneur:${user.id}`,
    data: { kind: "entrepreneur", entrepreneurId: user.id, selectedIds: selected ? "multi" : "single" },
    disabled,
  });

  const downPosRef = React.useRef<{ x: number; y: number } | null>(null);

  const style: CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.35 : 1,
    cursor: disabled ? "default" : isDragging ? "grabbing" : "grab",
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      data-planner-card={user.id}
      data-selected={selected ? "true" : "false"}
      onMouseDown={(e) => {
        downPosRef.current = { x: e.clientX, y: e.clientY };
      }}
      onClick={(e) => {
        const start = downPosRef.current;
        downPosRef.current = null;
        if (start) {
          const dx = e.clientX - start.x;
          const dy = e.clientY - start.y;
          if (Math.hypot(dx, dy) >= 6) return; // was een drag, niet een klik
        }
        if ((e.metaKey || e.ctrlKey) && onSelectToggle) {
          e.preventDefault();
          onSelectToggle(user.id);
          return;
        }
        if (e.shiftKey && (onSelectRange ?? onSelectToggle)) {
          e.preventDefault();
          (onSelectRange ?? onSelectToggle)?.(user.id);
          return;
        }
        // Plain click: open detail-modal (heeft voorrang op selectie)
        if (onOpenDetail) {
          e.preventDefault();
          onOpenDetail(user.id);
          return;
        }
        // Fallback: toggle als select-mode actief is
        if (onSelectToggle && selected !== undefined) {
          onSelectToggle(user.id);
        }
      }}
      className={cn(
        "group relative select-none rounded-[10px] border bg-[var(--color-surface)] p-2.5 transition-all hover:shadow-[var(--shadow-sm)]",
        selected
          ? "border-[var(--color-ink)] ring-2 ring-[var(--color-accent)] shadow-[var(--shadow-md)]"
          : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]",
        compact && "p-2"
      )}
      role="button"
      tabIndex={0}
      aria-selected={selected}
      aria-label={`${user.name}, ${reason}`}
    >
      {selected && (
        <div className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-[var(--color-accent)] ring-2 ring-[var(--color-surface)]">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-ink)]">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}
      <div className="flex items-start gap-2.5">
        <GradientAvatar
          initials={user.initials ?? user.name[0]}
          gradient={user.gradient ?? "from-zinc-400 to-zinc-600"}
          size={compact ? "sm" : "md"}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-[12.5px] font-semibold leading-tight">{user.name}</p>
            <span className={cn("size-1.5 shrink-0 rounded-full", tone.dot)} title={reason} />
          </div>
          <p className="truncate text-[10.5px] text-[var(--color-ink-3)]">{user.company}</p>
          {!compact && coach && (
            <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[var(--color-muted)]">
              <UserAvatar src={coach.avatar} name={coach.name} size="xs" />
              <span className="truncate">{coach.name.split(" ")[0]}</span>
            </div>
          )}
        </div>
      </div>
      {!compact && (
        <p className={cn("mt-1.5 line-clamp-1 text-[10.5px]", tone.text)} title={reason}>
          {reason}
        </p>
      )}
    </div>
  );
}

/**
 * Drag-overlay variant. Geen draggable, geen handlers — alleen visueel.
 */
export function PlannerCardOverlay({ entrepreneurs }: { entrepreneurs: PlannerEntrepreneur[] }) {
  if (entrepreneurs.length === 0) return null;
  const first = entrepreneurs[0];
  return (
    <div className="pointer-events-none relative rounded-[12px] border-2 border-[var(--color-ink)] bg-[var(--color-surface)] p-3 shadow-[var(--shadow-xl)]" style={{ width: 240 }}>
      <div className="flex items-center gap-2.5">
        <GradientAvatar
          initials={first.user.initials ?? first.user.name[0]}
          gradient={first.user.gradient ?? "from-zinc-400 to-zinc-600"}
          size="md"
        />
        <div className="min-w-0">
          <p className="truncate text-[12.5px] font-semibold">{first.user.name}</p>
          <p className="truncate text-[10.5px] text-[var(--color-ink-3)]">{first.user.company}</p>
        </div>
      </div>
      {entrepreneurs.length > 1 && (
        <div className="mt-2 flex items-center justify-between border-t border-[var(--color-border)] pt-1.5">
          <Badge variant="dark" className="text-[10px]">
            +{entrepreneurs.length - 1} meer
          </Badge>
          <span className="text-[10.5px] text-[var(--color-muted)]">batch-planning</span>
        </div>
      )}
    </div>
  );
}
