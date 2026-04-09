"use client";

import { useState } from "react";
import { X, ClipboardText, CaretRight, ClockCounterClockwise } from "@phosphor-icons/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useResizable, ResizeHandle } from "@/components/ui/resize-handle";
import { ActionPlan } from "@/types/chat";
import { PlanStepTimeline } from "./plan-step-timeline";
import { PlanControls, PlanStatusBadge } from "./plan-controls";
import { PlanHistory } from "./plan-history";

interface PlanPanelProps {
  plan: ActionPlan;
  onClose: () => void;
  onPause: () => void;
  onStop: () => void;
  onResume: () => void;
}

export function PlanPanel({ plan, onClose, onPause, onStop, onResume }: PlanPanelProps) {
  const { width, onDragStart } = useResizable({
    defaultWidth: 420,
    minWidth: 320,
    maxWidth: 600,
    storageKey: "plan-panel-width",
    side: "right",
  });
  const [showClockCounterClockwise, setShowClockCounterClockwise] = useState(false);

  return (
    <>
      <ResizeHandle onMouseDown={onDragStart} />
      <div
        className="flex flex-col h-full shrink-0 bg-muted dark:bg-card border-l border-border"
        style={{ width: `${width}px` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 shrink-0 border-b border-border">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0 bg-muted border border-border">
              <ClipboardText className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-medium truncate text-foreground">
                {plan.title}
              </h2>
              <PlanStatusBadge status={plan.status} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full transition-colors text-muted-foreground hover:bg-accent"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 px-5 py-4">
          {!showClockCounterClockwise ? (
            <div>
              {/* Plan description */}
              <p className="text-sm mb-5 text-muted-foreground">
                {plan.description}
              </p>

              {/* Metadata */}
              {plan.metadata && (
                <div className="flex gap-4 mb-5 pb-4 border-b border-border">
                  {plan.metadata.affectedCount && (
                    <div className="text-center">
                      <div className="text-[18px] font-medium text-foreground">
                        {plan.metadata.affectedCount}
                      </div>
                      <div className="text-[11px] font-mono font-medium uppercase tracking-[0.1em] text-muted-foreground">
                        {plan.metadata.affectedLabel || "items"}
                      </div>
                    </div>
                  )}
                  {plan.metadata.estimatedTime && (
                    <div className="text-center">
                      <div className="text-[18px] font-medium text-foreground">
                        {plan.metadata.estimatedTime}
                      </div>
                      <div className="text-[11px] font-mono font-medium uppercase tracking-[0.1em] text-muted-foreground">
                        estimated
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step timeline */}
              <PlanStepTimeline steps={plan.steps} />

              {/* Completion summary */}
              {plan.status === "completed" && plan.completionSummary && (
                <div
                  className="mt-5 flex items-center gap-2.5 p-3 rounded-lg text-sm"
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
          ) : (
            <PlanHistory plans={[]} />
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 shrink-0 border-t border-border">
          <PlanControls
            plan={plan}
            onPause={onPause}
            onStop={onStop}
            onResume={onResume}
          />
          <button
            onClick={() => setShowClockCounterClockwise(!showClockCounterClockwise)}
            className="flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em] transition-colors text-muted-foreground hover:text-foreground"
          >
            <ClockCounterClockwise className="w-3.5 h-3.5" />
            {showClockCounterClockwise ? "Current plan" : "Past plans"}
          </button>
        </div>
      </div>
    </>
  );
}

/** Collapsed pill indicator for when panel is minimized */
export function PlanPanelPill({
  plan,
  onClick,
}: {
  plan: ActionPlan;
  onClick: () => void;
}) {
  const completedSteps = plan.steps.filter((s) => s.status === "completed").length;
  const totalSteps = plan.steps.length;
  const progress = totalSteps > 0 ? completedSteps / totalSteps : 0;
  const isPaused = plan.status === "paused";

  const circumference = 2 * Math.PI * 10;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 pl-2.5 pr-3.5 py-2 rounded-full transition-all duration-300 hover:scale-105 group backdrop-blur-xl bg-card/80 border border-border"
    >
      {/* Progress ring */}
      <svg width="28" height="28" viewBox="0 0 24 24" className="shrink-0">
        <circle cx="12" cy="12" r="10" fill="none" stroke="var(--border)" strokeWidth="2" />
        <circle
          cx="12" cy="12" r="10" fill="none"
          stroke={isPaused ? "var(--color-warning)" : "var(--color-success)"}
          strokeWidth="2" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 12 12)" className="transition-all duration-500"
        />
        <text x="12" y="12" textAnchor="middle" dominantBaseline="central"
          fill="currentColor" fontSize="8" fontWeight="600">
          {completedSteps}
        </text>
      </svg>

      <div className="text-left">
        <div className="text-xs font-medium text-foreground">Plan</div>
        <div className="text-xs font-mono text-muted-foreground">
          {completedSteps}/{totalSteps}
          {plan.status === "executing" && " running"}
          {isPaused && " paused"}
        </div>
      </div>

      <CaretRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
    </button>
  );
}
