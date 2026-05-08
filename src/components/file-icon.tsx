import { FileText, FileImage, FileVideo, FileAudio, FileSpreadsheet, Presentation, FileArchive, File } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FileType } from "@/lib/types";

const map: Record<FileType, { icon: React.ComponentType<{ className?: string }>; bg: string; fg: string }> = {
  pdf: { icon: FileText, bg: "bg-red-50", fg: "text-red-600" },
  doc: { icon: FileText, bg: "bg-blue-50", fg: "text-blue-600" },
  image: { icon: FileImage, bg: "bg-fuchsia-50", fg: "text-fuchsia-600" },
  video: { icon: FileVideo, bg: "bg-purple-50", fg: "text-purple-600" },
  audio: { icon: FileAudio, bg: "bg-cyan-50", fg: "text-cyan-600" },
  sheet: { icon: FileSpreadsheet, bg: "bg-emerald-50", fg: "text-emerald-600" },
  slides: { icon: Presentation, bg: "bg-orange-50", fg: "text-orange-600" },
  zip: { icon: FileArchive, bg: "bg-slate-100", fg: "text-slate-600" },
  other: { icon: File, bg: "bg-zinc-100", fg: "text-zinc-600" },
};

export function FileIcon({ type, size = "md", className }: { type: FileType; size?: "sm" | "md" | "lg"; className?: string }) {
  const m = map[type] ?? map.other;
  const Icon = m.icon;
  const sizeClasses = {
    sm: "size-7 [&>svg]:size-3.5",
    md: "size-9 [&>svg]:size-4",
    lg: "size-12 [&>svg]:size-5",
  };
  return (
    <div className={cn("flex shrink-0 items-center justify-center rounded-[8px]", m.bg, sizeClasses[size], className)}>
      <Icon className={m.fg} />
    </div>
  );
}
