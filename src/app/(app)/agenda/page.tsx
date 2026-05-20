"use client";

import * as React from "react";
import { CalendarPlus, Coffee, Filter, Hourglass, PartyPopper, Sparkles, UserPlus } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AgendaItemCard } from "@/components/agenda-item";
import { QuickPlanDialog, RequestOneOnOneDialog } from "@/components/quick-plan-dialog";
import { useUser } from "@/lib/auth-context";
import { agendaForUser, agendaByDay } from "@/lib/mock/agenda";
import { users, getUser } from "@/lib/mock/users";
import { workfolders } from "@/lib/mock/workfolders";
import { cn } from "@/lib/utils";
import type { AgendaItem } from "@/lib/mock/sessions";

type FilterKind = "all" | "session" | "oneonone" | "deadline" | "event";

const filterLabels: Record<FilterKind, string> = {
  all: "Alles",
  session: "Sessies",
  oneonone: "1-op-1's",
  deadline: "Deadlines",
  event: "Events",
};

export default function AgendaPage() {
  const user = useUser();
  const all = agendaForUser(user.id);
  const [filter, setFilter] = React.useState<FilterKind>("all");
  const [openPlan, setOpenPlan] = React.useState(false);
  const [openRequest, setOpenRequest] = React.useState(false);

  const filtered = filter === "all" ? all : all.filter((i) => i.kind === filter);
  const grouped = agendaByDay(filtered);

  const counts: Record<FilterKind, number> = {
    all: all.length,
    session: all.filter((i) => i.kind === "session").length,
    oneonone: all.filter((i) => i.kind === "oneonone").length,
    deadline: all.filter((i) => i.kind === "deadline").length,
    event: all.filter((i) => i.kind === "event").length,
  };

  const coachEntrepreneurs = React.useMemo(() => {
    if (user.role !== "coach") return [];
    const ownIds = workfolders.filter((wf) => wf.coachId === user.id).map((wf) => wf.entrepreneurId);
    const coverageCoaches = users.filter((u) => u.availability?.coverageBy === user.id);
    const coverageIds = workfolders
      .filter((wf) => coverageCoaches.some((c) => c.id === wf.coachId))
      .map((wf) => wf.entrepreneurId);
    return Array.from(new Set([...ownIds, ...coverageIds]))
      .map((id) => getUser(id))
      .filter((u): u is NonNullable<typeof u> => !!u);
  }, [user]);

  const allEntrepreneurs = React.useMemo(() => {
    if (!["admin", "super_admin", "program_manager"].includes(user.role)) return [];
    return users.filter((u) => u.role === "entrepreneur");
  }, [user.role]);

  const coachUser = user.coachId ? getUser(user.coachId) : null;
  const subtitle = roleSubtitle(user.role, all.length);

  return (
    <>
      <Topbar
        title="Agenda"
        subtitle={subtitle}
        action={
          user.role === "entrepreneur" && coachUser ? (
            <Button size="sm" variant="accent" onClick={() => setOpenRequest(true)}>
              <UserPlus className="size-3.5" /> Vraag 1-op-1 aan
            </Button>
          ) : (
            <Button size="sm" variant="accent" onClick={() => setOpenPlan(true)}>
              <CalendarPlus className="size-3.5" /> Plan 1-op-1
            </Button>
          )
        }
      />

      <div className="space-y-5 p-6">
        {/* Summary tiles */}
        <div className="grid gap-3 sm:grid-cols-4">
          <SummaryTile
            icon={Sparkles}
            label="Groepssessies"
            value={counts.session}
            tone="ink"
          />
          <SummaryTile
            icon={Coffee}
            label="1-op-1's"
            value={counts.oneonone}
            tone="blue"
          />
          <SummaryTile
            icon={Hourglass}
            label="Deadlines"
            value={counts.deadline}
            tone="red"
          />
          <SummaryTile
            icon={PartyPopper}
            label="Events"
            value={counts.event}
            tone="purple"
          />
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Filter className="size-3.5 text-[var(--color-muted)] mr-1" />
          {(["all", "session", "oneonone", "deadline", "event"] as FilterKind[]).map((k) => (
            <FilterChip
              key={k}
              active={filter === k}
              onClick={() => setFilter(k)}
              count={counts[k]}
            >
              {filterLabels[k]}
            </FilterChip>
          ))}
        </div>

        {/* Day-grouped list */}
        {grouped.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="text-[14px] font-medium">Geen items op de agenda</p>
            <p className="mt-1 text-[12px] text-[var(--color-ink-3)]">Pas je filter aan of plan iets nieuws.</p>
          </Card>
        ) : (
          <div className="space-y-5">
            {grouped.map((g) => (
              <DaySection key={g.date} date={g.date} items={g.items} />
            ))}
          </div>
        )}

        <p className="text-center text-[11px] text-[var(--color-muted)]">
          Volgende versie: jouw Outlook of Google-agenda synchroniseert automatisch zodat dubbel boeken niet kan.
        </p>
      </div>

      <QuickPlanDialog
        open={openPlan}
        onOpenChange={setOpenPlan}
        availableEntrepreneurs={user.role === "coach" ? coachEntrepreneurs : allEntrepreneurs}
      />
      {coachUser && (
        <RequestOneOnOneDialog open={openRequest} onOpenChange={setOpenRequest} coach={coachUser} />
      )}
    </>
  );
}

function roleSubtitle(role: string, total: number): string {
  switch (role) {
    case "entrepreneur":
      return `Jouw sessies, 1-op-1's en deadlines · ${total} items`;
    case "coach":
      return `Sessies en 1-op-1's met jouw ondernemers · ${total} items`;
    case "program_manager":
      return `Alles wat in jouw programma's gepland staat · ${total} items`;
    case "admin":
      return `Overzicht over alle groepen · ${total} items`;
    case "super_admin":
      return `Volledig overzicht · ${total} items`;
    default:
      return `${total} items`;
  }
}

function FilterChip({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11.5px] font-medium transition-colors",
        active
          ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
          : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-2)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]"
      )}
    >
      {children}
      <span className={cn("text-[10px]", active ? "text-white/70" : "text-[var(--color-muted)]")}>
        {count}
      </span>
    </button>
  );
}

function SummaryTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone: "ink" | "blue" | "red" | "purple";
}) {
  const tones = {
    ink: "bg-[var(--color-ink)] text-[var(--color-accent)]",
    blue: "bg-blue-600 text-white",
    red: "bg-red-600 text-white",
    purple: "bg-purple-600 text-white",
  };
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <p className="text-[11.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">{label}</p>
        <div className={cn("flex size-7 items-center justify-center rounded-[7px]", tones[tone])}>
          <Icon className="size-3.5" />
        </div>
      </div>
      <p className="mt-1.5 text-[24px] font-semibold tracking-tight">{value}</p>
    </Card>
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
        <Badge variant="default" className="ml-auto text-[10px]">{items.length}</Badge>
      </div>
      <div className="space-y-2">
        {items.map((i) => (
          <AgendaItemCard key={i.id} item={i} />
        ))}
      </div>
    </div>
  );
}
