"use client";

import * as React from "react";
import { ChevronDown, ChevronRight, Search, Users, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlannerCard } from "./planner-card";
import { MultiFilter } from "./multi-filter";
import {
  statusGrouping,
  ALL_PLANNER_STATUSES,
  plannerStatusLabel,
  plannerStatusTone,
} from "@/lib/mock/planner";
import { coaches } from "@/lib/mock/users";
import { programs, cohorts } from "@/lib/mock/programs";
import type { PlannerEntrepreneur, PlannerStatus } from "@/lib/mock/planner";
import { cn } from "@/lib/utils";

interface PlannerBacklogProps {
  entrepreneurs: PlannerEntrepreneur[];
  selectedIds: Set<string>;
  onSelectToggle: (id: string) => void;
  onSelectRange: (id: string) => void;
  onClearSelection: () => void;
  onOpenEntrepreneur?: (id: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function PlannerBacklog({
  entrepreneurs,
  selectedIds,
  onSelectToggle,
  onSelectRange,
  onClearSelection,
  onOpenEntrepreneur,
  collapsed,
  onToggleCollapse,
}: PlannerBacklogProps) {
  const [search, setSearch] = React.useState("");
  const [filterCoaches, setFilterCoaches] = React.useState<Set<string>>(new Set(coaches.map((c) => c.id)));
  const [filterPrograms, setFilterPrograms] = React.useState<Set<string>>(new Set(programs.map((p) => p.id)));
  const [filterStatuses, setFilterStatuses] = React.useState<Set<PlannerStatus>>(new Set(ALL_PLANNER_STATUSES));

  const [expandedGroups, setExpandedGroups] = React.useState<Set<PlannerStatus>>(
    new Set(["submitted_waiting", "inactive", "needs_planning", "fresh"])
  );

  // Counts per filter-categorie (voor display in dropdown meta)
  const coachCounts = React.useMemo(() => {
    const map = new Map<string, number>();
    entrepreneurs.forEach((e) => {
      if (e.user.coachId) {
        map.set(e.user.coachId, (map.get(e.user.coachId) ?? 0) + 1);
      }
    });
    return map;
  }, [entrepreneurs]);

  const programCounts = React.useMemo(() => {
    const map = new Map<string, number>();
    entrepreneurs.forEach((e) => {
      const cohort = cohorts.find((c) => c.id === e.user.cohortId);
      if (cohort) {
        map.set(cohort.programId, (map.get(cohort.programId) ?? 0) + 1);
      }
    });
    return map;
  }, [entrepreneurs]);

  const statusCounts = React.useMemo(() => {
    const map = new Map<PlannerStatus, number>();
    entrepreneurs.forEach((e) => {
      map.set(e.status, (map.get(e.status) ?? 0) + 1);
    });
    return map;
  }, [entrepreneurs]);

  const filtered = entrepreneurs.filter((e) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !e.user.name.toLowerCase().includes(q) &&
        !e.user.company?.toLowerCase().includes(q)
      )
        return false;
    }
    if (e.user.coachId && !filterCoaches.has(e.user.coachId)) return false;
    if (e.user.cohortId) {
      const cohort = cohorts.find((c) => c.id === e.user.cohortId);
      if (cohort && !filterPrograms.has(cohort.programId)) return false;
    }
    if (!filterStatuses.has(e.status)) return false;
    return true;
  });

  const grouped = statusGrouping
    .map((g) => ({
      ...g,
      items: filtered.filter((e) => e.status === g.status),
    }))
    .filter((g) => g.items.length > 0);

  const toggleGroup = (status: PlannerStatus) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  };

  const totalActions = filtered.filter((e) => e.status !== "scheduled").length;

  if (collapsed) {
    return (
      <button
        onClick={onToggleCollapse}
        className="flex h-full w-12 flex-col items-center gap-2 border-r border-[var(--color-border)] bg-[var(--color-surface)] py-4 transition-colors hover:bg-[var(--color-surface-2)]"
        title="Open ondernemerslijst"
      >
        <ChevronRight className="size-4 text-[var(--color-ink-3)]" />
        <div className="flex size-7 items-center justify-center rounded-full bg-[var(--color-accent)] text-[11px] font-semibold text-[var(--color-ink)]">
          {entrepreneurs.length}
        </div>
        <div className="-rotate-90 whitespace-nowrap text-[10px] font-medium uppercase tracking-wider text-[var(--color-ink-3)]" style={{ marginTop: 40 }}>
          Ondernemers
        </div>
      </button>
    );
  }

  return (
    <aside className="flex h-full w-[320px] shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="border-b border-[var(--color-border)] p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-3.5 text-[var(--color-ink-2)]" />
            <p className="text-[12.5px] font-semibold">Ondernemers</p>
            <Badge variant="default" className="text-[10px]">
              {filtered.length}
            </Badge>
          </div>
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="rounded p-1 text-[var(--color-ink-3)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
              title="Inklappen"
            >
              <ChevronDown className="size-3.5 rotate-90" />
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-2">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3 -translate-y-1/2 text-[var(--color-muted)]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Zoek op naam of bedrijf…"
            className="h-8 pl-7 text-[12px]"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap gap-1.5">
          <MultiFilter
            label="Status"
            compact
            options={ALL_PLANNER_STATUSES.map((s) => ({
              id: s,
              label: plannerStatusLabel[s],
              dot: plannerStatusTone[s].dot,
              meta: String(statusCounts.get(s) ?? 0),
            }))}
            selected={filterStatuses as Set<string>}
            onChange={(next) => setFilterStatuses(next as Set<PlannerStatus>)}
          />
          <MultiFilter
            label="Coach"
            compact
            options={coaches.map((c) => ({
              id: c.id,
              label: c.name,
              meta: String(coachCounts.get(c.id) ?? 0),
            }))}
            selected={filterCoaches}
            onChange={setFilterCoaches}
          />
          <MultiFilter
            label="Programma"
            compact
            options={programs
              .filter((p) => (programCounts.get(p.id) ?? 0) > 0)
              .map((p) => ({
                id: p.id,
                label: p.shortName,
                meta: String(programCounts.get(p.id) ?? 0),
              }))}
            selected={filterPrograms}
            onChange={setFilterPrograms}
          />
        </div>

        {/* Multi-select action bar */}
        {selectedIds.size > 0 && (
          <div className="mt-2 flex items-center justify-between rounded-[8px] bg-[var(--color-ink)] px-2.5 py-1.5 text-white">
            <p className="text-[11.5px] font-medium">{selectedIds.size} geselecteerd</p>
            <div className="flex items-center gap-2">
              <p className="text-[10.5px] text-white/70">Sleep om te plannen</p>
              <button
                onClick={onClearSelection}
                className="rounded-full p-0.5 hover:bg-white/15"
                aria-label="Selectie wissen"
              >
                <X className="size-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hint */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-accent-soft)]/40 px-3 py-1.5">
        <p className="text-[10.5px] leading-snug text-[var(--color-ink-2)]">
          {totalActions > 0
            ? `${totalActions} ${totalActions === 1 ? "ondernemer vraagt" : "ondernemers vragen"} aandacht. Sleep ze naar de week.`
            : "Iedereen heeft een sessie staan. Sleep iemand naar een dag voor een extra moment."}
        </p>
      </div>

      {/* Groups */}
      <div className="flex-1 overflow-y-auto p-2">
        {grouped.length === 0 ? (
          <div className="flex h-full items-center justify-center p-6 text-center">
            <p className="text-[12px] text-[var(--color-ink-3)]">
              Geen ondernemers passen bij de filters.
            </p>
          </div>
        ) : (
          grouped.map((g) => {
            const expanded = expandedGroups.has(g.status);
            return (
              <div key={g.status} className="mb-3">
                <button
                  onClick={() => toggleGroup(g.status)}
                  className="mb-1.5 flex w-full items-center gap-1 px-1 text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-muted)] hover:text-[var(--color-ink-2)]"
                >
                  {expanded ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
                  {g.label}
                  <span className="ml-auto text-[10px]">{g.items.length}</span>
                </button>
                {expanded && (
                  <div className="space-y-1.5">
                    {g.items.map((e) => (
                      <PlannerCard
                        key={e.user.id}
                        entrepreneur={e}
                        selected={selectedIds.has(e.user.id)}
                        onSelectToggle={onSelectToggle}
                        onSelectRange={onSelectRange}
                        onOpenDetail={onOpenEntrepreneur}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="border-t border-[var(--color-border)] p-2.5 text-[10px] text-[var(--color-muted)]">
        Tip: <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-surface-2)] px-1 font-mono">⌘</kbd>-klik voor multi-select · klik op kaart voor details.
      </div>
    </aside>
  );
}
