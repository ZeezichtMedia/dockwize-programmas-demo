"use client";

import * as React from "react";
import { ChevronRight, ExternalLink, Plug, ShieldCheck } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type IntegrationState = "connected" | "available" | "planned";

interface Integration {
  name: string;
  description: string;
  state: IntegrationState;
  note: string;
  icon: React.ReactNode;
}

const integrations: Integration[] = [
  {
    name: "HubSpot",
    description: "Contractgetekende ondernemers stromen automatisch door als 'wachtend op coach'. Geen handmatig overtikken.",
    state: "connected",
    note: "Webhook actief · synced via API · 2 nieuwe sinds 7 mei",
    icon: <HubSpotIcon />,
  },
  {
    name: "Bisner Community",
    description: "Open de Dockwize Community-omgeving (chat, members, events) in een nieuw tabblad zonder dubbel inloggen.",
    state: "connected",
    note: "SSO-koppeling actief · 'Open in Bisner'-knop in cohort-pagina",
    icon: <BisnerIcon />,
  },
  {
    name: "Microsoft Teams",
    description: "Voor Dockwize-medewerkers die in Teams blijven werken: chats meelezen vanuit hun Teams-client.",
    state: "planned",
    note: "Could-have v2, alleen voor interne medewerkers, niet voor ondernemers",
    icon: <TeamsIcon />,
  },
  {
    name: "AI Kennisbank (Dockwize)",
    description: "Wanneer Dockwize's eigen AI-kennisbank live gaat, koppelen wij die aan de bibliotheek-assistent zodat antwoorden ook uit jullie bredere kennisbasis komen.",
    state: "planned",
    note: "Wacht op API-keuze van Dockwize · architectuur staat klaar",
    icon: <AIIcon />,
  },
  {
    name: "Resend (e-mail)",
    description: "Magic-link uitnodigingen, retentie-notificaties en feedback-meldingen.",
    state: "connected",
    note: "EU-residency · DKIM/SPF verified",
    icon: <MailIcon />,
  },
  {
    name: "Miro / Whiteboard alternatief",
    description: "Visueel samenwerken in een sessie zonder Miro-licentie per ondernemer.",
    state: "planned",
    note: "Could-have v2 · gesprek met Pascal nog open",
    icon: <WhiteboardIcon />,
  },
];

const stateConfig: Record<IntegrationState, { label: string; variant: "success" | "info" | "default" }> = {
  connected: { label: "Verbonden", variant: "success" },
  available: { label: "Beschikbaar", variant: "info" },
  planned: { label: "v2 / gepland", variant: "default" },
};

export default function SettingsPage() {
  return (
    <>
      <Topbar
        title="Instellingen"
        subtitle="Integraties, beleid en branding"
      />
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Plug className="size-4" /> Integraties
              </CardTitle>
              <p className="text-[12px] text-[var(--color-ink-3)]">
                Het werkmap-platform praat met andere systemen, niet andersom. Niets is hard-gekoppeld, zodat we morgen makkelijk een nieuwe partij kunnen aansluiten.
              </p>
            </div>
            <Badge variant="default">API-first</Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            {integrations.map((int) => {
              const cfg = stateConfig[int.state];
              return (
                <div
                  key={int.name}
                  className="flex items-start gap-4 rounded-[12px] border border-[var(--color-border)] p-4"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-[var(--color-surface-2)]">
                    {int.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-semibold">{int.name}</p>
                      <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    </div>
                    <p className="mt-0.5 text-[12.5px] text-[var(--color-ink-2)]">{int.description}</p>
                    <p className="mt-1 text-[11px] text-[var(--color-muted)]">{int.note}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    {int.state === "connected" ? "Beheer" : "Meer info"} <ChevronRight className="size-3.5" />
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Authenticatie</CardTitle>
            <p className="text-[12px] text-[var(--color-ink-3)]">Hoe gebruikers inloggen.</p>
          </CardHeader>
          <CardContent className="space-y-2">
            <Setting label="Magic-link login" value="Aan voor iedereen" />
            <Setting label="Wachtwoord (optioneel)" value="Aan voor herhaalbezoekers" />
            <Setting label="2FA voor coaches" value="Aanbevolen, open vraag voor Pascal" muted />
            <Setting label="2FA voor admins" value="Verplicht" />
            <Setting label="2FA voor ondernemers" value="Optioneel, anders te hoge drempel" muted />
            <Setting label="Sessieduur" value="14 dagen 'remember me' op trusted devices" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
            <p className="text-[12px] text-[var(--color-ink-3)]">Dockwize-look, niet generiek SaaS.</p>
          </CardHeader>
          <CardContent className="space-y-2">
            <Setting label="Primaire kleur" value="#1d1d1b (Dockwize ink)" />
            <Setting label="Accent kleur" value="#ffda00 (Dockwize geel)" />
            <Setting label="Logo" value="Dockwize wordmark met werkmap-suffix" />
            <Setting label="Domein" value="werkmap.dockwize.nl (te configureren)" muted />
            <Setting label="E-mail afzender" value="werkmap@dockwize.nl" />
          </CardContent>
        </Card>

        <div className="flex items-center gap-3 rounded-[12px] bg-[var(--color-surface-2)] p-4">
          <ShieldCheck className="size-4 text-[var(--color-ink-3)]" />
          <p className="text-[12px] text-[var(--color-ink-2)]">
            <span className="font-medium text-[var(--color-ink)]">Privacy by default:</span> alle integraties
            werken via API, geen data wordt zonder expliciete koppeling met derden gedeeld. Audit log
            registreert elke integratie-actie.
          </p>
        </div>
      </div>
    </>
  );
}

function Setting({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-[8px] border border-[var(--color-border)] px-3 py-2.5">
      <p className="text-[12.5px] font-medium">{label}</p>
      <p className={`text-[12px] ${muted ? "text-[var(--color-muted)]" : "text-[var(--color-ink-2)]"}`}>{value}</p>
    </div>
  );
}

function HubSpotIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="14" r="4" stroke="#FF7A59" strokeWidth="2" />
      <path d="M14 14V7" stroke="#FF7A59" strokeWidth="2" strokeLinecap="round" />
      <circle cx="6" cy="7" r="2" fill="#FF7A59" />
      <circle cx="14" cy="3" r="1.5" fill="#FF7A59" />
    </svg>
  );
}

function BisnerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="12" r="3" fill="#3B82F6" />
      <circle cx="18" cy="6" r="3" fill="#3B82F6" />
      <circle cx="18" cy="18" r="3" fill="#3B82F6" />
      <path d="M8.5 10.5l7-3M8.5 13.5l7 3" stroke="#3B82F6" strokeWidth="1.5" />
    </svg>
  );
}

function TeamsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#5059C9" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="6" width="11" height="12" rx="1.5" />
      <text x="8.5" y="15" fontSize="9" fontWeight="bold" fill="white" textAnchor="middle">T</text>
      <circle cx="18" cy="9" r="2.5" />
      <rect x="14.5" y="12" width="7" height="6" rx="1" />
    </svg>
  );
}

function AIIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" fill="#FFDA00" stroke="#1d1d1b" strokeWidth="0.8" strokeLinejoin="round" />
      <circle cx="6" cy="18" r="1.5" fill="#1d1d1b" />
      <circle cx="18" cy="18" r="1.5" fill="#1d1d1b" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <polyline points="3 7 12 13 21 7" />
    </svg>
  );
}

function WhiteboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="14" rx="2" />
      <path d="M8 11l3-3 3 3 3-3" />
      <path d="M12 17v4M8 21h8" />
    </svg>
  );
}
