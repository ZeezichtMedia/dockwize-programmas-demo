// KPI definities per programma. Pascal stelt hier targets in.
// Actuals worden uit lopende data berekend, voor de demo zijn ze ingevuld.

export type KpiStatus = "ahead" | "on_track" | "warning" | "behind";

export interface KpiTarget {
  id: string;
  label: string;
  description?: string;
  target: number;
  actual: number;
  unit: "percentage" | "count" | "rating" | "hours";
  // higher_is_better: true voor voortgang/NPS, false voor inactieve deelnemers / responstijd
  higherIsBetter: boolean;
  status: KpiStatus;
  trend?: number; // % delta tov vorige week
}

export interface ProgramKpis {
  programId: string;
  cohortId?: string;
  kpis: KpiTarget[];
}

export const kpiSets: ProgramKpis[] = [
  {
    programId: "p_jouw",
    cohortId: "c_jp7",
    kpis: [
      {
        id: "voortgang",
        label: "Opdrachten op tijd af",
        description: "Percentage opdrachten dat voor de deadline is ingeleverd.",
        target: 75,
        actual: 71,
        unit: "percentage",
        higherIsBetter: true,
        status: "on_track",
        trend: 4,
      },
      {
        id: "activiteit",
        label: "Inactieve deelnemers (7+ dagen)",
        description: "Aantal deelnemers zonder upload of chat-activiteit in 7+ dagen.",
        target: 0,
        actual: 1,
        unit: "count",
        higherIsBetter: false,
        status: "warning",
        trend: 0,
      },
      {
        id: "nps",
        label: "Tussentijdse NPS",
        description: "Gemiddelde rating bij sessie 4 evaluatie.",
        target: 4.0,
        actual: 4.3,
        unit: "rating",
        higherIsBetter: true,
        status: "ahead",
        trend: 7,
      },
      {
        id: "feedback",
        label: "Coach-feedback tijd (gem.)",
        description: "Gemiddelde tijd tussen inleveren en eerste reactie van coach.",
        target: 48,
        actual: 26,
        unit: "hours",
        higherIsBetter: false,
        status: "ahead",
        trend: -18,
      },
    ],
  },
  {
    programId: "p_groei",
    cohortId: "c_groei3",
    kpis: [
      {
        id: "voortgang",
        label: "Opdrachten op tijd af",
        target: 80,
        actual: 62,
        unit: "percentage",
        higherIsBetter: true,
        status: "behind",
        trend: -3,
      },
      {
        id: "activiteit",
        label: "Inactieve deelnemers (7+ dagen)",
        target: 0,
        actual: 0,
        unit: "count",
        higherIsBetter: false,
        status: "on_track",
        trend: 0,
      },
      {
        id: "nps",
        label: "Tussentijdse NPS",
        target: 4.2,
        actual: 4.1,
        unit: "rating",
        higherIsBetter: true,
        status: "on_track",
        trend: 2,
      },
      {
        id: "feedback",
        label: "Coach-feedback tijd (gem.)",
        target: 36,
        actual: 41,
        unit: "hours",
        higherIsBetter: false,
        status: "warning",
        trend: 5,
      },
    ],
  },
];

export const statusLabel: Record<KpiStatus, string> = {
  ahead: "Voor op schema",
  on_track: "Op schema",
  warning: "Aandacht",
  behind: "Achter op schema",
};

export const statusTone: Record<KpiStatus, { dot: string; text: string; bg: string; border: string }> = {
  ahead: {
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  on_track: {
    dot: "bg-[var(--color-success)]",
    text: "text-[var(--color-success)]",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  warning: {
    dot: "bg-amber-500",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  behind: {
    dot: "bg-red-500",
    text: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
  },
};

export function formatKpiValue(kpi: KpiTarget): string {
  switch (kpi.unit) {
    case "percentage":
      return `${kpi.actual}%`;
    case "count":
      return `${kpi.actual}`;
    case "rating":
      return kpi.actual.toFixed(1);
    case "hours":
      return `${kpi.actual}u`;
  }
}

export function formatKpiTarget(kpi: KpiTarget): string {
  switch (kpi.unit) {
    case "percentage":
      return `${kpi.target}%`;
    case "count":
      return `≤ ${kpi.target}`;
    case "rating":
      return `≥ ${kpi.target.toFixed(1)}`;
    case "hours":
      return `≤ ${kpi.target}u`;
  }
}

export function kpisForProgram(programId: string, cohortId?: string): KpiTarget[] {
  const set = kpiSets.find(
    (s) => s.programId === programId && (cohortId ? s.cohortId === cohortId : true)
  );
  return set?.kpis ?? [];
}

export function overallStatusForProgram(programId: string, cohortId?: string): KpiStatus {
  const kpis = kpisForProgram(programId, cohortId);
  if (kpis.some((k) => k.status === "behind")) return "behind";
  if (kpis.some((k) => k.status === "warning")) return "warning";
  if (kpis.every((k) => k.status === "ahead")) return "ahead";
  return "on_track";
}
