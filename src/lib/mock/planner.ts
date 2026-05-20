import { users, getUser } from "./users";
import { workfolders } from "./workfolders";
import { sessionProposals } from "./sessions";
import type { User } from "../types";

const TODAY = new Date("2026-05-08");

export type PlannerStatus =
  | "needs_planning"   // geen geplande/voorgestelde sessie binnen 14 dagen
  | "submitted_waiting" // ondernemer heeft net iets ingeleverd, vraagt feedback-sessie
  | "inactive"         // 7+ dagen geen activiteit
  | "scheduled"        // sessie binnen 14 dagen
  | "fresh";           // nieuwe ondernemer, eerste 3 sessies nog niet vastgepind

export interface PlannerEntrepreneur {
  user: User;
  status: PlannerStatus;
  reason: string;
  daysUntilNext?: number;
  daysSinceActivity?: number;
}

function hasAcceptedSessionWithin(entrepreneurId: string, daysAhead: number): boolean {
  return sessionProposals.some((p) => {
    if (p.entrepreneurId !== entrepreneurId) return false;
    if (p.status !== "accepted" || !p.acceptedSlot) return false;
    const days = (new Date(p.acceptedSlot).getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24);
    return days >= 0 && days <= daysAhead;
  });
}

function hasOpenProposal(entrepreneurId: string): boolean {
  return sessionProposals.some(
    (p) =>
      p.entrepreneurId === entrepreneurId &&
      (p.status === "proposed" || p.status === "alternatives_requested")
  );
}

function daysSinceLastActivity(entrepreneurId: string): number | null {
  const folder = workfolders.find((wf) => wf.entrepreneurId === entrepreneurId);
  if (!folder) return null;
  const last = folder.files
    .map((f) => new Date(f.uploadedAt).getTime())
    .sort((a, b) => b - a)[0];
  if (!last) return null;
  return Math.floor((TODAY.getTime() - last) / (1000 * 60 * 60 * 24));
}

function hasSubmittedAssignment(entrepreneurId: string): boolean {
  const folder = workfolders.find((wf) => wf.entrepreneurId === entrepreneurId);
  if (!folder) return false;
  return folder.assignments.some((a) => a.status === "submitted");
}

export function plannerStatusFor(user: User): PlannerEntrepreneur {
  const sinceActivity = daysSinceLastActivity(user.id);

  if (hasSubmittedAssignment(user.id) && !hasOpenProposal(user.id)) {
    return {
      user,
      status: "submitted_waiting",
      reason: "Heeft net opdracht ingeleverd, wacht op feedback-moment",
    };
  }

  if (sinceActivity !== null && sinceActivity >= 7) {
    return {
      user,
      status: "inactive",
      reason: `${sinceActivity} dagen geen activiteit, even contact`,
      daysSinceActivity: sinceActivity,
    };
  }

  if (hasAcceptedSessionWithin(user.id, 14)) {
    return {
      user,
      status: "scheduled",
      reason: "Volgende sessie staat al",
    };
  }

  if (hasOpenProposal(user.id)) {
    return {
      user,
      status: "scheduled",
      reason: "Voorstel verstuurd, wacht op reactie",
    };
  }

  // Nieuwe ondernemers (zonder bestanden) zijn "fresh"
  if (sinceActivity === null) {
    return {
      user,
      status: "fresh",
      reason: "Nieuwe ondernemer, 3 startsessies inplannen",
    };
  }

  return {
    user,
    status: "needs_planning",
    reason: "Geen sessie binnen 14 dagen, tijd voor nieuwe afspraak",
  };
}

/**
 * Welke ondernemers verschijnen in de planner voor deze gebruiker?
 * Joanne / Pascal / Imro zien iedereen. Coaches zien alleen eigen + waarneming.
 */
export function plannerEntrepreneursFor(viewerId: string): PlannerEntrepreneur[] {
  const viewer = getUser(viewerId);
  if (!viewer) return [];

  let entrepreneurs: User[] = [];

  if (viewer.role === "coach") {
    // Eigen ondernemers
    entrepreneurs = users.filter((u) => u.role === "entrepreneur" && u.coachId === viewer.id);
    // Plus waarneming
    const coverageCoaches = users.filter(
      (u) => u.role === "coach" && u.availability?.status === "away" && u.availability.coverageBy === viewer.id
    );
    coverageCoaches.forEach((c) => {
      users
        .filter((u) => u.role === "entrepreneur" && u.coachId === c.id)
        .forEach((u) => {
          if (!entrepreneurs.find((e) => e.id === u.id)) entrepreneurs.push(u);
        });
    });
  } else if (
    viewer.role === "admin" ||
    viewer.role === "super_admin" ||
    viewer.role === "program_manager"
  ) {
    entrepreneurs = users.filter((u) => u.role === "entrepreneur");
  }

  return entrepreneurs.map(plannerStatusFor);
}

export const statusGrouping: { status: PlannerStatus; label: string; tone: string }[] = [
  { status: "submitted_waiting", label: "Wacht op feedback-moment", tone: "amber" },
  { status: "inactive", label: "Inactief, contact maken", tone: "red" },
  { status: "needs_planning", label: "Geen sessie binnen 14 dagen", tone: "amber" },
  { status: "fresh", label: "Nieuw, 3 startsessies plannen", tone: "blue" },
  { status: "scheduled", label: "Loopt, sessie staat", tone: "green" },
];

export const plannerStatusTone: Record<PlannerStatus, { dot: string; pill: string; text: string }> = {
  submitted_waiting: { dot: "bg-amber-500", pill: "bg-amber-50 border-amber-200", text: "text-amber-700" },
  inactive: { dot: "bg-red-500", pill: "bg-red-50 border-red-200", text: "text-red-700" },
  needs_planning: { dot: "bg-amber-500", pill: "bg-amber-50 border-amber-200", text: "text-amber-700" },
  fresh: { dot: "bg-blue-500", pill: "bg-blue-50 border-blue-200", text: "text-blue-700" },
  scheduled: { dot: "bg-emerald-500", pill: "bg-emerald-50 border-emerald-200", text: "text-emerald-700" },
};

/**
 * Genereer week-dagen vanaf een referentiedatum (maandag t/m vrijdag).
 */
export function weekDays(refDate: Date): Date[] {
  const day = refDate.getDay(); // 0 = zondag
  const offset = day === 0 ? -6 : 1 - day;
  const monday = new Date(refDate);
  monday.setDate(refDate.getDate() + offset);
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

/**
 * Maand-grid: alle dagen die in de maand-view zichtbaar zijn (incl. spill-over
 * dagen uit voorgaande/volgende maand om de eerste week op maandag en de
 * laatste op zondag te starten). 6 rijen × 7 kolommen = 42 dagen.
 */
export function monthGridDays(refDate: Date): Date[] {
  const year = refDate.getFullYear();
  const month = refDate.getMonth();
  const first = new Date(year, month, 1);
  // Backtrack to Monday before (or on) the first
  const firstDay = first.getDay(); // 0 zo … 6 za
  const backtrack = firstDay === 0 ? 6 : firstDay - 1;
  const start = new Date(first);
  start.setDate(first.getDate() - backtrack);
  start.setHours(0, 0, 0, 0);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function isToday(d: Date): boolean {
  return isSameDay(d, TODAY);
}

export function fullMonthLabel(d: Date): string {
  return d.toLocaleDateString("nl-NL", { month: "long", year: "numeric" });
}

export const HOUR_SLOTS = [9, 10, 11, 12, 13, 14, 15, 16, 17];

export const ALL_PLANNER_STATUSES: PlannerStatus[] = [
  "submitted_waiting",
  "inactive",
  "needs_planning",
  "fresh",
  "scheduled",
];

export const plannerStatusLabel: Record<PlannerStatus, string> = {
  submitted_waiting: "Wacht op feedback-moment",
  inactive: "Inactief 7+ dagen",
  needs_planning: "Geen sessie binnen 14 dagen",
  fresh: "Nieuw, 3 startsessies plannen",
  scheduled: "Loopt op schema",
};
