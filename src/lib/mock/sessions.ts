import type { SessionProposal } from "../types";

export const sessionProposals: SessionProposal[] = [
  {
    id: "sp_marleen_1",
    coachId: "u_hans",
    entrepreneurId: "u_marleen",
    primarySlot: "2026-05-12T14:00:00Z",
    alternativeSlots: [
      "2026-05-13T10:00:00Z",
      "2026-05-15T09:00:00Z",
    ],
    durationMin: 45,
    location: "Brasserie PZEM 41",
    reason:
      "Tussentijds 1-op-1 over je pitch. Ik wil je horen pitchen voor je sessie 5 doet, dan kunnen we nog scherpen.",
    status: "proposed",
    proposedAt: "2026-05-07T09:15:00Z",
  },
  {
    id: "sp_aisha_1",
    coachId: "u_nicola",
    entrepreneurId: "u_aisha",
    primarySlot: "2026-05-13T13:00:00Z",
    alternativeSlots: [
      "2026-05-14T13:00:00Z",
      "2026-05-18T14:00:00Z",
    ],
    durationMin: 60,
    location: "Online (Teams-link volgt)",
    reason:
      "Verkennen wat je écht wilt: klein blijven of richting schaal. Geen druk, wel scherpe vragen.",
    status: "alternatives_requested",
    proposedAt: "2026-05-06T18:00:00Z",
  },
  {
    id: "sp_bram_1",
    coachId: "u_hans",
    entrepreneurId: "u_bram",
    primarySlot: "2026-05-11T16:00:00Z",
    alternativeSlots: [
      "2026-05-12T16:00:00Z",
      "2026-05-14T15:00:00Z",
    ],
    durationMin: 30,
    location: "Online (Teams-link volgt)",
    reason: "Snel doornemen wat we deze week deden met die interviews.",
    status: "accepted",
    proposedAt: "2026-05-05T11:00:00Z",
    acceptedSlot: "2026-05-11T16:00:00Z",
  },
];

export function proposalsForEntrepreneur(entrepreneurId: string): SessionProposal[] {
  return sessionProposals.filter((p) => p.entrepreneurId === entrepreneurId);
}

export function openProposalForEntrepreneur(entrepreneurId: string): SessionProposal | undefined {
  return sessionProposals.find(
    (p) => p.entrepreneurId === entrepreneurId && (p.status === "proposed" || p.status === "alternatives_requested")
  );
}

export function proposalsForCoach(coachId: string): SessionProposal[] {
  return sessionProposals.filter((p) => p.coachId === coachId);
}

export interface AgendaItem {
  id: string;
  kind: "session" | "deadline" | "event" | "oneonone";
  start: string;
  end?: string;
  title: string;
  location?: string;
  description?: string;
  cohortId?: string;
  programId?: string;
  participantIds: string[]; // entrepreneurs/coaches involved
  status?: "proposed" | "confirmed" | "alternatives_requested";
  proposalId?: string;
  prepLibraryItemIds?: string[];
}
