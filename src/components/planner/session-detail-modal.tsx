"use client";

import * as React from "react";
import {
  CalendarClock,
  Clock,
  ExternalLink,
  MapPin,
  MessageSquare,
  Trash2,
  Video,
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
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { GradientAvatar } from "@/components/user-pill";
import { getUser } from "@/lib/mock/users";
import type { PlannedSession } from "./planner-week";

interface SessionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: PlannedSession | null;
  onRemove?: (id: string) => void;
}

export function SessionDetailModal({ open, onOpenChange, session, onRemove }: SessionDetailModalProps) {
  if (!session) return null;
  const ent = getUser(session.entrepreneurId);
  const coach = getUser(session.coachId);
  if (!ent) return null;

  const startDate = new Date(`${session.day}T${String(session.hour).padStart(2, "0")}:00:00`);
  const endDate = new Date(startDate.getTime() + session.durationMin * 60_000);
  const isOnline = session.location?.toLowerCase().includes("online") ?? false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Badge variant={session.source === "proposal" ? "success" : "soft"} className="gap-1">
              <CalendarClock className="size-2.5" />
              {session.source === "proposal" ? "Bevestigd" : "Gepland"}
            </Badge>
            <span className="text-[11px] text-[var(--color-ink-3)]">1-op-1 sessie</span>
          </div>
          <DialogTitle>
            {ent.name.split(" ")[0]}
            {coach && ` & ${coach.name.split(" ")[0]}`}
          </DialogTitle>
          <DialogDescription>{session.reason}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-[10px] bg-[var(--color-surface-2)] p-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
              Wanneer
            </p>
            <p className="mt-1 text-[15px] font-semibold tracking-tight">
              {startDate.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-[var(--color-ink-3)]">
              <Clock className="size-3" />
              {startDate.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })} – {endDate.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
              <span className="text-[var(--color-muted)]">· {session.durationMin} min</span>
            </p>
            {session.location && (
              <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[var(--color-ink-2)]">
                {isOnline ? <Video className="size-3" /> : <MapPin className="size-3" />}
                {session.location}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Participant
              role="Ondernemer"
              avatar={
                <GradientAvatar
                  initials={ent.initials ?? ent.name[0]}
                  gradient={ent.gradient ?? "from-zinc-400 to-zinc-600"}
                  size="sm"
                />
              }
              name={ent.name}
              meta={ent.company}
            />
            {coach && (
              <Participant
                role="Coach"
                avatar={<UserAvatar src={coach.avatar} name={coach.name} size="sm" />}
                name={coach.name}
                meta={coach.jobTitle}
              />
            )}
          </div>
        </div>

        <DialogFooter className="flex-row justify-between sm:justify-between">
          <div className="flex gap-1.5">
            {onRemove && (
              <Button variant="ghost" size="sm" onClick={() => onRemove(session.id)} className="text-[var(--color-danger)] hover:bg-red-50">
                <Trash2 className="size-3.5" /> Annuleren
              </Button>
            )}
          </div>
          <div className="flex gap-1.5">
            <Button variant="secondary" size="sm">
              <MessageSquare className="size-3.5" /> Bericht
            </Button>
            {isOnline ? (
              <Button size="sm">
                <Video className="size-3.5" /> Open Teams
              </Button>
            ) : (
              <Button size="sm">
                <ExternalLink className="size-3.5" /> Routebeschrijving
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Participant({
  role,
  avatar,
  name,
  meta,
}: {
  role: string;
  avatar: React.ReactNode;
  name: string;
  meta?: string;
}) {
  return (
    <div className="rounded-[10px] border border-[var(--color-border)] p-2.5">
      <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-[var(--color-muted)]">{role}</p>
      <div className="flex items-center gap-2">
        {avatar}
        <div className="min-w-0">
          <p className="truncate text-[12.5px] font-semibold">{name}</p>
          {meta && <p className="truncate text-[10.5px] text-[var(--color-ink-3)]">{meta}</p>}
        </div>
      </div>
    </div>
  );
}
