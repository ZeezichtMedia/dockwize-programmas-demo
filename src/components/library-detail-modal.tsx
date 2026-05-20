"use client";

import * as React from "react";
import {
  BookmarkPlus,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Headphones,
  Play,
  Presentation,
  Sparkles,
  Volume2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { getUser } from "@/lib/mock/users";
import { getProgram } from "@/lib/mock/programs";
import { cn, relativeTime } from "@/lib/utils";
import type { LibraryItem } from "@/lib/types";

const typeLabels: Record<LibraryItem["type"], string> = {
  video: "Video",
  document: "Document",
  deck: "Slide deck",
  podcast: "Podcast",
  template: "Template",
};

const gradients = [
  "from-purple-500 via-fuchsia-500 to-pink-500",
  "from-indigo-600 via-blue-600 to-cyan-500",
  "from-emerald-500 via-teal-500 to-cyan-500",
  "from-amber-400 via-orange-500 to-red-500",
  "from-rose-400 via-fuchsia-500 to-purple-600",
  "from-slate-700 via-slate-800 to-zinc-900",
  "from-cyan-400 via-blue-500 to-indigo-600",
  "from-yellow-300 via-amber-400 to-orange-500",
  "from-pink-500 via-rose-500 to-red-500",
  "from-lime-400 via-emerald-500 to-teal-600",
  "from-blue-600 via-indigo-700 to-purple-800",
  "from-orange-300 via-amber-400 to-yellow-500",
  "from-zinc-500 via-zinc-700 to-zinc-900",
];

interface LibraryDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: LibraryItem | null;
}

export function LibraryDetailModal({ open, onOpenChange, item }: LibraryDetailModalProps) {
  if (!item) return null;

  const author = item.authorId ? getUser(item.authorId) : null;
  const program = getProgram(item.programId);
  const gradient = gradients[(item.thumbnailSeed ?? 0) % gradients.length];

  const TypeIcon =
    item.type === "video"
      ? Play
      : item.type === "podcast"
      ? Headphones
      : item.type === "deck"
      ? Presentation
      : FileText;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[680px] p-0">
        {/* Hero / player */}
        <div className={cn("relative flex aspect-[16/9] items-center justify-center overflow-hidden rounded-t-[20px] bg-gradient-to-br", gradient)}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute right-4 top-4 flex gap-1.5">
            <Badge variant="dark" className="text-[10px]">{typeLabels[item.type]}</Badge>
            {item.duration && (
              <Badge variant="dark" className="gap-1 text-[10px]">
                <Clock className="size-2.5" /> {item.duration}
              </Badge>
            )}
          </div>
          {item.type === "video" || item.type === "podcast" ? (
            <button className="group flex size-20 items-center justify-center rounded-full bg-white/25 backdrop-blur-md transition-all hover:scale-110 hover:bg-white/35">
              {item.type === "podcast" ? (
                <Volume2 className="size-8 fill-white text-white" />
              ) : (
                <Play className="size-9 fill-white text-white" />
              )}
            </button>
          ) : (
            <TypeIcon className="size-16 text-white/70" />
          )}
        </div>

        {/* Body */}
        <div className="px-6 pb-6 pt-5">
          <p className="text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
            {item.module}
          </p>
          <h2 className="mt-1 text-balance text-[22px] font-semibold leading-tight tracking-tight">
            {item.title}
          </h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-ink-2)]">
            {item.description}
          </p>

          {/* Meta row */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {author ? (
              <div className="flex items-center gap-2.5 rounded-[10px] border border-[var(--color-border)] p-2.5">
                <UserAvatar src={author.avatar} name={author.name} size="sm" />
                <div className="min-w-0">
                  <p className="text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">Door</p>
                  <p className="truncate text-[12.5px] font-semibold">{author.name}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 rounded-[10px] border border-[var(--color-border)] p-2.5">
                <div className="flex size-8 items-center justify-center rounded-full bg-[var(--color-ink)] text-[var(--color-accent)]">
                  <Sparkles className="size-3.5" />
                </div>
                <div>
                  <p className="text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">Door</p>
                  <p className="text-[12.5px] font-semibold">Dockwize</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2.5 rounded-[10px] border border-[var(--color-border)] p-2.5">
              <div className="flex size-8 items-center justify-center rounded-full bg-[var(--color-accent-soft)]">
                <FileText className="size-3.5 text-[var(--color-ink)]" />
              </div>
              <div>
                <p className="text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">Programma</p>
                <p className="text-[12.5px] font-semibold">{program?.shortName ?? "Algemeen"}</p>
              </div>
            </div>
          </div>

          {item.pages && (
            <p className="mt-3 text-[11.5px] text-[var(--color-ink-3)]">
              {item.pages} {item.pages === 1 ? "pagina" : "pagina's"}
            </p>
          )}

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {item.tags.map((t) => (
                <Badge key={t} variant="default" className="text-[10px]">
                  #{t}
                </Badge>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[var(--color-border)] pt-4">
            {item.type === "video" || item.type === "podcast" ? (
              <Button size="md" variant="accent">
                <Play className="size-3.5" /> Bekijk nu
              </Button>
            ) : (
              <Button size="md" variant="accent">
                <ExternalLink className="size-3.5" /> Open document
              </Button>
            )}
            <Button size="md" variant="secondary">
              <Download className="size-3.5" /> Download
            </Button>
            <Button size="md" variant="ghost">
              <BookmarkPlus className="size-3.5" /> Bewaar
            </Button>
            <span className="ml-auto text-[10.5px] text-[var(--color-muted)]">
              Gepubliceerd {relativeTime(item.publishedAt)}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
