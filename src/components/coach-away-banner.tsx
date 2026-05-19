"use client";

import { CalendarClock, MessageCircle, UserCheck } from "lucide-react";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/mock/users";
import type { User } from "@/lib/types";

function fmt(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("nl-NL", { day: "numeric", month: "long" });
}

/**
 * Banner shown to an entrepreneur whose coach is currently away.
 */
export function EntrepreneurCoachAwayBanner({ coach }: { coach: User }) {
  if (coach.availability?.status !== "away") return null;
  const cover = coach.availability.coverageBy ? getUser(coach.availability.coverageBy) : null;
  return (
    <div className="rounded-[14px] border border-amber-200 bg-amber-50/70 p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
          <CalendarClock className="size-5 text-amber-700" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-semibold text-amber-900">
            {coach.name.split(" ")[0]} is afwezig
            {coach.availability.awayUntil && ` tot ${fmt(coach.availability.awayUntil)}`}
            {coach.availability.reason && ` (${coach.availability.reason})`}
          </p>
          {cover && (
            <div className="mt-2 flex items-center gap-2">
              <UserAvatar src={cover.avatar} name={cover.name} size="sm" />
              <p className="text-[12.5px] text-amber-900">
                <strong className="font-semibold">{cover.name}</strong> neemt deze week waar. Je geplande 1-op-1 wordt automatisch geüpdate.
              </p>
            </div>
          )}
          {coach.availability.coverageMessage && (
            <p className="mt-2 text-[12px] leading-relaxed text-amber-900/80">
              {coach.availability.coverageMessage}
            </p>
          )}
          <div className="mt-3 flex gap-2">
            {cover && (
              <Button variant="secondary" size="sm" className="border-amber-200 bg-white">
                <MessageCircle className="size-3.5" /> Stuur {cover.name.split(" ")[0]} een bericht
              </Button>
            )}
            <Button variant="ghost" size="sm" className="text-amber-900 hover:bg-amber-100">
              Bekijk alternatieve sessie-slots
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Banner shown to a coach who is covering for an absent colleague.
 */
export function CoachCoveringBanner({ coveredUsers }: { coveredUsers: User[] }) {
  if (coveredUsers.length === 0) return null;
  const first = coveredUsers[0];
  return (
    <div className="rounded-[14px] border border-blue-200 bg-blue-50/70 p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
          <UserCheck className="size-5 text-blue-700" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-semibold text-blue-900">
            Je neemt waar voor {coveredUsers.map((u) => u.name.split(" ")[0]).join(", ")}
            {first.availability?.awayUntil && ` (tot ${fmt(first.availability.awayUntil)})`}
          </p>
          <p className="mt-1 text-[12.5px] text-blue-900/80">
            Hun ondernemers zijn tijdelijk in jouw lijst zichtbaar met een waarneming-badge. Geplande
            1-op-1's kun je overnemen of voorstellen om te verzetten.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Banner shown to a coach who is themselves marked away.
 */
export function CoachSelfAwayBanner({ user, onToggle }: { user: User; onToggle?: () => void }) {
  if (user.availability?.status !== "away") return null;
  const cover = user.availability.coverageBy ? getUser(user.availability.coverageBy) : null;
  return (
    <div className="rounded-[14px] border border-amber-200 bg-amber-50/70 p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
          <CalendarClock className="size-5 text-amber-700" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-semibold text-amber-900">
            Je staat op afwezig
            {user.availability.awayUntil && ` tot ${fmt(user.availability.awayUntil)}`}
          </p>
          <p className="mt-1 text-[12.5px] text-amber-900/80">
            {cover ? `${cover.name} neemt waar.` : "Joanne is op de hoogte en wijst een waarnemer toe."}{" "}
            Je deelnemers en de groep zien deze status automatisch.
          </p>
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" size="sm" className="border-amber-200 bg-white" onClick={onToggle}>
              Ik ben weer aanwezig
            </Button>
            <Button variant="ghost" size="sm" className="text-amber-900 hover:bg-amber-100">
              Waarnemer wijzigen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
