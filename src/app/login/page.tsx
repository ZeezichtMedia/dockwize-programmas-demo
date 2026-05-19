"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DockwizeLogo } from "@/components/dockwize-logo";
import { useAuth } from "@/lib/auth-context";
import { users } from "@/lib/mock/users";
import { cn } from "@/lib/utils";

const heroQuotes = [
  {
    quote:
      "Geen Microsoft-account nodig. Ik klik op de mail en zit meteen in mijn werkmap.",
    name: "Marleen de Visser",
    company: "De Werkbrand · Jouw Programma voorjaar 2026",
  },
  {
    quote:
      "Mijn cohort, mijn coach en de bibliotheek staan op één plek. Scheelt zoeken.",
    name: "Jeroen Klompmaker",
    company: "North Sea Lab",
  },
  {
    quote:
      "De assistent zoekt voor me door alle video's. Antwoord met de juiste video erbij.",
    name: "Aisha Boutkabout",
    company: "Studio Kind",
  },
];

const demoUsers = [
  { id: "u_marleen", role: "Ondernemer", subtitle: "De Werkbrand" },
  { id: "u_hans", role: "Coach", subtitle: "Groeicoach" },
  { id: "u_joanne", role: "Coördinator", subtitle: "Admin" },
  { id: "u_pascal", role: "Manager", subtitle: "Super-admin" },
];

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = React.useState("");
  const [stage, setStage] = React.useState<"email" | "sent" | "demo">("email");
  const [activeQuote, setActiveQuote] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveQuote((q) => (q + 1) % heroQuotes.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStage("sent");
    setTimeout(() => {
      // Demo: just sign in the matching mock user (Marleen by default)
      const matched = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      signIn(matched?.id ?? "u_marleen");
    }, 1700);
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_minmax(440px,520px)]">
      {/* Hero */}
      <div className="relative hidden overflow-hidden bg-[var(--color-ink)] text-white lg:block">
        <Image
          src="/cohort/home1.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-ink)] via-[var(--color-ink)]/85 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[var(--color-ink)] via-[var(--color-ink)]/70 to-transparent" />

        <div className="relative flex h-full flex-col justify-between p-12">
          <DockwizeLogo size="lg" variant="light" />

          <div className="max-w-xl space-y-12">
            <div>
              <Badge variant="accent" className="mb-5">
                <Sparkles className="size-3" /> Werkmap-platform
              </Badge>
              <h1 className="text-balance text-[44px] font-semibold leading-[1.05] tracking-tight">
                Eén werkplek voor jouw programma bij Dockwize.
              </h1>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/70">
                Privé werkmap met je coach. Chat met je cohort. Bibliotheek met video's en materialen, doorzoekbaar met een assistent. Zonder Microsoft-account.
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.figure
                key={activeQuote}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="border-l-2 border-[var(--color-accent)] pl-5"
              >
                <blockquote className="text-[18px] font-medium leading-snug text-white">
                  &ldquo;{heroQuotes[activeQuote].quote}&rdquo;
                </blockquote>
                <figcaption className="mt-3 text-[13px] text-white/60">
                  {heroQuotes[activeQuote].name} · {heroQuotes[activeQuote].company}
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-6 text-[12px] text-white/50">
            <span>© 2026 Dockwize</span>
            <span>·</span>
            <span>Edisonweg 41, Vlissingen</span>
            <span>·</span>
            <span>EU data residency, AVG-compliant</span>
          </div>
        </div>
      </div>

      {/* Login pane */}
      <div className="flex flex-col bg-[var(--color-bg)]">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] p-6 lg:hidden">
          <DockwizeLogo size="md" />
          <Badge variant="outline">Demo</Badge>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <AnimatePresence mode="wait">
              {stage === "email" && (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-7"
                >
                  <div>
                    <h2 className="text-[28px] font-semibold leading-tight tracking-tight">
                      Inloggen
                    </h2>
                    <p className="mt-2 text-[14px] text-[var(--color-ink-3)]">
                      Vul het mailadres in waarmee Dockwize je heeft uitgenodigd. Je krijgt een loginlink in je mail. Geen wachtwoord nodig.
                    </p>
                  </div>

                  <form onSubmit={handleEmailSubmit} className="space-y-3">
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-muted)]" />
                      <Input
                        type="email"
                        placeholder="jij@jouwbedrijf.nl"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoFocus
                        className="h-11 pl-10 text-[15px]"
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full" disabled={!email.trim()}>
                      Stuur loginlink
                      <ArrowRight className="size-4" />
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-[var(--color-border)]" />
                    </div>
                    <div className="relative flex justify-center text-[12px]">
                      <span className="bg-[var(--color-bg)] px-3 text-[var(--color-muted)] uppercase tracking-wider">
                        of
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    onClick={() => setStage("demo")}
                  >
                    Demo bekijken: kies een rol
                  </Button>

                  <p className="text-center text-[12px] text-[var(--color-muted)]">
                    Door in te loggen ga je akkoord met de <a className="underline underline-offset-2 hover:text-[var(--color-ink)]">voorwaarden</a> en <a className="underline underline-offset-2 hover:text-[var(--color-ink)]">privacy</a>.
                  </p>
                </motion.div>
              )}

              {stage === "sent" && (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 text-center"
                >
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[var(--color-accent)]">
                    <Check className="size-7 text-[var(--color-ink)]" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-[24px] font-semibold tracking-tight">
                      Mail verstuurd
                    </h2>
                    <p className="mt-2 text-[14px] text-[var(--color-ink-3)]">
                      We hebben de loginlink gestuurd naar <strong className="text-[var(--color-ink)]">{email}</strong>. Even geduld, je wordt zo doorgestuurd.
                    </p>
                  </div>
                  <div className="mx-auto h-1 w-32 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.7, ease: "linear" }}
                      className="h-full bg-[var(--color-ink)]"
                    />
                  </div>
                </motion.div>
              )}

              {stage === "demo" && (
                <motion.div
                  key="demo"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div>
                    <Badge variant="soft" className="mb-3">Demo modus</Badge>
                    <h2 className="text-[24px] font-semibold leading-tight tracking-tight">
                      Kies een rol
                    </h2>
                    <p className="mt-2 text-[14px] text-[var(--color-ink-3)]">
                      Zie hoe het platform werkt voor de ondernemer, de coach, de programmamanager, de coördinator of Pascal als manager.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {demoUsers.map((demo) => {
                      const u = users.find((x) => x.id === demo.id)!;
                      return (
                        <button
                          key={demo.id}
                          onClick={() => signIn(demo.id)}
                          className={cn(
                            "group flex w-full items-center gap-3 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-left transition-all hover:border-[var(--color-ink)] hover:shadow-[var(--shadow-md)]"
                          )}
                        >
                          <UserAvatar src={u.avatar} name={u.name} size="md" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-[14px] font-medium text-[var(--color-ink)]">
                                {u.name}
                              </p>
                              <Badge variant="default">{demo.role}</Badge>
                            </div>
                            <p className="truncate text-[12px] text-[var(--color-ink-3)]">
                              {u.jobTitle ?? demo.subtitle}
                            </p>
                          </div>
                          <ArrowRight className="size-4 text-[var(--color-muted)] transition-all group-hover:translate-x-0.5 group-hover:text-[var(--color-ink)]" />
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setStage("email")}
                    className="text-[13px] text-[var(--color-ink-3)] underline underline-offset-2 transition-colors hover:text-[var(--color-ink)]"
                  >
                    ← Terug naar inloggen
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="border-t border-[var(--color-border)] p-6 text-center text-[12px] text-[var(--color-muted)]">
          Werkmap-platform · gebouwd voor Dockwize door <span className="text-[var(--color-ink-2)]">Agensea</span>
        </div>
      </div>
    </div>
  );
}
