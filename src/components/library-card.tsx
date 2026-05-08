"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Play, FileText, Headphones, Presentation, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { getUser } from "@/lib/mock/users";
import { cn } from "@/lib/utils";
import type { LibraryItem } from "@/lib/types";

const typeLabels: Record<LibraryItem["type"], string> = {
  video: "Video",
  document: "Document",
  deck: "Deck",
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

export function LibraryCard({ item, onOpen }: { item: LibraryItem; onOpen?: () => void }) {
  const author = item.authorId ? getUser(item.authorId) : null;
  const gradient = gradients[(item.thumbnailSeed ?? 0) % gradients.length];

  const TypeIcon = item.type === "video" ? Play
    : item.type === "podcast" ? Headphones
    : item.type === "deck" ? Presentation
    : FileText;

  return (
    <motion.button
      onClick={onOpen}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group flex w-full flex-col overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] text-left transition-all hover:border-[var(--color-ink)] hover:shadow-[var(--shadow-md)]"
    >
      <div className={cn("relative aspect-[16/10] overflow-hidden bg-gradient-to-br", gradient)}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute right-3 top-3 flex gap-1.5">
          <Badge variant="dark" className="text-[10px]">{typeLabels[item.type]}</Badge>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-all group-hover:scale-110 group-hover:bg-white/30">
            <TypeIcon className="size-6 fill-white text-white" />
          </div>
        </div>
        {item.duration && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-md">
            <Clock className="size-2.5" /> {item.duration}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-muted)]">{item.module}</p>
        <h3 className="text-[14px] font-semibold leading-snug tracking-tight text-[var(--color-ink)]">{item.title}</h3>
        <p className="line-clamp-2 text-[12px] text-[var(--color-ink-3)]">{item.description}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          {author ? (
            <div className="flex items-center gap-1.5">
              <UserAvatar src={author.avatar} name={author.name} size="xs" />
              <span className="text-[11px] text-[var(--color-ink-2)]">{author.name}</span>
            </div>
          ) : (
            <span className="text-[11px] text-[var(--color-muted)]">Dockwize</span>
          )}
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 1).map((t) => (
              <span key={t} className="text-[10px] text-[var(--color-muted)]">#{t}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.button>
  );
}
