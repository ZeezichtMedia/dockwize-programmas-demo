"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarCheck, CalendarPlus, UserPlus } from "lucide-react";
import { useUser } from "@/lib/auth-context";
import { upcomingAgendaForUser } from "@/lib/mock/agenda";
import { AgendaItemCard } from "@/components/agenda-item";
import { QuickPlanDialog, RequestOneOnOneDialog } from "@/components/quick-plan-dialog";
import { users, getUser } from "@/lib/mock/users";
import { workfolders } from "@/lib/mock/workfolders";

export function SidebarAgenda() {
  const user = useUser();
  const items = upcomingAgendaForUser(user.id, 3);
  const [openPlan, setOpenPlan] = React.useState(false);
  const [openRequest, setOpenRequest] = React.useState(false);

  // Coach: zijn eigen ondernemers + waarneming
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

  // Admin / super_admin / program_manager: alle ondernemers
  const allEntrepreneurs = React.useMemo(() => {
    if (!["admin", "super_admin", "program_manager"].includes(user.role)) return [];
    return users.filter((u) => u.role === "entrepreneur");
  }, [user.role]);

  const coachUser = user.coachId ? getUser(user.coachId) : null;

  const renderButton = () => {
    if (user.role === "entrepreneur" && coachUser) {
      return (
        <button
          onClick={() => setOpenRequest(true)}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-[10px] bg-[var(--color-accent)] py-2 text-[12px] font-semibold text-[var(--color-ink)] transition-transform hover:scale-[1.01] active:scale-[0.98]"
        >
          <UserPlus className="size-3.5" /> Vraag 1-op-1 aan
        </button>
      );
    }
    if (user.role === "coach" || user.role === "admin" || user.role === "super_admin" || user.role === "program_manager") {
      return (
        <button
          onClick={() => setOpenPlan(true)}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-[10px] bg-[var(--color-accent)] py-2 text-[12px] font-semibold text-[var(--color-ink)] transition-transform hover:scale-[1.01] active:scale-[0.98]"
        >
          <CalendarPlus className="size-3.5" /> Plan 1-op-1
        </button>
      );
    }
    return null;
  };

  return (
    <>
      <div className="border-t border-[var(--color-border)] p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-[0.08em] text-[var(--color-muted)]">
            <CalendarCheck className="size-3" /> Komt eraan
          </p>
          <Link
            href="/agenda"
            className="text-[10px] font-medium text-[var(--color-ink-3)] hover:text-[var(--color-ink)]"
          >
            Bekijk alles
          </Link>
        </div>
        {items.length === 0 ? (
          <div className="rounded-[8px] border border-dashed border-[var(--color-border-strong)] p-3 text-center">
            <p className="text-[11px] text-[var(--color-ink-3)]">Nog niks gepland deze week.</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {items.map((item) => (
              <Link key={item.id} href="/agenda" className="block">
                <AgendaItemCard item={item} variant="compact" />
              </Link>
            ))}
          </div>
        )}
        {renderButton()}
      </div>

      {/* Dialogs */}
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
