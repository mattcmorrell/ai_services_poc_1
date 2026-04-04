"use client";

import { Sun, Moon, Palette } from "lucide-react";
import { useTheme, type Colorway } from "@/components/theme-provider";
import { useState, useRef, useEffect } from "react";

const colorways: { id: Colorway; label: string; dot: string }[] = [
  { id: "mercury", label: "Mercury", dot: "#6878B8" },
  { id: "inkwell", label: "Inkwell", dot: "#7A9A78" },
  { id: "orbital", label: "Orbital", dot: "#8AAEC4" },
];

export function ThemeSwitcher() {
  const { colorway, mode, setColorway, toggleMode } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const current = colorways.find((c) => c.id === colorway)!;

  return (
    <div ref={ref} className="relative flex w-full flex-col items-center gap-1">
      {/* Colorway dropdown */}
      {open && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-[140px] rounded-lg border border-border bg-popover p-1.5 shadow-xl z-50">
          {colorways.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setColorway(c.id);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[12px] transition-colors ${
                colorway === c.id
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <span
                className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: c.dot }}
              />
              {c.label}
            </button>
          ))}
        </div>
      )}

      {/* Colorway button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 w-full items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        title={`Theme: ${current.label}`}
      >
        <Palette className="h-4 w-4" />
      </button>

      {/* Light/dark toggle */}
      <button
        onClick={toggleMode}
        className="flex h-10 w-full items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {mode === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </button>
    </div>
  );
}
