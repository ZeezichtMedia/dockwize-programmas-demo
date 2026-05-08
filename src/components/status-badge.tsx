import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AssignmentStatus } from "@/lib/types";

const map: Record<AssignmentStatus, { label: string; variant: "default" | "info" | "success" | "danger" | "soft" | "outline" | "dark"; dot: string }> = {
  todo: { label: "Te doen", variant: "default", dot: "bg-[var(--color-ink-3)]" },
  in_progress: { label: "Mee bezig", variant: "info", dot: "bg-[var(--color-info)]" },
  submitted: { label: "Ingeleverd", variant: "soft", dot: "bg-amber-500" },
  feedback: { label: "Feedback ontvangen", variant: "soft", dot: "bg-purple-500" },
  done: { label: "Afgerond", variant: "success", dot: "bg-[var(--color-success)]" },
};

export function StatusBadge({ status, className }: { status: AssignmentStatus; className?: string }) {
  const m = map[status];
  return (
    <Badge variant={m.variant} className={cn("gap-1.5 py-0.5 pl-1.5", className)}>
      <span className={cn("size-1.5 rounded-full", m.dot)} />
      {m.label}
    </Badge>
  );
}

export function statusLabel(status: AssignmentStatus) {
  return map[status].label;
}
