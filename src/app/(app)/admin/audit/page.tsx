"use client";

import * as React from "react";
import { Filter, Search, ShieldCheck } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MultiFilter } from "@/components/planner/multi-filter";
import { auditLog } from "@/lib/mock/notifications";
import { getUser, users } from "@/lib/mock/users";
import { relativeTime } from "@/lib/utils";

export default function AuditPage() {
  const [search, setSearch] = React.useState("");

  const entrepreneurs = users.filter((u) => u.role === "entrepreneur");
  const [filterEntrepreneurs, setFilterEntrepreneurs] = React.useState<Set<string>>(
    new Set([...entrepreneurs.map((u) => u.id), "__none__"]) // "__none__" = audit-events zonder entrepreneurId zichtbaar
  );

  const actors = Array.from(new Set(auditLog.map((l) => l.actorId)))
    .map((id) => getUser(id))
    .filter((u): u is NonNullable<typeof u> => !!u);
  const [filterActors, setFilterActors] = React.useState<Set<string>>(new Set(actors.map((u) => u.id)));

  const types = Array.from(new Set(auditLog.map((l) => l.targetType)));
  const [filterTypes, setFilterTypes] = React.useState<Set<string>>(new Set(types));

  // Entrepreneur counts per audit-log entry
  const entrepreneurCounts = React.useMemo(() => {
    const map = new Map<string, number>();
    auditLog.forEach((l) => {
      const key = l.entrepreneurId ?? "__none__";
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return map;
  }, []);

  const filtered = auditLog
    .slice()
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .filter((l) => {
      if (search) {
        const q = search.toLowerCase();
        if (!l.action.toLowerCase().includes(q) && !l.target.toLowerCase().includes(q)) return false;
      }
      const entKey = l.entrepreneurId ?? "__none__";
      if (!filterEntrepreneurs.has(entKey)) return false;
      if (!filterActors.has(l.actorId)) return false;
      if (!filterTypes.has(l.targetType)) return false;
      return true;
    });

  return (
    <>
      <Topbar
        title="Audit log"
        subtitle="Volledig spoor van wie wat deed. Onveranderlijk en exporteerbaar."
      />
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative max-w-md flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[var(--color-muted)]" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Zoek actie of target…" className="pl-9" />
          </div>
          <MultiFilter
            label="Ondernemer"
            options={[
              ...entrepreneurs.map((u) => ({
                id: u.id,
                label: u.name,
                meta: String(entrepreneurCounts.get(u.id) ?? 0),
              })),
              {
                id: "__none__",
                label: "Geen ondernemer (systeem-acties)",
                meta: String(entrepreneurCounts.get("__none__") ?? 0),
              },
            ]}
            selected={filterEntrepreneurs}
            onChange={setFilterEntrepreneurs}
          />
          <MultiFilter
            label="Door wie"
            options={actors.map((u) => ({ id: u.id, label: u.name }))}
            selected={filterActors}
            onChange={setFilterActors}
          />
          <MultiFilter
            label="Type"
            options={types.map((t) => ({ id: t, label: t }))}
            selected={filterTypes}
            onChange={setFilterTypes}
          />
          <Button variant="ghost" size="sm">Exporteer CSV</Button>
        </div>

        <p className="text-[11.5px] text-[var(--color-ink-3)]">
          <strong className="font-medium text-[var(--color-ink-2)]">Pascal-tip:</strong> filter op één ondernemer om te zien wie de laatste contactmomenten heeft gehad en wat afgesproken is. Hele tooling is ondernemer-gericht.
        </p>

        <Card className="overflow-hidden p-0">
          <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)] px-5 py-2.5 text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
            <div className="grid grid-cols-[160px_140px_140px_1fr_120px] gap-4">
              <span>Wanneer</span>
              <span>Door wie</span>
              <span>Op ondernemer</span>
              <span>Wat</span>
              <span>Type</span>
            </div>
          </div>
          <div>
            {filtered.length === 0 ? (
              <div className="p-10 text-center text-[12.5px] text-[var(--color-ink-3)]">
                Geen audit-regels gevonden met dit filter.
              </div>
            ) : (
              filtered.map((log) => {
                const actor = getUser(log.actorId);
                const ent = log.entrepreneurId ? getUser(log.entrepreneurId) : null;
                return (
                  <div key={log.id} className="grid grid-cols-[160px_140px_140px_1fr_120px] items-center gap-4 border-b border-[var(--color-border)] px-5 py-3 last:border-0 hover:bg-[var(--color-surface-2)]/60">
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
                      {ent ? (
                        <span className="truncate text-[12px] text-[var(--color-ink)]">{ent.name}</span>
                      ) : (
                        <span className="text-[11.5px] text-[var(--color-muted)]">—</span>
                      )}
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
                  </div>
                );
              })
            )}
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
    "user.assigned_to_cohort": "Koppelde aan groep:",
    "user.assigned_coach": "Wees coach toe:",
    "file.uploaded": "Uploadde bestand:",
    "feedback.posted": "Gaf feedback op:",
    "library.published": "Publiceerde:",
    "retention.scheduled": "Plande retentie:",
    "session.scheduled": "Plande sessie:",
    "chat.posted": "Plaatste in chat:",
    "ai.queried": "Vroeg de bibliotheek:",
    "assignment.submitted": "Leverde opdracht in:",
  };
  return map[action] ?? action;
}
