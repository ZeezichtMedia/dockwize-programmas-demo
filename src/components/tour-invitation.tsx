"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useTour } from "@/lib/tour-context";
import type { Role } from "@/lib/types";

const offeredKey = (role: Role) => `dockwize_tour_offered_${role}_v1`;

const isOffered = (role: Role) => {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(offeredKey(role)) !== null;
};

const markOffered = (role: Role) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(offeredKey(role), new Date().toISOString());
};

const roleIntros: Record<Role, { title: string; body: React.ReactNode; takeMs: number }> = {
  entrepreneur: {
    title: "Hoi, zal ik je rondleiden?",
    body: (
      <>
        Je kijkt nu mee als <strong>Marleen</strong>, een verzonnen ondernemer. Ik wijs je in een minuutje de werkmap, je groep en de slimme bibliotheek aan. Of klik gewoon zelf rond, prima ook.
      </>
    ),
    takeMs: 60,
  },
  coach: {
    title: "Even langs de coach-kant lopen?",
    body: (
      <>
        Je bent nu <strong>Hans</strong>, een van de coaches. In een halve minuut wijs ik aan waar de coach zijn dag mee start. Of klik zelf rond.
      </>
    ),
    takeMs: 30,
  },
  program_manager: {
    title: "De programmamanager-kant bekijken?",
    body: (
      <>
        Je kijkt mee als <strong>Imro</strong>. Korte rondleiding van een halve minuut, of klik zelf de programma's, cohorts en content door.
      </>
    ),
    takeMs: 30,
  },
  admin: {
    title: "Wil je de coördinator-kant zien?",
    body: (
      <>
        Je bent nu <strong>Joanne</strong>. Ik laat je in een minuutje de HubSpot-instroom, coach-toewijzing en retentie zien. Of duik er zelf in.
      </>
    ),
    takeMs: 60,
  },
  super_admin: {
    title: "Pascal, zal ik je dashboard even toelichten?",
    body: (
      <>
        Een minuut langs de KPI's, programma-voortgang en AI-statistieken. Of kijk zelf rond, alles is bereikbaar via het menu links.
      </>
    ),
    takeMs: 60,
  },
};

export function TourInvitation() {
  const { user } = useAuth();
  const tour = useTour();
  const [open, setOpen] = React.useState(false);
  const [hasOffered, setHasOffered] = React.useState<Record<string, boolean>>({});

  // Hydrate from localStorage once on mount
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const map: Record<string, boolean> = {};
    (["entrepreneur", "coach", "program_manager", "admin", "super_admin"] as Role[]).forEach((r) => {
      map[r] = isOffered(r);
    });
    setHasOffered(map);
  }, []);

  // Open the invitation when user lands on a role we haven't offered yet
  React.useEffect(() => {
    if (!user) return;
    if (tour.active) return;
    if (hasOffered[user.role]) return;
    const t = setTimeout(() => setOpen(true), 600);
    return () => clearTimeout(t);
  }, [user, user?.role, hasOffered, tour.active]);

  if (!user) return null;
  const intro = roleIntros[user.role];

  const acceptAndStart = () => {
    markOffered(user.role);
    setHasOffered((prev) => ({ ...prev, [user.role]: true }));
    setOpen(false);
    setTimeout(() => tour.start(), 250);
  };

  const declineForNow = () => {
    markOffered(user.role);
    setHasOffered((prev) => ({ ...prev, [user.role]: true }));
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[160] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={declineForNow}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-[18px] bg-[var(--color-surface)] shadow-[var(--shadow-xl)]"
          >
            <button
              onClick={declineForNow}
              aria-label="Sluiten"
              className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-[var(--color-ink-3)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
            >
              <X className="size-4" />
            </button>

            <div className="bg-gradient-to-br from-[var(--color-accent-soft)] to-white px-6 pb-1 pt-6">
              <div className="flex size-10 items-center justify-center rounded-[10px] bg-[var(--color-ink)]">
                <Sparkles className="size-5 text-[var(--color-accent)]" />
              </div>
              <h2 className="mt-3 text-balance text-[20px] font-semibold leading-tight tracking-tight">
                {intro.title}
              </h2>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-ink-2)]">{intro.body}</p>
              <p className="mt-3 text-[11.5px] text-[var(--color-muted)]">
                Duurt ongeveer {intro.takeMs} seconden. Je kunt 'm later altijd starten via de gele knop rechtsonder.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:flex-row sm:justify-end">
              <Button variant="secondary" size="md" onClick={declineForNow}>
                Nee, later
              </Button>
              <Button variant="accent" size="md" onClick={acceptAndStart}>
                <Sparkles className="size-4" /> Rondleiding volgen
                <ArrowRight className="size-3.5" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
