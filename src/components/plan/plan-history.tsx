"use client";

import { CheckCircle, XCircle, Clock, Archive } from "@phosphor-icons/react";
import { ActionPlan } from "@/types/chat";

interface PlanHistoryEntry {
  plan: ActionPlan;
  chatTitle: string;
  completedAt?: Date;
}

interface PlanHistoryProps {
  plans: PlanHistoryEntry[];
  onSelect?: (planId: string) => void;
}

export function PlanHistory({ plans, onSelect }: PlanHistoryProps) {
  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
        <Archive className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm">No past plans</p>
        <p className="text-xs mt-1 opacity-70">
          Completed and stopped plans will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-mono font-medium uppercase tracking-wide text-muted-foreground">
        <Archive className="w-3 h-3" />
        Past Plans
      </div>
      {plans.map((entry) => {
        const { plan } = entry;
        const completedSteps = plan.steps.filter((s) => s.status === "completed").length;
        const isSuccess = plan.status === "completed";
        const isFailed = plan.status === "stopped" || plan.status === "declined";

        return (
          <button
            key={plan.id}
            onClick={() => onSelect?.(plan.id)}
            className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors hover:bg-accent"
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess ? (
                <CheckCircle className="w-4 h-4" style={{ color: "var(--color-success)" }} />
              ) : isFailed ? (
                <XCircle className="w-4 h-4" style={{ color: "var(--color-danger)" }} />
              ) : (
                <Clock className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm truncate text-foreground">{plan.title}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-mono text-muted-foreground">
                  {completedSteps}/{plan.steps.length} steps
                </span>
                {plan.completionSummary && (
                  <span className="text-[11px] truncate text-muted-foreground opacity-70">
                    {plan.completionSummary}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
