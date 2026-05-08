"use client";

import { Plus } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { coaches } from "@/lib/mock/users";
import { workfolders } from "@/lib/mock/workfolders";

export default function CoachesPage() {
  return (
    <>
      <Topbar
        title="Coaches"
        subtitle={`${coaches.length} actieve coaches`}
        action={<Button size="sm"><Plus className="size-4" /> Nieuwe coach</Button>}
      />
      <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
        {coaches.map((c) => {
          const assigned = workfolders.filter((wf) => wf.coachId === c.id).length;
          return (
            <Card key={c.id} className="p-5">
              <div className="flex items-start gap-3">
                <UserAvatar src={c.avatar} name={c.name} size="lg" />
                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px] font-semibold">{c.name}</p>
                  <p className="text-[12px] text-[var(--color-ink-3)]">{c.jobTitle}</p>
                </div>
                <Badge variant="default">{assigned} ondernemers</Badge>
              </div>
              {c.bio && <p className="mt-3 text-[12px] text-[var(--color-ink-2)]">{c.bio}</p>}
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="secondary" className="flex-1">Bekijk profiel</Button>
                <Button size="sm" variant="ghost">Toewijzen</Button>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
