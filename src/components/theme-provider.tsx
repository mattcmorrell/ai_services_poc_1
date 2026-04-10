"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { IconContext } from "@phosphor-icons/react";

export type Colorway = "mercury" | "inkwell" | "orbital";
export type Mode = "light" | "dark";

interface ThemeContextValue {
  colorway: Colorway;
  mode: Mode;
  setColorway: (c: Colorway) => void;
  setMode: (m: Mode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const COLORWAY_KEY = "theme-colorway";
const MODE_KEY = "theme-mode";
const COLORWAYS: Colorway[] = ["mercury", "inkwell", "orbital"];

function applyTheme(colorway: Colorway, mode: Mode) {
  const el = document.documentElement;
  // Remove old colorway/mode classes, preserve font vars and other classes
  COLORWAYS.forEach((c) => el.classList.remove(c));
  el.classList.remove("light", "dark");
  el.classList.add(colorway, mode);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorway, setColorwayState] = useState<Colorway>("mercury");
  const [mode, setModeState] = useState<Mode>("dark");

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedColorway = localStorage.getItem(COLORWAY_KEY) as Colorway | null;
    const storedMode = localStorage.getItem(MODE_KEY) as Mode | null;
    const c = storedColorway && COLORWAYS.includes(storedColorway) ? storedColorway : "mercury";
    const m = storedMode === "light" || storedMode === "dark" ? storedMode : "dark";
    setColorwayState(c);
    setModeState(m);
    applyTheme(c, m);
  }, []);

  const setColorway = useCallback((c: Colorway) => {
    setColorwayState(c);
    localStorage.setItem(COLORWAY_KEY, c);
    applyTheme(c, mode);
  }, [mode]);

  const setMode = useCallback((m: Mode) => {
    setModeState(m);
    localStorage.setItem(MODE_KEY, m);
    applyTheme(colorway, m);
  }, [colorway]);

  const toggleMode = useCallback(() => {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
  }, [mode, setMode]);

  return (
    <ThemeContext.Provider value={{ colorway, mode, setColorway, setMode, toggleMode }}>
      <IconContext.Provider value={{ weight: "light" }}>
        {children}
      </IconContext.Provider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
