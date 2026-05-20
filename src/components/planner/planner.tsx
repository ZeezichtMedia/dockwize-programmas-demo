"use client";

import * as React from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { PlannerBacklog } from "./planner-backlog";
import { PlannerWeek, type PlannedSession } from "./planner-week";
import { PlannerCardOverlay } from "./planner-card";
import { useUser } from "@/lib/auth-context";
import {
  plannerEntrepreneursFor,
  isSameDay,
  HOUR_SLOTS,
} from "@/lib/mock/planner";
import { sessionProposals } from "@/lib/mock/sessions";
import type { PlannerEntrepreneur } from "@/lib/mock/planner";

export function Planner() {
  const user = useUser();
  const allEntrepreneurs = React.useMemo(
    () => plannerEntrepreneursFor(user.id),
    [user.id]
  );

  const [refDate, setRefDate] = React.useState<Date>(new Date("2026-05-11")); // maandag 11 mei
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [activeDrag, setActiveDrag] = React.useState<string | null>(null);
  const [plannedSessions, setPlannedSessions] = React.useState<PlannedSession[]>(() =>
    seedFromProposals(user.id, user.role)
  );
  const [confirmToast, setConfirmToast] = React.useState<string | null>(null);

  // Re-seed wanneer user wisselt
  React.useEffect(() => {
    setPlannedSessions(seedFromProposals(user.id, user.role));
    setSelectedIds(new Set());
  }, [user.id, user.role]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  );

  const cohortId = user.cohortId ?? "c_jp7";
  const readOnly = user.role === "entrepreneur" || user.role === "super_admin";

  // ─── Selection ────────────────────────────────────────────────────────
  const onSelectToggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onSelectRange = (id: string) => {
    // Simpel: voeg toe (zelfde gedrag als toggle additive)
    setSelectedIds((prev) => new Set([...prev, id]));
  };

  const onClearSelection = () => setSelectedIds(new Set());

  // ─── Drag-drop ────────────────────────────────────────────────────────
  const handleDragStart = (e: DragStartEvent) => {
    setActiveDrag(String(e.active.id));
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveDrag(null);
    if (!e.over) return;
    const overData = e.over.data.current as { kind: "slot"; day: string; hour: number } | undefined;
    if (!overData || overData.kind !== "slot") return;

    const activeId = String(e.active.id);
    const draggedEntId = activeId.replace("entrepreneur:", "");

    // Bepaal alle ondernemers in de drop: selected (als de gedragen er onderdeel van is) of alleen de gedragen
    const idsToPlace = selectedIds.has(draggedEntId)
      ? Array.from(selectedIds)
      : [draggedEntId];

    const newSessions: PlannedSession[] = [];
    idsToPlace.forEach((entId, idx) => {
      const entrepreneur = allEntrepreneurs.find((e) => e.user.id === entId);
      if (!entrepreneur) return;
      // Spreiden over opeenvolgende uren als meerdere
      const hour = Math.min(overData.hour + idx, HOUR_SLOTS[HOUR_SLOTS.length - 1]);
      newSessions.push({
        id: `planned_${Date.now()}_${entId}`,
        entrepreneurId: entId,
        coachId: entrepreneur.user.coachId ?? "u_hans",
        day: overData.day,
        hour,
        durationMin: 45,
        location: "Online (Teams-link volgt)",
        reason: "Drag-and-drop ingepland",
        source: "planner_drop",
      });
    });

    setPlannedSessions((prev) => [...prev, ...newSessions]);
    setSelectedIds(new Set());
    setConfirmToast(
      newSessions.length === 1
        ? `1-op-1 met ${getEntrepreneurFirstName(allEntrepreneurs, newSessions[0].entrepreneurId)} ingepland.`
        : `${newSessions.length} 1-op-1's ingepland.`
    );
    setTimeout(() => setConfirmToast(null), 2400);
  };

  const onRemoveSession = (id: string) => {
    setPlannedSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const shiftWeek = (delta: number) => {
    setRefDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + delta * 7);
      return next;
    });
  };

  const jumpToToday = () => setRefDate(new Date("2026-05-08"));

  const activeEntrepreneur = activeDrag
    ? allEntrepreneurs.find((e) => `entrepreneur:${e.user.id}` === activeDrag)
    : undefined;

  // De groep die in de drag-overlay verschijnt: huidige drag + selectie
  const dragOverlayItems: PlannerEntrepreneur[] = [];
  if (activeEntrepreneur) {
    if (selectedIds.has(activeEntrepreneur.user.id)) {
      // Alle geselecteerden tonen
      selectedIds.forEach((id) => {
        const e = allEntrepreneurs.find((x) => x.user.id === id);
        if (e) dragOverlayItems.push(e);
      });
    } else {
      dragOverlayItems.push(activeEntrepreneur);
    }
  }

  if (allEntrepreneurs.length === 0) {
    // Read-only view voor ondernemer
    return (
      <PlannerWeek
        refDate={refDate}
        onShiftWeek={shiftWeek}
        onToday={jumpToToday}
        plannedSessions={plannedSessions}
        cohortId={cohortId}
        readOnly
      />
    );
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-full overflow-hidden">
        <PlannerBacklog
          entrepreneurs={allEntrepreneurs}
          selectedIds={selectedIds}
          onSelectToggle={onSelectToggle}
          onSelectRange={onSelectRange}
          onClearSelection={onClearSelection}
        />
        <div className="flex-1 overflow-hidden">
          <PlannerWeek
            refDate={refDate}
            onShiftWeek={shiftWeek}
            onToday={jumpToToday}
            plannedSessions={plannedSessions}
            onRemoveSession={onRemoveSession}
            cohortId={cohortId}
            readOnly={readOnly}
          />
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {dragOverlayItems.length > 0 && <PlannerCardOverlay entrepreneurs={dragOverlayItems} />}
      </DragOverlay>

      {/* Toast */}
      <AnimatePresence>
        {confirmToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[var(--color-ink)] px-4 py-2 text-[12.5px] font-medium text-white shadow-[var(--shadow-xl)]"
          >
            <div className="flex size-5 items-center justify-center rounded-full bg-[var(--color-accent)]">
              <Check className="size-3 text-[var(--color-ink)]" strokeWidth={3.5} />
            </div>
            {confirmToast}
          </motion.div>
        )}
      </AnimatePresence>
    </DndContext>
  );
}

function seedFromProposals(viewerId: string, role: string): PlannedSession[] {
  const accepted = sessionProposals.filter((p) => p.status === "accepted" && p.acceptedSlot);
  // Voor demo: laat alle accepted sessies zien voor admin/manager/coach.
  // Voor ondernemer: alleen eigen.
  return accepted
    .filter((p) => {
      if (role === "entrepreneur") return p.entrepreneurId === viewerId;
      if (role === "coach") {
        // Eigen + waarneming. Voor demo: gewoon alle accepted laten zien
        return true;
      }
      return true;
    })
    .map((p) => {
      const d = new Date(p.acceptedSlot!);
      return {
        id: `seed_${p.id}`,
        entrepreneurId: p.entrepreneurId,
        coachId: p.coachId,
        day: d.toISOString().slice(0, 10),
        hour: d.getHours(),
        durationMin: p.durationMin,
        location: p.location,
        reason: p.reason,
        source: "proposal" as const,
      };
    });
}

function getEntrepreneurFirstName(list: PlannerEntrepreneur[], id: string): string {
  return list.find((e) => e.user.id === id)?.user.name.split(" ")[0] ?? "ondernemer";
}
