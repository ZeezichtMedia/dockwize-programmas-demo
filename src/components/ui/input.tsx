import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-9 w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-[14px] transition-all placeholder:text-[var(--color-muted)] focus:border-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)] focus:ring-offset-1 focus:ring-offset-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[14px] transition-all placeholder:text-[var(--color-muted)] focus:border-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)] focus:ring-offset-1 focus:ring-offset-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export { Input, Textarea };
