"use client";

import * as React from "react";
import type { Role } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

export interface TourStep {
  id: string;
  target?: string;
  page?: string;
  title: string;
  body: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right" | "center";
  primaryActionLabel?: string;
}

interface TourContextValue {
  steps: TourStep[];
  active: boolean;
  index: number;
  start: () => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
}

const TourContext = React.createContext<TourContextValue | null>(null);

const TRIGGER_KEY = "dockwize_demo_start_tour";
const seenKey = (role: Role) => `dockwize_tour_seen_${role}_v1`;

export function isTourCompletedForRole(role: Role) {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(seenKey(role)) !== null;
}

export function markTourCompletedForRole(role: Role) {
  if (typeof window === "undefined") return;
  localStorage.setItem(seenKey(role), new Date().toISOString());
}

export function clearTourFlag(role: Role) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(seenKey(role));
}

export function shouldAutoStartTour() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(TRIGGER_KEY) === "1";
}

export function clearAutoStart() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TRIGGER_KEY);
}

const stepsByRole: Record<Role, TourStep[]> = {
  entrepreneur: [
    {
      id: "welcome",
      page: "/werkmap",
      placement: "center",
      title: "Hoi, ik loop even mee.",
      body: (
        <>
          Je kijkt nu mee als <strong>Marleen</strong>, een verzonnen ondernemer in Jouw Programma 7. In een minuutje laat ik zien wat de plekken doen. Loopt iets niet lekker? App Jorian even.
        </>
      ),
      primaryActionLabel: "Loop maar mee",
    },
    {
      id: "sidebar",
      target: "sidebar-nav",
      page: "/werkmap",
      placement: "right",
      title: "Het menu links",
      body: (
        <>
          Hier vind je alles. Als ondernemer zie je je werkmap, je groep en de bibliotheek. Het menu past zich aan wie je bent.
        </>
      ),
    },
    {
      id: "werkmap-hero",
      target: "werkmap-hero",
      page: "/werkmap",
      placement: "bottom",
      title: "Dit is jouw plek",
      body: (
        <>
          Hier komen jouw bestanden en opdrachten. Alleen jij en je coach kijken mee. Andere deelnemers zien hier echt niks van.
        </>
      ),
    },
    {
      id: "werkmap-tabs",
      target: "werkmap-tabs",
      page: "/werkmap",
      placement: "bottom",
      title: "Bestanden, opdrachten, notities",
      body: (
        <>
          Sleep een bestand erin om te uploaden. Bij opdrachten geeft je coach gewoon onder de opdracht zelf feedback. Geen losse mailtjes meer.
        </>
      ),
    },
    {
      id: "cohort",
      target: "sidebar-nav-cohort",
      page: "/werkmap",
      placement: "right",
      title: "Je groep",
      body: (
        <>
          Hier zie je je medecursisten, kun je samen kletsen en kleinere clubjes maken. Wíé erin zit kun je zien, wát zíj uploaden niet.
        </>
      ),
    },
    {
      id: "ai",
      target: "sidebar-nav-ai",
      page: "/werkmap",
      placement: "right",
      title: "Vraag het de bibliotheek",
      body: (
        <>
          Vergeet je iets uit een sessie? Stel een vraag, dan zoekt de hulp door alle video's en documenten van jouw programma en geeft antwoord met de juiste plek erbij.
        </>
      ),
    },
    {
      id: "role-switcher",
      target: "role-switcher",
      page: "/werkmap",
      placement: "bottom",
      title: "Wissel van rol",
      body: (
        <>
          Klik op je foto rechtsboven om als iemand anders te kijken. Probeer maar, voor elke rol start een eigen rondleiding.
        </>
      ),
    },
    {
      id: "done",
      placement: "center",
      title: "Dat was 'm.",
      body: (
        <>
          Klik vrij rond, niks kan stuk. App Jorian als iets niet duidelijk is.
        </>
      ),
      primaryActionLabel: "Top, doe ik",
    },
  ],

  coach: [
    {
      id: "welcome",
      page: "/coach",
      placement: "center",
      title: "Welkom in de coach-omgeving.",
      body: (
        <>
          Je kijkt nu mee als <strong>Hans de Waard</strong>, één van de coaches. Dit is hoe een coach zijn dag begint: even kijken bij wie hij vandaag aandacht moet besteden.
        </>
      ),
      primaryActionLabel: "Laat zien",
    },
    {
      id: "sidebar",
      target: "sidebar-nav",
      page: "/coach",
      placement: "right",
      title: "Beperkt menu, met opzet",
      body: (
        <>
          Een coach hoort niet bij beheer of bij andermans ondernemers. Alleen zijn eigen mensen, zijn inbox en de bibliotheek. Schoon en snel.
        </>
      ),
    },
    {
      id: "stats",
      target: "coach-stats",
      page: "/coach",
      placement: "bottom",
      title: "Waar is mijn aandacht nodig",
      body: (
        <>
          Vier cijfertjes. Wie wacht op feedback, wie is een week stil geweest, wat is de gemiddelde voortgang. Dat is je dagopstart.
        </>
      ),
    },
    {
      id: "list",
      target: "coach-list",
      page: "/coach",
      placement: "top",
      title: "Mijn ondernemers",
      body: (
        <>
          De coach ziet alleen zíjn eigen mensen, niet die van Nicola. Klik op iemand om naar de werkmap te gaan en feedback te geven.
        </>
      ),
    },
    {
      id: "switch",
      target: "role-switcher",
      page: "/coach",
      placement: "bottom",
      title: "Wissel naar Pascal of Joanne",
      body: (
        <>
          Klik je foto rechtsboven om als manager of coördinator te kijken. Voor elke rol start een eigen rondleiding zodat je het verschil voelt.
        </>
      ),
    },
    {
      id: "done",
      placement: "center",
      title: "Dat was de coach-kant.",
      body: (
        <>
          Klik gerust een ondernemer aan om de werkmap-detailpagina te zien. App Jorian als iets schuurt.
        </>
      ),
      primaryActionLabel: "Begrepen",
    },
  ],

  program_manager: [
    {
      id: "welcome",
      page: "/programma-manager",
      placement: "center",
      title: "De programmamanager-kant.",
      body: (
        <>
          Je kijkt mee als <strong>Imro Wong</strong>, programmamanager van Jouw Programma. Hier zorg je dat het programma loopt: sessies plannen, content publiceren, deelnemers monitoren.
        </>
      ),
      primaryActionLabel: "Laat zien",
    },
    {
      id: "kpi",
      target: "pm-kpi",
      page: "/programma-manager",
      placement: "bottom",
      title: "Vier cijfers, één blik",
      body: (
        <>
          Hoeveel cohorts loopt er, hoeveel mensen doen mee, wachten er inleveringen op een coach, en wie is een week stil. Genoeg om de week mee te starten.
        </>
      ),
    },
    {
      id: "cohorts",
      target: "pm-cohorts",
      page: "/programma-manager",
      placement: "top",
      title: "Mijn cohorts in beeld",
      body: (
        <>
          Per lopende cohort zie je de voortgang, de eerstvolgende sessie en deadline. Geen losse mailtjes meer over wie wanneer wat moet bekijken.
        </>
      ),
    },
    {
      id: "actions",
      target: "pm-actions",
      page: "/programma-manager",
      placement: "left",
      title: "Wat alleen jij kan oppakken",
      body: (
        <>
          Sessie 6 voorbereiding klaarzetten, nieuwe video reviewen, sessie plannen. Korte lijst, geen ruis.
        </>
      ),
    },
    {
      id: "done",
      placement: "center",
      title: "En zo loopt het programma.",
      body: (
        <>
          Wissel rechtsboven van rol om de andere kanten te zien. App Jorian bij vragen.
        </>
      ),
      primaryActionLabel: "Top",
    },
  ],

  admin: [
    {
      id: "welcome",
      page: "/admin",
      placement: "center",
      title: "De coördinator-kant.",
      body: (
        <>
          Je kijkt mee als <strong>Joanne Katsman</strong>. Hier zit het werk dat nu in Teams handmatig gebeurt: ondernemers koppelen, coaches toewijzen, retentie regelen.
        </>
      ),
      primaryActionLabel: "Laat zien",
    },
    {
      id: "sidebar",
      target: "sidebar-nav",
      page: "/admin",
      placement: "right",
      title: "De beheerkant",
      body: (
        <>
          Alles wat te maken heeft met inrichten en bijhouden. Ondernemers, cohorts, content, rechten, retentie, audit. Geen werkmap-inhoud zelf.
        </>
      ),
    },
    {
      id: "kpi",
      target: "admin-kpi",
      page: "/admin",
      placement: "bottom",
      title: "Wat moet vandaag aandacht?",
      body: (
        <>
          Hoeveel ondernemers actief, hoeveel cohorts lopen, wie is een week stil. Helder bovenaan zodat niets blijft hangen.
        </>
      ),
    },
    {
      id: "hubspot",
      target: "admin-hubspot",
      page: "/admin/users",
      placement: "bottom",
      title: "Vanuit HubSpot binnengekomen",
      body: (
        <>
          Heeft Jordi een contract op getekend gezet in HubSpot, dan staat de ondernemer hier. Eén klik op &lsquo;Werkmap aanmaken&rsquo; en klaar. Geen handmatig overtikken meer.
        </>
      ),
    },
    {
      id: "coach-cell",
      target: "admin-coach-cell",
      page: "/admin/users",
      placement: "left",
      title: "Coach toewijzen",
      body: (
        <>
          Klik op de coach-kolom om iemand toe te wijzen of te wisselen. Hij ziet direct alleen zíjn ondernemers, niet die van anderen.
        </>
      ),
    },
    {
      id: "switch",
      target: "role-switcher",
      page: "/admin",
      placement: "bottom",
      title: "Bekijk hoe het bij anderen werkt",
      body: (
        <>
          Wissel via je foto rechtsboven om te zien hoe een ondernemer of coach de tool gebruikt. Voor elke rol start een eigen rondleiding.
        </>
      ),
    },
    {
      id: "done",
      placement: "center",
      title: "Dit is jouw thuisbasis.",
      body: (
        <>
          Klik /admin/retentie en /admin/audit ook even open, daar zit de privacy-kant. App Jorian bij vragen.
        </>
      ),
      primaryActionLabel: "Top",
    },
  ],

  super_admin: [
    {
      id: "welcome",
      page: "/dashboard",
      placement: "center",
      title: "Pascal, dit is jouw dashboard.",
      body: (
        <>
          Eén plek om in een minuut te zien hoe de programma's lopen. Geen dieptewerk, wel de signalen die je nodig hebt.
        </>
      ),
      primaryActionLabel: "Laat zien",
    },
    {
      id: "sidebar",
      target: "sidebar-nav",
      page: "/dashboard",
      placement: "right",
      title: "Volledig overzicht",
      body: (
        <>
          Als manager kun je overal bij. Bovenaan jouw dashboard, daaronder alle beheerpagina's. Inzage in iemands werkmap wordt netjes gelogd, dat zie je terug bij Audit.
        </>
      ),
    },
    {
      id: "kpi",
      target: "dashboard-kpi",
      page: "/dashboard",
      placement: "bottom",
      title: "Vier cijfers, één blik",
      body: (
        <>
          Hoeveel ondernemers actief, hoeveel cohorts lopen, wat is de gemiddelde voortgang, en hoeveel vragen krijgt de bibliotheek-hulp. AI-gebruik is een mooie groei-indicator van het programma.
        </>
      ),
    },
    {
      id: "progress",
      target: "dashboard-progress",
      page: "/dashboard",
      placement: "right",
      title: "Hoe lopen de cohorts",
      body: (
        <>
          Per lopend cohort zie je twee balkjes: hoeveel opdrachten zijn af, en hoeveel tijd is verstreken. Lopen ze gelijk op, dan loopt het cohort op schema.
        </>
      ),
    },
    {
      id: "ai-stats",
      target: "dashboard-ai",
      page: "/dashboard",
      placement: "left",
      title: "Wat vragen ondernemers",
      body: (
        <>
          Top-onderwerpen waar de bibliotheek-hulp op draait. Goed signaal: gaan veel vragen over funding? Dan weet je waar je extra content op moet zetten.
        </>
      ),
    },
    {
      id: "switch",
      target: "role-switcher",
      page: "/dashboard",
      placement: "bottom",
      title: "Kijk mee als anderen",
      body: (
        <>
          Wissel rechtsboven om als ondernemer, coach, programmamanager of Joanne te kijken. Voor elke rol start een eigen korte rondleiding zodat je voelt hoe het verschilt.
        </>
      ),
    },
    {
      id: "done",
      placement: "center",
      title: "Dat is het.",
      body: (
        <>
          Bekijk vooral ook /admin/retentie en /admin/audit voor de privacy-kant. Of stap als Marleen in om te voelen hoe het voor een deelnemer werkt. App Jorian voor de rest.
        </>
      ),
      primaryActionLabel: "Top",
    },
  ],
};

export function TourProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [active, setActive] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const steps = React.useMemo(() => {
    if (!user) return [];
    return stepsByRole[user.role] ?? [];
  }, [user?.role]);

  const start = React.useCallback(() => {
    setIndex(0);
    setActive(true);
  }, []);

  const stop = React.useCallback(() => {
    setActive(false);
    if (user) markTourCompletedForRole(user.role);
    clearAutoStart();
  }, [user]);

  const next = React.useCallback(() => {
    setIndex((i) => {
      if (i >= steps.length - 1) {
        setActive(false);
        if (user) markTourCompletedForRole(user.role);
        clearAutoStart();
        return i;
      }
      return i + 1;
    });
  }, [steps.length, user]);

  const prev = React.useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const goTo = React.useCallback(
    (i: number) => {
      setIndex(Math.max(0, Math.min(steps.length - 1, i)));
    },
    [steps.length]
  );

  // Reset to step 0 whenever the role changes (so each role starts fresh)
  React.useEffect(() => {
    setIndex(0);
    setActive(false);
  }, [user?.role]);

  const value = React.useMemo(
    () => ({ steps, active, index, start, stop, next, prev, goTo }),
    [steps, active, index, start, stop, next, prev, goTo]
  );

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export function useTour() {
  const ctx = React.useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within TourProvider");
  return ctx;
}
