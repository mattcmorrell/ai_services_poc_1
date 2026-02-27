"use client";

import { useState } from "react";
import { X, ClipboardList, ChevronRight, History } from "lucide-react";
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
  });
  const [showHistory, setShowHistory] = useState(false);

  return (
    <>
      <ResizeHandle onMouseDown={onDragStart} />
      <div
        className="flex flex-col h-full shrink-0"
        style={{
          width: `${width}px`,
          background: "#060608",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <ClipboardList className="w-4 h-4" style={{ color: "rgba(255,255,255,0.4)" }} />
            </div>
            <div className="min-w-0">
              <h2
                className="text-sm font-medium truncate"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                {plan.title}
              </h2>
              <PlanStatusBadge status={plan.status} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-white/[0.06]"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 px-5 py-4">
          {!showHistory ? (
            <div>
              {/* Plan description */}
              <p
                className="text-sm mb-5"
                style={{ color: "rgba(255,255,255,0.4)", fontWeight: 300 }}
              >
                {plan.description}
              </p>

              {/* Metadata */}
              {plan.metadata && (
                <div
                  className="flex gap-4 mb-5 pb-4"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  {plan.metadata.affectedCount && (
                    <div className="text-center">
                      <div
                        className="text-lg font-semibold"
                        style={{ color: "rgba(255,255,255,0.75)" }}
                      >
                        {plan.metadata.affectedCount}
                      </div>
                      <div
                        className="text-[10px] uppercase tracking-wide"
                        style={{ color: "rgba(255,255,255,0.25)" }}
                      >
                        {plan.metadata.affectedLabel || "items"}
                      </div>
                    </div>
                  )}
                  {plan.metadata.estimatedTime && (
                    <div className="text-center">
                      <div
                        className="text-lg font-semibold"
                        style={{ color: "rgba(255,255,255,0.75)" }}
                      >
                        {plan.metadata.estimatedTime}
                      </div>
                      <div
                        className="text-[10px] uppercase tracking-wide"
                        style={{ color: "rgba(255,255,255,0.25)" }}
                      >
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
          className="flex items-center justify-between px-5 py-3 shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <PlanControls
            plan={plan}
            onPause={onPause}
            onStop={onStop}
            onResume={onResume}
          />
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1.5 text-[11px] transition-colors"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            <History className="w-3.5 h-3.5" />
            {showHistory ? "Current plan" : "Past plans"}
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
  const isExecuting = plan.status === "executing";
  const isPaused = plan.status === "paused";

  const circumference = 2 * Math.PI * 10;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <button
      onClick={onClick}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex items-center gap-2.5 pl-2.5 pr-3.5 py-2 rounded-full transition-all duration-300 hover:scale-105 group"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* Progress ring */}
      <svg width="28" height="28" viewBox="0 0 24 24" className="shrink-0">
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="2"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke={isPaused ? "rgba(251, 191, 36, 0.7)" : "rgba(74, 222, 128, 0.7)"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 12 12)"
          className="transition-all duration-500"
        />
        <text
          x="12"
          y="12"
          textAnchor="middle"
          dominantBaseline="central"
          fill="rgba(255,255,255,0.7)"
          fontSize="8"
          fontWeight="600"
        >
          {completedSteps}
        </text>
      </svg>

      <div className="text-left">
        <div className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
          Plan
        </div>
        <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
          {completedSteps}/{totalSteps}
          {isExecuting && " running"}
          {isPaused && " paused"}
        </div>
      </div>

      <ChevronRight
        className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: "rgba(255,255,255,0.4)" }}
      />
    </button>
  );
}
