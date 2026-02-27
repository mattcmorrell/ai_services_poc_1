"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Brain,
} from "lucide-react";
import { ActionPlan } from "@/types/chat";
import { PlanStepTimeline } from "./plan-step-timeline";
import { PlanControls, PlanStatusBadge } from "./plan-controls";

interface PlanDockProps {
  plan: ActionPlan;
  onPause: () => void;
  onStop: () => void;
  onResume: () => void;
}

export function PlanDock({ plan, onPause, onStop, onResume }: PlanDockProps) {
  const [expanded, setExpanded] = useState(false);
  const [showAgentLog, setShowAgentLog] = useState(false);

  const completedSteps = plan.steps.filter((s) => s.status === "completed").length;
  const activeStep = plan.steps.find((s) => s.status === "in_progress");
  const totalSteps = plan.steps.length;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div
      className="relative z-20 shrink-0"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Collapsed bar (always visible) */}
      <div
        className="flex items-center gap-3 px-6 py-3 cursor-pointer select-none transition-colors hover:bg-white/[0.02]"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Status dot */}
        <div
          className="w-2 h-2 rounded-full shrink-0"
          style={{
            background:
              plan.status === "executing"
                ? "rgba(96, 165, 250, 0.8)"
                : plan.status === "paused"
                ? "rgba(251, 191, 36, 0.8)"
                : plan.status === "completed"
                ? "rgba(74, 222, 128, 0.8)"
                : "rgba(255,255,255,0.25)",
            boxShadow:
              plan.status === "executing"
                ? "0 0 8px rgba(96, 165, 250, 0.4)"
                : "none",
          }}
        />

        {/* Title + active step */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-medium truncate"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              {plan.title}
            </span>
            <PlanStatusBadge status={plan.status} />
          </div>
          {activeStep && (
            <p
              className="text-[11px] truncate mt-0.5"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Step {completedSteps + 1}: {activeStep.description}
            </p>
          )}
        </div>

        {/* Mini progress bar */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div
              className="w-20 h-1.5 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, rgba(74, 222, 128, 0.6), rgba(74, 222, 128, 0.8))",
                }}
              />
            </div>
            <span
              className="text-[11px] tabular-nums font-medium"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {completedSteps}/{totalSteps}
            </span>
          </div>

          {/* Controls inline */}
          <div onClick={(e) => e.stopPropagation()}>
            <PlanControls
              plan={plan}
              onPause={onPause}
              onStop={onStop}
              onResume={onResume}
              compact
            />
          </div>

          {/* Expand/collapse chevron */}
          <div style={{ color: "rgba(255,255,255,0.25)" }}>
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div
          className="px-6 pb-4"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <div className="pt-3 max-w-2xl">
            {/* Compact step list */}
            <PlanStepTimeline steps={plan.steps} compact />

            {/* Agent log toggle */}
            <button
              onClick={() => setShowAgentLog(!showAgentLog)}
              className="flex items-center gap-1.5 mt-3 text-[11px] transition-colors"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              <Brain className="w-3 h-3" />
              {showAgentLog ? "Hide agent log" : "Show agent log"}
            </button>

            {/* Agent log flyout */}
            {showAgentLog && (
              <div
                className="mt-2 p-3 rounded-lg space-y-2 max-h-40 overflow-y-auto"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                {plan.steps
                  .filter((s) => s.thinkingLog && s.thinkingLog.length > 0)
                  .flatMap((step) =>
                    step.thinkingLog!.map((log, i) => (
                      <div key={`${step.id}-${i}`} className="flex gap-2">
                        <span
                          className="text-[10px] shrink-0 font-mono"
                          style={{ color: "rgba(255,255,255,0.2)" }}
                        >
                          [{step.description.slice(0, 20)}...]
                        </span>
                        <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                          {log}
                        </span>
                      </div>
                    ))
                  )}
                {plan.steps.every((s) => !s.thinkingLog || s.thinkingLog.length === 0) && (
                  <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                    No agent logs yet.
                  </p>
                )}
              </div>
            )}

            {/* Completion summary */}
            {plan.status === "completed" && plan.completionSummary && (
              <div
                className="mt-3 flex items-center gap-2 p-2.5 rounded-lg text-xs"
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
        </div>
      )}
    </div>
  );
}
