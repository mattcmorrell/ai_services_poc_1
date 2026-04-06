"use client";

import { useState } from "react";
import {
  CaretDown,
  CaretUp,
  ClipboardText,
  Brain,
} from "@phosphor-icons/react";
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

  const statusDotColor =
    plan.status === "executing" ? "var(--color-info)"
    : plan.status === "paused" ? "var(--color-warning)"
    : plan.status === "completed" ? "var(--color-success)"
    : "var(--muted-foreground)";

  return (
    <div className="relative z-20 shrink-0 border-b border-border">
      {/* Collapsed bar (always visible) */}
      <div
        className="flex items-center gap-3 px-6 py-3 cursor-pointer select-none transition-colors"
        style={{ ["--tw-bg-opacity" as string]: 1 }}
        onClick={() => setExpanded(!expanded)}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "")}
      >
        {/* Status dot */}
        <div
          className="w-2 h-2 rounded-full shrink-0"
          style={{
            background: statusDotColor,
            boxShadow: plan.status === "executing" ? `0 0 8px ${statusDotColor}` : "none",
          }}
        />

        {/* Title + active step */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate text-foreground">{plan.title}</span>
            <PlanStatusBadge status={plan.status} />
          </div>
          {activeStep && (
            <p className="text-[11px] font-mono truncate mt-0.5 text-muted-foreground">
              Step {completedSteps + 1}: {activeStep.description}
            </p>
          )}
        </div>

        {/* Mini progress bar */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 rounded-full overflow-hidden bg-muted">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: "var(--color-success)" }}
              />
            </div>
            <span className="text-[11px] font-mono tabular-nums font-medium text-muted-foreground">
              {completedSteps}/{totalSteps}
            </span>
          </div>

          {/* Controls inline */}
          <div onClick={(e) => e.stopPropagation()}>
            <PlanControls plan={plan} onPause={onPause} onStop={onStop} onResume={onResume} compact />
          </div>

          {/* Expand/collapse chevron */}
          <div className="text-muted-foreground">
            {expanded ? <CaretUp className="w-4 h-4" /> : <CaretDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div className="px-6 pb-4 border-t border-border">
          <div className="pt-3 max-w-2xl">
            <PlanStepTimeline steps={plan.steps} compact />

            {/* Agent log toggle */}
            <button
              onClick={() => setShowAgentLog(!showAgentLog)}
              className="flex items-center gap-1.5 mt-3 text-[11px] font-mono transition-colors text-muted-foreground hover:text-foreground"
            >
              <Brain className="w-3 h-3" />
              {showAgentLog ? "Hide agent log" : "Show agent log"}
            </button>

            {/* Agent log flyout */}
            {showAgentLog && (
              <div
                className="mt-2 p-3 rounded-lg space-y-2 max-h-40 overflow-y-auto font-mono bg-muted border border-border"
              >
                {plan.steps
                  .filter((s) => s.thinkingLog && s.thinkingLog.length > 0)
                  .flatMap((step) =>
                    step.thinkingLog!.map((log, i) => (
                      <div key={`${step.id}-${i}`} className="flex gap-2">
                        <span className="text-[11px] shrink-0 text-muted-foreground opacity-60">
                          [{step.description.slice(0, 20)}...]
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {log}
                        </span>
                      </div>
                    ))
                  )}
                {plan.steps.every((s) => !s.thinkingLog || s.thinkingLog.length === 0) && (
                  <p className="text-[11px] text-muted-foreground opacity-60">
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
                  background: "var(--color-success-muted)",
                  border: "1px solid var(--color-success-muted)",
                  color: "var(--color-success)",
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
