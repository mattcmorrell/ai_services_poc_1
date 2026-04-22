"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLineRight, House, ChatDots, Sun, Moon, Palette } from "@phosphor-icons/react";
import { useTheme, type Colorway } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const colorways: { id: Colorway; label: string; dot: string }[] = [
  { id: "human-services-hq", label: "HSHQ", dot: "#70A5D9" },
  { id: "mercury", label: "Mercury", dot: "#6878B8" },
  { id: "inkwell", label: "Inkwell", dot: "#7A9A78" },
  { id: "orbital", label: "Orbital", dot: "#8AAEC4" },
];

interface SidebarRailProps {
  activeView: string;
  popoverOpen: boolean;
  onExpand: () => void;
  onViewChange: (view: string) => void;
  onTogglePopover: () => void;
}

export function SidebarRail({
  activeView,
  popoverOpen,
  onExpand,
  onViewChange,
  onTogglePopover,
}: SidebarRailProps) {
  const { mode, colorway, setColorway, toggleMode } = useTheme();
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    }
    if (pickerOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [pickerOpen]);

  const chatsActive = popoverOpen;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-full w-14 flex-col items-center border-r border-sidebar-border bg-sidebar py-4 px-0">
        {/* Expand button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onExpand}
              className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <ArrowLineRight className="h-[18px] w-[18px]" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Expand sidebar (⌘B)</TooltipContent>
        </Tooltip>

        <nav className="flex flex-1 flex-col items-center">
          {/* Dashboard */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onViewChange("dashboard")}
                className={cn(
                  "mt-[7px] flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                  activeView === "dashboard"
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <House
                  className="h-5 w-5"
                  weight={activeView === "dashboard" ? "fill" : "light"}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>

          {/* Chats */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onTogglePopover}
                className={cn(
                  "mt-[8px] flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                  chatsActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <ChatDots
                  className="h-5 w-5"
                  weight={chatsActive ? "fill" : "light"}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Chats</TooltipContent>
          </Tooltip>
        </nav>

        {/* Footer icons */}
        <div className="flex flex-col items-center gap-1 pb-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleMode}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {mode === "dark" ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {mode === "dark" ? "Light mode" : "Dark mode"}
            </TooltipContent>
          </Tooltip>

          <div ref={pickerRef} className="relative">
            {pickerOpen && (
              <div className="absolute bottom-0 left-full ml-2 w-[140px] rounded-lg border border-border bg-popover p-1.5 shadow-xl z-50">
                {colorways.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setColorway(c.id); setPickerOpen(false); }}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 type-meta transition-colors",
                      colorway === c.id
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <span
                      className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: c.dot }}
                    />
                    {c.label}
                  </button>
                ))}
              </div>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setPickerOpen(!pickerOpen)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Palette className="h-[18px] w-[18px]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Theme</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
