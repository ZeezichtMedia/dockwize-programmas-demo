"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Eye, LogOut, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { useAuth, getHomeRoute } from "@/lib/auth-context";
import { users } from "@/lib/mock/users";
import { cn } from "@/lib/utils";

const roleLabels: Record<string, string> = {
  entrepreneur: "Ondernemer",
  coach: "Coach",
  admin: "Coördinator",
  program_manager: "Programmamanager",
  super_admin: "Manager",
};

const demoOrder = ["u_marleen", "u_hans", "u_joanne", "u_pascal"];

export function RoleSwitcher() {
  const { user, signOut, setUserId } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const switchTo = (id: string) => {
    setUserId(id);
    const u = users.find((x) => x.id === id);
    if (u) router.push(getHomeRoute(u));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button data-tour="role-switcher" className="group flex items-center gap-2 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] py-1 pl-1 pr-2.5 transition-all hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-sm)]">
          <UserAvatar src={user.avatar} name={user.name} size="sm" />
          <div className="hidden text-left md:block">
            <p className="text-[12.5px] font-medium leading-tight text-[var(--color-ink)]">
              {user.name.split(" ")[0]}
            </p>
            <p className="text-[10.5px] leading-tight text-[var(--color-ink-3)]">
              {roleLabels[user.role]}
            </p>
          </div>
          <ChevronDown className="size-3.5 text-[var(--color-muted)]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <div className="flex items-center gap-3 p-2">
          <UserAvatar src={user.avatar} name={user.name} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium">{user.name}</p>
            <p className="truncate text-[11px] text-[var(--color-ink-3)]">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => router.push("/profiel")}>
          <UserIcon className="size-4" /> Mijn profiel
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center gap-1.5">
          <Eye className="size-3" /> Demo: kijk als
        </DropdownMenuLabel>
        <div className="max-h-[260px] overflow-y-auto">
          {demoOrder.map((id) => {
            const u = users.find((x) => x.id === id)!;
            const isCurrent = u.id === user.id;
            return (
              <DropdownMenuItem
                key={id}
                onSelect={() => switchTo(id)}
                className={cn("gap-2.5", isCurrent && "bg-[var(--color-surface-2)]")}
              >
                <UserAvatar src={u.avatar} name={u.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-medium text-[var(--color-ink)]">
                    {u.name}
                  </p>
                  <p className="truncate text-[10.5px] text-[var(--color-ink-3)]">
                    {u.jobTitle ?? roleLabels[u.role]}
                  </p>
                </div>
                <Badge variant={isCurrent ? "dark" : "default"} className="text-[10px]">
                  {roleLabels[u.role]}
                </Badge>
              </DropdownMenuItem>
            );
          })}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={signOut} className="text-[var(--color-danger)]">
          <LogOut className="size-4" /> Uitloggen
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
