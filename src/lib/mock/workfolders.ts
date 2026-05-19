import type { WorkFolder, Assignment, WorkFile } from "../types";

const baseAssignments = (entrepreneurId: string, coachId: string): Assignment[] => [
  {
    id: `a_${entrepreneurId}_1`,
    title: "Intake-document — wie ben jij als ondernemer?",
    description:
      "Vul het intake-template in. Wat wil je halen uit Jouw Programma? Beschrijf in 500 woorden waar je nu staat, wat de grootste vraag is, en hoe succes er voor jou over 12 weken uitziet.",
    module: "Intake & strategie",
    dueDate: "2026-04-12",
    status: "done",
    submittedFileIds: [`f_${entrepreneurId}_intake`],
    feedback: [
      {
        id: `fb_${entrepreneurId}_1`,
        authorId: coachId,
        message:
          "Mooi scherp stuk. Ik haak met name aan op je opmerking over 'angst om te kiezen' — dat nemen we volgende sessie mee als kernvraag.",
        createdAt: "2026-04-15T10:30:00Z",
      },
    ],
    createdAt: "2026-04-08T09:00:00Z",
  },
  {
    id: `a_${entrepreneurId}_2`,
    title: "SWOT + concurrentie-analyse",
    description:
      "Maak een SWOT van jouw onderneming en breng minimaal 3 concurrenten in kaart. Gebruik het template uit de bibliotheek (week 2).",
    module: "Doelgroep & merk",
    dueDate: "2026-04-26",
    status: "feedback",
    submittedFileIds: [`f_${entrepreneurId}_swot`],
    feedback: [
      {
        id: `fb_${entrepreneurId}_2`,
        authorId: coachId,
        message:
          "Sterke SWOT. Bij de Threats zou ik 'leveranciersafhankelijkheid' explicieter benoemen. Concurrentie-analyse: je mist 1 belangrijke speler — kan je TripleSec ook meenemen?",
        createdAt: "2026-04-29T14:12:00Z",
      },
    ],
    createdAt: "2026-04-15T11:00:00Z",
  },
  {
    id: `a_${entrepreneurId}_3`,
    title: "Doelgroep-interviews (n=5)",
    description:
      "Interview 5 mensen uit je doelgroep volgens het JTBD-template. Lever een korte synthese in (max 1 A4) met de belangrijkste 3 inzichten.",
    module: "Doelgroep & merk",
    dueDate: "2026-05-15",
    status: "in_progress",
    submittedFileIds: [],
    feedback: [],
    createdAt: "2026-04-29T15:00:00Z",
  },
  {
    id: `a_${entrepreneurId}_4`,
    title: "Eerste pitch — 90 seconden",
    description:
      "Neem een pitch van max 90 sec op (video of audio) waarin je je propositie helder krijgt. Bekijk eerst de video 'Pitch Architectuur' van Hans in de bibliotheek.",
    module: "Product & propositie",
    dueDate: "2026-05-22",
    status: "todo",
    submittedFileIds: [],
    feedback: [],
    createdAt: "2026-04-29T15:00:00Z",
  },
  {
    id: `a_${entrepreneurId}_5`,
    title: "Financieel model — 12 maanden vooruit",
    description:
      "Werk je P&L en cashflow uit voor de komende 12 maanden. Gebruik het Excel-template uit module Financiën.",
    module: "Financiën & funding",
    dueDate: "2026-06-05",
    status: "todo",
    submittedFileIds: [],
    feedback: [],
    createdAt: "2026-04-29T15:00:00Z",
  },
];

const baseFiles = (entrepreneurId: string): WorkFile[] => [
  {
    id: `f_${entrepreneurId}_intake`,
    name: "Intake-document.pdf",
    size: 248_320,
    type: "pdf",
    uploadedAt: "2026-04-12T16:42:00Z",
    uploadedById: entrepreneurId,
    folder: "Week 1 — Intake",
  },
  {
    id: `f_${entrepreneurId}_swot`,
    name: "SWOT-analyse-v2.docx",
    size: 89_120,
    type: "doc",
    uploadedAt: "2026-04-26T20:14:00Z",
    uploadedById: entrepreneurId,
    folder: "Week 2 — SWOT",
  },
  {
    id: `f_${entrepreneurId}_concur`,
    name: "Concurrentie-matrix.xlsx",
    size: 51_200,
    type: "sheet",
    uploadedAt: "2026-04-26T20:14:00Z",
    uploadedById: entrepreneurId,
    folder: "Week 2 — SWOT",
  },
  {
    id: `f_${entrepreneurId}_notes`,
    name: "Eigen notities sessie 3.md",
    size: 8_840,
    type: "doc",
    uploadedAt: "2026-04-29T22:01:00Z",
    uploadedById: entrepreneurId,
    folder: "Persoonlijke notities",
  },
  {
    id: `f_${entrepreneurId}_moodboard`,
    name: "Moodboard merkidentiteit.png",
    size: 2_447_360,
    type: "image",
    uploadedAt: "2026-05-02T09:30:00Z",
    uploadedById: entrepreneurId,
    folder: "Week 3 — Merk",
  },
];

const entrepreneurAssignments: Record<string, Partial<Assignment>[]> = {
  u_marleen: [
    { id: "a_u_marleen_1", status: "done" },
    { id: "a_u_marleen_2", status: "feedback" },
    { id: "a_u_marleen_3", status: "in_progress" },
    { id: "a_u_marleen_4", status: "todo" },
    { id: "a_u_marleen_5", status: "todo" },
  ],
  u_jeroen: [
    { id: "a_u_jeroen_1", status: "done" },
    { id: "a_u_jeroen_2", status: "submitted" },
    { id: "a_u_jeroen_3", status: "in_progress" },
  ],
  u_bram: [
    { id: "a_u_bram_1", status: "done" },
    { id: "a_u_bram_2", status: "done" },
    { id: "a_u_bram_3", status: "submitted" },
    { id: "a_u_bram_4", status: "in_progress" },
  ],
  u_chantal: [
    { id: "a_u_chantal_1", status: "done" },
    { id: "a_u_chantal_2", status: "feedback" },
    { id: "a_u_chantal_3", status: "todo" },
  ],
};

const buildFolder = (entrepreneurId: string, coachId: string, cohortId: string, programId: string): WorkFolder => ({
  id: `wf_${entrepreneurId}`,
  entrepreneurId,
  coachId,
  cohortId,
  programId,
  files: baseFiles(entrepreneurId),
  assignments: baseAssignments(entrepreneurId, coachId),
  notes: "",
  retentionDays: 90,
  guests: [],
});

const guestSeeds: Record<string, WorkFolder["guests"]> = {
  u_marleen: [
    {
      id: "g_marleen_1",
      email: "tijs@werkbrand.nl",
      name: "Tijs van Aalst",
      role: "commenter",
      status: "active",
      invitedAt: "2026-04-12T15:30:00Z",
      invitedBy: "u_marleen",
      relationship: "Mede-oprichter",
    },
    {
      id: "g_marleen_2",
      email: "marja.devisser@hotmail.com",
      role: "viewer",
      status: "invited",
      invitedAt: "2026-05-05T20:14:00Z",
      invitedBy: "u_marleen",
      relationship: "Boekhouder",
    },
  ],
  u_chantal: [
    {
      id: "g_chantal_1",
      email: "willem@haventerras.nl",
      name: "Willem Verschuure",
      role: "commenter",
      status: "active",
      invitedAt: "2026-04-10T09:00:00Z",
      invitedBy: "u_chantal",
      relationship: "Vader, mede-eigenaar",
    },
  ],
  u_aisha: [
    {
      id: "g_aisha_1",
      email: "lex@studiokind.com",
      name: "Lex Boutkabout",
      role: "commenter",
      status: "active",
      invitedAt: "2026-04-15T11:20:00Z",
      invitedBy: "u_aisha",
      relationship: "Co-founder",
    },
  ],
};

export const workfolders: WorkFolder[] = [
  buildFolder("u_marleen", "u_hans", "c_jp7", "p_jouw"),
  buildFolder("u_jeroen", "u_nicola", "c_jp7", "p_jouw"),
  buildFolder("u_aisha", "u_nicola", "c_jp7", "p_jouw"),
  buildFolder("u_bram", "u_hans", "c_jp7", "p_jouw"),
  buildFolder("u_chantal", "u_hans", "c_jp7", "p_jouw"),
  buildFolder("u_finn", "u_nicola", "c_jp7", "p_jouw"),
  buildFolder("u_isabel", "u_nicola", "c_jp7", "p_jouw"),
  buildFolder("u_omar", "u_hans", "c_jp7", "p_jouw"),
  buildFolder("u_sanne", "u_hans", "c_jp7", "p_jouw"),
];

// Adjust statuses per ondernemer for variation
workfolders.forEach((wf) => {
  const overrides = entrepreneurAssignments[wf.entrepreneurId];
  if (!overrides) return;
  overrides.forEach((override) => {
    const a = wf.assignments.find((x) => x.id === override.id);
    if (a && override.status) a.status = override.status;
  });
});

// Seed guests
workfolders.forEach((wf) => {
  const seed = guestSeeds[wf.entrepreneurId];
  if (seed) wf.guests = seed;
});

export const getFolderForEntrepreneur = (entrepreneurId: string) =>
  workfolders.find((wf) => wf.entrepreneurId === entrepreneurId);

export const getFoldersForCoach = (coachId: string) =>
  workfolders.filter((wf) => wf.coachId === coachId);

export const getFoldersForCohort = (cohortId: string) =>
  workfolders.filter((wf) => wf.cohortId === cohortId);
