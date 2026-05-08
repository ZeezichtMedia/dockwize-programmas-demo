"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp,
  Sparkles,
  Plus,
  MessageSquare,
  ShieldCheck,
  Library,
  Play,
  FileText,
  ExternalLink,
} from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/lib/auth-context";
import { presetAIQuestions, matchAIResponse } from "@/lib/mock/ai";
import { getLibraryItem, libraryByProgram } from "@/lib/mock/library";
import { getCohort, getProgram } from "@/lib/mock/programs";
import { getUser } from "@/lib/mock/users";
import { cn, relativeTime } from "@/lib/utils";
import type { AIMessage } from "@/lib/types";

interface Thread {
  id: string;
  title: string;
  messages: AIMessage[];
  createdAt: string;
}

const initialThreads = (): Thread[] => [
  {
    id: "th_demo_1",
    title: "Wat hebben we behandeld over funding?",
    createdAt: "2026-05-06T19:30:00Z",
    messages: [
      {
        id: "m_u_1",
        role: "user",
        content: "Wat hebben we behandeld over funding?",
        timestamp: "2026-05-06T19:30:00Z",
      },
      ...matchAIResponse("funding"),
    ],
  },
  {
    id: "th_demo_2",
    title: "SWOT, wat is de aanpak?",
    createdAt: "2026-04-26T20:08:00Z",
    messages: [
      {
        id: "m_u_2",
        role: "user",
        content: "SWOT, wat is de aanpak?",
        timestamp: "2026-04-26T20:08:00Z",
      },
      ...matchAIResponse("swot"),
    ],
  },
];

export default function AIPage() {
  const user = useUser();
  const cohort = user.cohortId ? getCohort(user.cohortId) : null;
  const program = getProgram(cohort?.programId ?? "p_jouw")!;
  const lib = libraryByProgram(program.id);

  const [threads, setThreads] = React.useState<Thread[]>(initialThreads);
  const [activeThreadId, setActiveThreadId] = React.useState<string | null>(null);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const activeThread = threads.find((t) => t.id === activeThreadId);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [activeThread?.messages.length, loading]);

  const askQuestion = async (question: string) => {
    if (!question.trim()) return;
    setInput("");
    setLoading(true);

    const userMsg: AIMessage = {
      id: `mu_${Date.now()}`,
      role: "user",
      content: question,
      timestamp: new Date().toISOString(),
    };

    let threadId = activeThreadId;
    if (!threadId) {
      threadId = `th_${Date.now()}`;
      const newThread: Thread = {
        id: threadId,
        title: question.length > 48 ? question.slice(0, 48) + "…" : question,
        createdAt: new Date().toISOString(),
        messages: [userMsg],
      };
      setThreads((prev) => [newThread, ...prev]);
      setActiveThreadId(threadId);
    } else {
      setThreads((prev) =>
        prev.map((t) => (t.id === threadId ? { ...t, messages: [...t.messages, userMsg] } : t))
      );
    }

    // Simulate latency
    await new Promise((r) => setTimeout(r, 1100 + Math.random() * 700));
    const responseTemplate = matchAIResponse(question)[0];
    const assistantMsg: AIMessage = {
      ...responseTemplate,
      id: `ma_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId ? { ...t, messages: [...t.messages, assistantMsg] } : t
      )
    );
    setLoading(false);
    inputRef.current?.focus();
  };

  return (
    <>
      <Topbar
        title="Vraag de bibliotheek"
        subtitle={`AI-assistent met kennis van ${lib.length} materialen uit ${program.shortName}`}
      />
      <div className="grid h-[calc(100vh-3.5rem)] grid-cols-1 lg:grid-cols-[260px_1fr]">
        {/* Threads sidebar */}
        <div className="hidden border-r border-[var(--color-border)] bg-[var(--color-surface)] lg:flex lg:flex-col">
          <div className="border-b border-[var(--color-border)] p-3">
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => setActiveThreadId(null)}
            >
              <Plus className="size-4" /> Nieuwe vraag
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <p className="px-2 pb-1 text-[10.5px] font-medium uppercase tracking-[0.08em] text-[var(--color-muted)]">
              Recent
            </p>
            <div className="space-y-0.5">
              {threads.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveThreadId(t.id)}
                  className={cn(
                    "flex w-full items-start gap-2 rounded-[8px] px-2 py-1.5 text-left transition-colors",
                    t.id === activeThreadId
                      ? "bg-[var(--color-ink)] text-white"
                      : "text-[var(--color-ink-2)] hover:bg-[var(--color-surface-2)]"
                  )}
                >
                  <MessageSquare className={cn("mt-0.5 size-3.5 shrink-0", t.id === activeThreadId ? "text-white" : "text-[var(--color-ink-3)]")} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium">{t.title}</p>
                    <p className={cn("text-[10px]", t.id === activeThreadId ? "text-white/60" : "text-[var(--color-muted)]")}>
                      {relativeTime(t.createdAt)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-[var(--color-border)] p-3">
            <div className="rounded-[10px] bg-[var(--color-surface-2)] p-3">
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-[var(--color-ink-3)]" />
                <div>
                  <p className="text-[11.5px] font-medium text-[var(--color-ink)]">Privé & afgebakend</p>
                  <p className="mt-0.5 text-[10.5px] leading-snug text-[var(--color-ink-3)]">
                    De assistent zoekt alleen in de bibliotheek van {program.shortName}. Je gesprekken worden niet gedeeld met andere ondernemers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="flex flex-col bg-[var(--color-bg)]">
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            {!activeThread ? (
              <EmptyConversation
                onAsk={askQuestion}
                program={program.shortName}
                libraryCount={lib.length}
              />
            ) : (
              <div className="mx-auto max-w-3xl space-y-6 p-6">
                {activeThread.messages.map((m) =>
                  m.role === "user" ? (
                    <UserMessage key={m.id} message={m} userName={user.name} userAvatar={user.avatar} />
                  ) : (
                    <AssistantMessage key={m.id} message={m} />
                  )
                )}
                {loading && <LoadingMessage />}
              </div>
            )}
          </div>

          <div className="sticky bottom-0 border-t border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-md p-4">
            <div className="mx-auto max-w-3xl">
              <ComposeBox
                inputRef={inputRef}
                value={input}
                onChange={setInput}
                onSubmit={() => askQuestion(input)}
                disabled={loading}
              />
              <p className="mt-2 text-center text-[11px] text-[var(--color-muted)]">
                Alleen materialen uit deze bibliotheek worden gebruikt. Geen externe bronnen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function EmptyConversation({
  onAsk,
  program,
  libraryCount,
}: {
  onAsk: (q: string) => void;
  program: string;
  libraryCount: number;
}) {
  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center px-6 py-10 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mb-5 flex size-16 items-center justify-center rounded-[20px] bg-gradient-to-br from-[var(--color-accent)] to-[#f5b800] shadow-[var(--shadow-lg)]"
      >
        <Sparkles className="size-7 text-[var(--color-ink)]" strokeWidth={2} />
      </motion.div>
      <h2 className="text-balance text-[28px] font-semibold leading-tight tracking-tight">
        Wat wil je vandaag uit de bibliotheek halen?
      </h2>
      <p className="mt-3 max-w-md text-[14px] text-[var(--color-ink-3)]">
        Ik ken alle {libraryCount} materialen uit {program}. Stel een vraag, en ik geef antwoord met de juiste video's, documenten en bronvermeldingen erbij.
      </p>

      <div className="mt-8 grid w-full gap-2 sm:grid-cols-2">
        {presetAIQuestions.map((q) => (
          <motion.button
            key={q.question}
            whileHover={{ y: -1 }}
            onClick={() => onAsk(q.question)}
            className="group flex items-center gap-3 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-left transition-all hover:border-[var(--color-ink)] hover:shadow-[var(--shadow-sm)]"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-[var(--color-accent-soft)]">
              <Sparkles className="size-3.5 text-[var(--color-ink)]" />
            </div>
            <p className="flex-1 text-[12.5px] font-medium text-[var(--color-ink)]">{q.question}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function UserMessage({ message, userName, userAvatar }: { message: AIMessage; userName: string; userAvatar?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex justify-end"
    >
      <div className="max-w-[80%] rounded-[18px] rounded-tr-[6px] bg-[var(--color-ink)] px-4 py-3 text-white">
        <p className="text-[14px] leading-relaxed">{message.content}</p>
      </div>
    </motion.div>
  );
}

function AssistantMessage({ message }: { message: AIMessage }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-3"
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[#f5b800] shadow-[var(--shadow-sm)]">
        <Sparkles className="size-4 text-[var(--color-ink)]" />
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        <div className="prose prose-sm max-w-none text-[14px] leading-relaxed text-[var(--color-ink)]">
          {message.content.split("\n\n").map((para, i) => {
            if (para.startsWith("**") || para.startsWith("> ")) {
              return (
                <p key={i} className={cn(para.startsWith("> ") ? "border-l-2 border-[var(--color-accent)] pl-3 italic text-[var(--color-ink-2)]" : "")}>
                  {renderMarkdown(para)}
                </p>
              );
            }
            return <p key={i}>{renderMarkdown(para)}</p>;
          })}
        </div>
        {message.citations && message.citations.length > 0 && (
          <div className="space-y-2 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
            <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
              <Library className="size-3" /> Bronnen ({message.citations.length})
            </p>
            <div className="space-y-1.5">
              {message.citations.map((c, i) => {
                const item = getLibraryItem(c.libraryItemId);
                if (!item) return null;
                const TypeIcon = item.type === "video" ? Play : FileText;
                return (
                  <button
                    key={i}
                    className="group flex w-full items-start gap-2.5 rounded-[8px] p-2 text-left transition-colors hover:bg-[var(--color-surface-2)]"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-[6px] bg-[var(--color-surface-2)]">
                      <TypeIcon className="size-3.5 text-[var(--color-ink-2)]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-[12.5px] font-medium text-[var(--color-ink)]">{item.title}</p>
                        <span className="shrink-0 text-[10.5px] text-[var(--color-muted)]">
                          {c.timestamp ? `bij ${c.timestamp}` : c.page ? `p. ${c.page}` : ""}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-[11.5px] text-[var(--color-ink-3)]">&ldquo;{c.snippet}&rdquo;</p>
                    </div>
                    <ExternalLink className="mt-1 size-3 shrink-0 text-[var(--color-muted)] opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function LoadingMessage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex gap-3"
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[#f5b800]">
        <Sparkles className="size-4 text-[var(--color-ink)]" />
      </div>
      <div className="flex items-center gap-1 pt-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-1.5 rounded-full bg-[var(--color-ink-3)]"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function ComposeBox({
  inputRef,
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}) {
  return (
    <div className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[var(--shadow-sm)] transition-all focus-within:border-[var(--color-ink)] focus-within:shadow-[var(--shadow-md)]">
      <textarea
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
        placeholder="Stel een vraag aan de bibliotheek…"
        rows={1}
        className="w-full resize-none border-0 bg-transparent text-[14px] leading-relaxed outline-none placeholder:text-[var(--color-muted)]"
        autoFocus
      />
      <div className="mt-2 flex items-center justify-between">
        <p className="text-[10.5px] text-[var(--color-muted)]">
          ⏎ verzenden · ⇧⏎ nieuwe regel
        </p>
        <Button
          onClick={onSubmit}
          disabled={!value.trim() || disabled}
          size="icon-sm"
          variant="primary"
        >
          <ArrowUp className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function renderMarkdown(text: string) {
  // Very small inline markdown: **bold**, *italic*, > quote handled in caller
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > cursor) parts.push(text.slice(cursor, m.index));
    if (m[1]) parts.push(<strong key={m.index} className="font-semibold">{m[1]}</strong>);
    else if (m[2]) parts.push(<em key={m.index}>{m[2]}</em>);
    cursor = m.index + m[0].length;
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts.length === 1 ? parts[0] : parts;
}
