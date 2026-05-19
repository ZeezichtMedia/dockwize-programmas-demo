"use client";

import * as React from "react";
import { Filter, MoreHorizontal, Plus, Search, ShieldCheck, UserPlus, Check, ExternalLink } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { GradientAvatar } from "@/components/user-pill";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { coaches, users } from "@/lib/mock/users";
import { cohortsById, programsById } from "@/lib/mock/programs";
import { relativeTime, cn } from "@/lib/utils";
import type { User } from "@/lib/types";

// Demo: ondernemers die "via HubSpot" zijn binnengekomen
const hubspotSourced = new Set(["u_marleen", "u_jeroen", "u_aisha", "u_bram", "u_chantal", "u_finn", "u_isabel", "u_omar", "u_sanne"]);

interface PendingUser {
  name: string;
  company: string;
  email: string;
  source: "hubspot";
  receivedAt: string;
}

const pendingFromHubSpot: PendingUser[] = [
  {
    name: "Lieke van Gerwen",
    company: "TerraTwist Cosmetics",
    email: "lieke@terratwist.nl",
    source: "hubspot",
    receivedAt: "2026-05-07T11:14:00Z",
  },
  {
    name: "Daan Kruijthof",
    company: "Reefly",
    email: "daan@reefly.io",
    source: "hubspot",
    receivedAt: "2026-05-08T08:42:00Z",
  },
];

export default function AdminUsersPage() {
  const entrepreneurs = users.filter((u) => u.role === "entrepreneur");
  const [search, setSearch] = React.useState("");
  const [coachAssignments, setCoachAssignments] = React.useState<Record<string, string>>(
    Object.fromEntries(entrepreneurs.map((u) => [u.id, u.coachId ?? ""]))
  );
  const [assignDialogFor, setAssignDialogFor] = React.useState<string | null>(null);

  const filtered = entrepreneurs.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.company?.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  const targetUser = assignDialogFor ? entrepreneurs.find((u) => u.id === assignDialogFor) : null;

  return (
    <>
      <Topbar
        title="Ondernemers"
        subtitle={`${entrepreneurs.length} actieve werkmappen · ${pendingFromHubSpot.length} wachten op koppeling`}
        action={<Button size="sm"><Plus className="size-4" /> Handmatig toevoegen</Button>}
      />
      <div className="space-y-5 p-6">
        {/* HubSpot inbox */}
        {pendingFromHubSpot.length > 0 && (
          <Card data-tour="admin-hubspot" className="overflow-hidden border-orange-200 bg-orange-50/40">
            <div className="flex items-center justify-between border-b border-orange-200/60 bg-orange-100/40 px-5 py-2.5">
              <div className="flex items-center gap-2">
                <HubSpotMark />
                <p className="text-[12.5px] font-semibold text-orange-900">Vanuit HubSpot binnengekomen</p>
                <Badge variant="default" className="border-orange-200 bg-white text-orange-800">
                  {pendingFromHubSpot.length} nieuw
                </Badge>
              </div>
              <p className="text-[11px] text-orange-800/80">
                Auto-sync via webhook · laatste check: zojuist
              </p>
            </div>
            <div className="divide-y divide-orange-200/60">
              {pendingFromHubSpot.map((p) => (
                <div key={p.email} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-500 text-[11px] font-semibold text-white">
                    {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[13.5px] font-semibold">{p.name}</p>
                      <Badge variant="default" className="border-orange-200 bg-white text-[10px] text-orange-800">
                        Contract getekend · HubSpot
                      </Badge>
                    </div>
                    <p className="truncate text-[11.5px] text-orange-900/70">
                      {p.company} · {p.email} · {relativeTime(p.receivedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-orange-900 hover:bg-orange-100">
                      <ExternalLink className="size-3.5" /> HubSpot-record
                    </Button>
                    <Button size="sm">
                      <UserPlus className="size-3.5" /> Werkmap aanmaken
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[var(--color-muted)]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Zoek op naam, bedrijf of e-mail…"
              className="pl-9"
            />
          </div>
          <Button variant="secondary" size="sm"><Filter className="size-3.5" /> Filter</Button>
        </div>

        {/* Active list */}
        <Card className="overflow-hidden p-0">
          <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)] px-5 py-2.5 text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
            <div className="grid grid-cols-[2fr_1.5fr_1fr_1.2fr_120px_60px] items-center gap-4">
              <span>Naam</span>
              <span>Bedrijf</span>
              <span>Groep</span>
              <span>Coach</span>
              <span>Toegevoegd</span>
              <span></span>
            </div>
          </div>
          {filtered.map((u, idx) => {
            const cohort = u.cohortId ? cohortsById[u.cohortId] : null;
            const program = cohort ? programsById[cohort.programId] : null;
            const coachId = coachAssignments[u.id];
            const coach = coachId ? users.find((x) => x.id === coachId) : null;
            const fromHubSpot = hubspotSourced.has(u.id);
            return (
              <div
                key={u.id}
                className="grid grid-cols-[2fr_1.5fr_1fr_1.2fr_120px_60px] items-center gap-4 border-b border-[var(--color-border)] px-5 py-3.5 last:border-0 hover:bg-[var(--color-surface-2)]/60"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <GradientAvatar
                    initials={u.initials ?? u.name[0]}
                    gradient={u.gradient ?? "from-zinc-400 to-zinc-600"}
                    size="md"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-[13.5px] font-semibold">{u.name}</p>
                      {fromHubSpot && (
                        <span title="Toegevoegd via HubSpot" className="flex shrink-0 items-center">
                          <HubSpotMark size={11} />
                        </span>
                      )}
                    </div>
                    <p className="truncate text-[11px] text-[var(--color-ink-3)]">{u.email}</p>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-medium">{u.company ?? "—"}</p>
                  <p className="truncate text-[11px] text-[var(--color-ink-3)]">{u.jobTitle}</p>
                </div>
                <div>
                  {cohort ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="default">{program?.shortName}</Badge>
                      <span className="text-[11px] text-[var(--color-ink-3)]">
                        {cohort.name.split(" ").slice(-1)}
                      </span>
                    </div>
                  ) : (
                    <Badge variant="soft">Nog niet</Badge>
                  )}
                </div>
                <div data-tour={idx === 0 ? "admin-coach-cell" : undefined}>
                  <button
                    onClick={() => setAssignDialogFor(u.id)}
                    className="group flex items-center gap-2 rounded-[8px] px-1.5 py-0.5 transition-colors hover:bg-[var(--color-surface-2)]"
                  >
                    {coach ? (
                      <>
                        <UserAvatar src={coach.avatar} name={coach.name} size="xs" />
                        <span className="text-[12px] text-[var(--color-ink-2)]">{coach.name.split(" ")[0]}</span>
                        <span className="text-[10px] text-[var(--color-muted)] opacity-0 transition-opacity group-hover:opacity-100">
                          wijzig
                        </span>
                      </>
                    ) : (
                      <Badge variant="soft" className="cursor-pointer">+ Coach toewijzen</Badge>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-[var(--color-ink-3)]">{relativeTime("2026-04-08T08:00:00Z")}</p>
                <div className="flex items-center justify-end gap-1">
                  <button className="rounded p-1.5 text-[var(--color-ink-3)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]">
                    <MoreHorizontal className="size-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </Card>

        <div className="flex items-center gap-3 rounded-[12px] bg-[var(--color-surface-2)] p-4">
          <ShieldCheck className="size-4 text-[var(--color-ink-3)]" />
          <p className="text-[12px] text-[var(--color-ink-2)]">
            <span className="font-medium text-[var(--color-ink)]">Tip:</span> nieuwe ondernemers vanuit
            HubSpot verschijnen automatisch bovenaan zodra Jordi het contract op &lsquo;getekend&rsquo;
            zet. Klik op <strong>Werkmap aanmaken</strong> om in 1 stap groep en coach toe te wijzen.
          </p>
        </div>
      </div>

      {/* Coach assignment dialog */}
      <Dialog open={!!assignDialogFor} onOpenChange={(o) => !o && setAssignDialogFor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {targetUser ? `Coach toewijzen aan ${targetUser.name}` : "Coach toewijzen"}
            </DialogTitle>
            <DialogDescription>
              De coach krijgt direct toegang tot deze werkmap. Andere ondernemers blijven onzichtbaar
              voor deze coach. Wijzigen wordt gelogd in de audit log.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5">
            {coaches.map((c) => {
              const selected = targetUser && coachAssignments[targetUser.id] === c.id;
              const assignedCount = Object.values(coachAssignments).filter((cid) => cid === c.id).length;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    if (!targetUser) return;
                    setCoachAssignments((prev) => ({ ...prev, [targetUser.id]: c.id }));
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-[10px] border p-3 text-left transition-all",
                    selected
                      ? "border-[var(--color-ink)] bg-[var(--color-surface-2)]"
                      : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]"
                  )}
                >
                  <UserAvatar src={c.avatar} name={c.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold">{c.name}</p>
                    <p className="text-[11.5px] text-[var(--color-ink-3)]">{c.bio}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="default" className="text-[10px]">{assignedCount} ondernemers</Badge>
                    {selected && <Check className="size-4 text-[var(--color-ink)]" />}
                  </div>
                </button>
              );
            })}
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setAssignDialogFor(null)}>Annuleren</Button>
            <Button onClick={() => setAssignDialogFor(null)}>
              <Check className="size-4" /> Bevestig toewijzing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function HubSpotMark({ size = 14 }: { size?: number }) {
  // Simplified HubSpot icon (orange round-ended cross)
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="14" r="4" stroke="#FF7A59" strokeWidth="2" />
      <path d="M14 14V7" stroke="#FF7A59" strokeWidth="2" strokeLinecap="round" />
      <circle cx="6" cy="7" r="2" fill="#FF7A59" />
      <circle cx="14" cy="3" r="1.5" fill="#FF7A59" />
    </svg>
  );
}
