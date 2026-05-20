/**
 * Coach-competenties en match-scores per module. Pascal:
 * "Ik wil een overzicht hebben van waar de competenties van Hans
 *  zitten en waar die van Nicola. Met een klein cijfer dat de beste
 *  fit aangeeft."
 *
 * Voor de demo: handmatige scores per coach × module. Voelt slim,
 * maar de echte tool kan dit later automatisch afleiden uit
 * geleverde sessies en feedback-ratings.
 */

export interface CoachSkill {
  label: string;
  /** 1-5, 5 = expert */
  level: number;
}

export interface CoachProfile {
  coachId: string;
  tagline: string;
  /** Kerncompetenties met niveau */
  skills: CoachSkill[];
  /** Score per module-naam (0-100). Hogere score = betere fit. */
  moduleMatch: Record<string, number>;
}

export const coachProfiles: CoachProfile[] = [
  {
    coachId: "u_hans",
    tagline: "Strategie, sales en commerciële groei. 20 jaar ondernemerservaring.",
    skills: [
      { label: "Strategie & visie", level: 5 },
      { label: "Sales-funnel", level: 5 },
      { label: "Financieel model", level: 4 },
      { label: "Funding & pitch", level: 4 },
      { label: "Pricing", level: 4 },
      { label: "Doelgroep & JTBD", level: 3 },
      { label: "MVP & validatie", level: 3 },
      { label: "Branding", level: 2 },
    ],
    moduleMatch: {
      "Intake & strategie": 95,
      "Doelgroep & merk": 70,
      "Product & propositie": 80,
      "Financiën & funding": 95,
      "Innovatie & schaal": 75,
      "Eindpresentatie": 90,
    },
  },
  {
    coachId: "u_nicola",
    tagline: "Marketing, merk en doelgroep. Ex-PostNL en Albert Heijn.",
    skills: [
      { label: "Branding & merk", level: 5 },
      { label: "Doelgroep & JTBD", level: 5 },
      { label: "Marketing-strategie", level: 5 },
      { label: "Content & verhalen", level: 4 },
      { label: "MVP & validatie", level: 4 },
      { label: "Pitch architectuur", level: 4 },
      { label: "Sales-funnel", level: 3 },
      { label: "Financieel model", level: 2 },
    ],
    moduleMatch: {
      "Intake & strategie": 75,
      "Doelgroep & merk": 98,
      "Product & propositie": 90,
      "Financiën & funding": 55,
      "Innovatie & schaal": 80,
      "Eindpresentatie": 85,
    },
  },
];

export function getCoachProfile(coachId: string): CoachProfile | undefined {
  return coachProfiles.find((p) => p.coachId === coachId);
}

export function bestCoachForModule(moduleName: string): { coachId: string; score: number }[] {
  return coachProfiles
    .map((p) => ({ coachId: p.coachId, score: p.moduleMatch[moduleName] ?? 0 }))
    .sort((a, b) => b.score - a.score);
}
