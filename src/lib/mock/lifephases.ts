/**
 * Levensfase-model van Dockwize. Pascal in het praatplaat-transcript:
 * "Een ideaallijn van startup naar scaleup. Per element zit een
 * milestone (gevalideerde probleemstelling, getoetste oplossing,
 * marktanalyse, eerste koper, opschaling). Niemand loopt de ideaallijn
 * recht, maar we willen zien waar een ondernemer zit en wat zijn
 * volgende stap is."
 */

export type LifePhaseId = "idee" | "validatie" | "mvp" | "eerste_klanten" | "opschaling" | "groei";

export interface LifePhase {
  id: LifePhaseId;
  label: string;
  shortLabel: string;
  description: string;
  milestones: string[];
  /** Tint voor visualisatie */
  tone: "amber" | "orange" | "yellow" | "lime" | "emerald" | "teal";
}

export const lifePhases: LifePhase[] = [
  {
    id: "idee",
    label: "Idee & probleem",
    shortLabel: "Idee",
    description: "Je hebt een vermoeden van een probleem. Nog geen bewijs.",
    milestones: ["Probleem beschreven", "Aannames in beeld"],
    tone: "amber",
  },
  {
    id: "validatie",
    label: "Probleemvalidatie",
    shortLabel: "Validatie",
    description: "Je toetst of het probleem echt is bij potentiële klanten.",
    milestones: ["Gevalideerde probleemstelling", "JTBD-interviews (n=5+)", "Doelgroep scherp"],
    tone: "orange",
  },
  {
    id: "mvp",
    label: "MVP & oplossing",
    shortLabel: "MVP",
    description: "Je bouwt een eerste oplossing en toetst die in de markt.",
    milestones: ["Getoetste oplossingsrichting", "Eerste prototype", "Eerste pilot-klanten"],
    tone: "yellow",
  },
  {
    id: "eerste_klanten",
    label: "Eerste betalende klanten",
    shortLabel: "Eerste klanten",
    description: "Mensen betalen voor je product. Je weet wat werkt.",
    milestones: ["Eerste 5 betalende klanten", "Verdienmodel", "Pitch werkt"],
    tone: "lime",
  },
  {
    id: "opschaling",
    label: "Opschaling",
    shortLabel: "Opschaling",
    description: "Het werkt. Nu moet het herhaalbaar en groter.",
    milestones: ["Salesproces staat", "Eerste teamlid", "Financiering rond"],
    tone: "emerald",
  },
  {
    id: "groei",
    label: "Groei & schaal",
    shortLabel: "Groei",
    description: "Volwassen organisatie, doorlopende groei en optimalisatie.",
    milestones: ["Team operationeel", "Vaste processen", "Internationale schaal"],
    tone: "teal",
  },
];

/**
 * Per ondernemer een huidige fase + concrete signalen waarom.
 * Voor demo handmatig gemapt zodat het narratief klopt met de
 * mock-data (Marleen = validatie, Bram = MVP-validatie, Omar inactief,
 * etc).
 */
export const entrepreneurLifePhase: Record<string, { current: LifePhaseId; signals: string[]; nextStep?: string }> = {
  u_marleen: {
    current: "validatie",
    signals: ["JTBD-interviews lopen", "SWOT gemaakt", "Doelgroep nog te breed"],
    nextStep: "Doelgroep aanscherpen, dan door naar pitch (MVP-fase)",
  },
  u_jeroen: {
    current: "mvp",
    signals: ["Werkende sensor in zout water", "1 pilot-klant in Zeeland", "Pricing in beweging"],
    nextStep: "Tweede pilot-klant binnenhalen voor eerste-klanten-fase",
  },
  u_aisha: {
    current: "eerste_klanten",
    signals: ["Made-to-order werkt", "Eerste 8 klanten", "Schaal-vraag op tafel"],
    nextStep: "Beslissen: klein blijven of opschaling-fase in",
  },
  u_bram: {
    current: "validatie",
    signals: ["50 JTBD-interviews gedaan", "Wachten op product-market-fit signaal"],
    nextStep: "Concept aanscherpen, MVP-versie 2 maken",
  },
  u_chantal: {
    current: "opschaling",
    signals: ["Bedrijf draait al jaren", "Eigen Untill-koppeling", "Mollie-flow stroef"],
    nextStep: "Operations optimaliseren, daarna groei-fase",
  },
  u_finn: {
    current: "mvp",
    signals: ["Eerste industrial-design klaar", "Eerste pitch opgenomen", "Zorg-pilot ingang"],
    nextStep: "Pilot evalueren, dan eerste-klanten-fase",
  },
  u_isabel: {
    current: "validatie",
    signals: ["50 doelgroep-interviews gehaald", "B2B-route via zorgverzekeraars open"],
    nextStep: "MVP-platform bouwen op basis van interviews",
  },
  u_omar: {
    current: "mvp",
    signals: ["Drones werken", "Eerste pilot windmolens", "B2B-sales lange cyclus"],
    nextStep: "Twee weken stil. Wakker maken en pitch aanscherpen.",
  },
  u_sanne: {
    current: "eerste_klanten",
    signals: ["8 kantoorklanten", "Regionale leveranciers vast", "Tweede locatie?"],
    nextStep: "Bedrijfsmodel scherp krijgen voor opschaling",
  },
};

export function getLifePhase(id: LifePhaseId): LifePhase {
  return lifePhases.find((p) => p.id === id)!;
}

export function getEntrepreneurLifePhase(entrepreneurId: string) {
  const mapping = entrepreneurLifePhase[entrepreneurId];
  if (!mapping) return null;
  const phase = getLifePhase(mapping.current);
  return { phase, signals: mapping.signals, nextStep: mapping.nextStep };
}

export const phaseToneClass: Record<LifePhase["tone"], { bg: string; text: string; ring: string; dot: string }> = {
  amber: { bg: "bg-amber-100", text: "text-amber-800", ring: "ring-amber-300", dot: "bg-amber-500" },
  orange: { bg: "bg-orange-100", text: "text-orange-800", ring: "ring-orange-300", dot: "bg-orange-500" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-800", ring: "ring-yellow-300", dot: "bg-yellow-500" },
  lime: { bg: "bg-lime-100", text: "text-lime-800", ring: "ring-lime-300", dot: "bg-lime-500" },
  emerald: { bg: "bg-emerald-100", text: "text-emerald-800", ring: "ring-emerald-300", dot: "bg-emerald-500" },
  teal: { bg: "bg-teal-100", text: "text-teal-800", ring: "ring-teal-300", dot: "bg-teal-500" },
};
