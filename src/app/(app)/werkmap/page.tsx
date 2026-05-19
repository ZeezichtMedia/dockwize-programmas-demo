"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Check,
  Clock,
  Download,
  FolderOpen,
  Lock,
  MessageSquareReply,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
  ChevronRight,
} from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { Input, Textarea } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { FileIcon } from "@/components/file-icon";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { EntrepreneurCoachAwayBanner } from "@/components/coach-away-banner";
import { SessionProposalCard } from "@/components/session-proposal-card";
import { openProposalForEntrepreneur } from "@/lib/mock/sessions";
import { TeamMembersCard } from "@/components/team-members-card";
import { useUser } from "@/lib/auth-context";
import { getFolderForEntrepreneur } from "@/lib/mock/workfolders";
import { getUser } from "@/lib/mock/users";
import { getCohort, getProgram } from "@/lib/mock/programs";
import { eventsForCohort } from "@/lib/mock/notifications";
import { libraryByProgram } from "@/lib/mock/library";
import { formatBytes, relativeTime, cn } from "@/lib/utils";
import type { Assignment } from "@/lib/types";

export default function WerkmapPage() {
  const user = useUser();
  const folder = getFolderForEntrepreneur(user.id);
  const [activeFolder, setActiveFolder] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");

  if (!folder) {
    return (
      <>
        <Topbar title="Mijn werkmap" />
        <div className="p-8">
          <EmptyState
            icon={FolderOpen}
            title="Geen werkmap gevonden"
            description="Wissel rechtsboven naar een ondernemer (bijv. Marleen) om de werkmap te zien."
          />
        </div>
      </>
    );
  }

  const coach = getUser(folder.coachId)!;
  const cohort = getCohort(folder.cohortId)!;
  const program = getProgram(folder.programId)!;
  const upcomingEvents = eventsForCohort(folder.cohortId).slice(0, 3);
  const lib = libraryByProgram(folder.programId);

  const openAssignments = folder.assignments.filter((a) => a.status !== "done");
  const doneCount = folder.assignments.filter((a) => a.status === "done").length;
  const progress = Math.round((doneCount / folder.assignments.length) * 100);

  const folders = Array.from(new Set(folder.files.map((f) => f.folder).filter(Boolean))) as string[];
  const openProposal = openProposalForEntrepreneur(user.id);

  const filesShown = folder.files.filter((f) => {
    if (activeFolder && f.folder !== activeFolder) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <Topbar
        title="Mijn werkmap"
        subtitle={`${program.shortName} · ${cohort.name}`}
        action={
          <Button size="sm">
            <Upload className="size-4" /> Bestand uploaden
          </Button>
        }
      />

      {/* Hero strip */}
      <div data-tour="werkmap-hero" className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="grid gap-4 p-6 md:grid-cols-[1.5fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <Badge variant="dark" className="gap-1.5">
                <Lock className="size-2.5" /> Privé, alleen jij en {coach.name.split(" ")[0]}
              </Badge>
              <Badge variant="default" className="gap-1.5">
                <ShieldCheck className="size-2.5" /> Versleuteld
              </Badge>
            </div>
            <h2 className="text-balance text-[28px] font-semibold leading-tight tracking-tight">
              Hoi {user.name.split(" ")[0]}.
            </h2>
            <p className="max-w-md text-[14px] text-[var(--color-ink-3)]">
              {openAssignments.length} opdrachten staan open. {coach.name.split(" ")[0]} heeft sinds gisteren feedback voor je geplaatst.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <div className="flex flex-1 max-w-xs items-center gap-3">
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between text-[11px]">
                    <span className="text-[var(--color-ink-3)]">Programma-voortgang</span>
                    <span className="font-medium text-[var(--color-ink)]">{progress}%</span>
                  </div>
                  <Progress value={progress} indicatorClassName="bg-[var(--color-accent)]" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[14px] border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface-2)] to-white p-4"
          >
            <p className="text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
              Jouw coach
            </p>
            <div className="mt-2 flex items-start gap-3">
              <UserAvatar src={coach.avatar} name={coach.name} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-[var(--color-ink)]">{coach.name}</p>
                <p className="text-[12px] text-[var(--color-ink-3)]">{coach.jobTitle}</p>
                <p className="mt-1.5 line-clamp-2 text-[12px] text-[var(--color-ink-2)]">
                  {coach.bio}
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="secondary" className="flex-1">
                <MessageSquareReply className="size-3.5" /> Stuur bericht
              </Button>
              <Button size="sm" variant="ghost">
                <CalendarDays className="size-3.5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="p-6">
        {coach.availability?.status === "away" && (
          <div className="mb-4">
            <EntrepreneurCoachAwayBanner coach={coach} />
          </div>
        )}
        <Tabs defaultValue="overzicht" className="w-full">
          <TabsList data-tour="werkmap-tabs">
            <TabsTrigger value="overzicht">Overzicht</TabsTrigger>
            <TabsTrigger value="opdrachten">
              Opdrachten {openAssignments.length > 0 && <span className="ml-1.5 rounded-full bg-[var(--color-accent)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-ink)]">{openAssignments.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="bestanden">Bestanden ({folder.files.length})</TabsTrigger>
            <TabsTrigger value="notities">Notities</TabsTrigger>
          </TabsList>

          {/* Overzicht */}
          <TabsContent value="overzicht" className="space-y-6">
            {openProposal && <SessionProposalCard proposal={openProposal} />}
            <div className="grid gap-5 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader className="flex-row items-center justify-between gap-2">
                  <div>
                    <CardTitle>Open opdrachten</CardTitle>
                    <p className="text-[12px] text-[var(--color-ink-3)]">Voor de komende weken.</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Alle opdrachten <ChevronRight className="size-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  {openAssignments.slice(0, 3).map((a) => (
                    <AssignmentRow key={a.id} assignment={a} coachName={coach.name.split(" ")[0]} compact />
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Komt eraan</CardTitle>
                  <p className="text-[12px] text-[var(--color-ink-3)]">Sessies en deadlines.</p>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {upcomingEvents.map((ev) => (
                    <div key={ev.id} className="flex gap-3 rounded-[10px] border border-[var(--color-border)] p-2.5">
                      <div className="flex size-10 shrink-0 flex-col items-center justify-center rounded-[8px] bg-[var(--color-ink)] text-white">
                        <p className="text-[9px] uppercase font-semibold tracking-wider opacity-70">
                          {new Date(ev.start).toLocaleDateString("nl-NL", { month: "short" })}
                        </p>
                        <p className="text-[14px] font-bold leading-none">
                          {new Date(ev.start).getDate()}
                        </p>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12.5px] font-medium text-[var(--color-ink)]">{ev.title}</p>
                        <p className="text-[11px] text-[var(--color-ink-3)]">
                          {new Date(ev.start).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
                          {ev.location && ` · ${ev.location}`}
                        </p>
                        {ev.prepLibraryItemIds && ev.prepLibraryItemIds.length > 0 && (
                          <Badge variant="soft" className="mt-1.5 gap-1 text-[9.5px]">
                            <Sparkles className="size-2.5" /> Voorbereiding klaar
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <TeamMembersCard guests={folder.guests ?? []} entrepreneurFirstName={user.name.split(" ")[0]} />

            <Card>
              <CardHeader className="flex-row items-center justify-between gap-2">
                <div>
                  <CardTitle>Aanbevolen voor jou</CardTitle>
                  <p className="text-[12px] text-[var(--color-ink-3)]">Materialen die passen bij waar je nu staat.</p>
                </div>
                <Button variant="ghost" size="sm">Naar bibliotheek <ChevronRight className="size-4" /></Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-3">
                  {lib.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="group cursor-pointer overflow-hidden rounded-[12px] border border-[var(--color-border)] transition-all hover:border-[var(--color-ink)] hover:shadow-[var(--shadow-md)]"
                    >
                      <div
                        className={cn(
                          "relative aspect-video overflow-hidden",
                          item.type === "video" ? "bg-gradient-to-br from-purple-500 to-blue-700" : "bg-gradient-to-br from-amber-100 to-amber-300"
                        )}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          {item.type === "video" ? (
                            <div className="flex size-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-transform group-hover:scale-110">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                            </div>
                          ) : (
                            <FileIcon type="doc" size="lg" className="bg-white/30" />
                          )}
                        </div>
                        {item.duration && (
                          <Badge variant="dark" className="absolute bottom-2 right-2 text-[10px]">{item.duration}</Badge>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-muted)]">{item.module}</p>
                        <p className="mt-0.5 line-clamp-1 text-[13px] font-semibold text-[var(--color-ink)]">{item.title}</p>
                        <p className="mt-1 line-clamp-2 text-[11.5px] text-[var(--color-ink-3)]">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Opdrachten */}
          <TabsContent value="opdrachten" className="space-y-3">
            <div className="flex items-center gap-3">
              <p className="text-[13px] text-[var(--color-ink-3)]">
                {doneCount} van {folder.assignments.length} afgerond · {openAssignments.length} open
              </p>
            </div>
            {folder.assignments.map((a) => (
              <AssignmentRow key={a.id} assignment={a} coachName={coach.name.split(" ")[0]} coachAvatar={coach.avatar} />
            ))}
          </TabsContent>

          {/* Bestanden */}
          <TabsContent value="bestanden" className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[var(--color-muted)]" />
                <Input
                  placeholder="Zoek in je bestanden…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setActiveFolder(null)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-[11.5px] font-medium transition-colors",
                    !activeFolder
                      ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
                      : "border-[var(--color-border)] text-[var(--color-ink-2)] hover:border-[var(--color-border-strong)]"
                  )}
                >
                  Alle ({folder.files.length})
                </button>
                {folders.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFolder(f)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-[11.5px] font-medium transition-colors",
                      activeFolder === f
                        ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
                        : "border-[var(--color-border)] text-[var(--color-ink-2)] hover:border-[var(--color-border-strong)]"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <Card className="overflow-hidden p-0">
              <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2.5 text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
                <div className="grid grid-cols-[1fr_120px_120px_140px_40px] items-center gap-3">
                  <span>Naam</span>
                  <span>Map</span>
                  <span>Grootte</span>
                  <span>Geüpload</span>
                  <span></span>
                </div>
              </div>
              <div>
                {filesShown.length === 0 ? (
                  <EmptyState
                    icon={Search}
                    title="Geen bestanden gevonden"
                    description="Pas je filter aan of upload een nieuw bestand."
                    className="m-4"
                  />
                ) : (
                  filesShown.map((f) => (
                    <div
                      key={f.id}
                      className="grid grid-cols-[1fr_120px_120px_140px_40px] items-center gap-3 border-b border-[var(--color-border)] px-4 py-3 text-[13px] last:border-0 hover:bg-[var(--color-surface-2)]/60"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <FileIcon type={f.type} size="sm" />
                        <p className="truncate font-medium text-[var(--color-ink)]">{f.name}</p>
                      </div>
                      <p className="truncate text-[11.5px] text-[var(--color-ink-3)]">{f.folder ?? "—"}</p>
                      <p className="text-[11.5px] text-[var(--color-ink-3)]">{formatBytes(f.size)}</p>
                      <p className="text-[11.5px] text-[var(--color-ink-3)]">{relativeTime(f.uploadedAt)}</p>
                      <div className="flex items-center justify-end gap-1">
                        <button className="rounded p-1.5 text-[var(--color-ink-3)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]">
                          <Download className="size-3.5" />
                        </button>
                        <button className="rounded p-1.5 text-[var(--color-ink-3)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]">
                          <MoreHorizontal className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <UploadDropzone />
          </TabsContent>

          {/* Notities */}
          <TabsContent value="notities">
            <Card>
              <CardHeader>
                <CardTitle>Persoonlijke notities</CardTitle>
                <p className="text-[12px] text-[var(--color-ink-3)]">
                  Privé voor jou. Niet zichtbaar voor je coach. Handig voor losse aantekeningen tijdens een sessie.
                </p>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={10}
                  defaultValue={`Sessie 4, doelgroep en merk

Hans had gelijk: stoppen met "ondernemers" als doelgroep noemen, te breed.
- Kerndoel: solo-ondernemers in dienstverlening, 35-50 jaar, willen scherper communiceren maar weten niet hoe.
- 3 mensen interviewen voor donderdag: Lisanne, Ruben, en die jongen van die yoga-startup.

Voor Bram: vragen of hij me kan helpen met landing page conversion.`}
                />
                <div className="mt-3 flex justify-end gap-2">
                  <Button variant="secondary" size="sm">Auto-bewaard</Button>
                  <Button variant="ghost" size="sm"><Clock className="size-3.5" /> Geschiedenis</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <RetentionFooter days={folder.retentionDays} />
      </div>
    </>
  );
}

function AssignmentRow({
  assignment,
  coachName,
  coachAvatar,
  compact,
}: {
  assignment: Assignment;
  coachName: string;
  coachAvatar?: string;
  compact?: boolean;
}) {
  const due = new Date(assignment.dueDate);
  const today = new Date("2026-05-08");
  const daysUntil = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const overdue = daysUntil < 0 && assignment.status !== "done";

  return (
    <div
      className={cn(
        "group rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-all hover:border-[var(--color-border-strong)]",
        compact && "p-3"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className={cn("font-semibold text-[var(--color-ink)]", compact ? "text-[13px]" : "text-[14px]")}>
              {assignment.title}
            </p>
            <StatusBadge status={assignment.status} />
            <Badge variant="outline" className="text-[10px]">{assignment.module}</Badge>
          </div>
          {!compact && (
            <p className="mt-1.5 text-[13px] text-[var(--color-ink-2)]">{assignment.description}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[11.5px] text-[var(--color-ink-3)]">
            <span className={cn("flex items-center gap-1", overdue && "text-[var(--color-danger)]")}>
              <CalendarDays className="size-3" />
              {due.toLocaleDateString("nl-NL", { day: "numeric", month: "long" })}
              {daysUntil >= 0
                ? assignment.status !== "done" && ` · over ${daysUntil} dagen`
                : ` · ${Math.abs(daysUntil)} dagen geleden`}
            </span>
            {assignment.feedback.length > 0 && (
              <span className="flex items-center gap-1.5">
                <MessageSquareReply className="size-3" /> {assignment.feedback.length} feedback
                {assignment.feedback.length > 1 ? "berichten" : "bericht"}
              </span>
            )}
          </div>
          {!compact && assignment.feedback.length > 0 && (
            <div className="mt-3 flex gap-3 rounded-[10px] bg-[var(--color-surface-2)] p-3">
              <UserAvatar src={coachAvatar} name={coachName} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-[12px]">
                  <span className="font-semibold text-[var(--color-ink)]">{coachName}</span>
                  <span className="text-[var(--color-muted)]">{relativeTime(assignment.feedback[0].createdAt)}</span>
                </p>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-[var(--color-ink-2)]">
                  {assignment.feedback[0].message}
                </p>
              </div>
            </div>
          )}
        </div>
        {!compact && (
          <div className="flex flex-col gap-1.5">
            {assignment.status === "todo" && (
              <Button size="sm">Start <ChevronRight className="size-3.5" /></Button>
            )}
            {assignment.status === "in_progress" && (
              <Button size="sm">Inleveren <Upload className="size-3.5" /></Button>
            )}
            {assignment.status === "feedback" && (
              <Button size="sm" variant="secondary">Bekijk feedback</Button>
            )}
            {assignment.status === "done" && (
              <Button size="sm" variant="ghost">Bekijk</Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function UploadDropzone() {
  const [isDragging, setIsDragging] = React.useState(false);
  const [recentlyUploaded, setRecentlyUploaded] = React.useState<{ name: string; size: number }[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const acceptFiles = (files: FileList | File[]) => {
    const arr = Array.from(files).slice(0, 5);
    if (arr.length === 0) return;
    setRecentlyUploaded((prev) => [
      ...arr.map((f) => ({ name: f.name, size: f.size })),
      ...prev,
    ].slice(0, 4));
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length) acceptFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "cursor-pointer rounded-[14px] border-2 border-dashed bg-[var(--color-surface)]/50 p-6 transition-all",
        isDragging
          ? "border-[var(--color-ink)] bg-[var(--color-accent-soft)] scale-[1.005]"
          : "border-[var(--color-border-strong)] hover:border-[var(--color-ink)] hover:bg-[var(--color-surface-2)]/40"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && acceptFiles(e.target.files)}
      />
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-[10px] transition-all",
            isDragging ? "bg-[var(--color-ink)] text-white scale-110" : "bg-[var(--color-accent)] text-[var(--color-ink)]"
          )}
        >
          <Plus className="size-5" strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-semibold text-[var(--color-ink)]">
            {isDragging ? "Laat los om te uploaden" : "Sleep bestanden hierheen of klik om te selecteren"}
          </p>
          <p className="text-[12px] text-[var(--color-ink-3)]">
            PDF, Word, Excel, foto's en video tot 500 MB per bestand. Opslag in EU, versleuteld. Op mobiel: kies vanuit je Foto's of Bestanden-app.
          </p>
        </div>
        <Button variant="secondary" type="button" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>
          <Upload className="size-4" /> Selecteer bestanden
        </Button>
      </div>

      {recentlyUploaded.length > 0 && (
        <div className="mt-4 space-y-1.5 border-t border-[var(--color-border)] pt-4" onClick={(e) => e.stopPropagation()}>
          <p className="text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-success)]">Net geüpload (demo)</p>
          {recentlyUploaded.map((f, i) => (
            <div key={`${f.name}-${i}`} className="flex items-center gap-2 rounded-[8px] bg-[var(--color-success-soft)] px-3 py-1.5">
              <Check className="size-3.5 text-[var(--color-success)]" strokeWidth={3} />
              <p className="flex-1 truncate text-[12px] font-medium text-[var(--color-ink)]">{f.name}</p>
              <span className="text-[11px] text-[var(--color-ink-3)]">{(f.size / 1024).toFixed(0)} KB</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RetentionFooter({ days }: { days: number }) {
  return (
    <div className="mt-8 flex items-start gap-3 rounded-[12px] bg-[var(--color-surface-2)] p-4">
      <ShieldCheck className="size-4 shrink-0 text-[var(--color-ink-3)] mt-0.5" />
      <div className="text-[12px] text-[var(--color-ink-2)]">
        <p className="font-medium text-[var(--color-ink)]">Bewaring en privacy</p>
        <p className="mt-0.5 text-[var(--color-ink-3)]">
          Je werkmap is privé voor jou en je coach. Na het programma kun je nog {days} dagen alles downloaden. Daarna wordt de werkmap automatisch verwijderd. Dockwize-medewerkers kunnen alleen voor beheer of compliance kijken, en dat wordt altijd gelogd.
        </p>
      </div>
    </div>
  );
}
