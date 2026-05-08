"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Folder,
  Users,
  Library,
  Sparkles,
  LayoutDashboard,
  Settings,
  Inbox,
  ShieldCheck,
  Building2,
  ClipboardList,
  Archive,
  GraduationCap,
} from "lucide-react";
import { DockwizeLogo } from "@/components/dockwize-logo";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

const navByRole: Record<Role, NavGroup[]> = {
  entrepreneur: [
    {
      items: [
        { label: "Mijn werkmap", href: "/werkmap", icon: Folder },
        { label: "Mijn cohort", href: "/cohort", icon: Users },
        { label: "Bibliotheek", href: "/bibliotheek", icon: Library },
        { label: "Vraag de bibliotheek", href: "/ai", icon: Sparkles, badge: "AI" },
      ],
    },
    {
      label: "Persoonlijk",
      items: [
        { label: "Inbox", href: "/inbox", icon: Inbox, badge: 3 },
      ],
    },
  ],
  coach: [
    {
      items: [
        { label: "Mijn ondernemers", href: "/coach", icon: Users },
        { label: "Inbox", href: "/inbox", icon: Inbox, badge: 2 },
        { label: "Bibliotheek", href: "/bibliotheek", icon: Library },
      ],
    },
  ],
  program_manager: [
    {
      items: [
        { label: "Mijn programma's", href: "/programma-manager", icon: GraduationCap },
        { label: "Content publiceren", href: "/admin/content", icon: Library },
        { label: "Cohorts", href: "/admin/cohorts", icon: Users },
        { label: "Inbox", href: "/inbox", icon: Inbox },
      ],
    },
  ],
  admin: [
    {
      items: [
        { label: "Overzicht", href: "/admin", icon: LayoutDashboard },
        { label: "Ondernemers", href: "/admin/users", icon: Building2 },
        { label: "Cohorts", href: "/admin/cohorts", icon: Users },
        { label: "Coaches", href: "/admin/coaches", icon: GraduationCap },
        { label: "Content", href: "/admin/content", icon: Library },
      ],
    },
    {
      label: "Beheer",
      items: [
        { label: "Retentie", href: "/admin/retentie", icon: Archive },
        { label: "Audit log", href: "/admin/audit", icon: ClipboardList },
        { label: "Rechten", href: "/admin/rechten", icon: ShieldCheck },
        { label: "Instellingen", href: "/admin/settings", icon: Settings },
      ],
    },
  ],
  super_admin: [
    {
      items: [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Programma's", href: "/admin/programmas", icon: GraduationCap },
        { label: "Cohorts", href: "/admin/cohorts", icon: Users },
        { label: "Ondernemers", href: "/admin/users", icon: Building2 },
        { label: "Bibliotheek", href: "/bibliotheek", icon: Library },
      ],
    },
    {
      label: "Beheer",
      items: [
        { label: "Retentie", href: "/admin/retentie", icon: Archive },
        { label: "Audit log", href: "/admin/audit", icon: ClipboardList },
        { label: "Rechten", href: "/admin/rechten", icon: ShieldCheck },
        { label: "Instellingen", href: "/admin/settings", icon: Settings },
      ],
    },
  ],
};

interface SidebarProps {
  role: Role;
}

function navTourAttr(href: string): string | undefined {
  if (href === "/cohort") return "sidebar-nav-cohort";
  if (href === "/ai") return "sidebar-nav-ai";
  if (href === "/werkmap") return "sidebar-nav-werkmap";
  if (href === "/bibliotheek") return "sidebar-nav-bibliotheek";
  return undefined;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const groups = navByRole[role] ?? navByRole.entrepreneur;

  return (
    <aside data-tour="sidebar-nav" className="hidden h-full w-[244px] shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] md:flex">
      <div className="flex h-14 items-center border-b border-[var(--color-border)] px-5">
        <Link href="/" className="block">
          <DockwizeLogo size="md" />
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        {groups.map((group, gi) => (
          <div key={gi} className={cn(gi > 0 && "mt-5")}>
            {group.label && (
              <p className="px-2.5 pb-1.5 text-[10.5px] font-medium uppercase tracking-[0.08em] text-[var(--color-muted)]">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                const tourAttr = navTourAttr(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      data-tour={tourAttr}
                      className={cn(
                        "group relative flex items-center gap-2.5 rounded-[8px] px-2.5 py-1.5 text-[13px] font-medium transition-all",
                        active
                          ? "bg-[var(--color-ink)] text-white shadow-[var(--shadow-sm)]"
                          : "text-[var(--color-ink-2)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
                      )}
                    >
                      <item.icon className={cn("size-4 shrink-0", active ? "text-white" : "text-[var(--color-ink-3)]")} />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge !== undefined && (
                        <Badge
                          variant={active ? "accent" : "default"}
                          className={cn(
                            "h-5 min-w-5 justify-center px-1.5 text-[10px]",
                            typeof item.badge === "string" && active && "bg-[var(--color-accent)] text-[var(--color-ink)]"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--color-border)] p-3">
        <div className="rounded-[10px] bg-gradient-to-br from-[var(--color-accent-soft)] to-[#ffe687] p-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-ink)]/70">
            Conceptdemo
          </p>
          <p className="mt-1 text-[12px] leading-snug text-[var(--color-ink)]">
            Wissel rechtsboven van rol om te zien hoe de tool er voor de coach, programmamanager, coördinator of Pascal uitziet.
          </p>
        </div>
      </div>
    </aside>
  );
}
