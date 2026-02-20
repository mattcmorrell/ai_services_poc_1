"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ApproachConfig {
  id: string;
  label: string;
  description: string;
  maxVersion: number;
}

interface PrototypeSwitcherProps {
  approaches: ApproachConfig[];
  currentApproach: string;
  currentVersion: number;
  onApproachChange: (approach: string) => void;
  onVersionChange: (version: number) => void;
}

export function PrototypeSwitcher({
  approaches,
  currentApproach,
  currentVersion,
  onApproachChange,
  onVersionChange,
}: PrototypeSwitcherProps) {
  const [expanded, setExpanded] = useState(false);

  const current = approaches.find((a) => a.id === currentApproach);
  const maxVersion = current?.maxVersion ?? 1;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {expanded ? (
        <div className="w-72 overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
          {/* Header */}
          <button
            onClick={() => setExpanded(false)}
            className="flex w-full items-center justify-between border-b border-border px-4 py-2.5"
          >
            <div className="flex items-center gap-2">
              <FlaskConical className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Prototype Switcher
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>

          {/* Approaches */}
          <div className="p-2">
            {approaches.map((approach) => (
              <button
                key={approach.id}
                onClick={() => {
                  onApproachChange(approach.id);
                  onVersionChange(
                    approaches.find((a) => a.id === approach.id)?.maxVersion ?? 1
                  );
                }}
                className={cn(
                  "flex w-full flex-col rounded-lg px-3 py-2 text-left transition-colors",
                  currentApproach === approach.id
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-muted text-[10px] font-bold">
                    {approach.id}
                  </span>
                  <span className="text-sm font-medium">{approach.label}</span>
                </div>
                <span className="ml-7 mt-0.5 text-[11px] text-muted-foreground">
                  {approach.description}
                </span>
              </button>
            ))}
          </div>

          {/* Version selector */}
          {maxVersion > 1 && (
            <div className="border-t border-border px-4 py-2.5">
              <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Version
              </span>
              <div className="flex gap-1">
                {Array.from({ length: maxVersion }, (_, i) => i + 1).map((v) => (
                  <button
                    key={v}
                    onClick={() => onVersionChange(v)}
                    className={cn(
                      "flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-xs font-medium transition-colors",
                      currentVersion === v
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    v{v}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Collapsed pill */
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 shadow-lg transition-colors hover:bg-accent"
        >
          <FlaskConical className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium">
            {current?.label} v{currentVersion}
          </span>
          <ChevronUp className="h-3 w-3 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
