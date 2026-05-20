"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { AgendaItemCard } from "@/components/agenda-item";
import { agendaForUser, agendaByDay } from "@/lib/mock/agenda";
import { useUser } from "@/lib/auth-context";
import type { AgendaItem } from "@/lib/mock/sessions";

export function EntrepreneurAgenda() {
  const user = useUser();
  const items = agendaForUser(user.id);
  const grouped = agendaByDay(items);

  return (
    <div className="space-y-5 p-6">
      {grouped.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-[14px] font-medium">Geen items op je agenda</p>
          <p className="mt-1 text-[12px] text-[var(--color-ink-3)]">Vraag een 1-op-1 aan of wacht op nieuwe sessies.</p>
        </Card>
      ) : (
        grouped.map((g) => <DaySection key={g.date} date={g.date} items={g.items} />)
      )}
      <p className="text-center text-[11px] text-[var(--color-muted)]">
        Volgende versie: jouw Outlook of Google-agenda synchroniseert automatisch.
      </p>
    </div>
  );
}

function DaySection({ date, items }: { date: string; items: AgendaItem[] }) {
  const d = new Date(date);
  const today = new Date("2026-05-08");
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const isToday = date === today.toISOString().slice(0, 10);
  const isTomorrow = date === tomorrow.toISOString().slice(0, 10);
  const heading = isToday
    ? "Vandaag"
    : isTomorrow
    ? "Morgen"
    : d.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div>
      <div className="mb-2.5 flex items-baseline gap-2 px-1">
        <h3 className="text-[15px] font-semibold tracking-tight text-[var(--color-ink)]">{heading}</h3>
        {!isToday && !isTomorrow && (
          <span className="text-[11px] text-[var(--color-muted)]">
            {d.toLocaleDateString("nl-NL", { day: "numeric", month: "long" })}
          </span>
        )}
      </div>
      <div className="space-y-2">
        {items.map((i) => (
          <AgendaItemCard key={i.id} item={i} />
        ))}
      </div>
    </div>
  );
}
