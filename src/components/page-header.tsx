import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 border-b border-[var(--color-border)] px-8 pb-6 pt-8 md:flex-row md:items-end md:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-muted)]">
            {eyebrow}
          </div>
        )}
        <h1 className="text-balance text-[28px] font-semibold leading-[1.1] tracking-tight text-[var(--color-ink)]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-xl text-[14px] text-[var(--color-ink-3)]">{description}</p>
        )}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}
