"use client";

import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Palette } from "@phosphor-icons/react";
import { useTheme, type Colorway } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const colorways: { id: Colorway; label: string; dot: string }[] = [
  { id: "human-services-hq", label: "HSHQ", dot: "#70A5D9" },
  { id: "mercury", label: "Mercury", dot: "#6878B8" },
  { id: "inkwell", label: "Inkwell", dot: "#7A9A78" },
  { id: "orbital", label: "Orbital", dot: "#8AAEC4" },
];

export function SidebarFooter() {
  const { colorway, mode, setColorway, toggleMode } = useTheme();
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

  const activeColorway = colorways.find((c) => c.id === colorway);

  return (
    <div className="flex flex-shrink-0 flex-col gap-0.5 border-t border-sidebar-border px-[14px] py-3">
      {/* Theme picker row */}
      <div ref={pickerRef} className="relative">
        {pickerOpen && (
          <div className="absolute bottom-full left-2 mb-1 w-[160px] rounded-lg border border-border bg-popover p-1.5 shadow-xl z-50">
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
        <button
          onClick={() => setPickerOpen(!pickerOpen)}
          className="flex w-full items-center gap-1.5 px-2 py-2 text-left rounded-md transition-colors text-foreground hover:bg-accent"
          title="Theme"
        >
          <Palette className="h-[18px] w-[18px] flex-shrink-0" weight="light" />
          <span className="type-chat-name flex-1">Theme</span>
          {activeColorway && (
            <span
              className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
              style={{ backgroundColor: activeColorway.dot }}
            />
          )}
        </button>
      </div>

      {/* Dark/light mode row */}
      <button
        onClick={toggleMode}
        title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        className="flex w-full items-center gap-1.5 px-2 py-2 text-left rounded-md transition-colors text-foreground hover:bg-accent"
      >
        {mode === "dark" ? (
          <Moon className="h-[18px] w-[18px] flex-shrink-0" weight="light" />
        ) : (
          <Sun className="h-[18px] w-[18px] flex-shrink-0" weight="light" />
        )}
        <span className="type-chat-name">{mode === "dark" ? "Dark mode" : "Light mode"}</span>
      </button>
    </div>
  );
}
