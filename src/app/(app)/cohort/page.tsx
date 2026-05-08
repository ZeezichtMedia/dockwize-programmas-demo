"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar,
  Hash,
  Lock,
  MoreHorizontal,
  Paperclip,
  Plus,
  Send,
  Smile,
  Sparkles,
  Users,
  Video,
} from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useUser } from "@/lib/auth-context";
import { entrepreneursIn, getUser } from "@/lib/mock/users";
import { getCohort, getProgram } from "@/lib/mock/programs";
import { channels, channelsForUser, messagesForChannel, messages as allMessages } from "@/lib/mock/chats";
import { eventsForCohort } from "@/lib/mock/notifications";
import { libraryByProgram } from "@/lib/mock/library";
import { relativeTime, cn } from "@/lib/utils";
import type { ChatMessage, ChatChannel, User } from "@/lib/types";

export default function CohortPage() {
  const user = useUser();
  const cohortId = user.cohortId ?? "c_jp7";
  const cohort = getCohort(cohortId)!;
  const program = getProgram(cohort.programId)!;
  const members = entrepreneursIn(cohortId);
  const myChannels = channelsForUser(user.id).filter((c) => c.cohortId === cohortId || c.type === "subgroup");
  const generalChannel = channels.find((c) => c.id === "ch_jp7_general")!;
  const subgroups = myChannels.filter((c) => c.type === "subgroup");
  const events = eventsForCohort(cohortId);
  const lib = libraryByProgram(program.id);

  const [activeChannelId, setActiveChannelId] = React.useState(generalChannel.id);
  const activeChannel = channels.find((c) => c.id === activeChannelId)!;

  return (
    <>
      <Topbar
        title={cohort.name}
        subtitle={`${program.shortName} · ${members.length} deelnemers`}
        action={
          <div className="hidden gap-2 md:flex">
            <Button variant="secondary" size="sm">
              <Plus className="size-4" /> Nieuwe subgroep
            </Button>
          </div>
        }
      />

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-ink)]">
        <Image src="/cohort/home2.jpg" alt="" fill className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-ink)] via-[var(--color-ink)]/85 to-[var(--color-ink)]/40" />
        <div className="relative flex flex-col gap-4 p-7 text-white md:flex-row md:items-end md:justify-between">
          <div>
            <Badge variant="accent" className="mb-3">{program.shortName}</Badge>
            <h1 className="text-balance text-[28px] font-semibold leading-tight tracking-tight">
              {cohort.name}
            </h1>
            <p className="mt-2 max-w-xl text-[13.5px] text-white/70">
              Loopt van {new Date(cohort.startDate).toLocaleDateString("nl-NL", { day: "numeric", month: "long" })} tot {new Date(cohort.endDate).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}. Coördinator: {getUser(cohort.managerId)?.name}.
            </p>
            <div className="mt-3 flex -space-x-2">
              {members.slice(0, 8).map((m) => (
                <div key={m.id} className="rounded-full ring-2 ring-[var(--color-ink)]">
                  <GradientFallback user={m} />
                </div>
              ))}
              {members.length > 8 && (
                <div className="flex size-8 items-center justify-center rounded-full bg-white/15 text-[10px] font-semibold text-white ring-2 ring-[var(--color-ink)]">
                  +{members.length - 8}
                </div>
              )}
            </div>
          </div>
          <div className="hidden flex-wrap gap-2 md:flex">
            <button className="flex items-center gap-2 rounded-[10px] bg-white/10 px-3 py-2 text-[12px] font-medium backdrop-blur-md transition hover:bg-white/15">
              <Calendar className="size-3.5" /> Volgende sessie {new Date(events[0]?.start ?? "").toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}
            </button>
            <a
              href="https://dockwize.bisner.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-[10px] bg-white/10 px-3 py-2 text-[12px] font-medium backdrop-blur-md transition hover:bg-white/15"
              title="Open Dockwize Community in Bisner"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="6" cy="12" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M8.5 10.5l7-3M8.5 13.5l7 3" stroke="currentColor" strokeWidth="1.5"/></svg>
              Open in Bisner Community
            </a>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="chat" className="w-full">
          <TabsList>
            <TabsTrigger value="chat"><Hash className="mr-1 size-3.5" /> Chat</TabsTrigger>
            <TabsTrigger value="mensen"><Users className="mr-1 size-3.5" /> Mensen ({members.length})</TabsTrigger>
            <TabsTrigger value="subgroepen">Subgroepen ({subgroups.length})</TabsTrigger>
            <TabsTrigger value="agenda"><Calendar className="mr-1 size-3.5" /> Agenda</TabsTrigger>
          </TabsList>

          {/* Chat */}
          <TabsContent value="chat" className="mt-4">
            <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
              <Card className="h-fit p-3">
                <p className="px-2 pb-2 text-[10.5px] font-medium uppercase tracking-[0.08em] text-[var(--color-muted)]">
                  Cohort kanalen
                </p>
                <div className="space-y-0.5">
                  {channels
                    .filter((c) => c.type === "cohort" && c.cohortId === cohortId)
                    .map((c) => (
                      <ChannelButton
                        key={c.id}
                        channel={c}
                        active={c.id === activeChannelId}
                        onClick={() => setActiveChannelId(c.id)}
                      />
                    ))}
                </div>

                <p className="mt-4 px-2 pb-2 text-[10.5px] font-medium uppercase tracking-[0.08em] text-[var(--color-muted)]">
                  Subgroepen
                </p>
                <div className="space-y-0.5">
                  {subgroups.map((c) => (
                    <ChannelButton
                      key={c.id}
                      channel={c}
                      active={c.id === activeChannelId}
                      onClick={() => setActiveChannelId(c.id)}
                    />
                  ))}
                  <button className="flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-[12.5px] text-[var(--color-ink-3)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]">
                    <Plus className="size-3.5" /> Nieuwe subgroep
                  </button>
                </div>

                <p className="mt-4 px-2 pb-2 text-[10.5px] font-medium uppercase tracking-[0.08em] text-[var(--color-muted)]">
                  Direct
                </p>
                <div className="space-y-0.5">
                  {channels
                    .filter((c) => c.type === "direct" && c.memberIds.includes(user.id))
                    .map((c) => (
                      <ChannelButton
                        key={c.id}
                        channel={c}
                        active={c.id === activeChannelId}
                        onClick={() => setActiveChannelId(c.id)}
                      />
                    ))}
                </div>
              </Card>

              <ChatPanel channel={activeChannel} currentUserId={user.id} />
            </div>
          </TabsContent>

          {/* Mensen */}
          <TabsContent value="mensen">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((m) => (
                <PersonCard key={m.id} user={m} />
              ))}
              <Card className="flex flex-col p-5">
                <CardHeader className="p-0">
                  <CardTitle className="text-[13px]">Coördinator + coaches</CardTitle>
                </CardHeader>
                <CardContent className="mt-3 space-y-2 p-0">
                  {[cohort.managerId, "u_hans", "u_nicola"].map((id) => {
                    const u = getUser(id);
                    if (!u) return null;
                    return (
                      <div key={id} className="flex items-center gap-2.5 rounded-[8px] p-1.5">
                        <UserAvatar src={u.avatar} name={u.name} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12.5px] font-medium text-[var(--color-ink)]">{u.name}</p>
                          <p className="truncate text-[10.5px] text-[var(--color-ink-3)]">{u.jobTitle}</p>
                        </div>
                        <Badge variant="default" className="text-[9px]">{u.role === "coach" ? "Coach" : u.role === "admin" ? "Coör." : "Mgr."}</Badge>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Subgroepen */}
          <TabsContent value="subgroepen" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {subgroups.map((sg) => (
                <SubgroupCard key={sg.id} channel={sg} onOpen={() => setActiveChannelId(sg.id)} />
              ))}
              <button className="flex flex-col items-center justify-center gap-2 rounded-[16px] border-2 border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)]/50 p-6 text-center transition-all hover:border-[var(--color-ink)] hover:bg-[var(--color-surface)]">
                <div className="flex size-12 items-center justify-center rounded-full bg-[var(--color-accent)]">
                  <Plus className="size-5 text-[var(--color-ink)]" strokeWidth={2.5} />
                </div>
                <p className="text-[14px] font-semibold text-[var(--color-ink)]">Start een subgroep</p>
                <p className="max-w-xs text-[12px] text-[var(--color-ink-3)]">
                  Vorm een kleine groep met andere deelnemers, bijvoorbeeld om wekelijks te sparren over een thema.
                </p>
              </button>
            </div>
            <div className="rounded-[12px] bg-[var(--color-surface-2)] p-4 text-[12px] text-[var(--color-ink-2)]">
              <span className="font-medium">Goed om te weten:</span> in subgroepen kun je chatten, maar bestanden blijven privé in je eigen werkmap. Dat houdt 't bij elkaar.
            </div>
          </TabsContent>

          {/* Agenda */}
          <TabsContent value="agenda" className="space-y-3">
            {events.map((ev) => (
              <Card key={ev.id} className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-4">
                  <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-[10px] bg-[var(--color-ink)] text-white">
                    <p className="text-[10px] uppercase font-semibold tracking-wider opacity-70">
                      {new Date(ev.start).toLocaleDateString("nl-NL", { month: "short" })}
                    </p>
                    <p className="text-[18px] font-bold leading-none">{new Date(ev.start).getDate()}</p>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          ev.type === "session"
                            ? "dark"
                            : ev.type === "deadline"
                            ? "danger"
                            : "default"
                        }
                        className="text-[10px]"
                      >
                        {ev.type === "session" ? "Sessie" : ev.type === "deadline" ? "Deadline" : "Event"}
                      </Badge>
                      <p className="text-[11.5px] text-[var(--color-ink-3)]">
                        {new Date(ev.start).toLocaleString("nl-NL", { weekday: "long", hour: "2-digit", minute: "2-digit" })}
                        {ev.location && ` · ${ev.location}`}
                      </p>
                    </div>
                    <h3 className="mt-1 text-[15px] font-semibold leading-tight tracking-tight">{ev.title}</h3>
                    {ev.description && (
                      <p className="mt-1 text-[12.5px] text-[var(--color-ink-2)]">{ev.description}</p>
                    )}
                    {ev.prepLibraryItemIds && ev.prepLibraryItemIds.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 rounded-[8px] bg-[var(--color-accent-soft)] p-2">
                        <Sparkles className="size-3 text-[var(--color-ink)]" />
                        <span className="text-[11.5px] font-medium text-[var(--color-ink)]">Voorbereiding:</span>
                        {ev.prepLibraryItemIds.map((id) => {
                          const item = lib.find((l) => l.id === id);
                          if (!item) return null;
                          return (
                            <button key={id} className="text-[11.5px] underline underline-offset-2 hover:text-[var(--color-ink)]">
                              {item.title}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost"><Calendar className="size-3.5" /> Toevoegen</Button>
                  {ev.type === "session" && <Button size="sm" variant="secondary"><Video className="size-3.5" /> Online</Button>}
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function ChannelButton({ channel, active, onClick }: { channel: ChatChannel; active: boolean; onClick: () => void }) {
  const last = messagesForChannel(channel.id).slice(-1)[0];
  const unread = false; // demo

  if (channel.type === "direct") {
    const otherId = channel.memberIds.find((m) => m !== "u_marleen");
    const other = otherId ? getUser(otherId) : null;
    return (
      <button
        onClick={onClick}
        className={cn(
          "flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-left transition-all",
          active
            ? "bg-[var(--color-ink)] text-white"
            : "text-[var(--color-ink-2)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
        )}
      >
        {other && <UserAvatar src={other.avatar} name={other.name} size="xs" />}
        <span className="flex-1 truncate text-[12.5px] font-medium">{other?.name.split(" ")[0]}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-left transition-all",
        active
          ? "bg-[var(--color-ink)] text-white"
          : "text-[var(--color-ink-2)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
      )}
    >
      <Hash className={cn("size-3.5", active ? "text-white" : "text-[var(--color-ink-3)]")} />
      <span className="flex-1 truncate text-[12.5px] font-medium">{channel.name}</span>
      {unread && <span className="size-1.5 rounded-full bg-[var(--color-info)]" />}
    </button>
  );
}

function ChatPanel({ channel, currentUserId }: { channel: ChatChannel; currentUserId: string }) {
  const messages = messagesForChannel(channel.id);
  const [input, setInput] = React.useState("");

  return (
    <Card className="flex h-[640px] flex-col overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
        <div className="flex items-center gap-2">
          {channel.type === "direct" ? (
            <Lock className="size-3.5 text-[var(--color-ink-3)]" />
          ) : (
            <Hash className="size-4 text-[var(--color-ink-3)]" />
          )}
          <p className="text-[14px] font-semibold tracking-tight">{channel.name}</p>
          <Badge variant="default" className="text-[10px]">{channel.memberIds.length} leden</Badge>
        </div>
        <Button variant="ghost" size="icon-sm">
          <MoreHorizontal className="size-4" />
        </Button>
      </div>
      {channel.description && (
        <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)]/50 px-4 py-2">
          <p className="text-[11.5px] text-[var(--color-ink-3)]">{channel.description}</p>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-[13px] font-medium text-[var(--color-ink)]">Nog geen berichten in {channel.name}</p>
              <p className="mt-1 text-[12px] text-[var(--color-ink-3)]">Wees de eerste. Zeg hallo.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((m, i) => {
              const author = getUser(m.authorId);
              const prev = messages[i - 1];
              const sameAuthorAsPrev = prev?.authorId === m.authorId &&
                new Date(m.timestamp).getTime() - new Date(prev.timestamp).getTime() < 5 * 60 * 1000;
              const isSelf = m.authorId === currentUserId;
              return (
                <Message
                  key={m.id}
                  message={m}
                  author={author}
                  hideHeader={sameAuthorAsPrev}
                  isSelf={isSelf}
                  replyTo={m.replyToId ? messages.find((x) => x.id === m.replyToId) : undefined}
                />
              );
            })}
          </div>
        )}
      </div>
      <div className="border-t border-[var(--color-border)] p-3">
        <div className="flex items-end gap-2 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] p-2 transition-colors focus-within:border-[var(--color-ink)]">
          <Button variant="ghost" size="icon-sm">
            <Paperclip className="size-4" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Bericht naar ${channel.type === "direct" ? channel.name : `#${channel.name}`}…`}
            className="flex-1 border-0 bg-transparent px-1 focus:ring-0"
          />
          <Button variant="ghost" size="icon-sm">
            <Smile className="size-4" />
          </Button>
          <Button size="sm" disabled={!input.trim()}>
            <Send className="size-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function Message({
  message,
  author,
  hideHeader,
  isSelf,
  replyTo,
}: {
  message: ChatMessage;
  author?: User;
  hideHeader?: boolean;
  isSelf: boolean;
  replyTo?: ChatMessage;
}) {
  if (!author) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("group flex gap-3 rounded-[8px] px-2 py-1 hover:bg-[var(--color-surface-2)]/50", hideHeader ? "mt-0" : "mt-3")}
    >
      <div className="w-8 shrink-0">
        {!hideHeader && <UserAvatar src={author.avatar} name={author.name} size="sm" />}
      </div>
      <div className="min-w-0 flex-1">
        {!hideHeader && (
          <div className="mb-0.5 flex items-baseline gap-2">
            <p className="text-[12.5px] font-semibold text-[var(--color-ink)]">{author.name}</p>
            <p className="text-[10.5px] text-[var(--color-muted)]">{relativeTime(message.timestamp)}</p>
            {author.role === "coach" && <Badge variant="default" className="text-[9px]">Coach</Badge>}
            {author.role === "admin" && <Badge variant="default" className="text-[9px]">Coör.</Badge>}
            {author.role === "program_manager" && <Badge variant="default" className="text-[9px]">Mgr.</Badge>}
          </div>
        )}
        {replyTo && (
          <div className="mb-1 flex items-center gap-2 rounded-[6px] border-l-2 border-[var(--color-accent)] bg-[var(--color-surface-2)]/60 px-2 py-1 text-[11.5px] text-[var(--color-ink-3)]">
            <span className="font-medium text-[var(--color-ink-2)]">{getUser(replyTo.authorId)?.name.split(" ")[0]}</span>
            <span className="line-clamp-1">{replyTo.content}</span>
          </div>
        )}
        <p className="whitespace-pre-line text-[13.5px] leading-relaxed text-[var(--color-ink)]">{message.content}</p>
        {message.reactions && Object.keys(message.reactions).length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {Object.entries(message.reactions).map(([emoji, userIds]) => (
              <button
                key={emoji}
                className="flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-1.5 py-0.5 text-[11px] hover:border-[var(--color-border-strong)]"
              >
                <span>{emoji}</span>
                <span className="font-medium text-[var(--color-ink-2)]">{userIds.length}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function GradientFallback({ user }: { user: User }) {
  if (user.avatar) {
    return <UserAvatar src={user.avatar} name={user.name} size="sm" />;
  }
  return (
    <div
      className={cn(
        "flex size-8 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-semibold text-white",
        user.gradient ?? "from-zinc-400 to-zinc-600"
      )}
    >
      {user.initials ?? user.name[0]}
    </div>
  );
}

function PersonCard({ user }: { user: User }) {
  const coach = user.coachId ? getUser(user.coachId) : null;
  return (
    <Card className="p-4 transition-all hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-md)]">
      <div className="flex items-start gap-3">
        <GradientFallback user={user} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-[var(--color-ink)]">{user.name}</p>
          <p className="truncate text-[12px] text-[var(--color-ink-3)]">
            {user.company} · {user.jobTitle}
          </p>
          {user.bio && (
            <p className="mt-1.5 line-clamp-2 text-[12px] text-[var(--color-ink-2)]">{user.bio}</p>
          )}
          {coach && (
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-[var(--color-ink-3)]">
              <span>Coach:</span>
              <UserAvatar src={coach.avatar} name={coach.name} size="xs" />
              <span className="font-medium text-[var(--color-ink-2)]">{coach.name}</span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <Button size="sm" variant="secondary" className="flex-1">Stuur bericht</Button>
        <Button size="sm" variant="ghost"><Plus className="size-3.5" /></Button>
      </div>
    </Card>
  );
}

function SubgroupCard({ channel, onOpen }: { channel: ChatChannel; onOpen: () => void }) {
  const memberUsers = channel.memberIds.map((id) => getUser(id)).filter(Boolean) as User[];
  const lastMsg = messagesForChannel(channel.id).slice(-1)[0];
  return (
    <Card className="p-5 transition-all hover:border-[var(--color-border-strong)]">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Hash className="size-4 text-[var(--color-ink-3)]" />
            <h3 className="text-[15px] font-semibold tracking-tight">{channel.name}</h3>
          </div>
          {channel.description && (
            <p className="mt-1 text-[12.5px] text-[var(--color-ink-3)]">{channel.description}</p>
          )}
        </div>
        <Badge variant="default">{memberUsers.length} leden</Badge>
      </div>
      <div className="mt-4 flex -space-x-2">
        {memberUsers.map((m) => (
          <div key={m.id} className="rounded-full ring-2 ring-[var(--color-surface)]">
            <GradientFallback user={m} />
          </div>
        ))}
      </div>
      {lastMsg && (
        <div className="mt-4 rounded-[8px] bg-[var(--color-surface-2)] p-2.5">
          <p className="text-[11px] text-[var(--color-ink-3)]">
            <span className="font-medium text-[var(--color-ink-2)]">{getUser(lastMsg.authorId)?.name.split(" ")[0]}</span> · {relativeTime(lastMsg.timestamp)}
          </p>
          <p className="mt-0.5 line-clamp-2 text-[12px] text-[var(--color-ink-2)]">{lastMsg.content}</p>
        </div>
      )}
      <Button size="sm" variant="secondary" className="mt-4 w-full" onClick={onOpen}>Open chat</Button>
    </Card>
  );
}
