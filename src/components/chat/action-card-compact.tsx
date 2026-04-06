"use client";

import {
  ClipboardText,
  ArrowRight,
  CheckCircle,
  XCircle,
  CircleNotch,
  Pause,
  Check,
  X,
  Stop,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { ActionPlan } from "@/types/chat";

interface ActionCardCompactProps {
  plan: ActionPlan;
  onOpenPanel: () => void;
  onApprove?: () => void;
  onDecline?: () => void;
}

/** Compact inline plan card — title, status, progress. Approve/decline for pending. Click to open detail view. */
export function ActionCardCompact({ plan, onOpenPanel, onApprove, onDecline }: ActionCardCompactProps) {
  const completedSteps = plan.steps.filter((s) => s.status === "completed").length;
  const isPending = plan.status === "pending";
  const isApproved = plan.status === "approved";
  const isExecuting = plan.status === "executing";
  const isCompleted = plan.status === "completed";
  const isDeclined = plan.status === "declined";
  const isPaused = plan.status === "paused";
  const isStopped = plan.status === "stopped";

  const getStatusIcon = () => {
    if (isCompleted) return <CheckCircle className="w-4 h-4 shrink-0" style={{ color: "var(--color-success)" }} />;
    if (isDeclined || isStopped) return <XCircle className="w-4 h-4 shrink-0" style={{ color: "color-mix(in srgb, var(--color-danger) 50%, var(--muted-foreground))" }} />;
    if (isPaused) return <Pause className="w-4 h-4 shrink-0" style={{ color: "var(--color-warning)" }} />;
    if (isExecuting) return <CircleNotch weight="regular" className="w-4 h-4 shrink-0 animate-spin" style={{ color: "var(--color-info)" }} />;
    if (isApproved) return <Check className="w-4 h-4 shrink-0" style={{ color: "var(--color-success)" }} />;
    return <ClipboardText className="w-4 h-4 shrink-0 text-muted-foreground" />;
  };

  const getStatusText = () => {
    if (isPending) return "awaiting approval";
    if (isApproved) return "approved";
    if (isExecuting) return "running";
    if (isPaused) return "paused";
    if (isCompleted) return "done";
    if (isDeclined) return "declined";
    if (isStopped) return "stopped";
    return "";
  };

  return (
    <div className="rounded-xl max-w-lg bg-muted border border-border">
      {/* Clickable card body */}
      <button
        onClick={onOpenPanel}
        className="group flex items-center gap-3 px-4 py-3 w-full text-left transition-colors hover:bg-accent rounded-xl"
      >
        {getStatusIcon()}
        <div className="flex-1 min-w-0">
          <div className="text-sm truncate text-foreground">{plan.title}</div>
          <div className="text-xs font-mono text-muted-foreground">
            {plan.steps.length} steps · {getStatusText()}
            {(isExecuting || isCompleted) && ` · ${completedSteps}/${plan.steps.length} complete`}
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-muted-foreground">
          Details
          <ArrowRight className="w-3 h-3" />
        </div>
      </button>

      {/* Approve/Decline for pending plans */}
      {isPending && (onApprove || onDecline) && (
        <div className="flex gap-2.5 px-3 py-3 border-t border-border">
          {onApprove && (
            <button
              onClick={(e) => { e.stopPropagation(); onApprove(); }}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-200 bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90"
              style={{ padding: "8px 20px" }}
            >
              <Check className="w-4 h-4" />
              Approve plan
            </button>
          )}
          {onDecline && (
            <button
              onClick={(e) => { e.stopPropagation(); onDecline(); }}
              className="inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer bg-muted text-muted-foreground border border-border"
              style={{ padding: "8px 20px" }}
            >
              <X className="w-4 h-4" />
              Decline
            </button>
          )}
        </div>
      )}

      {/* Completion summary */}
      {isCompleted && plan.completionSummary && (
        <div className="px-4 py-2 text-xs border-t border-border" style={{ color: "var(--color-success)" }}>
          {plan.completionSummary}
        </div>
      )}
    </div>
  );
}
