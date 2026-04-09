"use client";

import { House, ChatDots, Buildings, Robot, Gear } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: "dashboard", icon: House, label: "Dashboard", badge: 12 },
  { id: "chats", icon: ChatDots, label: "Chats", badge: 5 },
  { id: "clients", icon: Buildings, label: "Clients", badge: null },
  { id: "agents", icon: Robot, label: "Agents", badge: 1 },
];

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-full w-16 flex-col items-center border-r border-border bg-card py-4 px-2">
        <nav className="flex flex-1 flex-col items-center gap-1 w-full">
          {navItems.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={cn(
                    "relative flex h-10 w-full items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                    activeView === item.id && "bg-accent text-accent-foreground"
                  )}
                >
                  {item.badge !== null && (
                    <span className="absolute -right-1 -top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-primary px-0.5 text-[11px] font-semibold leading-none text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                  <item.icon className="h-5 w-5" weight={activeView === item.id ? "fill" : "light"} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <div className="flex flex-col items-center gap-1 w-full">
          <ThemeSwitcher />
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="flex h-10 w-full items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                <Gear className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
