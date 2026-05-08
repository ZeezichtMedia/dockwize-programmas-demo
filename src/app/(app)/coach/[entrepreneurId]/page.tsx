"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Download, ExternalLink, FileText, Lock, Send, ShieldCheck } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea, Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { FileIcon } from "@/components/file-icon";
import { StatusBadge } from "@/components/status-badge";
import { GradientAvatar } from "@/components/user-pill";
import { useUser } from "@/lib/auth-context";
import { getFolderForEntrepreneur } from "@/lib/mock/workfolders";
import { getUser } from "@/lib/mock/users";
import { getCohort, getProgram } from "@/lib/mock/programs";
import { formatBytes, relativeTime, cn } from "@/lib/utils";

export default function CoachDetailPage() {
  const router = useRouter();
  const params = useParams<{ entrepreneurId: string }>();
  const user = useUser();
  const entId = params.entrepreneurId;
  const folder = getFolderForEntrepreneur(entId);
  const ent = getUser(entId);

  if (!folder || !ent) {
    return (
      <>
        <Topbar title="Niet gevonden" />
        <div className="p-8 text-[14px] text-[var(--color-ink-3)]">Werkmap niet gevonden.</div>
      </>
    );
  }

  const cohort = getCohort(folder.cohortId)!;
  const program = getProgram(folder.programId)!;
  const done = folder.assignments.filter((a) => a.status === "done").length;
  const progress = Math.round((done / folder.assignments.length) * 100);
  const submittedAssignment = folder.assignments.find((a) => a.status === "submitted");

  return (
    <>
      <Topbar
        title={ent.name}
        subtitle={`${ent.company} · ${cohort.name}`}
        action={
          <Button variant="secondary" size="sm" onClick={() => router.push("/coach")}>
            <ArrowLeft className="size-3.5" /> Terug
          </Button>
        }
      />

      {/* Hero */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-4">
            <GradientAvatar initials={ent.initials ?? ent.name[0]} gradient={ent.gradient ?? "from-zinc-400 to-zinc-600"} size="xl" />
            <div>
              <h1 className="text-[24px] font-semibold leading-tight tracking-tight">{ent.name}</h1>
              <p className="text-[13.5px] text-[var(--color-ink-3)]">{ent.company} · {ent.jobTitle}</p>
              <p className="mt-2 max-w-lg text-[13px] text-[var(--color-ink-2)]">{ent.bio}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="dark" className="gap-1.5"><Lock className="size-2.5" /> Toegang verleend door Joanne · 8 apr 2026</Badge>
                <Badge variant="default">{program.shortName}</Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">Voortgang</p>
                <p className="text-[20px] font-semibold leading-tight">{progress}%</p>
              </div>
              <div className="h-12 w-32">
                <Progress value={progress} className="h-2" indicatorClassName="bg-[var(--color-accent)]" />
                <p className="mt-1.5 text-right text-[10.5px] text-[var(--color-muted)]">{done} / {folder.assignments.length} af</p>
              </div>
            </div>
            <Button size="sm"><Send className="size-3.5" /> Stuur bericht</Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="opdrachten" className="w-full">
          <TabsList>
            <TabsTrigger value="opdrachten">Opdrachten</TabsTrigger>
            <TabsTrigger value="bestanden">Bestanden ({folder.files.length})</TabsTrigger>
            <TabsTrigger value="notities">Coach-notities</TabsTrigger>
          </TabsList>

          {/* Opdrachten met inline feedback */}
          <TabsContent value="opdrachten" className="space-y-3">
            {submittedAssignment && (
              <Card className="border-[var(--color-accent)] bg-[var(--color-accent-soft)]/40">
                <CardHeader className="flex-row items-center gap-3 space-y-0">
                  <div className="size-2 rounded-full bg-[var(--color-accent)]" />
                  <div>
                    <CardTitle className="text-[14px]">Wacht op jouw feedback</CardTitle>
                    <p className="text-[12px] text-[var(--color-ink-3)]">
                      &ldquo;{submittedAssignment.title}&rdquo; · ingeleverd {relativeTime(submittedAssignment.createdAt)}
                    </p>
                  </div>
                </CardHeader>
              </Card>
            )}
            {folder.assignments.map((a) => (
              <CoachAssignmentCard key={a.id} assignment={a} entrepreneur={ent} files={folder.files} coachAvatar={user.avatar} coachName={user.name} />
            ))}
          </TabsContent>

          {/* Bestanden */}
          <TabsContent value="bestanden" className="space-y-3">
            <Card className="overflow-hidden p-0">
              <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2.5 text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
                <div className="grid grid-cols-[1fr_140px_120px_140px_40px] gap-3">
                  <span>Naam</span><span>Map</span><span>Grootte</span><span>Door</span><span></span>
                </div>
              </div>
              {folder.files.map((f) => {
                const uploader = getUser(f.uploadedById);
                return (
                  <div key={f.id} className="grid grid-cols-[1fr_140px_120px_140px_40px] items-center gap-3 border-b border-[var(--color-border)] px-4 py-3 text-[13px] last:border-0 hover:bg-[var(--color-surface-2)]/60">
                    <div className="flex min-w-0 items-center gap-3">
                      <FileIcon type={f.type} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{f.name}</p>
                        <p className="text-[11px] text-[var(--color-muted)]">{relativeTime(f.uploadedAt)}</p>
                      </div>
                    </div>
                    <p className="truncate text-[11.5px] text-[var(--color-ink-3)]">{f.folder ?? "—"}</p>
                    <p className="text-[11.5px] text-[var(--color-ink-3)]">{formatBytes(f.size)}</p>
                    <p className="truncate text-[11.5px] text-[var(--color-ink-3)]">{uploader?.name.split(" ")[0]}</p>
                    <button className="rounded p-1.5 text-[var(--color-ink-3)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]">
                      <Download className="size-3.5" />
                    </button>
                  </div>
                );
              })}
            </Card>
          </TabsContent>

          {/* Coach-notities */}
          <TabsContent value="notities">
            <Card>
              <CardHeader>
                <CardTitle>Privé coach-notities</CardTitle>
                <p className="text-[12px] text-[var(--color-ink-3)]">
                  Niet zichtbaar voor {ent.name.split(" ")[0]} of voor andere coaches. Alleen jij ziet dit.
                </p>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={10}
                  defaultValue={`Sessie 4, ${new Date().toLocaleDateString("nl-NL", { day: "numeric", month: "long" })}

Belangrijkste signalen:
- Marleen vermijdt commerciële vraagstukken en keert steeds terug op het 'merkverhaal'.
- Nog niet bereid om kerndoelgroep écht te smal te kiezen.
- Sessie 5 (Pitch) wordt belangrijk: hier moet ze keuzes maken die ze tot nu toe ontwijkt.

Aktiepunten:
- 1-op-1 inplannen tussen sessie 5 en 6.
- Vragen of ze haar 5 doelgroep-interviews al heeft gepland.
- Bram en Marleen koppelen voor onderlinge feedback.`}
                />
                <div className="mt-3 flex items-center gap-2 rounded-[8px] bg-[var(--color-surface-2)] p-3">
                  <ShieldCheck className="size-3.5 text-[var(--color-ink-3)]" />
                  <p className="text-[11.5px] text-[var(--color-ink-3)]">
                    Privacy: deze notities zijn versleuteld en alleen toegankelijk voor jou.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function CoachAssignmentCard({
  assignment,
  entrepreneur,
  files,
  coachAvatar,
  coachName,
}: {
  assignment: any;
  entrepreneur: any;
  files: any[];
  coachAvatar?: string;
  coachName: string;
}) {
  const [feedbackInput, setFeedbackInput] = React.useState("");
  const submittedFiles = (assignment.submittedFileIds ?? [])
    .map((id: string) => files.find((f) => f.id === id))
    .filter(Boolean);

  const isSubmitted = assignment.status === "submitted";

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[14px] font-semibold">{assignment.title}</h3>
            <StatusBadge status={assignment.status} />
            <Badge variant="outline" className="text-[10px]">{assignment.module}</Badge>
          </div>
          <p className="mt-1.5 text-[12.5px] text-[var(--color-ink-2)]">{assignment.description}</p>
          <p className="mt-2 flex items-center gap-1 text-[11px] text-[var(--color-ink-3)]">
            <CalendarDays className="size-3" />
            Deadline {new Date(assignment.dueDate).toLocaleDateString("nl-NL", { day: "numeric", month: "long" })}
          </p>
        </div>
      </div>

      {submittedFiles.length > 0 && (
        <div className="mt-4 space-y-1.5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
            Inlevering door {entrepreneur.name.split(" ")[0]}
          </p>
          <div className="space-y-1.5">
            {submittedFiles.map((f: any) => (
              <div key={f.id} className="flex items-center gap-3 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface-2)]/50 p-2.5">
                <FileIcon type={f.type} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-medium">{f.name}</p>
                  <p className="text-[11px] text-[var(--color-ink-3)]">
                    {relativeTime(f.uploadedAt)} · {formatBytes(f.size)}
                  </p>
                </div>
                <Button variant="ghost" size="icon-sm"><Download className="size-3.5" /></Button>
                <Button variant="ghost" size="icon-sm"><ExternalLink className="size-3.5" /></Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {assignment.feedback.length > 0 && (
        <div className="mt-4 space-y-2.5">
          {assignment.feedback.map((fb: any) => {
            const author = getUser(fb.authorId);
            return (
              <div key={fb.id} className="flex gap-3">
                <UserAvatar src={author?.avatar} name={author?.name ?? ""} size="sm" />
                <div className="flex-1 rounded-[10px] bg-[var(--color-surface-2)] p-3">
                  <div className="flex items-baseline gap-2">
                    <p className="text-[12.5px] font-semibold">{author?.name}</p>
                    <p className="text-[10.5px] text-[var(--color-muted)]">{relativeTime(fb.createdAt)}</p>
                  </div>
                  <p className="mt-0.5 text-[12.5px] text-[var(--color-ink-2)]">{fb.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(isSubmitted || assignment.status === "in_progress") && (
        <div className="mt-4 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <div className="flex gap-3">
            <UserAvatar src={coachAvatar} name={coachName} size="sm" />
            <div className="flex-1">
              <Textarea
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                placeholder={`Feedback aan ${entrepreneur.name.split(" ")[0]}…`}
                rows={3}
                className="border-0 bg-transparent p-0 focus:ring-0"
              />
              <div className="mt-2 flex items-center justify-between">
                <p className="text-[11px] text-[var(--color-muted)]">Tip: wees concreet en geef minimaal 1 vraag terug.</p>
                <Button size="sm" disabled={!feedbackInput.trim()}>
                  <Send className="size-3.5" /> Stuur feedback
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
