"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Search, Library as LibraryIcon } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LibraryCard } from "@/components/library-card";
import { useUser } from "@/lib/auth-context";
import { libraryByProgram } from "@/lib/mock/library";
import { getCohort, getProgram } from "@/lib/mock/programs";
import { cn } from "@/lib/utils";

export default function BibliotheekPage() {
  const user = useUser();
  const cohortId = user.cohortId ?? "c_jp7";
  const cohort = getCohort(cohortId);
  const programId = cohort?.programId ?? "p_jouw";
  const program = getProgram(programId)!;
  const items = libraryByProgram(programId);

  const modules = Array.from(new Set(items.map((i) => i.module)));
  const types = Array.from(new Set(items.map((i) => i.type)));

  const [activeModule, setActiveModule] = React.useState<string | null>(null);
  const [activeType, setActiveType] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");

  const filtered = items.filter((i) => {
    if (activeModule && i.module !== activeModule) return false;
    if (activeType && i.type !== activeType) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !i.title.toLowerCase().includes(q) &&
        !i.description.toLowerCase().includes(q) &&
        !i.tags.some((t) => t.includes(q))
      )
        return false;
    }
    return true;
  });

  return (
    <>
      <Topbar
        title="Bibliotheek"
        subtitle={`${program.shortName} · ${items.length} materialen`}
      />
      <div className="p-6 space-y-6">
        {/* AI hero */}
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-[var(--color-ink)] via-[#2a2a28] to-[#1a1a18] p-7 text-white shadow-[var(--shadow-lg)]">
          <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
            <div className="max-w-xl">
              <Badge variant="accent" className="mb-3"><Sparkles className="size-3" /> AI Assistent</Badge>
              <h2 className="text-balance text-[22px] font-semibold leading-tight tracking-tight">
                Stel een vraag aan de hele bibliotheek tegelijk.
              </h2>
              <p className="mt-2 text-[13.5px] text-white/70">
                Ik ken alle video's, documenten en sessies van {program.shortName}. Vraag bijvoorbeeld
                <em className="text-white/90"> &ldquo;Wat hebben we behandeld over funding?&rdquo;</em>, en ik wijs je gelijk de juiste plek.
              </p>
            </div>
            <Button asChild variant="accent" size="lg">
              <Link href="/ai">
                <Sparkles className="size-4" /> Stel een vraag
              </Link>
            </Button>
          </div>
        </Card>

        {/* Search & filters */}
        <div className="space-y-3">
          <div className="relative max-w-lg">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[var(--color-muted)]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Zoek in titels, beschrijvingen, tags…"
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            <FilterChip active={activeModule === null} onClick={() => setActiveModule(null)}>
              Alle modules
            </FilterChip>
            {modules.map((m) => (
              <FilterChip key={m} active={activeModule === m} onClick={() => setActiveModule(m === activeModule ? null : m)}>
                {m}
              </FilterChip>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            <FilterChip active={activeType === null} onClick={() => setActiveType(null)} small>Alle vormen</FilterChip>
            {types.map((t) => (
              <FilterChip key={t} active={activeType === t} small onClick={() => setActiveType(t === activeType ? null : t)}>
                {t === "video" ? "Video" : t === "document" ? "Document" : t === "deck" ? "Deck" : t === "podcast" ? "Podcast" : "Template"}
              </FilterChip>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <Card className="p-10 text-center">
            <LibraryIcon className="mx-auto mb-3 size-8 text-[var(--color-ink-3)]" />
            <p className="text-[14px] font-medium">Geen materialen gevonden</p>
            <p className="mt-1 text-[12px] text-[var(--color-ink-3)]">Pas je filter aan of zoek anders.</p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((item) => (
              <LibraryCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
  small,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border font-medium transition-colors",
        small ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-[12px]",
        active
          ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
          : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-2)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]"
      )}
    >
      {children}
    </button>
  );
}
