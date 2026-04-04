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

  return (
    <div className="space-y-1">
      {/* Progress summary */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface-subtle)" }}>
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${(completedCount / steps.length) * 100}%`,
              background: "var(--color-success)",
            }}
          />
        </div>
        <span className="text-xs font-mono tabular-nums" style={{ color: "var(--text-tertiary-alpha)" }}>
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
            <div key={step.id} className="flex items-center gap-2 py-0.5">
              <StepIndicator status={step.status} index={index} compact />
              <span
                className={cn("text-xs truncate flex-1", isCompleted && "line-through")}
                style={{
                  color: isActive
                    ? "var(--text-primary-alpha)"
                    : isCompleted
                    ? "var(--text-quaternary-alpha)"
                    : "var(--text-secondary-alpha)",
                }}
              >
                {step.description}
              </span>
              {step.nonUndoable && (
                <AlertTriangle className="w-3 h-3 shrink-0" style={{ color: "var(--color-warning)" }} />
              )}
            </div>
          );
        }

        return (
          <div key={step.id}>
            <div
              className={cn(
                "flex items-start gap-3 py-2 px-2 rounded-lg transition-colors",
                hasThinking && "cursor-pointer",
              )}
              style={hasThinking ? { ["--tw-bg-opacity" as string]: 1 } : undefined}
              onClick={() => hasThinking && toggleStep(step.id)}
              onMouseEnter={(e) => hasThinking && (e.currentTarget.style.background = "var(--surface-hover)")}
              onMouseLeave={(e) => hasThinking && (e.currentTarget.style.background = "")}
            >
              <StepIndicator status={step.status} index={index} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm"
                    style={{
                      color: isActive
                        ? "var(--text-primary-alpha)"
                        : isCompleted
                        ? "var(--text-secondary-alpha)"
                        : "var(--text-tertiary-alpha)",
                      fontWeight: isActive ? 500 : 400,
                    }}
                  >
                    {step.description}
                  </span>
                  {step.nonUndoable && (
                    <span
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono text-xs font-medium"
                      style={{
                        background: "var(--color-warning-muted)",
                        color: "var(--color-warning)",
                        border: "1px solid var(--color-warning-muted)",
                      }}
                    >
                      <AlertTriangle className="w-2.5 h-2.5" />
                      Gate
                    </span>
                  )}
                </div>

                {step.completedAt && isCompleted && (
                  <span className="text-xs mt-0.5 block" style={{ color: "var(--text-quaternary-alpha)" }}>
                    Completed {step.completedAt.toLocaleTimeString()}
                  </span>
                )}
              </div>

              {hasThinking && (
                <div className="shrink-0 mt-1 text-muted-foreground">
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </div>
              )}
            </div>

            {/* Thinking log */}
            {hasThinking && isExpanded && (
              <div
                className="ml-9 mb-2 p-3 rounded-lg text-xs font-mono space-y-1.5"
                style={{
                  background: "var(--surface-subtle)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div
                  className="flex items-center gap-1.5 mb-2 text-xs font-medium uppercase tracking-wide"
                  style={{ color: "var(--text-quaternary-alpha)" }}
                >
                  <Brain className="w-3 h-3" />
                  Agent thinking
                </div>
                {step.thinkingLog!.map((log, i) => (
                  <p key={i} style={{ color: "var(--text-tertiary-alpha)" }}>
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
        style={{ background: "var(--color-success-muted)" }}
      >
        <Check className={iconSize} style={{ color: "var(--color-success)" }} strokeWidth={3} />
      </div>
    );
  }

  if (status === "in_progress") {
    return (
      <div
        className={cn(size, "rounded-full flex items-center justify-center shrink-0")}
        style={{ background: "var(--color-info-muted)" }}
      >
        <Loader2 className={cn(iconSize, "animate-spin")} style={{ color: "var(--color-info)" }} />
      </div>
    );
  }

  return (
    <div
      className={cn(size, textSize, "rounded-full flex items-center justify-center shrink-0 font-medium")}
      style={{
        background: "var(--surface-subtle)",
        color: "var(--text-quaternary-alpha)",
      }}
    >
      {index + 1}
    </div>
  );
}
