import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-[16px] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)]/50 px-6 py-12 text-center", className)}>
      {Icon && (
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-[var(--color-surface-2)]">
          <Icon className="size-5 text-[var(--color-ink-3)]" />
        </div>
      )}
      <p className="text-[14px] font-medium text-[var(--color-ink)]">{title}</p>
      {description && <p className="mt-1 max-w-sm text-[12.5px] text-[var(--color-ink-3)]">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
