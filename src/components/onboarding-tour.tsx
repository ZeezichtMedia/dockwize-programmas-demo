"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTour } from "@/lib/tour-context";

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PADDING = 8;

export function OnboardingTour() {
  const tour = useTour();
  const router = useRouter();
  const pathname = usePathname();
  const [rect, setRect] = React.useState<Rect | null>(null);
  const [hasNavigated, setHasNavigated] = React.useState(false);

  const step = tour.active ? tour.steps[tour.index] : null;

  // Navigate to the right page before showing the spotlight
  React.useEffect(() => {
    if (!step) return;
    setRect(null);
    setHasNavigated(false);

    if (step.page && pathname !== step.page) {
      router.push(step.page);
    } else {
      setHasNavigated(true);
    }
  }, [step, pathname, router]);

  React.useEffect(() => {
    if (!step) return;
    if (!step.page || pathname === step.page) setHasNavigated(true);
  }, [pathname, step]);

  React.useEffect(() => {
    if (!step || !hasNavigated) return;
    if (!step.target) {
      setRect(null);
      return;
    }
    let cancelled = false;
    let attempts = 0;
    const measure = () => {
      if (cancelled) return;
      const el = document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`);
      if (el) {
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
        if (r.top < 80 || r.bottom > window.innerHeight - 80) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(() => {
            const r2 = el.getBoundingClientRect();
            setRect({ top: r2.top, left: r2.left, width: r2.width, height: r2.height });
          }, 320);
        }
        return;
      }
      attempts++;
      if (attempts < 25) setTimeout(measure, 90);
    };
    measure();

    const onResize = () => {
      const el = document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`);
      if (el) {
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      }
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [step, hasNavigated, tour.index]);

  if (!tour.active || !step) return null;

  const totalSteps = tour.steps.length;
  const isFirst = tour.index === 0;
  const isLast = tour.index === totalSteps - 1;
  const placement = step.placement ?? (rect ? "bottom" : "center");
  const tooltipPos = computeTooltipPosition(rect, placement);

  return (
    <AnimatePresence>
      <motion.div
        key="tour"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[150]"
        style={{ pointerEvents: "auto" }}
      >
        <SpotlightOverlay rect={rect} />

        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute z-[151] w-full max-w-sm rounded-[16px] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-xl)]"
          style={tooltipPos}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-full bg-[var(--color-accent)]">
                <Sparkles className="size-3.5 text-[var(--color-ink)]" />
              </div>
              <Badge variant="default" className="text-[10px]">
                {tour.index + 1} van {totalSteps}
              </Badge>
            </div>
            <button
              onClick={tour.stop}
              className="rounded-full p-1 text-[var(--color-ink-3)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
              aria-label="Tour sluiten"
            >
              <X className="size-4" />
            </button>
          </div>

          <h3 className="mt-3 text-[16px] font-semibold leading-tight tracking-tight">{step.title}</h3>
          <div className="mt-1.5 text-[13px] leading-relaxed text-[var(--color-ink-2)]">{step.body}</div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1">
              {tour.steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => tour.goTo(i)}
                  className={`h-1 rounded-full transition-all ${
                    i === tour.index
                      ? "w-5 bg-[var(--color-ink)]"
                      : "w-1 bg-[var(--color-border-strong)] hover:bg-[var(--color-ink-3)]"
                  }`}
                  aria-label={`Stap ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              {!isFirst && (
                <Button variant="ghost" size="sm" onClick={tour.prev}>
                  <ArrowLeft className="size-3.5" /> Terug
                </Button>
              )}
              {isLast ? (
                <Button size="sm" variant="accent" onClick={tour.stop}>
                  {step.primaryActionLabel ?? "Klaar"}
                </Button>
              ) : (
                <Button size="sm" onClick={tour.next}>
                  {step.primaryActionLabel ?? "Volgende"} <ArrowRight className="size-3.5" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        <button
          onClick={tour.stop}
          className="absolute right-5 top-5 z-[152] rounded-full bg-[var(--color-surface)]/95 px-3 py-1.5 text-[11.5px] font-medium text-[var(--color-ink-2)] shadow-[var(--shadow-md)] backdrop-blur-md transition-colors hover:bg-white"
        >
          Tour overslaan
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

function SpotlightOverlay({ rect }: { rect: Rect | null }) {
  if (!rect) {
    return <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />;
  }
  const padded = {
    top: rect.top - PADDING,
    left: rect.left - PADDING,
    width: rect.width + PADDING * 2,
    height: rect.height + PADDING * 2,
  };
  return (
    <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
      <defs>
        <mask id="tour-spotlight-mask">
          <rect width="100%" height="100%" fill="white" />
          <rect
            x={padded.left}
            y={padded.top}
            width={padded.width}
            height={padded.height}
            rx="12"
            fill="black"
          />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="rgba(0,0,0,0.55)" mask="url(#tour-spotlight-mask)" />
      <rect
        x={padded.left}
        y={padded.top}
        width={padded.width}
        height={padded.height}
        rx="12"
        fill="none"
        stroke="#ffda00"
        strokeWidth="2"
        opacity="0.9"
      >
        <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" />
      </rect>
    </svg>
  );
}

function computeTooltipPosition(rect: Rect | null, placement: string): React.CSSProperties {
  if (!rect || placement === "center") {
    return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  }
  const TOOLTIP_WIDTH = 384;
  const GAP = 18;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;

  let top = 0;
  let left = 0;

  switch (placement) {
    case "right":
      left = rect.left + rect.width + GAP;
      top = rect.top + rect.height / 2;
      break;
    case "left":
      left = rect.left - TOOLTIP_WIDTH - GAP;
      top = rect.top + rect.height / 2;
      break;
    case "top":
      left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
      top = rect.top - GAP;
      break;
    case "bottom":
    default:
      left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
      top = rect.top + rect.height + GAP;
      break;
  }

  const margin = 16;
  left = Math.max(margin, Math.min(vw - TOOLTIP_WIDTH - margin, left));
  top = Math.max(margin, Math.min(vh - 200, top));

  const transform =
    placement === "left" || placement === "right"
      ? "translateY(-50%)"
      : placement === "top"
      ? "translateY(-100%)"
      : undefined;

  return { top, left, transform };
}
