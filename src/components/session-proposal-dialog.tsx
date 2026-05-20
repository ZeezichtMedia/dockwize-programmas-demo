"use client";

import * as React from "react";
import { Calendar, CalendarPlus, Clock, Info, MapPin, Send } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface SessionProposalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entrepreneurName: string;
}

const durations = [30, 45, 60];
const locations = ["Online (Teams-link volgt)", "Brasserie PZEM 41", "Dockwize Edisonweg 41", "Bij ondernemer op locatie"];

function defaultDate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  d.setHours(14, 0, 0, 0);
  return d.toISOString().slice(0, 16);
}

export function SessionProposalDialog({ open, onOpenChange, entrepreneurName }: SessionProposalDialogProps) {
  const [primary, setPrimary] = React.useState(defaultDate(5));
  const [duration, setDuration] = React.useState(45);
  const [location, setLocation] = React.useState(locations[0]);
  const [reason, setReason] = React.useState("");
  const [stage, setStage] = React.useState<"compose" | "sent">("compose");

  React.useEffect(() => {
    if (!open) {
      // Reset on close
      setTimeout(() => {
        setStage("compose");
        setReason("");
      }, 200);
    }
  }, [open]);

  const send = () => {
    setStage("sent");
    setTimeout(() => onOpenChange(false), 1600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        {stage === "compose" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarPlus className="size-4" /> 1-op-1 voorstellen aan {entrepreneurName.split(" ")[0]}
              </DialogTitle>
              <DialogDescription>
                Kies je voorkeursdatum. {entrepreneurName.split(" ")[0]} krijgt twee alternatieve momenten te zien
                als deze niet schikt.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Field label="Voorkeurs moment" icon={Calendar}>
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
                  placeholder="Bv. Even sparren over je pitch voor sessie 5."
                />
              </div>

              <div className="flex items-start gap-2 rounded-[10px] bg-[var(--color-surface-2)] p-3">
                <Info className="mt-0.5 size-3.5 shrink-0 text-[var(--color-ink-3)]" />
                <div className="text-[11.5px] text-[var(--color-ink-2)]">
                  <p>
                    <strong className="text-[var(--color-ink)]">Volgende versie:</strong> we lezen je Outlook-agenda mee en stellen automatisch twee alternatieve slots voor.
                  </p>
                  <p className="mt-0.5 text-[var(--color-ink-3)]">
                    In deze demo worden de alternatieven uit een vaste template gehaald.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="secondary" onClick={() => onOpenChange(false)}>Annuleren</Button>
              <Button onClick={send} disabled={!reason.trim()}>
                <Send className="size-3.5" /> Voorstel versturen
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="flex flex-col items-center py-6 text-center">
            <Badge variant="success" className="mb-3">Verstuurd</Badge>
            <h3 className="text-[18px] font-semibold tracking-tight">Voorstel onderweg</h3>
            <p className="mt-1.5 max-w-sm text-[13px] text-[var(--color-ink-2)]">
              {entrepreneurName.split(" ")[0]} ziet je voorstel direct in haar werkmap en krijgt een mail.
              Je krijgt bericht zodra ze accepteert of een alternatief kiest.
            </p>
          </div>
        )}
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
