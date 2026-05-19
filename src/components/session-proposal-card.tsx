"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, CalendarCheck, CalendarX, Check, ChevronRight, Clock, MapPin, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { getUser } from "@/lib/mock/users";
import { cn } from "@/lib/utils";
import type { SessionProposal } from "@/lib/types";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" });
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
}

function fmtSlot(iso: string) {
  return `${fmtDate(iso)} · ${fmtTime(iso)}`;
}

interface SessionProposalCardProps {
  proposal: SessionProposal;
}

export function SessionProposalCard({ proposal }: SessionProposalCardProps) {
  const coach = getUser(proposal.coachId);
  // Local UI state for the demo
  const [status, setStatus] = React.useState(proposal.status);
  const [acceptedSlot, setAcceptedSlot] = React.useState(proposal.acceptedSlot ?? proposal.primarySlot);
  const [showAlts, setShowAlts] = React.useState(proposal.status === "alternatives_requested");

  if (status === "accepted") {
    return <AcceptedView coach={coach} slot={acceptedSlot} proposal={proposal} />;
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-[14px] border-2 border-[var(--color-accent)] bg-gradient-to-br from-[var(--color-accent-soft)]/60 to-white p-5 shadow-[var(--shadow-sm)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {coach && <UserAvatar src={coach.avatar} name={coach.name} size="md" />}
          <div className="min-w-0">
            <Badge variant="dark" className="mb-1.5 gap-1">
              <Calendar className="size-2.5" /> 1-op-1 voorstel
            </Badge>
            <p className="text-[14px] font-semibold text-[var(--color-ink)]">
              {coach?.name.split(" ")[0]} wil een 1-op-1 met je inplannen
            </p>
            <p className="mt-1 text-[12.5px] text-[var(--color-ink-2)]">{proposal.reason}</p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showAlts ? (
          <motion.div
            key="primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4"
          >
            <div className="rounded-[10px] border border-[var(--color-border)] bg-white p-3">
              <p className="text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
                Voorstel
              </p>
              <p className="mt-1 text-[14px] font-semibold tracking-tight">
                {fmtSlot(proposal.primarySlot)}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11.5px] text-[var(--color-ink-3)]">
                <span className="flex items-center gap-1">
                  <Clock className="size-3" /> {proposal.durationMin} min
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3" /> {proposal.location}
                </span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="accent"
                onClick={() => {
                  setAcceptedSlot(proposal.primarySlot);
                  setStatus("accepted");
                }}
              >
                <Check className="size-3.5" /> Past me, bevestigen
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setShowAlts(true)}>
                <CalendarX className="size-3.5" /> Komt me niet uit
              </Button>
              <Button size="sm" variant="ghost">
                <MessageSquare className="size-3.5" /> Vraag stellen aan {coach?.name.split(" ")[0]}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="alts"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4"
          >
            <p className="text-[12.5px] font-medium text-[var(--color-ink)]">
              {coach?.name.split(" ")[0]} stelt drie andere momenten voor:
            </p>
            <div className="mt-2 space-y-2">
              {proposal.alternativeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => {
                    setAcceptedSlot(slot);
                    setStatus("accepted");
                  }}
                  className="group flex w-full items-center justify-between gap-3 rounded-[10px] border border-[var(--color-border)] bg-white p-3 text-left transition-all hover:border-[var(--color-ink)] hover:shadow-[var(--shadow-sm)]"
                >
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-semibold">{fmtSlot(slot)}</p>
                    <p className="mt-0.5 text-[11.5px] text-[var(--color-ink-3)]">
                      {proposal.durationMin} min · {proposal.location}
                    </p>
                  </div>
                  <ChevronRight className="size-4 text-[var(--color-muted)] transition-all group-hover:translate-x-0.5 group-hover:text-[var(--color-ink)]" />
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <button
                onClick={() => setShowAlts(false)}
                className="text-[11.5px] text-[var(--color-ink-3)] underline underline-offset-2 hover:text-[var(--color-ink)]"
              >
                ← Terug naar oorspronkelijk voorstel
              </button>
              <Button size="sm" variant="ghost">
                Geen van deze opties past
              </Button>
            </div>
            <p className="mt-3 text-[11px] text-[var(--color-muted)]">
              {coach?.name.split(" ")[0]}'s beschikbaarheid wordt later automatisch uit Outlook gehaald. Voor nu zijn deze opties handmatig voorgesteld.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AcceptedView({
  coach,
  slot,
  proposal,
}: {
  coach: ReturnType<typeof getUser>;
  slot: string;
  proposal: SessionProposal;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-[14px] border border-emerald-200 bg-emerald-50/60 p-5"
    >
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
          <CalendarCheck className="size-5 text-emerald-700" />
        </div>
        <div className="min-w-0 flex-1">
          <Badge variant="success" className="mb-1.5">Bevestigd</Badge>
          <p className="text-[14px] font-semibold text-emerald-900">
            1-op-1 met {coach?.name.split(" ")[0]} op {fmtSlot(slot)}
          </p>
          <p className="mt-1 text-[12px] text-emerald-900/80">
            {proposal.durationMin} min · {proposal.location}. Je krijgt een herinnering 24 uur van tevoren.
          </p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="secondary" className="border-emerald-200 bg-white">
              <Calendar className="size-3.5" /> Naar mijn agenda
            </Button>
            <Button size="sm" variant="ghost" className="text-emerald-900 hover:bg-emerald-100">
              Verzetten
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
