"use client";

import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { Input, Textarea } from "@/components/ui/input";
import { useUser } from "@/lib/auth-context";

export default function ProfilePage() {
  const user = useUser();
  return (
    <>
      <Topbar title="Mijn profiel" subtitle="Persoonlijke gegevens en voorkeuren" />
      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_2fr]">
        <Card className="p-6">
          <div className="flex flex-col items-center text-center">
            <UserAvatar src={user.avatar} name={user.name} size="xl" />
            <p className="mt-3 text-[16px] font-semibold">{user.name}</p>
            <p className="text-[12px] text-[var(--color-ink-3)]">{user.email}</p>
            <Badge variant="default" className="mt-2">{user.jobTitle ?? user.role}</Badge>
            <Button size="sm" variant="secondary" className="mt-4">Foto uploaden</Button>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gegevens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Naam" defaultValue={user.name} />
            <Field label="E-mail" defaultValue={user.email} />
            {user.company && <Field label="Bedrijf" defaultValue={user.company} />}
            {user.jobTitle && <Field label="Functie" defaultValue={user.jobTitle} />}
            {user.bio && <Field label="Korte bio" defaultValue={user.bio} textarea />}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function Field({ label, defaultValue, textarea }: { label: string; defaultValue: string; textarea?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-[11.5px] font-medium uppercase tracking-wider text-[var(--color-muted)]">{label}</label>
      {textarea ? <Textarea defaultValue={defaultValue} rows={3} /> : <Input defaultValue={defaultValue} />}
    </div>
  );
}
