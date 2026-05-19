"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Mail, MailPlus, ShieldCheck, UserPlus, Users, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn, initials, relativeTime } from "@/lib/utils";
import type { GuestMember, GuestRole } from "@/lib/types";

interface TeamMembersCardProps {
  guests: GuestMember[];
  entrepreneurFirstName: string;
}

export function TeamMembersCard({ guests: initialGuests, entrepreneurFirstName }: TeamMembersCardProps) {
  const [guests, setGuests] = React.useState<GuestMember[]>(initialGuests);
  const [open, setOpen] = React.useState(false);

  const addGuest = (g: GuestMember) => setGuests((prev) => [...prev, g]);

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-2 pb-3">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-4" /> Teamleden
          </CardTitle>
          <p className="text-[12px] text-[var(--color-ink-3)]">
            Mensen uit je eigen team die mogen meekijken (collega, partner, boekhouder). Geen extra Dockwize-account nodig.
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
          <UserPlus className="size-3.5" /> Iemand uitnodigen
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {guests.length === 0 ? (
          <div className="rounded-[10px] border border-dashed border-[var(--color-border-strong)] p-4 text-center">
            <p className="text-[12.5px] text-[var(--color-ink-3)]">
              Nog niemand uitgenodigd. Je kan tot 4 teamleden toevoegen.
            </p>
          </div>
        ) : (
          guests.map((g) => <GuestRow key={g.id} guest={g} onRemove={() => setGuests((p) => p.filter((x) => x.id !== g.id))} />)
        )}

        <div className="flex items-start gap-2 rounded-[8px] bg-[var(--color-surface-2)] p-2.5">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-[var(--color-ink-3)]" />
          <p className="text-[11.5px] leading-snug text-[var(--color-ink-2)]">
            <strong className="text-[var(--color-ink)]">Wat zien teamleden:</strong> jouw bestanden, opdrachten en je coach-feedback. Niets van andere ondernemers. Elke toegang wordt gelogd.
          </p>
        </div>
      </CardContent>

      <InviteGuestDialog
        open={open}
        onOpenChange={setOpen}
        onInvite={addGuest}
        entrepreneurFirstName={entrepreneurFirstName}
      />
    </Card>
  );
}

function GuestRow({ guest, onRemove }: { guest: GuestMember; onRemove: () => void }) {
  const isInvited = guest.status === "invited";
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-[10px] border p-2.5",
        isInvited ? "border-amber-200 bg-amber-50/40" : "border-[var(--color-border)] bg-white"
      )}
    >
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
          isInvited ? "bg-amber-100 text-amber-800" : "bg-gradient-to-br from-blue-400 to-indigo-600 text-white"
        )}
      >
        {guest.name ? initials(guest.name) : <Mail className="size-3.5" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="truncate text-[13px] font-semibold">
            {guest.name ?? guest.email}
          </p>
          {isInvited ? (
            <Badge variant="soft" className="text-[9.5px]">Uitnodiging open</Badge>
          ) : (
            <Badge variant="default" className="text-[9.5px]">
              {guest.role === "commenter" ? "Mag reageren" : "Alleen lezen"}
            </Badge>
          )}
        </div>
        <p className="truncate text-[11px] text-[var(--color-ink-3)]">
          {guest.relationship ? `${guest.relationship} · ` : ""}
          {isInvited ? `Uitgenodigd ${relativeTime(guest.invitedAt)}` : guest.email}
        </p>
      </div>
      <button
        onClick={onRemove}
        className="rounded p-1 text-[var(--color-ink-3)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-danger)]"
        aria-label="Toegang intrekken"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}

function InviteGuestDialog({
  open,
  onOpenChange,
  onInvite,
  entrepreneurFirstName,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onInvite: (g: GuestMember) => void;
  entrepreneurFirstName: string;
}) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [relationship, setRelationship] = React.useState("");
  const [role, setRole] = React.useState<GuestRole>("commenter");
  const [stage, setStage] = React.useState<"compose" | "sent">("compose");

  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setName("");
        setEmail("");
        setRelationship("");
        setRole("commenter");
        setStage("compose");
      }, 250);
    }
  }, [open]);

  const submit = () => {
    if (!email.trim()) return;
    const guest: GuestMember = {
      id: `g_new_${Date.now()}`,
      email: email.trim(),
      name: name.trim() || undefined,
      relationship: relationship.trim() || undefined,
      role,
      status: "invited",
      invitedAt: new Date().toISOString(),
      invitedBy: "current_user",
    };
    onInvite(guest);
    setStage("sent");
    setTimeout(() => onOpenChange(false), 1600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <AnimatePresence mode="wait">
          {stage === "compose" ? (
            <motion.div key="compose" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MailPlus className="size-4" /> Teamlid uitnodigen
                </DialogTitle>
                <DialogDescription>
                  De uitgenodigde krijgt een mail met een directe link. Geen wachtwoord nodig, geen Dockwize-account nodig.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-[11.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
                    Naam (optioneel)
                  </label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Voornaam Achternaam" />
                </div>
                <div>
                  <label className="mb-1 block text-[11.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
                    E-mail
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="naam@bedrijf.nl"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
                    Wie is dit voor jou? (optioneel)
                  </label>
                  <Input
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    placeholder="Bv. partner, mede-oprichter, boekhouder"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
                    Toegang
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <RoleOption
                      active={role === "viewer"}
                      onClick={() => setRole("viewer")}
                      title="Alleen lezen"
                      body="Bekijkt je werkmap. Geen reageren op opdrachten of chat."
                    />
                    <RoleOption
                      active={role === "commenter"}
                      onClick={() => setRole("commenter")}
                      title="Mag reageren"
                      body="Kan opmerkingen plaatsen onder opdrachten en bestanden."
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 rounded-[10px] bg-[var(--color-surface-2)] p-3">
                  <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-[var(--color-ink-3)]" />
                  <p className="text-[11px] leading-snug text-[var(--color-ink-2)]">
                    {entrepreneurFirstName}, je nodigt iemand uit jouw eigen team uit. Ze zien jouw werkmap, niet die van andere ondernemers. Je kunt toegang elk moment intrekken.
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="secondary" onClick={() => onOpenChange(false)}>Annuleren</Button>
                <Button onClick={submit} disabled={!email.trim()}>
                  <Mail className="size-3.5" /> Stuur uitnodiging
                </Button>
              </DialogFooter>
            </motion.div>
          ) : (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-6 text-center"
            >
              <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-emerald-100">
                <Check className="size-5 text-emerald-700" strokeWidth={3} />
              </div>
              <h3 className="text-[16px] font-semibold tracking-tight">Uitnodiging onderweg</h3>
              <p className="mt-1.5 max-w-sm text-[12.5px] text-[var(--color-ink-2)]">
                We hebben de mail gestuurd naar <strong>{email}</strong>. Zodra ze klikken zijn ze direct binnen.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

function RoleOption({
  active,
  onClick,
  title,
  body,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  body: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-[10px] border p-3 text-left transition-all",
        active
          ? "border-[var(--color-ink)] bg-[var(--color-surface-2)] shadow-[var(--shadow-sm)]"
          : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]"
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold">{title}</p>
        {active && <Check className="size-3.5 text-[var(--color-ink)]" />}
      </div>
      <p className="mt-0.5 text-[11px] text-[var(--color-ink-3)]">{body}</p>
    </button>
  );
}
