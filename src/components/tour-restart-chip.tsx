"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useTour } from "@/lib/tour-context";
import { useAuth } from "@/lib/auth-context";

export function TourRestartChip() {
  const tour = useTour();
  const pathname = usePathname();
  const { user } = useAuth();

  if (pathname === "/login" || pathname === "/") return null;
  if (!user) return null;
  if (tour.active) return null;
  if (tour.steps.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.button
        key="tour-chip"
        onClick={tour.start}
        initial={{ opacity: 0, y: 14, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 14, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[var(--color-accent)] py-2 pl-2.5 pr-3.5 text-[12.5px] font-semibold text-[var(--color-ink)] shadow-[var(--shadow-lg)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <span className="flex size-5 items-center justify-center rounded-full bg-[var(--color-ink)]">
          <Sparkles className="size-3 text-[var(--color-accent)]" />
        </span>
        Start rondleiding
      </motion.button>
    </AnimatePresence>
  );
}
