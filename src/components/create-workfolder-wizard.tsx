"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  GraduationCap,
  Mail,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { coaches, getUser } from "@/lib/mock/users";
import { cohorts, programs } from "@/lib/mock/programs";
import { cn } from "@/lib/utils";

interface PendingUser {
  name: string;
  company: string;
  email: string;
}

interface CreateWorkfolderWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingUser: PendingUser | null;
}

type Step = 1 | 2 | 3 | 4;

const sessionTemplates = [
  { label: "Sessie 1 — Intake & doel", weeksAhead: 1 },
  { label: "Sessie 2 — SWOT & doelgroep", weeksAhead: 3 },
  { label: "Sessie 3 — Propositie & pitch", weeksAhead: 6 },
];

function defaultDate(weeksAhead: number): string {
  const d = new Date("2026-05-08");
  d.setDate(d.getDate() + weeksAhead * 7);
  d.setHours(14, 0, 0, 0);
  return d.toISOString().slice(0, 16);
}

export function CreateWorkfolderWizard({
  open,
  onOpenChange,
  pendingUser,
}: CreateWorkfolderWizardProps) {
  const [step, setStep] = React.useState<Step>(1);
  const [programId, setProgramId] = React.useState<string>("p_jouw");
  const [cohortId, setCohortId] = React.useState<string>("c_jp7");
  const [coachId, setCoachId] = React.useState<string>("u_hans");
  const [sessions, setSessions] = React.useState(
    sessionTemplates.map((t) => ({ label: t.label, date: defaultDate(t.weeksAhead) }))
  );
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(1);
        setProgramId("p_jouw");
        setCohortId("c_jp7");
        setCoachId("u_hans");
        setSessions(sessionTemplates.map((t) => ({ label: t.label, date: defaultDate(t.weeksAhead) })));
        setDone(false);
      }, 250);
    }
  }, [open]);

  if (!pendingUser) return null;

  const activeCohorts = cohorts.filter((c) => c.programId === programId && c.state !== "archived");
  const selectedCoach = getUser(coachId);
  const selectedProgram = programs.find((p) => p.id === programId);
  const selectedCohort = cohorts.find((c) => c.id === cohortId);

  const next = () => setStep((s) => Math.min(4, (s + 1)) as Step);
  const prev = () => setStep((s) => Math.max(1, (s - 1)) as Step);

  const create = () => {
    setDone(true);
    setTimeout(() => {
      onOpenChange(false);
    }, 2400);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[640px]">
        {!done ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge variant="dark">Stap {step} van 4</Badge>
                <span className="text-[11.5px] text-[var(--color-ink-3)]">Werkmap aanmaken</span>
              </div>
              <DialogTitle>
                {pendingUser.name} naar binnen halen
              </DialogTitle>
              <DialogDescription>
                {pendingUser.company} · {pendingUser.email}
              </DialogDescription>
            </DialogHeader>

            {/* Stepper visual */}
            <div className="flex items-center gap-1.5">
              {([1, 2, 3, 4] as Step[]).map((s) => (
                <div
                  key={s}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    s <= step ? "bg-[var(--color-ink)]" : "bg-[var(--color-border)]"
                  )}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <StepWrap key="1">
                  <StepHeader icon={GraduationCap} title="Welk programma?" desc="Aan welk programma neemt deze ondernemer deel?" />
                  <div className="grid gap-2">
                    {programs.slice(0, 4).map((p) => (
                      <SelectRow
                        key={p.id}
                        active={programId === p.id}
                        onClick={() => setProgramId(p.id)}
                        title={p.shortName}
                        body={p.description}
                      />
                    ))}
                  </div>
                </StepWrap>
              )}

              {step === 2 && (
                <StepWrap key="2">
                  <StepHeader icon={Users} title="In welke groep?" desc="Selecteer de actieve groep waar deze ondernemer in komt." />
                  {activeCohorts.length === 0 ? (
                    <p className="rounded-[10px] bg-[var(--color-surface-2)] p-3 text-[12.5px] text-[var(--color-ink-3)]">
                      Geen actieve groep voor dit programma. Maak eerst een nieuwe groep aan.
                    </p>
                  ) : (
                    <div className="grid gap-2">
                      {activeCohorts.map((c) => (
                        <SelectRow
                          key={c.id}
                          active={cohortId === c.id}
                          onClick={() => setCohortId(c.id)}
                          title={c.name}
                          body={`Loopt tot ${new Date(c.endDate).toLocaleDateString("nl-NL", { day: "numeric", month: "long" })}`}
                        />
                      ))}
                    </div>
                  )}
                </StepWrap>
              )}

              {step === 3 && (
                <StepWrap key="3">
                  <StepHeader icon={Sparkles} title="Welke coach?" desc="Wie wordt de toegewezen coach? Wijzigen kan altijd later." />
                  <div className="grid gap-2">
                    {coaches.map((c) => (
                      <SelectRow
                        key={c.id}
                        active={coachId === c.id}
                        onClick={() => setCoachId(c.id)}
                        title={c.name}
                        body={c.bio ?? c.jobTitle ?? ""}
                        avatar={<UserAvatar src={c.avatar} name={c.name} size="sm" />}
                      />
                    ))}
                  </div>
                </StepWrap>
              )}

              {step === 4 && (
                <StepWrap key="4">
                  <StepHeader icon={Calendar} title="Drie startsessies inplannen" desc="Verstuur meteen drie voorgestelde sessies. De ondernemer kan accepteren of een alternatief vragen." />
                  <div className="space-y-2">
                    {sessions.map((s, i) => (
                      <div key={i} className="rounded-[10px] border border-[var(--color-border)] p-3">
                        <p className="text-[12.5px] font-semibold">{s.label}</p>
                        <Input
                          type="datetime-local"
                          value={s.date}
                          onChange={(e) => {
                            const next = [...sessions];
                            next[i] = { ...next[i], date: e.target.value };
                            setSessions(next);
                          }}
                          className="mt-1.5 h-8 text-[12px]"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-start gap-2 rounded-[10px] bg-[var(--color-accent-soft)]/40 p-3">
                    <Mail className="mt-0.5 size-3.5 shrink-0 text-[var(--color-ink-2)]" />
                    <p className="text-[11.5px] text-[var(--color-ink-2)]">
                      {pendingUser.name.split(" ")[0]} krijgt direct een welkomstmail met de loginlink en de drie sessie-voorstellen. Geen Microsoft-account nodig.
                    </p>
                  </div>
                </StepWrap>
              )}
            </AnimatePresence>

            <DialogFooter className="flex-row justify-between sm:justify-between">
              <Button variant="ghost" size="sm" onClick={step === 1 ? () => onOpenChange(false) : prev}>
                {step === 1 ? "Annuleren" : (<><ArrowLeft className="size-3.5" /> Terug</>)}
              </Button>
              {step < 4 ? (
                <Button size="sm" onClick={next}>
                  Volgende <ArrowRight className="size-3.5" />
                </Button>
              ) : (
                <Button variant="accent" size="md" onClick={create}>
                  <Check className="size-3.5" /> Werkmap aanmaken en versturen
                </Button>
              )}
            </DialogFooter>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-6 text-center"
          >
            <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-emerald-100">
              <Check className="size-6 text-emerald-700" strokeWidth={3} />
            </div>
            <DialogTitle>{pendingUser.name} staat klaar</DialogTitle>
            <DialogDescription className="mt-1">
              Werkmap aangemaakt, gekoppeld aan {selectedProgram?.shortName} · {selectedCohort?.name}.
              Coach {selectedCoach?.name.split(" ")[0]} is toegewezen. Drie startsessies verstuurd.
            </DialogDescription>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[var(--color-ink-3)]">
              <ShieldCheck className="size-3" />
              Audit log bijgewerkt
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StepWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2 }}
      className="space-y-3"
    >
      {children}
    </motion.div>
  );
}

function StepHeader({ icon: Icon, title, desc }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)]">
        <Icon className="size-3.5 text-[var(--color-ink)]" />
      </div>
      <div>
        <p className="text-[14px] font-semibold">{title}</p>
        <p className="text-[12px] text-[var(--color-ink-3)]">{desc}</p>
      </div>
    </div>
  );
}

function SelectRow({
  active,
  onClick,
  title,
  body,
  avatar,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  body?: string;
  avatar?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-[10px] border p-3 text-left transition-all",
        active
          ? "border-[var(--color-ink)] bg-[var(--color-surface-2)] shadow-[var(--shadow-sm)]"
          : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]"
      )}
    >
      {avatar}
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold">{title}</p>
        {body && <p className="line-clamp-1 text-[11.5px] text-[var(--color-ink-3)]">{body}</p>}
      </div>
      {active && (
        <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)]">
          <Check className="size-3 text-white" strokeWidth={3} />
        </div>
      )}
    </button>
  );
}
