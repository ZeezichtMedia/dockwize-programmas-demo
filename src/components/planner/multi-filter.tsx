"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MultiFilterOption {
  id: string;
  label: string;
  /** Optionele kleurstip voor visueel scannen */
  dot?: string;
  /** Optionele meta-info (bv. aantal) achteraan */
  meta?: string;
}

interface MultiFilterProps {
  label: string;
  options: MultiFilterOption[];
  selected: Set<string>;
  onChange: (next: Set<string>) => void;
  emptyLabel?: string;
  className?: string;
  compact?: boolean;
}

export function MultiFilter({
  label,
  options,
  selected,
  onChange,
  emptyLabel = "Geen",
  className,
  compact,
}: MultiFilterProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(next);
  };

  const allOn = selected.size === options.length;
  const noneOn = selected.size === 0;
  const displayLabel = allOn
    ? `Alle ${label.toLowerCase()}`
    : noneOn
    ? emptyLabel
    : selected.size === 1
    ? options.find((o) => selected.has(o.id))?.label
    : `${selected.size} van ${options.length}`;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "inline-flex items-center gap-2 rounded-[10px] border bg-[var(--color-surface)] transition-colors",
          compact ? "px-2.5 py-1 text-[11.5px]" : "px-3 py-1.5 text-[12.5px]",
          allOn
            ? "border-[var(--color-border)] text-[var(--color-ink-2)]"
            : "border-[var(--color-ink)] text-[var(--color-ink)] shadow-[var(--shadow-sm)]"
        )}
      >
        <span className="flex -space-x-1" aria-hidden>
          {options
            .filter((o) => selected.has(o.id))
            .slice(0, 4)
            .map((o) => (
              <span
                key={o.id}
                className={cn(
                  "inline-block size-2 rounded-full ring-2 ring-[var(--color-surface)]",
                  o.dot ?? "bg-[var(--color-ink)]"
                )}
              />
            ))}
          {noneOn && <span className="inline-block size-2 rounded-full bg-[var(--color-muted)]/40" />}
        </span>
        <span className="font-medium">{displayLabel}</span>
        <ChevronDown className={cn("size-3 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={`${label} filteren`}
          className="absolute right-0 z-30 mt-1.5 w-64 overflow-hidden rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-xl)]"
        >
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
              {label}
            </p>
            <div className="flex items-center gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => onChange(new Set(options.map((o) => o.id)))}
                disabled={allOn}
                className="text-[var(--color-ink)] hover:underline disabled:text-[var(--color-muted)] disabled:no-underline"
              >
                Alle
              </button>
              <span className="text-[var(--color-muted)]">·</span>
              <button
                type="button"
                onClick={() => onChange(new Set())}
                disabled={noneOn}
                className="text-[var(--color-ink-3)] hover:underline disabled:text-[var(--color-muted)] disabled:no-underline"
              >
                Geen
              </button>
            </div>
          </div>

          <div className="max-h-[280px] overflow-y-auto py-1">
            {options.map((o) => {
              const isOn = selected.has(o.id);
              return (
                <button
                  type="button"
                  key={o.id}
                  onClick={() => toggle(o.id)}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[12.5px] hover:bg-[var(--color-surface-2)]"
                >
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded border",
                      isOn
                        ? "border-[var(--color-ink)] bg-[var(--color-ink)]"
                        : "border-[var(--color-border-strong)] bg-white"
                    )}
                  >
                    {isOn && <Check className="size-3 text-white" strokeWidth={3} />}
                  </span>
                  {o.dot && <span className={cn("inline-block size-2 rounded-full shrink-0", o.dot)} />}
                  <span className="flex-1 truncate">{o.label}</span>
                  {o.meta && <span className="text-[10.5px] text-[var(--color-muted)]">{o.meta}</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
