"use client";

import { LayoutDashboard, MessageSquare, Bot, Box, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", badge: 12 },
  { id: "chats", icon: MessageSquare, label: "Chats", badge: 5 },
  { id: "agents", icon: Bot, label: "Agents", badge: 1 },
  { id: "thing", icon: Box, label: "Thing", badge: null },
];

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <div className="flex h-full w-16 flex-col items-center border-r border-border bg-card py-4">
      <nav className="flex flex-1 flex-col items-center gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "relative flex h-12 w-12 flex-col items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
              activeView === item.id && "bg-accent text-accent-foreground"
            )}
          >
            {item.badge !== null && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                {item.badge}
              </span>
            )}
            <item.icon className="h-5 w-5" />
            <span className="mt-1 text-[10px]">{item.label}</span>
          </button>
        ))}
      </nav>
      <button className="flex h-12 w-12 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
        <Settings className="h-5 w-5" />
      </button>
    </div>
  );
}
