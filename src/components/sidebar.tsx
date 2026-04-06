"use client";

import { SquaresFour, ChatDots, Robot, Gear } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/theme-switcher";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: "dashboard", icon: SquaresFour, label: "Dashboard", badge: 12 },
  { id: "chats", icon: ChatDots, label: "Chats", badge: 5 },
  { id: "agents", icon: Robot, label: "Agents", badge: 1 },
];

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <div className="flex h-full w-20 flex-col items-center border-r border-border bg-card py-4 px-2">
      <nav className="flex flex-1 flex-col items-center gap-2 w-full">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "relative flex h-12 w-full flex-col items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
              activeView === item.id && "bg-accent text-accent-foreground"
            )}
          >
            {item.badge !== null && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-medium text-primary-foreground">
                {item.badge}
              </span>
            )}
            <item.icon className="h-5 w-5" weight={activeView === item.id ? "fill" : "light"} />
            <span className="mt-1 text-xs">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="flex flex-col items-center gap-1 w-full">
        <ThemeSwitcher />
        <button className="flex h-10 w-full items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
          <Gear className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
