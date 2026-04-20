"use client";

import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Palette } from "@phosphor-icons/react";
import { useTheme, type Colorway } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const colorways: { id: Colorway; label: string; dot: string }[] = [
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

  return (
    <div className="flex flex-shrink-0 items-center gap-1 border-t border-sidebar-border py-4 px-5">
      {/* Dark/light toggle */}
      <button
        onClick={toggleMode}
        title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        {mode === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </button>

      {/* Theme picker */}
      <div ref={pickerRef} className="relative flex-1">
        {pickerOpen && (
          <div className="absolute bottom-full left-0 mb-1 w-[140px] rounded-lg border border-border bg-popover p-1.5 shadow-xl z-50">
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
          className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          title="Theme"
        >
          <Palette className="h-4 w-4 flex-shrink-0" />
          <span className="type-body">Theme</span>
        </button>
      </div>
    </div>
  );
}
