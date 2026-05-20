import { sessionProposals } from "./sessions";
import type { AgendaItem } from "./sessions";
import { events } from "./notifications";
import { cohorts } from "./programs";
import { users, getUser } from "./users";

/**
 * Verzamelt alle agenda-items relevant voor een gebruiker.
 * Combineert cohort-events (sessies, deadlines, events) met 1-op-1
 * voorstellen, geprioriteerd op tijd.
 */
export function agendaForUser(userId: string): AgendaItem[] {
  const user = getUser(userId);
  if (!user) return [];

  const items: AgendaItem[] = [];

  // 1. Cohort events
  const myCohortIds = new Set<string>();
  if (user.cohortId) myCohortIds.add(user.cohortId);
  // Voor coach: alle cohorts waar zijn ondernemers in zitten
  if (user.role === "coach") {
    users
      .filter((u) => u.role === "entrepreneur" && u.coachId === user.id)
      .forEach((u) => u.cohortId && myCohortIds.add(u.cohortId));
  }
  // Voor program_manager: cohorts die hij/zij beheert
  if (user.role === "program_manager") {
    cohorts.filter((c) => c.managerId === user.id).forEach((c) => myCohortIds.add(c.id));
  }
  // Voor admin/super_admin: alle actieve cohorts
  if (user.role === "admin" || user.role === "super_admin") {
    cohorts.filter((c) => c.state === "active").forEach((c) => myCohortIds.add(c.id));
  }

  events
    .filter((e) => (e.cohortId ? myCohortIds.has(e.cohortId) : false))
    .forEach((e) =>
      items.push({
        id: e.id,
        kind: e.type === "deadline" ? "deadline" : e.type === "session" ? "session" : "event",
        start: e.start,
        end: e.end,
        title: e.title,
        location: e.location,
        description: e.description,
        cohortId: e.cohortId,
        programId: e.programId,
        participantIds: [],
        prepLibraryItemIds: e.prepLibraryItemIds,
      })
    );

  // 2. 1-op-1 proposals
  const myProposals = sessionProposals.filter((p) => {
    if (user.role === "entrepreneur") return p.entrepreneurId === userId;
    if (user.role === "coach") {
      if (p.coachId === userId) return true;
      // Coverage: ik neem waar voor iemand die deze proposal heeft
      const coverer = users.find((u) => u.id === p.coachId && u.availability?.coverageBy === userId);
      return !!coverer;
    }
    if (user.role === "admin" || user.role === "super_admin" || user.role === "program_manager") {
      return true;
    }
    return false;
  });

  myProposals.forEach((p) => {
    if (p.status === "accepted" && p.acceptedSlot) {
      const start = p.acceptedSlot;
      const end = new Date(new Date(start).getTime() + p.durationMin * 60_000).toISOString();
      items.push({
        id: `prop_${p.id}`,
        kind: "oneonone",
        start,
        end,
        title: `1-op-1 met ${oneOnOneOtherName(p, userId)}`,
        location: p.location,
        description: p.reason,
        participantIds: [p.coachId, p.entrepreneurId],
        status: "confirmed",
        proposalId: p.id,
      });
    } else if (p.status === "proposed" || p.status === "alternatives_requested") {
      items.push({
        id: `prop_${p.id}`,
        kind: "oneonone",
        start: p.primarySlot,
        end: new Date(new Date(p.primarySlot).getTime() + p.durationMin * 60_000).toISOString(),
        title: `1-op-1 voorstel met ${oneOnOneOtherName(p, userId)}`,
        location: p.location,
        description: p.reason,
        participantIds: [p.coachId, p.entrepreneurId],
        status: p.status,
        proposalId: p.id,
      });
    }
  });

  return items.sort((a, b) => a.start.localeCompare(b.start));
}

function oneOnOneOtherName(
  p: { coachId: string; entrepreneurId: string },
  userId: string
): string {
  if (p.coachId === userId) {
    const ent = getUser(p.entrepreneurId);
    return ent?.name ?? "ondernemer";
  }
  if (p.entrepreneurId === userId) {
    const coach = getUser(p.coachId);
    return coach?.name ?? "coach";
  }
  // Coverage or admin view: show both
  const ent = getUser(p.entrepreneurId);
  const coach = getUser(p.coachId);
  return `${coach?.name.split(" ")[0]} & ${ent?.name.split(" ")[0]}`;
}

export function upcomingAgendaForUser(userId: string, limit = 5): AgendaItem[] {
  const all = agendaForUser(userId);
  const today = new Date("2026-05-08").getTime();
  return all.filter((i) => new Date(i.start).getTime() >= today - 12 * 60 * 60 * 1000).slice(0, limit);
}

export function agendaByDay(items: AgendaItem[]): { date: string; items: AgendaItem[] }[] {
  const map = new Map<string, AgendaItem[]>();
  items.forEach((i) => {
    const d = new Date(i.start).toISOString().slice(0, 10);
    if (!map.has(d)) map.set(d, []);
    map.get(d)!.push(i);
  });
  return Array.from(map.entries())
    .map(([date, items]) => ({ date, items }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
