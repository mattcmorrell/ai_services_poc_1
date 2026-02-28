"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Loader2,
  AlertTriangle,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ActionPlanStep } from "@/types/chat";

interface PlanStepTimelineProps {
  steps: ActionPlanStep[];
  compact?: boolean;
}

export function PlanStepTimeline({ steps, compact = false }: PlanStepTimelineProps) {
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (stepId: string) => {
    setExpandedSteps((prev) => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const completedCount = steps.filter((s) => s.status === "completed").length;
  const activeStep = steps.find((s) => s.status === "in_progress");

  return (
    <div className="space-y-1">
      {/* Progress summary */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${(completedCount / steps.length) * 100}%`,
              background: "linear-gradient(90deg, rgba(74, 222, 128, 0.6), rgba(74, 222, 128, 0.8))",
            }}
          />
        </div>
        <span className="text-xs tabular-nums" style={{ color: "rgba(255,255,255,0.35)" }}>
          {completedCount}/{steps.length}
        </span>
      </div>

      {/* Steps */}
      {steps.map((step, index) => {
        const isCompleted = step.status === "completed";
        const isActive = step.status === "in_progress";
        const hasThinking = step.thinkingLog && step.thinkingLog.length > 0;
        const isExpanded = expandedSteps[step.id];

        if (compact) {
          return (
            <div
              key={step.id}
              className="flex items-center gap-2 py-0.5"
            >
              <StepIndicator status={step.status} index={index} compact />
              <span
                className={cn(
                  "text-xs truncate flex-1",
                  isCompleted && "line-through",
                )}
                style={{
                  color: isActive
                    ? "rgba(255,255,255,0.85)"
                    : isCompleted
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(255,255,255,0.45)",
                }}
              >
                {step.description}
              </span>
              {step.nonUndoable && (
                <AlertTriangle
                  className="w-3 h-3 shrink-0"
                  style={{ color: "rgba(251, 191, 36, 0.7)" }}
                />
              )}
            </div>
          );
        }

        return (
          <div key={step.id}>
            <div
              className={cn(
                "flex items-start gap-3 py-2 px-2 rounded-lg transition-colors",
                hasThinking && "cursor-pointer hover:bg-white/[0.03]",
              )}
              onClick={() => hasThinking && toggleStep(step.id)}
            >
              <StepIndicator status={step.status} index={index} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm"
                    style={{
                      color: isActive
                        ? "rgba(255,255,255,0.9)"
                        : isCompleted
                        ? "rgba(255,255,255,0.5)"
                        : "rgba(255,255,255,0.4)",
                      fontWeight: isActive ? 500 : 400,
                    }}
                  >
                    {step.description}
                  </span>
                  {step.nonUndoable && (
                    <span
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium"
                      style={{
                        background: "rgba(251, 191, 36, 0.1)",
                        color: "rgba(251, 191, 36, 0.8)",
                        border: "1px solid rgba(251, 191, 36, 0.15)",
                      }}
                    >
                      <AlertTriangle className="w-2.5 h-2.5" />
                      Gate
                    </span>
                  )}
                </div>

                {step.completedAt && isCompleted && (
                  <span
                    className="text-xs mt-0.5 block"
                    style={{ color: "rgba(255,255,255,0.2)" }}
                  >
                    Completed {step.completedAt.toLocaleTimeString()}
                  </span>
                )}
              </div>

              {hasThinking && (
                <div className="shrink-0 mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </div>
              )}
            </div>

            {/* Thinking log */}
            {hasThinking && isExpanded && (
              <div
                className="ml-9 mb-2 p-3 rounded-lg text-xs space-y-1.5"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div
                  className="flex items-center gap-1.5 mb-2 text-xs font-medium uppercase tracking-wide"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  <Brain className="w-3 h-3" />
                  Agent thinking
                </div>
                {step.thinkingLog!.map((log, i) => (
                  <p key={i} style={{ color: "rgba(255,255,255,0.35)" }}>
                    {log}
                  </p>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function StepIndicator({
  status,
  index,
  compact = false,
}: {
  status: ActionPlanStep["status"];
  index: number;
  compact?: boolean;
}) {
  const size = compact ? "w-4 h-4" : "w-6 h-6";
  const iconSize = compact ? "w-2.5 h-2.5" : "w-3 h-3";
  const textSize = compact ? "text-[10px]" : "text-xs";

  if (status === "completed") {
    return (
      <div
        className={cn(size, "rounded-full flex items-center justify-center shrink-0")}
        style={{ background: "rgba(74, 222, 128, 0.2)" }}
      >
        <Check className={iconSize} style={{ color: "rgba(74, 222, 128, 0.9)" }} strokeWidth={3} />
      </div>
    );
  }

  if (status === "in_progress") {
    return (
      <div
        className={cn(size, "rounded-full flex items-center justify-center shrink-0")}
        style={{ background: "rgba(96, 165, 250, 0.2)" }}
      >
        <Loader2
          className={cn(iconSize, "animate-spin")}
          style={{ color: "rgba(96, 165, 250, 0.9)" }}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        size,
        textSize,
        "rounded-full flex items-center justify-center shrink-0 font-medium",
      )}
      style={{
        background: "rgba(255,255,255,0.04)",
        color: "rgba(255,255,255,0.25)",
      }}
    >
      {index + 1}
    </div>
  );
}
