"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Bookmark,
  Brain,
  ChartLine,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Materials",
    href: "/materials",
    icon: BookOpen,
  },
  {
    name: "Practice",
    href: "/practice",
    icon: Brain,
  },
  {
    name: "Exams",
    href: "/exams",
    icon: ClipboardList,
  },
  {
    name: "Question Bank",
    href: "/questions",
    icon: FileText,
  },
  {
    name: "Bookmarks",
    href: "/bookmarks",
    icon: Bookmark,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: ChartLine,
  },
];

const bottomNavigation = [
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-surface">
      <div className="flex h-16 shrink-0 items-center px-4">
        <Link
          href="/dashboard"
          className="text-xl font-semibold tracking-tight text-foreground"
        >
          Revia
        </Link>
      </div>
      <nav className="flex flex-1 flex-col overflow-y-auto px-2 py-4">
        <ul className="flex flex-1 flex-col gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-muted text-primary"
                      : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
          <li className="mt-auto">
            {bottomNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-muted text-primary"
                      : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </li>
        </ul>
      </nav>
    </aside>
  );
}
