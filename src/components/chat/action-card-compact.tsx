"use client";

import {
  ClipboardList,
  ArrowRight,
  CheckCircle,
  XCircle,
  Loader2,
  Pause,
  Check,
  X,
  Square,
} from "lucide-react";
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
    if (isCompleted) return <CheckCircle className="w-4 h-4 shrink-0" style={{ color: "rgba(74, 222, 128, 0.8)" }} />;
    if (isDeclined || isStopped) return <XCircle className="w-4 h-4 shrink-0" style={{ color: "rgba(239, 68, 68, 0.6)" }} />;
    if (isPaused) return <Pause className="w-4 h-4 shrink-0" style={{ color: "rgba(251, 191, 36, 0.8)" }} />;
    if (isExecuting) return <Loader2 className="w-4 h-4 shrink-0 animate-spin" style={{ color: "rgba(96, 165, 250, 0.8)" }} />;
    if (isApproved) return <Check className="w-4 h-4 shrink-0" style={{ color: "rgba(74, 222, 128, 0.8)" }} />;
    return <ClipboardList className="w-4 h-4 shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />;
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
    <div
      className="rounded-xl max-w-lg"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Clickable card body */}
      <button
        onClick={onOpenPanel}
        className="group flex items-center gap-3 px-4 py-3 w-full text-left transition-colors hover:bg-white/[0.02] rounded-xl"
      >
        {getStatusIcon()}
        <div className="flex-1 min-w-0">
          <div
            className="text-sm truncate"
            style={{ color: "rgba(255,255,255,0.7)", fontWeight: 400 }}
          >
            {plan.title}
          </div>
          <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            {plan.steps.length} steps · {getStatusText()}
            {(isExecuting || isCompleted) && ` · ${completedSteps}/${plan.steps.length} complete`}
          </div>
        </div>
        <div
          className="flex items-center gap-1 text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          Details
          <ArrowRight className="w-3 h-3" />
        </div>
      </button>

      {/* Approve/Decline for pending plans */}
      {isPending && (onApprove || onDecline) && (
        <div
          className="flex items-center gap-2 px-4 py-2.5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          {onApprove && (
            <button
              onClick={(e) => { e.stopPropagation(); onApprove(); }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: "rgba(255,255,255,0.9)",
                color: "#060608",
              }}
            >
              <Check className="w-3.5 h-3.5" />
              Approve
            </button>
          )}
          {onDecline && (
            <button
              onClick={(e) => { e.stopPropagation(); onDecline(); }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <X className="w-3.5 h-3.5" />
              Decline
            </button>
          )}
        </div>
      )}

      {/* Completion summary */}
      {isCompleted && plan.completionSummary && (
        <div
          className="px-4 py-2 text-xs"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.04)",
            color: "rgba(74, 222, 128, 0.7)",
          }}
        >
          {plan.completionSummary}
        </div>
      )}
    </div>
  );
}
