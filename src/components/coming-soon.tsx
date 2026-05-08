import { Topbar } from "@/components/topbar";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export function ComingSoon({ title, subtitle, description }: { title: string; subtitle?: string; description?: string }) {
  return (
    <>
      <Topbar title={title} subtitle={subtitle} />
      <div className="p-6">
        <Card className="overflow-hidden bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-2)] p-12 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[var(--color-accent)]">
            <Sparkles className="size-5 text-[var(--color-ink)]" />
          </div>
          <h2 className="text-[20px] font-semibold tracking-tight">{title}</h2>
          {description && <p className="mx-auto mt-2 max-w-md text-[13px] text-[var(--color-ink-3)]">{description}</p>}
          <p className="mt-3 text-[11.5px] text-[var(--color-muted)]">In de demo nog niet uitgewerkt. Wel voorzien in het MVP.</p>
        </Card>
      </div>
    </>
  );
}
