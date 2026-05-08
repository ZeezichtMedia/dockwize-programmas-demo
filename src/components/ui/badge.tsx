import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-ink-2)]",
        accent:
          "border-transparent bg-[var(--color-accent)] text-[var(--color-ink)]",
        soft:
          "border-transparent bg-[var(--color-accent-soft)] text-[var(--color-ink)]",
        success:
          "border-transparent bg-[var(--color-success-soft)] text-[var(--color-success)]",
        danger:
          "border-transparent bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
        info:
          "border-transparent bg-[var(--color-info-soft)] text-[var(--color-info)]",
        outline:
          "border-[var(--color-border-strong)] bg-transparent text-[var(--color-ink-2)]",
        dark:
          "border-transparent bg-[var(--color-ink)] text-white",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
