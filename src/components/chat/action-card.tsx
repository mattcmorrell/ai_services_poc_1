"use client";

import { useState, useEffect } from "react";
import {
  Check,
  X,
  ClipboardList,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ActionPlan, ActionPlanStep } from "@/types/chat";

interface ActionCardProps {
  plan: ActionPlan;
  workflow?: {
    id: string;
    name: string;
    description: string;
  };
  onApprove: () => void;
  onDecline: () => void;
  onWorkflowClick?: (workflowId: string) => void;
}

export function ActionCard({ plan, workflow, onApprove, onDecline, onWorkflowClick }: ActionCardProps) {
  const isPending = plan.status === "pending";
  const isApproved = plan.status === "approved";
  const isExecuting = plan.status === "executing";
  const isCompleted = plan.status === "completed";
  const isDeclined = plan.status === "declined";

  const getStatusIcon = () => {
    if (isCompleted) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    if (isDeclined) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    return <ClipboardList className="w-5 h-5 text-muted-foreground" />;
  };

  const getTimeDisplay = () => {
    if (isCompleted && plan.completionSummary) {
      return plan.completionSummary.match(/\d+[ms]\s*\d*s?/)?.[0] || plan.metadata?.estimatedTime;
    }
    return plan.metadata?.estimatedTime;
  };

  return (
    <div
      className={cn(
        "rounded-xl border p-5 max-w-lg",
        "bg-muted/30 border-border",
        isDeclined && "opacity-70"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold">{plan.title}</h3>
        {getStatusIcon()}
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

      {/* Metadata */}
      {plan.metadata && (
        <div className="flex gap-4 mb-4">
          {plan.metadata.affectedCount && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>
                {plan.metadata.affectedCount} {plan.metadata.affectedLabel || "items"}
              </span>
            </div>
          )}
          {plan.metadata.estimatedTime && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>
                {isCompleted
                  ? `Completed in ${getTimeDisplay()}`
                  : plan.metadata.estimatedTime}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Workflow Link */}
      {workflow && (
        <div
          onClick={() => onWorkflowClick?.(workflow.id)}
          className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30 mb-4 cursor-pointer hover:bg-muted/50 transition-colors"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
            <ArrowUpDown className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm">{workflow.name}</div>
            <div className="text-xs text-muted-foreground">{workflow.description}</div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      )}

      {/* Steps */}
      <div className="border-t border-border pt-4 mb-4">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Steps
        </div>
        <div className="space-y-2">
          {plan.steps.map((step, index) => (
            <StepItem
              key={step.id}
              step={step}
              index={index + 1}
              isDeclined={isDeclined}
            />
          ))}
        </div>
      </div>

      {/* Buttons */}
      {isPending && (
        <div className="flex gap-3">
          <Button onClick={onApprove} className="gap-2">
            <Check className="w-4 h-4" />
            Approve
          </Button>
          <Button
            variant="outline"
            onClick={onDecline}
            className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
          >
            <X className="w-4 h-4" />
            Decline
          </Button>
        </div>
      )}

      {(isApproved || isExecuting) && (
        <Button disabled className="gap-2 bg-green-600 hover:bg-green-600 text-white">
          <Check className="w-4 h-4" />
          Approved
        </Button>
      )}

      {isDeclined && (
        <>
          <Button disabled variant="destructive" className="gap-2">
            <X className="w-4 h-4" />
            Declined
          </Button>
          <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground">
            This plan was declined. What would you like me to change?
          </div>
        </>
      )}

      {/* Completion Banner */}
      {isCompleted && plan.completionSummary && (
        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-400">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{plan.completionSummary}</span>
        </div>
      )}
    </div>
  );
}

interface StepItemProps {
  step: ActionPlanStep;
  index: number;
  isDeclined: boolean;
}

function StepItem({ step, index, isDeclined }: StepItemProps) {
  const isCompleted = step.status === "completed";
  const isInProgress = step.status === "in_progress";

  return (
    <div
      className={cn(
        "flex items-start gap-3 py-1",
        isDeclined && "opacity-50"
      )}
    >
      <div
        className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0",
          isCompleted && "bg-green-600 text-white",
          isInProgress && "bg-blue-600 text-white animate-pulse",
          !isCompleted && !isInProgress && "bg-muted text-muted-foreground"
        )}
      >
        {isCompleted ? (
          <Check className="w-3 h-3" strokeWidth={3} />
        ) : (
          index
        )}
      </div>
      <span
        className={cn(
          "text-sm",
          !isCompleted && !isInProgress && step.status === "pending" && "text-muted-foreground"
        )}
      >
        {step.description}
      </span>
    </div>
  );
}
