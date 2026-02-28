"use client";

import { useState } from "react";
import { Pause, Square, Play, AlertTriangle } from "lucide-react";
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
        <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(239, 68, 68, 0.8)" }}>
          <AlertTriangle className="w-3 h-3" />
          Stop? {completedSteps}/{plan.steps.length} steps done. Cannot resume.
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { onStop(); setConfirmingStop(false); }}
            className={cn(buttonBase, "font-medium")}
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              color: "rgba(239, 68, 68, 0.9)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
          >
            <Square className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} />
            {!compact && "Confirm Stop"}
          </button>
          <button
            onClick={() => setConfirmingStop(false)}
            className={cn(buttonBase, "font-medium")}
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
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
              background: "rgba(251, 191, 36, 0.1)",
              color: "rgba(251, 191, 36, 0.85)",
              border: "1px solid rgba(251, 191, 36, 0.15)",
            }}
          >
            <Pause className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} />
            {!compact && "Pause"}
          </button>
          <button
            onClick={() => setConfirmingStop(true)}
            className={cn(buttonBase, "font-medium")}
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              color: "rgba(239, 68, 68, 0.85)",
              border: "1px solid rgba(239, 68, 68, 0.15)",
            }}
          >
            <Square className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} />
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
              background: "rgba(74, 222, 128, 0.1)",
              color: "rgba(74, 222, 128, 0.85)",
              border: "1px solid rgba(74, 222, 128, 0.15)",
            }}
          >
            <Play className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} />
            {!compact && "Resume"}
          </button>
          <button
            onClick={() => setConfirmingStop(true)}
            className={cn(buttonBase, "font-medium")}
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              color: "rgba(239, 68, 68, 0.85)",
              border: "1px solid rgba(239, 68, 68, 0.15)",
            }}
          >
            <Square className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} />
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
    pending: { label: "Pending", bg: "rgba(255,255,255,0.04)", text: "rgba(255,255,255,0.4)", dot: "rgba(255,255,255,0.3)" },
    approved: { label: "Approved", bg: "rgba(74, 222, 128, 0.08)", text: "rgba(74, 222, 128, 0.8)", dot: "rgba(74, 222, 128, 0.8)" },
    executing: { label: "Running", bg: "rgba(96, 165, 250, 0.08)", text: "rgba(96, 165, 250, 0.8)", dot: "rgba(96, 165, 250, 0.8)" },
    paused: { label: "Paused", bg: "rgba(251, 191, 36, 0.08)", text: "rgba(251, 191, 36, 0.8)", dot: "rgba(251, 191, 36, 0.8)" },
    stopped: { label: "Stopped", bg: "rgba(239, 68, 68, 0.08)", text: "rgba(239, 68, 68, 0.8)", dot: "rgba(239, 68, 68, 0.8)" },
    completed: { label: "Done", bg: "rgba(74, 222, 128, 0.08)", text: "rgba(74, 222, 128, 0.8)", dot: "rgba(74, 222, 128, 0.8)" },
    declined: { label: "Declined", bg: "rgba(239, 68, 68, 0.08)", text: "rgba(239, 68, 68, 0.6)", dot: "rgba(239, 68, 68, 0.6)" },
  };

  const c = config[status] || config.pending;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: c.bg, color: c.text }}
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
