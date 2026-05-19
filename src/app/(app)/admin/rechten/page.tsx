"use client";

import { ShieldCheck, Lock, Eye, AlertCircle } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RechtenPage() {
  return (
    <>
      <Topbar
        title="Rechten & rollen"
        subtitle="Hoe toegang werkt op het werkmap-platform"
      />
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Rolmodel</CardTitle>
            <p className="text-[12px] text-[var(--color-ink-3)]">Vier rollen, elk met eigen toegangsregels.</p>
          </CardHeader>
          <CardContent className="space-y-2">
            <RoleRow
              role="Ondernemer"
              description="Heeft alleen toegang tot eigen werkmap, eigen groep-chat en bibliotheek van het programma."
              canSee={["Eigen bestanden", "Eigen opdrachten", "Andere deelnemers in eigen groep", "Bibliotheek programma", "Subgroepen waar ik in zit"]}
              cantSee={["Werkmappen van andere ondernemers", "Andere coaches' notities"]}
            />
            <RoleRow
              role="Coach"
              description="Toegang tot werkmappen van toegewezen ondernemers. Niet die van andere coaches."
              canSee={["Eigen ondernemers", "Hun bestanden + opdrachten", "Groep-chat", "Bibliotheek"]}
              cantSee={["Ondernemers van andere coaches", "Audit log", "Beheer"]}
            />
            <RoleRow
              role="Coördinator"
              description="Beheert ondernemers, programma's en content. Geen toegang tot werkmap-inhoud zonder reden."
              canSee={["Alle ondernemers (lijst)", "Groep-beheer", "Content publicatie", "Audit log", "Retentie"]}
              cantSee={["Werkmap-bestanden zonder geldige reden, en elke inzage wordt gelogd"]}
            />
            <RoleRow
              role="Manager / Super-admin"
              description="Volledig overzicht, KPI's en beleid. Inzage in werkmappen vereist auditreden."
              canSee={["Alles", "KPI-dashboard", "Audit log", "Beleid"]}
              cantSee={["Persoonlijke notities van anderen"]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Garanties</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <Guarantee icon={Lock} title="Row-level security" body="Database-isolatie per ondernemer. Verkeerde rechten zetten is onmogelijk omdat de DB ongeautoriseerde queries fundamenteel weigert." />
            <Guarantee icon={Eye} title="Inzage altijd gelogd" body="Als een admin of manager naar een werkmap kijkt, wordt dat met reden vastgelegd in de audit log." />
            <Guarantee icon={ShieldCheck} title="EU-data residency" body="Alle data en backups in EU. Versleuteld at-rest en in-transit." />
            <Guarantee icon={AlertCircle} title="Onomkeerbare audit" body="Auditlog is append-only. Niemand, ook geen admin, kan eerdere regels wijzigen of verwijderen." />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function RoleRow({
  role,
  description,
  canSee,
  cantSee,
}: {
  role: string;
  description: string;
  canSee: string[];
  cantSee: string[];
}) {
  return (
    <div className="rounded-[12px] border border-[var(--color-border)] p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-[14px] font-semibold">{role}</p>
          <p className="mt-0.5 text-[12px] text-[var(--color-ink-2)]">{description}</p>
        </div>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-success)]">Mag zien</p>
          <ul className="mt-1 space-y-0.5">
            {canSee.map((item) => (
              <li key={item} className="text-[11.5px] text-[var(--color-ink-2)]">• {item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-danger)]">Niet zonder reden</p>
          <ul className="mt-1 space-y-0.5">
            {cantSee.map((item) => (
              <li key={item} className="text-[11.5px] text-[var(--color-ink-2)]">• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Guarantee({ icon: Icon, title, body }: { icon: React.ComponentType<{ className?: string }>; title: string; body: string }) {
  return (
    <div className="flex items-start gap-3 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface)]">
        <Icon className="size-3.5 text-[var(--color-ink-2)]" />
      </div>
      <div>
        <p className="text-[13px] font-semibold">{title}</p>
        <p className="mt-0.5 text-[11.5px] text-[var(--color-ink-3)]">{body}</p>
      </div>
    </div>
  );
}
