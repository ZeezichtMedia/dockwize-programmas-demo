"use client";

import { Bell, MailCheck } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { useUser } from "@/lib/auth-context";
import { notificationsForUser } from "@/lib/mock/notifications";
import { getUser } from "@/lib/mock/users";
import { relativeTime, cn } from "@/lib/utils";

const typeLabels: Record<string, string> = {
  feedback: "Feedback",
  assignment: "Opdracht",
  chat: "Chat",
  library: "Bibliotheek",
  session: "Sessie",
  system: "Systeem",
};

export default function InboxPage() {
  const user = useUser();
  const notifs = notificationsForUser(user.id);

  return (
    <>
      <Topbar
        title="Inbox"
        subtitle="Alle meldingen op één plek"
        action={
          <Button variant="secondary" size="sm">
            <MailCheck className="size-3.5" /> Alles als gelezen markeren
          </Button>
        }
      />
      <div className="space-y-3 p-6">
        {notifs.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="mx-auto size-8 text-[var(--color-ink-3)]" />
            <p className="mt-3 text-[14px] font-medium">Lege inbox</p>
            <p className="text-[12px] text-[var(--color-ink-3)]">Geen meldingen voor je vandaag.</p>
          </Card>
        ) : (
          notifs.map((n) => {
            const from = n.fromUserId ? getUser(n.fromUserId) : null;
            return (
              <Card key={n.id} className={cn("p-4 transition-colors hover:border-[var(--color-border-strong)]", !n.read && "border-l-4 border-l-[var(--color-info)]")}>
                <div className="flex items-start gap-3">
                  {from ? (
                    <UserAvatar src={from.avatar} name={from.name} size="md" />
                  ) : (
                    <div className="flex size-10 items-center justify-center rounded-full bg-[var(--color-surface-2)]">
                      <Bell className="size-4 text-[var(--color-ink-2)]" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[13.5px] font-semibold text-[var(--color-ink)]">{n.title}</p>
                      <Badge variant="default" className="text-[10px]">{typeLabels[n.type] ?? n.type}</Badge>
                      {!n.read && <span className="size-1.5 rounded-full bg-[var(--color-info)]" />}
                    </div>
                    <p className="mt-0.5 text-[12.5px] text-[var(--color-ink-2)]">{n.body}</p>
                    <p className="mt-1.5 text-[11px] text-[var(--color-muted)]">{relativeTime(n.createdAt)}</p>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </>
  );
}
