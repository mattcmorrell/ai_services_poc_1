"use client";

import { useState } from "react";
import { X, ClipboardList, History } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActionPlan } from "@/types/chat";
import { PlanStepTimeline } from "./plan-step-timeline";
import { PlanControls, PlanStatusBadge } from "./plan-controls";
import { PlanHistory } from "./plan-history";

interface PlanSplitViewProps {
  plan: ActionPlan;
  onClose: () => void;
  onPause: () => void;
  onStop: () => void;
  onResume: () => void;
}

/** Right pane content for the split-view approach (C). Rendered inside ChatView's split layout. */
export function PlanSplitView({ plan, onClose, onPause, onStop, onResume }: PlanSplitViewProps) {
  const [showHistory, setShowHistory] = useState(false);

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
        {!showHistory ? (
          <div>
            <p
              className="text-xs mb-4"
              style={{ color: "rgba(255,255,255,0.35)", fontWeight: 300 }}
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
        ) : (
          <PlanHistory plans={[]} />
        )}
      </ScrollArea>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-4 py-2.5 shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <PlanControls
          plan={plan}
          onPause={onPause}
          onStop={onStop}
          onResume={onResume}
          compact
        />
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-1 text-[10px] transition-colors"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          <History className="w-3 h-3" />
          {showHistory ? "Current" : "History"}
        </button>
      </div>
    </div>
  );
}
