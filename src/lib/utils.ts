import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function relativeTime(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const sec = Math.round(diff / 1000);
  const min = Math.round(sec / 60);
  const hr = Math.round(min / 60);
  const days = Math.round(hr / 24);
  if (sec < 60) return "zojuist";
  if (min < 60) return `${min} min geleden`;
  if (hr < 24) return `${hr} u geleden`;
  if (days < 7) return `${days} d geleden`;
  return d.toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
}

export function fileTypeFromName(name: string): "pdf" | "doc" | "image" | "video" | "audio" | "sheet" | "slides" | "zip" | "other" {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["pdf"].includes(ext)) return "pdf";
  if (["doc", "docx", "txt", "md", "rtf"].includes(ext)) return "doc";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg", "heic"].includes(ext)) return "image";
  if (["mp4", "mov", "webm", "avi"].includes(ext)) return "video";
  if (["mp3", "wav", "m4a"].includes(ext)) return "audio";
  if (["xls", "xlsx", "csv", "numbers"].includes(ext)) return "sheet";
  if (["ppt", "pptx", "key"].includes(ext)) return "slides";
  if (["zip", "rar", "tar", "7z"].includes(ext)) return "zip";
  return "other";
}
