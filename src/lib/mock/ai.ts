import type { AIThread, AIMessage } from "../types";

const buildId = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

export const presetAIQuestions: { question: string; previewIcon?: string }[] = [
  { question: "Wat hebben we behandeld over financiering?" },
  { question: "Hoe maak ik een goede SWOT?" },
  { question: "Welke video's gaan over pitchen?" },
  { question: "Wat is JTBD precies?" },
  { question: "Wat zijn de funding-opties voor Zeeuwse ondernemers?" },
  { question: "Hoe schrijf ik een eindpresentatie?" },
];

export const presetAIResponses: Record<string, AIMessage[]> = {
  default: [
    {
      id: "ai_default",
      role: "assistant",
      content:
        "Ik heb de bibliotheek van Jouw Programma doorzocht. Er zijn meerdere relevante items voor jouw vraag — bekijk de bronnen hieronder. Wil je dat ik een specifiek onderdeel uitlicht?",
      citations: [],
      timestamp: new Date().toISOString(),
    },
  ],
  financiering: [
    {
      id: "ai_fin",
      role: "assistant",
      content: `Goede vraag. In Jouw Programma hebben we het thema financiering uitgesplitst in drie blokken:

**1. Financieel model bouwen** — Hans neemt je in een uur door de Excel/Numbers-template heen, P&L en cashflow voor 12 maanden vooruit. Belangrijk: cashflow is *niet* hetzelfde als winst, en juist daar lopen veel ondernemers vast.

**2. Funding-routes** — er is een document waarin we de routes voor Zeeuwse ondernemers naast elkaar zetten: subsidies, het Rabo Transitie Ticket, BOM/InvestNL, en business angels. Voor jouw fase (validatie/early growth) zijn met name het Rabo Transitie Ticket en seed-subsidies relevant.

**3. Verwachte vraag van een investeerder** — niet apart in de bibliotheek, maar wel onderdeel van Sessie 7. Tip: bekijk vast 'Pitch Architectuur' van Hans — daar zit de hooks-en-arc voor financiële slides in verstopt.

Wil je dat ik je in één keer naar het Excel-template stuur?`,
      citations: [
        {
          libraryItemId: "lib_finance",
          snippet: "Cashflow is geen winst. Het verschil zit in tijd: wanneer komt geld binnen en wanneer ga het uit.",
          timestamp: "12:08",
        },
        {
          libraryItemId: "lib_finance_template",
          snippet: "P&L en cashflow naast elkaar in 1 spreadsheet, met automatische breakeven berekening.",
          page: 1,
        },
        {
          libraryItemId: "lib_funding",
          snippet: "Voor pre-seed ondernemers in Zeeland: Rabo Transitie Ticket (max €25k) + provinciale subsidies via Impuls.",
          page: 4,
        },
      ],
      timestamp: new Date().toISOString(),
    },
  ],
  swot: [
    {
      id: "ai_swot",
      role: "assistant",
      content: `Een goede SWOT is geen invuloefening. Hans zegt het zo:

> "Verzin geen Threats omdat de matrix dat vraagt. Schrijf de drie dingen op waar je 's nachts wakker van ligt. Daar zit je echte SWOT."

De aanpak die in de bibliotheek wordt uitgelegd:

1. **Schrijf eerst je 3 nachtelijke vragen op** (eerlijk, dat is je échte Threats + Weaknesses).
2. **Vraag drie klanten waarom ze juist voor jou kozen** (= Strengths).
3. **Kijk naar wat in je markt verschuift dit jaar** (= Opportunities).
4. **Pas dán** zet je het in een matrix.

In de bibliotheek vind je de video van Hans (18 min) en het template — beide voor opdracht 2.`,
      citations: [
        {
          libraryItemId: "lib_swot",
          snippet: "Verzin geen Threats omdat de matrix dat vraagt. Schrijf de drie dingen op waar je 's nachts wakker van ligt.",
          timestamp: "03:14",
        },
        {
          libraryItemId: "lib_swot_template",
          snippet: "Template — start altijd bij Strengths via klant-quotes, niet vanuit eigen aannames.",
          page: 1,
        },
      ],
      timestamp: new Date().toISOString(),
    },
  ],
  pitch: [
    {
      id: "ai_pitch",
      role: "assistant",
      content: `Twee bronnen relevant:

**Pitch Architectuur — 90 seconden** (video, 15:52, Hans). Drie verhaal-structuren die voor bijna elke goede pitch werken: probleem-oplossing, before-after-bridge, en hero's journey. Hans laat ze met voorbeelden zien.

**Pitch deck template** (10 slides). Werkt voor pre-seed én groei. Slide 3 (probleem) en slide 7 (model) zijn waar de meeste decks struikelen.

Specifieke tip uit de video: een pitch hoeft niet origineel te beginnen, maar moet een **scherp moment van urgentie** in de eerste 15 seconden hebben. "We bouwen een platform voor X" is geen urgentie. "Iedere week verliezen Zeeuwse mosselkwekers €40.000 doordat ze blind sturen op zuurstofgehalte" — dát is urgentie.`,
      citations: [
        {
          libraryItemId: "lib_pitch",
          snippet: "Een pitch moet een scherp moment van urgentie hebben in de eerste 15 seconden.",
          timestamp: "02:40",
        },
        {
          libraryItemId: "lib_pitch_deck",
          snippet: "Slide 3 (probleem) en slide 7 (model) zijn waar de meeste decks struikelen.",
          page: 3,
        },
      ],
      timestamp: new Date().toISOString(),
    },
  ],
  jtbd: [
    {
      id: "ai_jtbd",
      role: "assistant",
      content: `Jobs-to-be-Done (JTBD) is een framework dat zegt: klanten 'huren' jouw product in om een klus te klaren. Ze kopen geen boormachine, ze kopen een gat in de muur.

Nicola heeft een video van 26 min waarin ze het uitlegt met voorbeelden uit horeca en SaaS. Praktisch: je doet **5+ interviews** waar je vraagt naar het laatste moment dat iemand jouw type oplossing aanschafte — wat triggerde dat? Welke andere opties wogen ze af? Wat ging er fout met de vorige oplossing?

Voor opdracht 3 verwacht Nicola dat je 5 interviews doet en 3 kerninzichten distilleert. Tip uit de chat: Isabel deed er deze week 50 — "je leert pas wat na de 30e."`,
      citations: [
        {
          libraryItemId: "lib_jtbd",
          snippet: "Klanten huren je product in voor een klus. Vraag naar het moment van inhuren, niet naar features.",
          timestamp: "08:22",
        },
      ],
      timestamp: new Date().toISOString(),
    },
  ],
  funding: [
    {
      id: "ai_funding",
      role: "assistant",
      content: `Voor Zeeuwse ondernemers zijn er ruwweg 5 routes:

1. **Eigen middelen + omzet** — voor product-businesses waar je marges direct in werk kan steken.
2. **Rabo Transitie Ticket** — €25k voor verduurzaming/transitie. Dockwize is partner. Snelle route via Jordi.
3. **Provinciale subsidies (Impuls Zeeland)** — voor innovatie en banengroei. 4-6 weken procestijd.
4. **BOM Brabant Ventures / InvestNL** — voor schaalbare startups, ticket €250k+.
5. **Angels** — Zeeland heeft een groeiend angel-netwerk via Dockwize Community.

In het document 'Funding-routes voor Zeeuwse ondernemers' (14 pagina's) staan de criteria, deadlines en typische ticket-grootte naast elkaar.

Voor jouw fase zou ik beginnen met punt 2 + 3.`,
      citations: [
        {
          libraryItemId: "lib_funding",
          snippet: "Rabo Transitie Ticket — €25k, max 8 weken doorlooptijd, partner-route via Dockwize.",
          page: 6,
        },
      ],
      timestamp: new Date().toISOString(),
    },
  ],
  eindpresentatie: [
    {
      id: "ai_eind",
      role: "assistant",
      content: `Imro heeft een korte video (8:45) gemaakt met de exacte verwachtingen. In het kort:

- **Duur:** 12 minuten + 8 minuten Q&A.
- **Publiek:** mede-deelnemers, coaches, Pascal, en optioneel een investeerder van het netwerk.
- **Vorm:** geen verplichte structuur, wel verwacht: probleem → oplossing → tractie/bewijs → wat heb je geleerd → wat is je volgende stap.
- **Niet:** een verkooppraatje voor je product. Wel: eerlijk, reflectief, scherp.

Tip die niet in de video staat maar wel in de chat van Sessie 8: oefen vooraf met Hans of Nicola. Eén droogloop scheelt je 20% angst op de avond zelf.`,
      citations: [
        {
          libraryItemId: "lib_eindpresentatie",
          snippet: "Geen verkooppraatje. Reflectie + bewijs + volgende stap.",
          timestamp: "02:18",
        },
      ],
      timestamp: new Date().toISOString(),
    },
  ],
};

export function matchAIResponse(question: string): AIMessage[] {
  const q = question.toLowerCase();
  if (/financ|geld|funding|invester|subsid|rabo|kasstroom|cashflow|p&l/.test(q)) {
    if (/funding|invester|subsid|rabo/.test(q)) return presetAIResponses.funding;
    return presetAIResponses.financiering;
  }
  if (/swot|sterktes|zwaktes|kansen|bedreiging/.test(q)) return presetAIResponses.swot;
  if (/pitch|presentatie|verhaal|deck/.test(q)) {
    if (/eind/.test(q)) return presetAIResponses.eindpresentatie;
    return presetAIResponses.pitch;
  }
  if (/jtbd|jobs|klant|doelgroep|interview/.test(q)) return presetAIResponses.jtbd;
  if (/eindpres|afsluit/.test(q)) return presetAIResponses.eindpresentatie;
  return presetAIResponses.default;
}

export const initialThread = (userId: string, programId: string): AIThread => ({
  id: buildId("th"),
  userId,
  programId,
  title: "Nieuwe vraag",
  createdAt: new Date().toISOString(),
  messages: [],
});
