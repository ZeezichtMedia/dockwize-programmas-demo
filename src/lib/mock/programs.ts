import type { Program, Cohort } from "../types";

export const programs: Program[] = [
  {
    id: "p_jouw",
    slug: "jouw-programma",
    name: "Jouw Programma op Maat",
    shortName: "Jouw Programma",
    description:
      "Maatwerk coachingtraject voor ondernemers — strategie, marketing, productontwikkeling, financiën en innovatie. Persoonlijke intake, eigen coach, doorlopend programma.",
    duration: "12 weken (flexibel)",
    cover: "/cohort/home1.jpg",
    modules: ["Intake & strategie", "Doelgroep & merk", "Product & propositie", "Financiën & funding", "Innovatie & schaal", "Eindpresentatie"],
    active: true,
  },
  {
    id: "p_groei",
    slug: "groeiprogramma",
    name: "Groeiprogramma",
    shortName: "Groei",
    description: "Voor doorgroeiende ondernemers die willen schalen. 6 maanden intensief.",
    duration: "6 maanden",
    cover: "/cohort/home2.jpg",
    modules: ["Strategie", "Team", "Sales", "Operations", "Financiën", "Exit-readiness"],
    active: true,
  },
  {
    id: "p_intra",
    slug: "intrapreneurship",
    name: "Intrapreneurship",
    shortName: "Intrapreneurship",
    description: "Innovatie binnen bestaande bedrijven — samen met DELTA, Zalsman en Volker Energy.",
    duration: "16 weken",
    cover: "/cohort/home3.jpg",
    modules: ["Innovatie-mindset", "Validatie", "MVP", "Stakeholder-management", "Pitch"],
    active: true,
  },
  {
    id: "p_familie",
    slug: "familiebedrijven",
    name: "Familiebedrijven",
    shortName: "Familiebedrijven",
    description: "Overdracht, opvolging en strategie voor Zeeuwse familiebedrijven.",
    duration: "9 maanden",
    cover: "/cohort/home4.jpg",
    modules: ["Visie & opvolging", "Governance", "Generatie-overdracht", "Strategie", "Cultuur"],
    active: true,
  },
  {
    id: "p_ctrl",
    slug: "ctrl",
    name: "CTRL.",
    shortName: "CTRL.",
    description: "Digitalisering, AI en cybersecurity voor Zeeuwse ondernemers.",
    duration: "10 weken",
    cover: "/cohort/home6.jpg",
    modules: ["Digitale fundering", "AI in jouw bedrijf", "Cybersecurity", "Data & privacy"],
    active: true,
  },
  {
    id: "p_visa",
    slug: "startup-visa",
    name: "Startup Visa Program",
    shortName: "Startup Visa",
    description: "Voor internationale ondernemers met een startup-visum.",
    duration: "12 maanden",
    cover: "/cohort/event.jpg",
    modules: ["NL business basics", "Validatie", "Funding", "Network", "Visa-roadmap"],
    active: true,
  },
];

export const cohorts: Cohort[] = [
  {
    id: "c_jp7",
    programId: "p_jouw",
    name: "Jouw Programma 7",
    startDate: "2026-04-08",
    endDate: "2026-06-30",
    memberIds: ["u_marleen", "u_jeroen", "u_aisha", "u_bram", "u_chantal", "u_finn", "u_isabel", "u_omar", "u_sanne"],
    managerId: "u_imro",
    state: "active",
  },
  {
    id: "c_jp6",
    programId: "p_jouw",
    name: "Jouw Programma 6",
    startDate: "2026-01-13",
    endDate: "2026-03-30",
    memberIds: [],
    managerId: "u_imro",
    state: "archived",
  },
  {
    id: "c_groei3",
    programId: "p_groei",
    name: "Groei #3",
    startDate: "2026-03-01",
    endDate: "2026-09-01",
    memberIds: [],
    managerId: "u_mirjam",
    state: "active",
  },
];

export const getProgram = (id: string) => programs.find((p) => p.id === id);
export const getCohort = (id: string) => cohorts.find((c) => c.id === id);
export const programsById = Object.fromEntries(programs.map((p) => [p.id, p]));
export const cohortsById = Object.fromEntries(cohorts.map((c) => [c.id, c]));
