"use client";

import { X, ClipboardText, Check, Warning } from "@phosphor-icons/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActionPlan } from "@/types/chat";
import { PlanStepTimeline } from "./plan-step-timeline";
import { PlanControls, PlanStatusBadge } from "./plan-controls";

interface PlanSplitViewProps {
  plan: ActionPlan;
  onClose: () => void;
  onPause: () => void;
  onStop: () => void;
  onResume: () => void;
  onApprove?: () => void;
  onDecline?: () => void;
}

/** Right pane content for the split-view approach (C). Rendered inside ChatView's split layout. */
export function PlanSplitView({ plan, onClose, onPause, onStop, onResume, onApprove, onDecline }: PlanSplitViewProps) {
  const isPausedByGate = plan.status === "paused" && plan.pausedBy === "gate";
  const gatedStep = isPausedByGate ? plan.steps.find((s) => s.status === "in_progress") : null;

  return (
    <div className="flex flex-col h-full bg-muted dark:bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2.5 min-w-0">
          <ClipboardText className="w-4 h-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <h3 className="text-sm font-medium truncate text-foreground">{plan.title}</h3>
            <PlanStatusBadge status={plan.status} />
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded-full transition-colors text-muted-foreground hover:bg-accent"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 px-4 py-3">
        <div>
          <p className="text-sm mb-4 leading-relaxed text-muted-foreground">
            {plan.description}
          </p>

          {/* Metadata row */}
          {plan.metadata && (
            <div className="flex gap-4 mb-4 pb-3 border-b" style={{ borderColor: "var(--border)" }}>
              {plan.metadata.affectedCount && (
                <div>
                  <span className="text-[14px] font-medium text-foreground">{plan.metadata.affectedCount}</span>
                  <span className="text-xs ml-1 text-muted-foreground">
                    {plan.metadata.affectedLabel || "items"}
                  </span>
                </div>
              )}
              {plan.metadata.estimatedTime && (
                <div>
                  <span className="text-[14px] font-medium text-foreground">{plan.metadata.estimatedTime}</span>
                </div>
              )}
            </div>
          )}

          {/* Gate warning when paused at a non-undoable step */}
          {isPausedByGate && gatedStep && (
            <div
              className="flex items-start gap-2 p-3 rounded-lg mb-4 text-xs"
              style={{
                background: "var(--color-warning-muted)",
                border: "1px solid var(--color-warning-muted)",
                color: "var(--color-warning)",
              }}
            >
              <Warning className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium">This step cannot be undone.</span>
                <span className="block mt-0.5" style={{ opacity: 0.75 }}>
                  {gatedStep.description}. Press Resume to continue.
                </span>
              </div>
            </div>
          )}

          <PlanStepTimeline steps={plan.steps} />

          {plan.status === "completed" && plan.completionSummary && (
            <div
              className="mt-4 flex items-center gap-2 p-2.5 rounded-lg text-xs"
              style={{
                background: "var(--color-success-muted)",
                border: "1px solid var(--color-success-muted)",
                color: "var(--color-success)",
              }}
            >
              {plan.completionSummary}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="px-4 py-2.5 shrink-0 border-t" style={{ borderColor: "var(--border)" }}>
        {plan.status === "pending" ? (
          <div className="flex items-center gap-2">
            {onApprove && (
              <button
                onClick={onApprove}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all bg-primary text-primary-foreground"
              >
                <Check className="w-3.5 h-3.5" />
                Approve
              </button>
            )}
            {onDecline && (
              <button
                onClick={onDecline}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all bg-muted text-muted-foreground border border-border"
              >
                <X className="w-3.5 h-3.5" />
                Decline
              </button>
            )}
          </div>
        ) : (
          <PlanControls plan={plan} onPause={onPause} onStop={onStop} onResume={onResume} />
        )}
      </div>
    </div>
  );
}
