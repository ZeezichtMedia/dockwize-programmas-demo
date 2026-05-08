"use client";

import * as React from "react";
import { Archive, AlertTriangle, Clock, Download, ShieldCheck } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GradientAvatar } from "@/components/user-pill";
import { entrepreneursIn } from "@/lib/mock/users";
import { cohorts } from "@/lib/mock/programs";

const retentionPolicies = [
  {
    cohortId: "c_jp7",
    daysAfterEnd: 90,
    notifyBeforeDays: 14,
    autoArchive: true,
    state: "active",
  },
  {
    cohortId: "c_jp6",
    daysAfterEnd: 90,
    notifyBeforeDays: 14,
    autoArchive: true,
    state: "scheduled",
  },
];

export default function AdminRetentiePage() {
  const jp5 = {
    name: "Jouw Programma 5",
    members: 14,
    archiveDate: "2026-05-22",
    daysUntil: 14,
  };

  return (
    <>
      <Topbar
        title="Retentiebeleid"
        subtitle="Bewaring, notificatie en automatische archivering"
      />
      <div className="space-y-6 p-6">
        {/* Active alert */}
        <Card className="overflow-hidden border-amber-200 bg-amber-50/50">
          <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
                <AlertTriangle className="size-5 text-amber-700" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-amber-900">{jp5.name}: archivering over {jp5.daysUntil} dagen</p>
                <p className="mt-0.5 text-[12.5px] text-amber-800">
                  {jp5.members} ondernemers krijgen vandaag een notificatie. Hun werkmappen worden op {new Date(jp5.archiveDate).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })} automatisch gearchiveerd.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">Stuur reminder</Button>
              <Button size="sm">Bekijk lijst</Button>
            </div>
          </div>
        </Card>

        {/* Policies */}
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2">
            <div>
              <CardTitle>Beleid per cohort</CardTitle>
              <p className="text-[12px] text-[var(--color-ink-3)]">Stel per cohort in hoelang werkmappen na afloop bewaard blijven.</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {cohorts.map((c) => {
              const memberCount = entrepreneursIn(c.id).length;
              const policy = retentionPolicies.find((p) => p.cohortId === c.id);
              return (
                <div key={c.id} className="rounded-[12px] border border-[var(--color-border)] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] font-semibold">{c.name}</p>
                        <Badge variant={c.state === "active" ? "info" : "default"}>{c.state === "active" ? "Lopend" : c.state === "archived" ? "Afgerond" : "Komt eraan"}</Badge>
                      </div>
                      <p className="mt-0.5 text-[11.5px] text-[var(--color-ink-3)]">
                        {new Date(c.startDate).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })} – {new Date(c.endDate).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })} · {memberCount} ondernemers
                      </p>
                    </div>
                    <Button variant="secondary" size="sm">Aanpassen</Button>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-[8px] bg-[var(--color-surface-2)] p-3">
                      <p className="flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
                        <Clock className="size-3" /> Bewaartermijn
                      </p>
                      <p className="mt-1 text-[16px] font-semibold">{policy?.daysAfterEnd ?? 90} dagen</p>
                      <p className="text-[11px] text-[var(--color-ink-3)]">na einde programma</p>
                    </div>
                    <div className="rounded-[8px] bg-[var(--color-surface-2)] p-3">
                      <p className="flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
                        <Download className="size-3" /> Notificatie
                      </p>
                      <p className="mt-1 text-[16px] font-semibold">{policy?.notifyBeforeDays ?? 14} dagen</p>
                      <p className="text-[11px] text-[var(--color-ink-3)]">vooraf, met download-link</p>
                    </div>
                    <div className="rounded-[8px] bg-[var(--color-surface-2)] p-3">
                      <p className="flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
                        <Archive className="size-3" /> Auto-archivering
                      </p>
                      <p className="mt-1 text-[16px] font-semibold">{policy?.autoArchive ? "Aan" : "Uit"}</p>
                      <p className="text-[11px] text-[var(--color-ink-3)]">na bewaartermijn</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Werking</CardTitle>
            <p className="text-[12px] text-[var(--color-ink-3)]">Hoe automatische retentie verloopt. Zonder verrassingen.</p>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {[
                {
                  title: "Programma sluit af",
                  body: "Op de einddatum gaat een cohort over naar de status 'afgerond'. Werkmappen blijven gewoon bereikbaar.",
                },
                {
                  title: "Notificatie 14 dagen voor archief",
                  body: "Ondernemers krijgen e-mail + in-app melding met een directe download-link voor al hun bestanden (ZIP).",
                },
                {
                  title: "Archief-flag",
                  body: "Op de archiefdatum worden werkmappen verplaatst naar Cold Storage. Bestanden zijn nog 30 dagen herstelbaar voor admin.",
                },
                {
                  title: "Definitief verwijderen",
                  body: "Daarna worden bestanden onherroepelijk verwijderd. Audit log behoudt het feit-record (wie, wanneer, hoeveel) voor compliance.",
                },
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] text-[11.5px] font-semibold text-white">{i + 1}</div>
                  <div>
                    <p className="text-[13px] font-semibold">{step.title}</p>
                    <p className="mt-0.5 text-[12px] text-[var(--color-ink-2)]">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3 rounded-[12px] bg-[var(--color-surface-2)] p-4">
          <ShieldCheck className="size-4 text-[var(--color-ink-3)]" />
          <p className="text-[12px] text-[var(--color-ink-2)]">
            <span className="font-medium text-[var(--color-ink)]">AVG-compliant:</span> ondernemers kunnen via support hun werkmap eerder laten verwijderen. Dat wordt automatisch in het auditlog gezet.
          </p>
        </div>
      </div>
    </>
  );
}
