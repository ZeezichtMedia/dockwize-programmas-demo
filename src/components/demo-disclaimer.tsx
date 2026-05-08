"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Check, MessageCircle } from "lucide-react";
import { DockwizeLogo } from "@/components/dockwize-logo";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "dockwize_demo_disclaimer_seen_v1";
const TOUR_TRIGGER_KEY = "dockwize_demo_start_tour";

export function DemoDisclaimer() {
  const [open, setOpen] = React.useState(false);
  const [hasScrolledToEnd, setHasScrolledToEnd] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      const t = setTimeout(() => setOpen(true), 280);
      return () => clearTimeout(t);
    }
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      const el = scrollRef.current;
      if (el && el.scrollHeight <= el.clientHeight + 8) setHasScrolledToEnd(true);
    }, 120);
    return () => {
      document.body.style.overflow = original;
      clearTimeout(t);
    };
  }, [open]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom < 24) setHasScrolledToEnd(true);
  };

  const accept = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
      sessionStorage.setItem(TOUR_TRIGGER_KEY, "1");
    }
    setOpen(false);
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--color-ink)]/80 p-4 backdrop-blur-md"
        onKeyDown={(e) => e.preventDefault()}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex max-h-[88vh] w-full max-w-xl flex-col overflow-hidden rounded-[20px] bg-[var(--color-surface)] shadow-[var(--shadow-xl)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-gradient-to-br from-[var(--color-accent-soft)] to-white px-5 py-4">
            <DockwizeLogo size="sm" suffix="Werkmap" />
            <span className="rounded-full bg-[var(--color-ink)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
              Voorbeeld
            </span>
          </div>

          {/* Body */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-6 py-5"
          >
            <h1 className="text-balance text-[24px] font-semibold leading-tight tracking-tight text-[var(--color-ink)]">
              Hoi Pascal.
            </h1>
            <p className="mt-2.5 text-[14px] leading-relaxed text-[var(--color-ink-2)]">
              Welkom bij de demo. Dit is geen werkende app, maar een doorklikbaar voorbeeld zodat je kunt voelen hoe de werkmap voor jullie programma's eruit zou kunnen zien. Bedoeld als gespreksstartpunt, niet als eindbeeld.
            </p>

            <Block title="Wat je hier kunt bekijken">
              <ul className="space-y-1.5">
                <li><strong className="text-[var(--color-ink)]">Een eigen werkmap per ondernemer</strong>, alleen toegankelijk voor de ondernemer en de toegewezen coach. Bestanden, opdrachten en feedback bij elkaar.</li>
                <li><strong className="text-[var(--color-ink)]">De groepschat van een cohort</strong>, met de mogelijkheid voor deelnemers om kleinere subgroepjes te starten.</li>
                <li><strong className="text-[var(--color-ink)]">Een bibliotheek met video's en documenten</strong>, en een zoekhulp die vragen beantwoordt met de juiste bron erbij.</li>
                <li><strong className="text-[var(--color-ink)]">De beheerkant voor Joanne</strong>: ondernemers koppelen, coaches toewijzen, retentie en een audit-spoor van wie wat deed.</li>
                <li><strong className="text-[var(--color-ink)]">Vijf perspectieven</strong>: wissel rechtsboven om te zien wat een ondernemer, coach, programmamanager, Joanne of jij zelf ziet.</li>
              </ul>
            </Block>

            <Block title="Wat hier verzonnen is">
              <ul className="space-y-1.5">
                <li>De negen ondernemers (Marleen, Jeroen, Aisha en de rest) zijn fictief. Hun bedrijven, bestanden, opdrachten en chatberichten ook.</li>
                <li>De zoekhulp geeft antwoorden die we voor de demo hebben klaargezet. In het echt komt er een echte zoekmachine onder die door jullie eigen bibliotheek loopt.</li>
                <li>De cijfers in de dashboards en alle tijdsmeldingen zijn voorbeelden.</li>
                <li>Foto's en namen van het Dockwize-team zijn echt, die staan ook gewoon op dockwize.nl.</li>
              </ul>
            </Block>

            <Block title="Waar we vooral input op zoeken">
              <ul className="space-y-1.5">
                <li>Welke onderdelen écht must-have zijn, en welke je rustig laat liggen voor v2.</li>
                <li>Of de manier waarop privacy werkt (wat ondernemers wel en niet van elkaar zien) klopt voor jullie.</li>
                <li>Of de werkwijze voor Joanne tijdwinst oplevert, of dat we daar nog stappen overslaan.</li>
                <li>Wat er aan UI of taal anders moet zodat het voelt als Dockwize en niet als generieke software.</li>
              </ul>
            </Block>

            <div className="mt-5 flex items-start gap-3 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]">
                <MessageCircle className="size-4 text-[var(--color-ink)]" />
              </div>
              <div className="text-[13px] leading-snug text-[var(--color-ink-2)]">
                <p><strong className="text-[var(--color-ink)]">Iets onduidelijk of werkt iets niet zoals je verwacht?</strong></p>
                <p className="mt-1">Stuur Jorian gewoon even een appje. Sneller dan zelf zoeken. En verder: klik vrij rond, niks kan stuk.</p>
              </div>
            </div>
          </div>

          {!hasScrolledToEnd && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-[80px] left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-[var(--color-ink)] px-3 py-1.5 text-[11px] font-medium text-white shadow-[var(--shadow-md)]"
            >
              <ArrowDown className="size-3" /> Lees verder
            </button>
          )}

          {/* Footer */}
          <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3.5">
            <Button
              onClick={accept}
              disabled={!hasScrolledToEnd}
              size="lg"
              variant={hasScrolledToEnd ? "accent" : "secondary"}
              className="w-full"
            >
              {hasScrolledToEnd && <Check className="size-4" />}
              Begrepen, laat maar zien
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <h2 className="text-[13.5px] font-semibold tracking-tight text-[var(--color-ink)]">{title}</h2>
      <div className="mt-1.5 text-[13px] leading-relaxed text-[var(--color-ink-2)]">{children}</div>
    </div>
  );
}
