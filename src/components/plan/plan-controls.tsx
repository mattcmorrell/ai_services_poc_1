"use client";

import { useState } from "react";
import { Pause, Stop, Play, Warning } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { ActionPlan } from "@/types/chat";

interface PlanControlsProps {
  plan: ActionPlan;
  onPause: () => void;
  onStop: () => void;
  onResume: () => void;
  compact?: boolean;
}

export function PlanControls({ plan, onPause, onStop, onResume, compact = false }: PlanControlsProps) {
  const [confirmingStop, setConfirmingStop] = useState(false);
  const isExecuting = plan.status === "executing";
  const isPaused = plan.status === "paused";
  const isStopped = plan.status === "stopped";
  const isCompleted = plan.status === "completed";
  const isDeclined = plan.status === "declined";

  if (isCompleted || isDeclined || isStopped) return null;

  const completedSteps = plan.steps.filter((s) => s.status === "completed").length;

  const buttonBase = cn(
    "inline-flex items-center justify-center gap-1.5 transition-all duration-200",
    compact ? "h-7 px-2.5 text-xs rounded-lg" : "h-8 px-3 text-[13px] rounded-lg",
  );

  if (confirmingStop) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-danger)" }}>
          <Warning className="w-3 h-3" />
          Stop? {completedSteps}/{plan.steps.length} steps done. Cannot resume.
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { onStop(); setConfirmingStop(false); }}
            className={cn(buttonBase, "font-medium")}
            style={{
              background: "var(--color-danger-muted)",
              color: "var(--color-danger)",
              border: "1px solid var(--color-danger-muted)",
            }}
          >
            <Stop className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} />
            {!compact && "Confirm Stop"}
          </button>
          <button
            onClick={() => setConfirmingStop(false)}
            className={cn(buttonBase, "font-medium bg-muted text-muted-foreground border border-border")}
          >
            {!compact ? "Cancel" : "Back"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {isExecuting && (
        <>
          <button
            onClick={onPause}
            className={cn(buttonBase, "font-medium")}
            style={{
              background: "var(--color-warning-muted)",
              color: "var(--color-warning)",
              border: "1px solid var(--color-warning-muted)",
            }}
          >
            <Pause className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} />
            {!compact && "Pause"}
          </button>
          <button
            onClick={() => setConfirmingStop(true)}
            className={cn(buttonBase, "font-medium")}
            style={{
              background: "var(--color-danger-muted)",
              color: "var(--color-danger)",
              border: "1px solid var(--color-danger-muted)",
            }}
          >
            <Stop className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} />
            {!compact && "Stop"}
          </button>
        </>
      )}

      {isPaused && (
        <>
          <button
            onClick={onResume}
            className={cn(buttonBase, "font-medium")}
            style={{
              background: "var(--color-success-muted)",
              color: "var(--color-success)",
              border: "1px solid var(--color-success-muted)",
            }}
          >
            <Play className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} />
            {!compact && "Resume"}
          </button>
          <button
            onClick={() => setConfirmingStop(true)}
            className={cn(buttonBase, "font-medium")}
            style={{
              background: "var(--color-danger-muted)",
              color: "var(--color-danger)",
              border: "1px solid var(--color-danger-muted)",
            }}
          >
            <Stop className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} />
            {!compact && "Stop"}
          </button>
        </>
      )}
    </div>
  );
}

/** Status badge for plan state */
export function PlanStatusBadge({ status }: { status: ActionPlan["status"] }) {
  const config: Record<string, { label: string; bg: string; text: string; dot: string }> = {
    pending: { label: "Pending", bg: "var(--secondary)", text: "var(--muted-foreground)", dot: "var(--muted-foreground)" },
    approved: { label: "Approved", bg: "var(--color-success-muted)", text: "var(--color-success)", dot: "var(--color-success)" },
    executing: { label: "Running", bg: "var(--color-info-muted)", text: "var(--color-info)", dot: "var(--color-info)" },
    paused: { label: "Paused", bg: "var(--color-warning-muted)", text: "var(--color-warning)", dot: "var(--color-warning)" },
    stopped: { label: "Stopped", bg: "color-mix(in srgb, var(--color-danger) 8%, transparent)", text: "color-mix(in srgb, var(--color-danger) 50%, var(--muted-foreground))", dot: "color-mix(in srgb, var(--color-danger) 40%, var(--muted-foreground))" },
    completed: { label: "Done", bg: "var(--color-success-muted)", text: "var(--color-success)", dot: "var(--color-success)" },
    declined: { label: "Declined", bg: "color-mix(in srgb, var(--color-danger) 8%, transparent)", text: "color-mix(in srgb, var(--color-danger) 50%, var(--muted-foreground))", dot: "color-mix(in srgb, var(--color-danger) 40%, var(--muted-foreground))" },
  };

  const c = config[status] || config.pending;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full font-mono text-xs font-semibold"
      style={{ background: c.bg, color: c.text, padding: "3px 10px" }}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          status === "executing" && "animate-pulse",
        )}
        style={{ background: c.dot }}
      />
      {c.label}
    </span>
  );
}
