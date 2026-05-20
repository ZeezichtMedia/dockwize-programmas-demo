"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Download, FileArchive, FileText, FolderArchive, MessageSquare, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface DownloadWorkfolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entrepreneurFirstName: string;
}

type Stage = "choose" | "preparing" | "ready";

const downloadOptions: { id: string; label: string; desc: string; icon: React.ComponentType<{ className?: string }>; defaultOn: boolean }[] = [
  { id: "files", label: "Mijn bestanden", desc: "Alles wat je hebt geüpload (incl. mappen-structuur)", icon: FolderArchive, defaultOn: true },
  { id: "assignments", label: "Opdrachten en feedback", desc: "Inleveringen en coach-feedback per opdracht als PDF", icon: FileText, defaultOn: true },
  { id: "ai", label: "AI-gesprekken", desc: "Vragen die je aan de bibliotheek stelde, met antwoorden", icon: Sparkles, defaultOn: false },
  { id: "chats", label: "Chat-berichten", desc: "Berichten uit groepschat en subgroepjes waar je in zat", icon: MessageSquare, defaultOn: false },
];

export function DownloadWorkfolderDialog({
  open,
  onOpenChange,
  entrepreneurFirstName,
}: DownloadWorkfolderDialogProps) {
  const [stage, setStage] = React.useState<Stage>("choose");
  const [selected, setSelected] = React.useState<Set<string>>(
    new Set(downloadOptions.filter((o) => o.defaultOn).map((o) => o.id))
  );

  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStage("choose");
        setSelected(new Set(downloadOptions.filter((o) => o.defaultOn).map((o) => o.id)));
      }, 250);
    }
  }, [open]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const start = () => {
    setStage("preparing");
    setTimeout(() => setStage("ready"), 1800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px]">
        <AnimatePresence mode="wait">
          {stage === "choose" && (
            <motion.div
              key="choose"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Download className="size-4" /> Download mijn werkmap
                </DialogTitle>
                <DialogDescription>
                  Pak alles wat je in jouw werkmap hebt mee. Je krijgt een ZIP met je bestanden plus een PDF van je opdrachten en feedback.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2">
                {downloadOptions.map((opt) => {
                  const isOn = selected.has(opt.id);
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggle(opt.id)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-[10px] border p-3 text-left transition-all",
                        isOn
                          ? "border-[var(--color-ink)] bg-[var(--color-surface-2)]"
                          : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]"
                      )}
                    >
                      <div
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-[8px]",
                          isOn ? "bg-[var(--color-ink)] text-[var(--color-accent)]" : "bg-[var(--color-surface-2)] text-[var(--color-ink-2)]"
                        )}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold">{opt.label}</p>
                        <p className="mt-0.5 text-[11.5px] text-[var(--color-ink-3)]">{opt.desc}</p>
                      </div>
                      <span
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded border-2",
                          isOn ? "border-[var(--color-ink)] bg-[var(--color-ink)]" : "border-[var(--color-border-strong)] bg-white"
                        )}
                      >
                        {isOn && <Check className="size-3 text-white" strokeWidth={3} />}
                      </span>
                    </button>
                  );
                })}
              </div>

              <DialogFooter>
                <Button variant="secondary" onClick={() => onOpenChange(false)}>Annuleren</Button>
                <Button onClick={start} disabled={selected.size === 0}>
                  <FileArchive className="size-3.5" /> Klaarzetten
                </Button>
              </DialogFooter>
            </motion.div>
          )}

          {stage === "preparing" && (
            <motion.div
              key="preparing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-6"
            >
              <DialogHeader>
                <DialogTitle>Even pakken voor je…</DialogTitle>
                <DialogDescription>We bundelen je gekozen onderdelen tot één ZIP-bestand.</DialogDescription>
              </DialogHeader>
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.6, ease: "linear" }}
                className="mt-4 h-1.5 rounded-full bg-[var(--color-accent)]"
              />
            </motion.div>
          )}

          {stage === "ready" && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-6 text-center"
            >
              <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-emerald-100">
                <Check className="size-6 text-emerald-700" strokeWidth={3} />
              </div>
              <DialogTitle>Klaar om te downloaden</DialogTitle>
              <DialogDescription className="mt-1">
                {entrepreneurFirstName}, je pakketje staat klaar. {selected.size} onderdelen ingepakt.
              </DialogDescription>
              <div className="mt-4 flex justify-center gap-2">
                <Button variant="secondary" onClick={() => onOpenChange(false)}>Sluiten</Button>
                <Button variant="accent" onClick={() => onOpenChange(false)}>
                  <Download className="size-3.5" /> Download werkmap.zip
                </Button>
              </div>
              <p className="mt-3 text-[11px] text-[var(--color-muted)]">
                Tip: download nogmaals als er iets ontbreekt. Geen limiet.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
