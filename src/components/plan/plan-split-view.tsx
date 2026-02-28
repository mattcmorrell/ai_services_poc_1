"use client";

import { X, ClipboardList, Check, AlertTriangle } from "lucide-react";
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
    <div
      className="flex flex-col h-full"
      style={{
        background: "rgba(255,255,255,0.01)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <ClipboardList className="w-4 h-4 shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
          <div className="min-w-0">
            <h3
              className="text-sm font-medium truncate"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              {plan.title}
            </h3>
            <PlanStatusBadge status={plan.status} />
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-white/[0.06]"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 px-4 py-3">
        <div>
          <p
            className="text-sm mb-4 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.55)", fontWeight: 400 }}
          >
            {plan.description}
          </p>

          {/* Metadata row */}
          {plan.metadata && (
            <div
              className="flex gap-4 mb-4 pb-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
            >
              {plan.metadata.affectedCount && (
                <div>
                  <span
                    className="text-base font-semibold"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {plan.metadata.affectedCount}
                  </span>
                  <span
                    className="text-[10px] ml-1"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                  >
                    {plan.metadata.affectedLabel || "items"}
                  </span>
                </div>
              )}
              {plan.metadata.estimatedTime && (
                <div>
                  <span
                    className="text-base font-semibold"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {plan.metadata.estimatedTime}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Gate warning when paused at a non-undoable step */}
          {isPausedByGate && gatedStep && (
            <div
              className="flex items-start gap-2 p-3 rounded-lg mb-4 text-xs"
              style={{
                background: "rgba(251, 191, 36, 0.08)",
                border: "1px solid rgba(251, 191, 36, 0.15)",
                color: "rgba(251, 191, 36, 0.85)",
              }}
            >
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium">This step cannot be undone.</span>
                <span className="block mt-0.5" style={{ color: "rgba(251, 191, 36, 0.65)" }}>
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
                background: "rgba(74, 222, 128, 0.06)",
                border: "1px solid rgba(74, 222, 128, 0.1)",
                color: "rgba(74, 222, 128, 0.8)",
              }}
            >
              {plan.completionSummary}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div
        className="px-4 py-2.5 shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        {plan.status === "pending" ? (
          <div className="flex items-center gap-2">
            {onApprove && (
              <button
                onClick={onApprove}
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
                onClick={onDecline}
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
        ) : (
          <PlanControls
            plan={plan}
            onPause={onPause}
            onStop={onStop}
            onResume={onResume}
          />
        )}
      </div>
    </div>
  );
}
