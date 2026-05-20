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
import { PlannerWeek, type PlannedSession, type PlannerView } from "./planner-week";
import { PlannerCardOverlay } from "./planner-card";
import { EntrepreneurDetailModal } from "./entrepreneur-detail-modal";
import { SessionDetailModal } from "./session-detail-modal";
import { QuickPlanDialog } from "@/components/quick-plan-dialog";
import { useUser } from "@/lib/auth-context";
import {
  plannerEntrepreneursFor,
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

  const [view, setView] = React.useState<PlannerView>("week");
  const [refDate, setRefDate] = React.useState<Date>(new Date("2026-05-11"));
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [activeDrag, setActiveDrag] = React.useState<string | null>(null);
  const [plannedSessions, setPlannedSessions] = React.useState<PlannedSession[]>(() =>
    seedFromProposals(user.id, user.role)
  );
  const [confirmToast, setConfirmToast] = React.useState<string | null>(null);
  const [detailEntrepreneurId, setDetailEntrepreneurId] = React.useState<string | null>(null);
  const [detailSessionId, setDetailSessionId] = React.useState<string | null>(null);
  const [planDialogFor, setPlanDialogFor] = React.useState<string | null>(null);
  const shellRef = React.useRef<HTMLDivElement>(null);
  const [marquee, setMarquee] = React.useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    additive: boolean;
    initialSelection: Set<string>;
  } | null>(null);

  React.useEffect(() => {
    setPlannedSessions(seedFromProposals(user.id, user.role));
    setSelectedIds(new Set());
  }, [user.id, user.role]);

  // Marquee-rechthoek-selectie. Werkt vanaf de shell-root, behalve op
  // interactieve elementen (kaart, knop, link, modal). Cmd/shift/ctrl =
  // additief; anders vervangt de selectie.
  React.useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    function isInteractive(target: HTMLElement | null): boolean {
      if (!target) return true;
      if (target.closest("[data-planner-card]")) return true;
      if (target.closest("button")) return true;
      if (target.closest("a")) return true;
      if (target.closest("input, textarea, select")) return true;
      if (target.closest('[role="dialog"]')) return true;
      return false;
    }

    let startX = 0;
    let startY = 0;
    let initial = new Set<string>();

    function onMouseDown(e: MouseEvent) {
      if (e.button !== 0) return;
      if (isInteractive(e.target as HTMLElement)) return;
      e.preventDefault();
      const additive = e.shiftKey || e.metaKey || e.ctrlKey;
      initial = additive ? new Set(selectedIds) : new Set();
      if (!additive) setSelectedIds(new Set());
      startX = e.clientX;
      startY = e.clientY;
      setMarquee({
        startX,
        startY,
        currentX: e.clientX,
        currentY: e.clientY,
        additive,
        initialSelection: initial,
      });
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    }

    function onMove(ev: MouseEvent) {
      setMarquee((prev) => (prev ? { ...prev, currentX: ev.clientX, currentY: ev.clientY } : prev));
      const cards = shell!.querySelectorAll<HTMLElement>("[data-planner-card]");
      const rect = {
        left: Math.min(ev.clientX, startX),
        top: Math.min(ev.clientY, startY),
        right: Math.max(ev.clientX, startX),
        bottom: Math.max(ev.clientY, startY),
      };
      const hits: string[] = [];
      cards.forEach((el) => {
        const id = el.getAttribute("data-planner-card");
        if (!id) return;
        const r = el.getBoundingClientRect();
        if (r.right >= rect.left && r.left <= rect.right && r.bottom >= rect.top && r.top <= rect.bottom) {
          hits.push(id);
        }
      });
      const next = new Set<string>(initial);
      for (const h of hits) next.add(h);
      setSelectedIds(next);
    }

    function onUp() {
      setMarquee(null);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    }

    shell.addEventListener("mousedown", onMouseDown);
    return () => {
      shell.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  );

  const cohortId = user.cohortId ?? "c_jp7";
  const readOnly = user.role === "entrepreneur" || user.role === "super_admin";

  const onSelectToggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onSelectRange = (id: string) => {
    setSelectedIds((prev) => new Set([...prev, id]));
  };

  const onClearSelection = () => setSelectedIds(new Set());

  const handleDragStart = (e: DragStartEvent) => {
    setActiveDrag(String(e.active.id));
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveDrag(null);
    if (!e.over) return;
    const overData = e.over.data.current as { kind: "slot"; day: string; hour: number } | undefined;
    if (!overData || overData.kind !== "slot") return;

    const activeId = String(e.active.id);

    // Case 1: existing session being moved
    if (activeId.startsWith("session:")) {
      const sessionId = activeId.replace("session:", "");
      setPlannedSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, day: overData.day, hour: overData.hour } : s))
      );
      const moved = plannedSessions.find((s) => s.id === sessionId);
      if (moved) {
        setConfirmToast(`Verplaatst naar ${overData.day} ${overData.hour}:00`);
        setTimeout(() => setConfirmToast(null), 2400);
      }
      return;
    }

    // Case 2: new entrepreneur card dropped
    const draggedEntId = activeId.replace("entrepreneur:", "");
    const idsToPlace = selectedIds.has(draggedEntId)
      ? Array.from(selectedIds)
      : [draggedEntId];

    const newSessions: PlannedSession[] = [];
    idsToPlace.forEach((entId, idx) => {
      const entrepreneur = allEntrepreneurs.find((e) => e.user.id === entId);
      if (!entrepreneur) return;
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

  const shift = (delta: number) => {
    setRefDate((prev) => {
      const next = new Date(prev);
      if (view === "week") next.setDate(prev.getDate() + delta * 7);
      else next.setMonth(prev.getMonth() + delta);
      return next;
    });
  };

  const jumpToToday = () => setRefDate(new Date("2026-05-08"));

  const activeEntrepreneur = activeDrag
    ? allEntrepreneurs.find((e) => `entrepreneur:${e.user.id}` === activeDrag)
    : undefined;

  const dragOverlayItems: PlannerEntrepreneur[] = [];
  if (activeEntrepreneur) {
    if (selectedIds.has(activeEntrepreneur.user.id)) {
      selectedIds.forEach((id) => {
        const e = allEntrepreneurs.find((x) => x.user.id === id);
        if (e) dragOverlayItems.push(e);
      });
    } else {
      dragOverlayItems.push(activeEntrepreneur);
    }
  }

  const detailEntrepreneur = detailEntrepreneurId
    ? allEntrepreneurs.find((e) => e.user.id === detailEntrepreneurId) ?? null
    : null;
  const detailSession = detailSessionId
    ? plannedSessions.find((s) => s.id === detailSessionId) ?? null
    : null;

  if (allEntrepreneurs.length === 0) {
    return (
      <PlannerWeek
        refDate={refDate}
        view={view}
        onViewChange={setView}
        onShift={shift}
        onToday={jumpToToday}
        plannedSessions={plannedSessions}
        onOpenSession={setDetailSessionId}
        cohortId={cohortId}
        readOnly
      />
    );
  }

  const marqueeStyle = marquee
    ? {
        position: "fixed" as const,
        left: Math.min(marquee.startX, marquee.currentX),
        top: Math.min(marquee.startY, marquee.currentY),
        width: Math.abs(marquee.currentX - marquee.startX),
        height: Math.abs(marquee.currentY - marquee.startY),
        pointerEvents: "none" as const,
        zIndex: 100,
      }
    : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div ref={shellRef} className="relative flex h-full overflow-hidden">
        <PlannerBacklog
          entrepreneurs={allEntrepreneurs}
          selectedIds={selectedIds}
          onSelectToggle={onSelectToggle}
          onSelectRange={onSelectRange}
          onClearSelection={onClearSelection}
          onOpenEntrepreneur={setDetailEntrepreneurId}
        />
        <div className="flex-1 overflow-hidden">
          <PlannerWeek
            refDate={refDate}
            view={view}
            onViewChange={setView}
            onShift={shift}
            onToday={jumpToToday}
            plannedSessions={plannedSessions}
            onRemoveSession={onRemoveSession}
            onOpenSession={setDetailSessionId}
            cohortId={cohortId}
            readOnly={readOnly}
          />
        </div>
      </div>

      {marqueeStyle && (
        <div
          style={marqueeStyle}
          className="rounded-[6px] border-2 border-[var(--color-ink)] bg-[var(--color-accent)]/15"
        />
      )}

      <DragOverlay dropAnimation={null}>
        {dragOverlayItems.length > 0 && <PlannerCardOverlay entrepreneurs={dragOverlayItems} />}
      </DragOverlay>

      <EntrepreneurDetailModal
        open={!!detailEntrepreneur}
        onOpenChange={(o) => !o && setDetailEntrepreneurId(null)}
        entrepreneur={detailEntrepreneur}
        onPlan={!readOnly ? (id) => {
          setDetailEntrepreneurId(null);
          setPlanDialogFor(id);
        } : undefined}
      />

      <SessionDetailModal
        open={!!detailSession}
        onOpenChange={(o) => !o && setDetailSessionId(null)}
        session={detailSession}
        onRemove={readOnly ? undefined : (id) => {
          onRemoveSession(id);
          setDetailSessionId(null);
        }}
      />

      {planDialogFor && (
        <QuickPlanDialog
          open={!!planDialogFor}
          onOpenChange={(o) => !o && setPlanDialogFor(null)}
          availableEntrepreneurs={allEntrepreneurs.map((e) => e.user)}
          defaultEntrepreneurId={planDialogFor}
        />
      )}

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
  return accepted
    .filter((p) => {
      if (role === "entrepreneur") return p.entrepreneurId === viewerId;
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
