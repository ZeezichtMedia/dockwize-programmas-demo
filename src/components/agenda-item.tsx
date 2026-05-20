"use client";

import {
  CalendarClock,
  Clock,
  Hourglass,
  MapPin,
  PartyPopper,
  Sparkles,
  Video,
  Coffee,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AgendaItem as AgendaItemType } from "@/lib/mock/sessions";

const kindStyles: Record<
  AgendaItemType["kind"],
  { icon: React.ComponentType<{ className?: string }>; label: string; tile: string; iconBg: string; iconColor: string }
> = {
  session: {
    icon: Sparkles,
    label: "Sessie",
    tile: "border-[var(--color-ink)]/15 bg-gradient-to-br from-white to-[var(--color-accent-soft)]/40",
    iconBg: "bg-[var(--color-ink)]",
    iconColor: "text-[var(--color-accent)]",
  },
  oneonone: {
    icon: Coffee,
    label: "1-op-1",
    tile: "border-blue-200 bg-blue-50/40",
    iconBg: "bg-blue-600",
    iconColor: "text-white",
  },
  deadline: {
    icon: Hourglass,
    label: "Deadline",
    tile: "border-red-200 bg-red-50/40",
    iconBg: "bg-red-600",
    iconColor: "text-white",
  },
  event: {
    icon: PartyPopper,
    label: "Event",
    tile: "border-purple-200 bg-purple-50/40",
    iconBg: "bg-purple-600",
    iconColor: "text-white",
  },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" });
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
}

interface AgendaItemCardProps {
  item: AgendaItemType;
  variant?: "full" | "compact";
  className?: string;
}

export function AgendaItemCard({ item, variant = "full", className }: AgendaItemCardProps) {
  const style = kindStyles[item.kind];
  const Icon = style.icon;
  const isOnline = item.location?.toLowerCase().includes("online") ?? false;

  if (variant === "compact") {
    return (
      <div className={cn("flex items-start gap-2.5 rounded-[10px] border p-2.5", style.tile, className)}>
        <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-[8px]", style.iconBg)}>
          <Icon className={cn("size-3.5", style.iconColor)} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Badge variant="default" className="text-[9px]">{style.label}</Badge>
            {item.status === "proposed" && <Badge variant="soft" className="text-[9px]">Voorstel</Badge>}
            {item.status === "alternatives_requested" && <Badge variant="soft" className="text-[9px]">Alternatief gevraagd</Badge>}
          </div>
          <p className="mt-0.5 truncate text-[12.5px] font-semibold text-[var(--color-ink)]">{item.title}</p>
          <p className="mt-0.5 flex items-center gap-1 text-[10.5px] text-[var(--color-ink-3)]">
            <Clock className="size-2.5" />
            {fmtDate(item.start)} · {fmtTime(item.start)}
            {item.end && ` – ${fmtTime(item.end)}`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex gap-4 rounded-[14px] border p-4 transition-all", style.tile, className)}>
      <div className="flex flex-col items-center gap-1">
        <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-[10px]", style.iconBg)}>
          <Icon className={cn("size-5", style.iconColor)} />
        </div>
        <div className="flex flex-col items-center rounded-[6px] bg-white/70 px-2 py-1 text-center">
          <p className="text-[9px] uppercase font-semibold tracking-wider text-[var(--color-ink-3)]">
            {new Date(item.start).toLocaleDateString("nl-NL", { month: "short" })}
          </p>
          <p className="text-[18px] font-bold leading-none text-[var(--color-ink)]">
            {new Date(item.start).getDate()}
          </p>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="default" className="text-[10px]">{style.label}</Badge>
          {item.status === "proposed" && (
            <Badge variant="soft" className="gap-1 text-[10px]">
              <CalendarClock className="size-2.5" /> Voorstel open
            </Badge>
          )}
          {item.status === "alternatives_requested" && (
            <Badge variant="soft" className="gap-1 text-[10px]">
              <CalendarClock className="size-2.5" /> Alternatief gekozen
            </Badge>
          )}
          {item.status === "confirmed" && item.kind === "oneonone" && (
            <Badge variant="success" className="text-[10px]">Bevestigd</Badge>
          )}
        </div>
        <h3 className="mt-1 text-[15px] font-semibold leading-tight tracking-tight">{item.title}</h3>
        {item.description && (
          <p className="mt-1 text-[12.5px] text-[var(--color-ink-2)]">{item.description}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-[var(--color-ink-3)]">
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {fmtTime(item.start)}
            {item.end && ` – ${fmtTime(item.end)}`}
          </span>
          {item.location && (
            <span className="flex items-center gap-1">
              {isOnline ? <Video className="size-3" /> : <MapPin className="size-3" />}
              {item.location}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
