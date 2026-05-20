"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarPlus, Check, Clock, Info, MapPin, Search, Send, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GradientAvatar } from "@/components/user-pill";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/types";

const durations = [30, 45, 60];
const locations = ["Online (Teams-link volgt)", "Brasserie PZEM 41", "Dockwize Edisonweg 41", "Bij ondernemer op locatie"];

function defaultDate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  d.setHours(14, 0, 0, 0);
  return d.toISOString().slice(0, 16);
}

interface QuickPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableEntrepreneurs: User[];
  defaultEntrepreneurId?: string;
}

export function QuickPlanDialog({
  open,
  onOpenChange,
  availableEntrepreneurs,
  defaultEntrepreneurId,
}: QuickPlanDialogProps) {
  const [entrepreneurId, setEntrepreneurId] = React.useState<string | null>(defaultEntrepreneurId ?? null);
  const [primary, setPrimary] = React.useState(defaultDate(3));
  const [duration, setDuration] = React.useState(45);
  const [location, setLocation] = React.useState(locations[0]);
  const [reason, setReason] = React.useState("");
  const [stage, setStage] = React.useState<"compose" | "sent">("compose");
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setEntrepreneurId(defaultEntrepreneurId ?? null);
        setReason("");
        setSearch("");
        setStage("compose");
      }, 250);
    }
  }, [open, defaultEntrepreneurId]);

  const selected = availableEntrepreneurs.find((e) => e.id === entrepreneurId);
  const filtered = availableEntrepreneurs.filter(
    (e) =>
      !search ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.company?.toLowerCase().includes(search.toLowerCase())
  );

  const send = () => {
    setStage("sent");
    setTimeout(() => onOpenChange(false), 1600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <AnimatePresence mode="wait">
          {stage === "compose" ? (
            <motion.div key="compose" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CalendarPlus className="size-4" /> 1-op-1 plannen
                </DialogTitle>
                <DialogDescription>
                  Kies een ondernemer en stel een moment voor. Past het niet, dan ziet de ondernemer drie alternatieven.
                </DialogDescription>
              </DialogHeader>

              {/* Step 1: select entrepreneur */}
              {!selected ? (
                <div>
                  <label className="mb-1 block text-[11.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
                    Met wie?
                  </label>
                  <div className="relative mb-2">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[var(--color-muted)]" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Zoek op naam of bedrijf…"
                      className="pl-9"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-[280px] space-y-1 overflow-y-auto">
                    {filtered.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => setEntrepreneurId(e.id)}
                        className="flex w-full items-center gap-3 rounded-[10px] border border-[var(--color-border)] p-2.5 text-left transition-all hover:border-[var(--color-ink)] hover:shadow-[var(--shadow-sm)]"
                      >
                        <GradientAvatar
                          initials={e.initials ?? e.name[0]}
                          gradient={e.gradient ?? "from-zinc-400 to-zinc-600"}
                          size="sm"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-semibold">{e.name}</p>
                          <p className="truncate text-[11px] text-[var(--color-ink-3)]">
                            {e.company} · {e.jobTitle}
                          </p>
                        </div>
                      </button>
                    ))}
                    {filtered.length === 0 && (
                      <p className="py-6 text-center text-[12px] text-[var(--color-ink-3)]">
                        Geen ondernemer gevonden.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Selected entrepreneur header */}
                  <div className="flex items-center gap-3 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
                    <GradientAvatar
                      initials={selected.initials ?? selected.name[0]}
                      gradient={selected.gradient ?? "from-zinc-400 to-zinc-600"}
                      size="md"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] font-semibold">{selected.name}</p>
                      <p className="text-[11.5px] text-[var(--color-ink-3)]">{selected.company}</p>
                    </div>
                    {!defaultEntrepreneurId && (
                      <button
                        onClick={() => setEntrepreneurId(null)}
                        className="text-[11.5px] text-[var(--color-ink-3)] underline underline-offset-2 hover:text-[var(--color-ink)]"
                      >
                        Wissel
                      </button>
                    )}
                  </div>

                  <Field label="Voorkeurs moment" icon={CalendarPlus}>
                    <Input
                      type="datetime-local"
                      value={primary}
                      onChange={(e) => setPrimary(e.target.value)}
                      className="h-10 text-[14px]"
                    />
                  </Field>

                  <Field label="Duur" icon={Clock}>
                    <div className="flex gap-1.5">
                      {durations.map((d) => (
                        <button
                          key={d}
                          onClick={() => setDuration(d)}
                          className={cn(
                            "rounded-full border px-3 py-1 text-[12px] font-medium transition-colors",
                            duration === d
                              ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
                              : "border-[var(--color-border)] text-[var(--color-ink-2)] hover:border-[var(--color-border-strong)]"
                          )}
                        >
                          {d} min
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label="Locatie" icon={MapPin}>
                    <div className="flex flex-wrap gap-1.5">
                      {locations.map((l) => (
                        <button
                          key={l}
                          onClick={() => setLocation(l)}
                          className={cn(
                            "rounded-full border px-3 py-1 text-[12px] font-medium transition-colors",
                            location === l
                              ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
                              : "border-[var(--color-border)] text-[var(--color-ink-2)] hover:border-[var(--color-border-strong)]"
                          )}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <div>
                    <label className="mb-1 block text-[11.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
                      Reden / wat wil je bespreken
                    </label>
                    <Textarea
                      rows={3}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Bv. Tussentijds even sparren over de pitch."
                    />
                  </div>

                  <div className="flex items-start gap-2 rounded-[10px] bg-[var(--color-surface-2)] p-3">
                    <Info className="mt-0.5 size-3.5 shrink-0 text-[var(--color-ink-3)]" />
                    <p className="text-[11.5px] text-[var(--color-ink-2)]">
                      Volgende versie: jouw Outlook-agenda wordt automatisch meegelezen voor alternatieve slots.
                    </p>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button variant="secondary" onClick={() => onOpenChange(false)}>Annuleren</Button>
                <Button onClick={send} disabled={!selected || !reason.trim()}>
                  <Send className="size-3.5" /> Voorstel versturen
                </Button>
              </DialogFooter>
            </motion.div>
          ) : (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-6 text-center"
            >
              <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-emerald-100">
                <Check className="size-5 text-emerald-700" strokeWidth={3} />
              </div>
              <h3 className="text-[16px] font-semibold tracking-tight">Voorstel onderweg</h3>
              <p className="mt-1.5 max-w-sm text-[12.5px] text-[var(--color-ink-2)]">
                {selected?.name.split(" ")[0]} ziet je voorstel direct in haar werkmap en krijgt een mail.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 flex items-center gap-1.5 text-[11.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
        <Icon className="size-3" /> {label}
      </label>
      {children}
    </div>
  );
}

interface RequestOneOnOneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coach: User;
}

export function RequestOneOnOneDialog({ open, onOpenChange, coach }: RequestOneOnOneDialogProps) {
  const [topic, setTopic] = React.useState("");
  const [urgency, setUrgency] = React.useState<"normaal" | "snel">("normaal");
  const [stage, setStage] = React.useState<"compose" | "sent">("compose");

  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setTopic("");
        setUrgency("normaal");
        setStage("compose");
      }, 250);
    }
  }, [open]);

  const send = () => {
    setStage("sent");
    setTimeout(() => onOpenChange(false), 1600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <AnimatePresence mode="wait">
          {stage === "compose" ? (
            <motion.div key="compose" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <UserPlus className="size-4" /> 1-op-1 aanvragen
                </DialogTitle>
                <DialogDescription>
                  Vraag {coach.name.split(" ")[0]} om een 1-op-1 sessie. Hij stuurt je een datumvoorstel.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
                  <div className="size-9 shrink-0 overflow-hidden rounded-full bg-[var(--color-surface)]">
                    {coach.avatar ? (
                      <img src={coach.avatar} alt="" className="size-full object-cover" />
                    ) : null}
                  </div>
                  <div>
                    <p className="text-[13.5px] font-semibold">{coach.name}</p>
                    <p className="text-[11.5px] text-[var(--color-ink-3)]">{coach.jobTitle}</p>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-[11.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
                    Waar wil je het over hebben?
                  </label>
                  <Textarea
                    rows={4}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Bv. Ik loop vast op mijn pitch en wil even sparren voor de sessie van dinsdag."
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
                    Hoe snel hoop je dat het kan?
                  </label>
                  <div className="flex gap-1.5">
                    <UrgencyChip active={urgency === "normaal"} onClick={() => setUrgency("normaal")} label="Geen haast (deze maand)" />
                    <UrgencyChip active={urgency === "snel"} onClick={() => setUrgency("snel")} label="Liefst deze week" />
                  </div>
                </div>

                <div className="flex items-start gap-2 rounded-[10px] bg-[var(--color-surface-2)] p-3">
                  <Info className="mt-0.5 size-3.5 shrink-0 text-[var(--color-ink-3)]" />
                  <p className="text-[11.5px] text-[var(--color-ink-2)]">
                    {coach.name.split(" ")[0]} krijgt een melding en stuurt je een datumvoorstel terug. Past dat niet, dan zie je drie alternatieven.
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="secondary" onClick={() => onOpenChange(false)}>Annuleren</Button>
                <Button onClick={send} disabled={!topic.trim()}>
                  <Send className="size-3.5" /> Stuur aanvraag
                </Button>
              </DialogFooter>
            </motion.div>
          ) : (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-6 text-center"
            >
              <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-emerald-100">
                <Check className="size-5 text-emerald-700" strokeWidth={3} />
              </div>
              <h3 className="text-[16px] font-semibold tracking-tight">Aanvraag verstuurd</h3>
              <p className="mt-1.5 max-w-sm text-[12.5px] text-[var(--color-ink-2)]">
                {coach.name.split(" ")[0]} ziet je vraag en stuurt zo snel mogelijk een datumvoorstel.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

function UrgencyChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors",
        active
          ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
          : "border-[var(--color-border)] text-[var(--color-ink-2)] hover:border-[var(--color-border-strong)]"
      )}
    >
      {label}
    </button>
  );
}
