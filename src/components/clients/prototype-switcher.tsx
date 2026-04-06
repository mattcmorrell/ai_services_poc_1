"use client";

import { useState } from "react";
import { CaretDown, CaretUp, Flask, Archive } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export interface ApproachConfig {
  id: string;
  label: string;
  description: string;
  maxVersion: number;
  status?: "active" | "parked" | "killed";
}

interface PrototypeSwitcherProps {
  approaches: ApproachConfig[];
  currentApproach: string;
  currentVersion: number;
  onApproachChange: (approach: string) => void;
  onVersionChange: (version: number) => void;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  parked: { label: "Parked", color: "bg-amber-500/20 text-amber-400" },
  killed: { label: "Killed", color: "bg-red-500/20 text-red-400" },
};

export function PrototypeSwitcher({
  approaches,
  currentApproach,
  currentVersion,
  onApproachChange,
  onVersionChange,
}: PrototypeSwitcherProps) {
  const [expanded, setExpanded] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const activeApproaches = approaches.filter((a) => !a.status || a.status === "active");
  const archivedApproaches = approaches.filter((a) => a.status === "parked" || a.status === "killed");

  const current = approaches.find((a) => a.id === currentApproach);
  const maxVersion = current?.maxVersion ?? 1;
  const isArchived = current?.status === "parked" || current?.status === "killed";

  const renderApproachButton = (approach: ApproachConfig, dimmed = false) => (
    <button
      key={approach.id}
      onClick={() => {
        onApproachChange(approach.id);
        onVersionChange(approach.maxVersion ?? 1);
      }}
      className={cn(
        "flex w-full flex-col rounded-lg px-3 py-2 text-left transition-colors",
        currentApproach === approach.id
          ? "bg-primary/10 text-foreground"
          : dimmed
            ? "text-muted-foreground/60 hover:bg-accent/50 hover:text-muted-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      <div className="flex items-center gap-2">
        <span className={cn(
          "flex h-6 w-6 items-center justify-center rounded text-[11px] font-bold",
          dimmed ? "bg-muted/50" : "bg-muted"
        )}>
          {approach.id}
        </span>
        <span className={cn("text-sm font-medium", dimmed && "text-muted-foreground/70")}>
          {approach.label}
        </span>
        {approach.status && STATUS_LABELS[approach.status] && (
          <span className={cn(
            "rounded px-1.5 py-0.5 text-[11px] font-semibold uppercase leading-none",
            STATUS_LABELS[approach.status].color
          )}>
            {STATUS_LABELS[approach.status].label}
          </span>
        )}
      </div>
      <span className="ml-7 mt-0.5 text-[11px] text-muted-foreground">
        {approach.description}
      </span>
    </button>
  );

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
              <Flask className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Prototype Switcher
              </span>
            </div>
            <CaretDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>

          {/* Active approaches */}
          <div className="p-2">
            {activeApproaches.map((approach) => renderApproachButton(approach))}
          </div>

          {/* Archived section */}
          {archivedApproaches.length > 0 && (
            <div className="border-t border-border">
              <button
                onClick={() => setShowArchived(!showArchived)}
                className="flex w-full items-center gap-2 px-4 py-2 text-left transition-colors hover:bg-accent/50"
              >
                <Archive className="h-3 w-3 text-muted-foreground/60" />
                <span className="text-[11px] font-medium text-muted-foreground/60">
                  Archived ({archivedApproaches.length})
                </span>
                <CaretDown className={cn(
                  "ml-auto h-3 w-3 text-muted-foreground/40 transition-transform",
                  showArchived && "rotate-180"
                )} />
              </button>
              {showArchived && (
                <div className="px-2 pb-2">
                  {archivedApproaches.map((approach) => renderApproachButton(approach, true))}
                </div>
              )}
            </div>
          )}

          {/* Version selector */}
          {maxVersion > 1 && (
            <div className="border-t border-border px-4 py-2.5">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
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
          <Flask className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium">
            {current?.label} v{currentVersion}
          </span>
          {isArchived && current?.status && STATUS_LABELS[current.status] && (
            <span className={cn(
              "rounded px-1.5 py-0.5 text-[11px] font-medium uppercase leading-none",
              STATUS_LABELS[current.status].color
            )}>
              {STATUS_LABELS[current.status].label}
            </span>
          )}
          <CaretUp className="h-3 w-3 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
