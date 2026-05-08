# Dockwize Werkmap — Demo

Volledige UI-demo van het werkmap-platform voor Dockwize. Geen echte backend, geen echte AI — alle data zit in `src/lib/mock/`. Bedoeld om aan Pascal te laten zien hoe het platform aanvoelt voor elke rol.

## Snel starten

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Je komt op het login-scherm.

## Hoe te demoen

Op het login-scherm staat onderaan **"Bekijk demo — kies een rol"**. Daar kies je tussen de vier perspectieven:

| Rol | Inlog-account | Wat zie je |
|---|---|---|
| **Ondernemer** | Marleen de Visser (De Werkbrand) | Werkmap, coach-feedback, cohort-chat, AI-bibliotheek |
| **Coach** | Hans de Waard | Lijst van toegewezen ondernemers, feedback geven |
| **Coördinator** | Joanne Katsman | Admin-overzicht, retentie, audit log |
| **Manager** | Pascal Kartan | Super-admin dashboard, KPI's, programma-overzicht |

In de topbar rechtsboven kun je tijdens de demo **op elk moment van rol wisselen** via de avatar-dropdown.

## Wat zit erin

**Voor de ondernemer (Marleen):**
- Werkmap met bestanden + opdrachten + coach-feedback inline
- Cohort-pagina met algemene chat, subgroepjes, deelnemers, agenda
- Bibliotheek met video's, documenten, decks, templates
- AI-assistent ("Vraag de bibliotheek") met preset antwoorden + bronvermeldingen
- Persoonlijke notities (privé voor ondernemer)
- Inbox met notificaties
- Magic-link login (gemockt)

**Voor de coach (Hans):**
- Lijst van toegewezen ondernemers met voortgang + signalen
- Detail-werkmap per ondernemer
- Inline feedback geven op opdrachten
- Privé coach-notities

**Voor de coördinator (Joanne):**
- Admin-overzicht met KPI's + recente activiteit
- Ondernemers-lijst (komt vanuit HubSpot in beeld)
- Cohorts, coaches, content beheren
- Retentie-beleid + audit log
- Rechten-overzicht

**Voor de manager (Pascal):**
- Volledig dashboard met programma-voortgang
- AI-bibliotheek statistieken
- Audit log preview
- Compliance-status

## Tech stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 met Dockwize design tokens (`#1d1d1b` + `#ffda00`)
- Radix UI primitives + custom shadcn-stijl componenten
- Framer Motion voor transitions
- Lucide voor iconografie
- Inter (typografie)
- Echte foto's van Dockwize team gescraped van dockwize.nl

## Mock data

Alles in `src/lib/mock/`:
- `users.ts` — Pascal, Joanne, Hans, Nicola + 9 fictieve ondernemers
- `programs.ts` — alle 6 Dockwize-programma's
- `workfolders.ts` — bestanden + opdrachten per ondernemer
- `library.ts` — 13 materialen voor Jouw Programma
- `chats.ts` — 5 channels + ~25 berichten met realistische dialoog
- `notifications.ts` + audit log + agenda-events
- `ai.ts` — preset RAG-antwoorden met bronvermeldingen

## Disclaimer

Dit is een **conceptdemo**. Geen echte data, geen echte authenticatie, geen backend. Alles is statisch in localStorage. Bedoeld om scope te valideren met Pascal — niet om in productie te draaien.
