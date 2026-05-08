import { UserAvatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/types";

export function UserPill({ user, subtitle, className, size = "sm" }: { user: User; subtitle?: string; className?: string; size?: "xs" | "sm" | "md" }) {
  return (
    <div className={cn("flex items-center gap-2 min-w-0", className)}>
      <UserAvatar src={user.avatar} name={user.name} size={size === "md" ? "md" : "sm"} />
      <div className="min-w-0">
        <p className={cn("truncate font-medium text-[var(--color-ink)] leading-tight", size === "xs" ? "text-[11.5px]" : "text-[12.5px]")}>
          {user.name}
        </p>
        {(subtitle ?? user.company ?? user.jobTitle) && (
          <p className={cn("truncate text-[var(--color-ink-3)] leading-tight", size === "xs" ? "text-[10px]" : "text-[11px]")}>
            {subtitle ?? user.company ?? user.jobTitle}
          </p>
        )}
      </div>
    </div>
  );
}

export function GradientAvatar({ initials, gradient, size = "md", className }: { initials: string; gradient: string; size?: "sm" | "md" | "lg" | "xl"; className?: string }) {
  const sizes = {
    sm: "size-8 text-[10px]",
    md: "size-10 text-[12px]",
    lg: "size-12 text-[14px]",
    xl: "size-16 text-[18px]",
  };
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white shadow-[var(--shadow-sm)]",
        gradient,
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
