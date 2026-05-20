"use client";

import * as React from "react";
import { Topbar } from "@/components/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus } from "lucide-react";
import { Planner } from "@/components/planner/planner";
import { EntrepreneurAgenda } from "@/components/planner/entrepreneur-agenda";
import { RequestOneOnOneDialog } from "@/components/quick-plan-dialog";
import { useUser } from "@/lib/auth-context";
import { getUser } from "@/lib/mock/users";

export default function AgendaPage() {
  const user = useUser();
  const [requestOpen, setRequestOpen] = React.useState(false);
  const coach = user.coachId ? getUser(user.coachId) : null;

  if (user.role === "entrepreneur") {
    // Ondernemer: read-only agenda + aanvraag-knop
    return (
      <>
        <Topbar
          title="Mijn agenda"
          subtitle="Sessies, 1-op-1's en deadlines"
          action={
            coach && (
              <Button size="sm" variant="accent" onClick={() => setRequestOpen(true)}>
                <UserPlus className="size-3.5" /> Vraag 1-op-1 aan
              </Button>
            )
          }
        />
        <EntrepreneurAgenda />
        {coach && (
          <RequestOneOnOneDialog open={requestOpen} onOpenChange={setRequestOpen} coach={coach} />
        )}
      </>
    );
  }

  // Coach / coordinator / programmamanager / super_admin: drag-drop planner
  const planSubtitle = subtitleForRole(user.role);
  return (
    <>
      <Topbar
        title="Planner"
        subtitle={planSubtitle}
        action={
          <Badge variant="default" className="hidden md:inline-flex">
            ⌘-klik · Sleep om in te plannen
          </Badge>
        }
      />
      <div className="h-[calc(100vh-3.5rem)]">
        <Planner />
      </div>
    </>
  );
}

function subtitleForRole(role: string): string {
  switch (role) {
    case "coach":
      return "Sleep een ondernemer naar een dagslot om een 1-op-1 in te plannen";
    case "admin":
      return "Plan sessies voor alle ondernemers in actieve groepen";
    case "program_manager":
      return "Sessies en 1-op-1's voor jouw programma's";
    case "super_admin":
      return "Volledig overzicht van geplande sessies";
    default:
      return "Plan sessies en bekijk de week";
  }
}
