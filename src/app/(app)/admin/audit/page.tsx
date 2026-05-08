"use client";

import * as React from "react";
import { Activity, Filter, Search, ShieldCheck } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { auditLog } from "@/lib/mock/notifications";
import { getUser } from "@/lib/mock/users";
import { relativeTime, cn } from "@/lib/utils";

export default function AuditPage() {
  const [search, setSearch] = React.useState("");

  const filtered = auditLog
    .slice()
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .filter((l) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return l.action.toLowerCase().includes(q) || l.target.toLowerCase().includes(q);
    });

  return (
    <>
      <Topbar
        title="Audit log"
        subtitle="Volledig spoor van wie wat deed. Onveranderlijk en exporteerbaar."
      />
      <div className="space-y-4 p-6">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[var(--color-muted)]" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Zoek actie of target…" className="pl-9" />
          </div>
          <Button variant="secondary" size="sm"><Filter className="size-3.5" /> Filter</Button>
          <Button variant="ghost" size="sm">Exporteer CSV</Button>
        </div>

        <Card className="overflow-hidden p-0">
          <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)] px-5 py-2.5 text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
            <div className="grid grid-cols-[180px_140px_1fr_140px_60px] gap-4">
              <span>Wanneer</span>
              <span>Wie</span>
              <span>Wat</span>
              <span>Type</span>
              <span></span>
            </div>
          </div>
          <div>
            {filtered.map((log) => {
              const actor = getUser(log.actorId);
              return (
                <div key={log.id} className="grid grid-cols-[180px_140px_1fr_140px_60px] items-center gap-4 border-b border-[var(--color-border)] px-5 py-3 last:border-0 hover:bg-[var(--color-surface-2)]/60">
                  <div>
                    <p className="text-[12px] font-medium text-[var(--color-ink)]">{relativeTime(log.timestamp)}</p>
                    <p className="text-[10.5px] text-[var(--color-muted)]">
                      {new Date(log.timestamp).toLocaleString("nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    {actor && <UserAvatar src={actor.avatar} name={actor.name} size="xs" />}
                    <span className="truncate text-[12px] font-medium">{actor?.name.split(" ")[0]}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12.5px]">
                      <span className="font-medium text-[var(--color-ink-2)]">{labelForAction(log.action)}</span>{" "}
                      <span className="text-[var(--color-ink)]">{log.target}</span>
                    </p>
                    {log.meta && (
                      <p className="text-[10.5px] text-[var(--color-muted)]">
                        {Object.entries(log.meta)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(" · ")}
                      </p>
                    )}
                  </div>
                  <Badge variant="default" className="w-fit text-[10px]">{log.targetType}</Badge>
                  <span></span>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="flex items-center gap-3 rounded-[12px] bg-[var(--color-surface-2)] p-4">
          <ShieldCheck className="size-4 text-[var(--color-ink-3)]" />
          <p className="text-[12px] text-[var(--color-ink-2)]">
            <span className="font-medium text-[var(--color-ink)]">Onveranderlijk:</span> auditregels worden append-only opgeslagen. Niemand, ook geen admin, kan eerdere regels bewerken of verwijderen.
          </p>
        </div>
      </div>
    </>
  );
}

function labelForAction(action: string) {
  const map: Record<string, string> = {
    "user.created": "Voegde ondernemer toe:",
    "user.assigned_to_cohort": "Koppelde aan cohort:",
    "user.assigned_coach": "Wees coach toe:",
    "file.uploaded": "Uploadde bestand:",
    "feedback.posted": "Gaf feedback op:",
    "library.published": "Publiceerde:",
    "retention.scheduled": "Plande retentie:",
    "session.scheduled": "Plande sessie:",
  };
  return map[action] ?? action;
}
