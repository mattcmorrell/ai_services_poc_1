"use client";

import { Check, CircleNotch, WarningCircle, Lightning } from "@phosphor-icons/react";
import type { StatusUpdate } from "@/types/chat";

interface ActivityFeedProps {
  updates: StatusUpdate[];
}

export function ActivityFeed({ updates }: ActivityFeedProps) {
  if (updates.length === 0) return null;

  return (
    <div className="flex flex-col gap-1 py-1">
      {updates.map((update) => (
        <div
          key={update.id}
          className="flex items-center gap-2 font-mono text-[13px] leading-relaxed"
        >
          {/* Status icon */}
          <span className="flex h-4 w-4 shrink-0 items-center justify-center">
            {update.status === "running" ? (
              <CircleNotch weight="regular" className="h-3.5 w-3.5 animate-spin text-blue-400" />
            ) : update.status === "error" ? (
              <WarningCircle className="h-3.5 w-3.5 text-red-400" />
            ) : (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            )}
          </span>

          {/* Lightning icon + label */}
          <Lightning className="h-3 w-3 shrink-0 text-muted-foreground/50" />
          <span
            className={
              update.status === "running"
                ? "text-foreground"
                : "text-muted-foreground"
            }
          >
            {update.label}
          </span>
        </div>
      ))}
    </div>
  );
}
