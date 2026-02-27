"use client";

import { CheckCircle, XCircle, Clock, Archive } from "lucide-react";
import { ActionPlan } from "@/types/chat";
import { cn } from "@/lib/utils";

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
      <div
        className="flex flex-col items-center justify-center py-8 text-center"
        style={{ color: "rgba(255,255,255,0.25)" }}
      >
        <Archive className="w-8 h-8 mb-2" style={{ color: "rgba(255,255,255,0.15)" }} />
        <p className="text-sm">No past plans</p>
        <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>
          Completed and stopped plans will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div
        className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-medium uppercase tracking-wide"
        style={{ color: "rgba(255,255,255,0.25)" }}
      >
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
            className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors hover:bg-white/[0.03]"
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess ? (
                <CheckCircle className="w-4 h-4" style={{ color: "rgba(74, 222, 128, 0.6)" }} />
              ) : isFailed ? (
                <XCircle className="w-4 h-4" style={{ color: "rgba(239, 68, 68, 0.5)" }} />
              ) : (
                <Clock className="w-4 h-4" style={{ color: "rgba(255,255,255,0.25)" }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="text-sm truncate"
                style={{ color: "rgba(255,255,255,0.6)", fontWeight: 400 }}
              >
                {plan.title}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                  {completedSteps}/{plan.steps.length} steps
                </span>
                {plan.completionSummary && (
                  <span className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.2)" }}>
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
