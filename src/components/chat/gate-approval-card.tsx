"use client";

import { Check, ShieldAlert, Play, Pencil } from "lucide-react";
import { ActionPlan } from "@/types/chat";

interface GateApprovalCardProps {
  gateApproval: {
    planMessageId: string;
    stepIndex: number;
    stepDescription: string;
  };
  /** Current status of the linked action plan */
  planStatus: ActionPlan["status"] | undefined;
  /** Status of this specific step ("pending" | "in_progress" | "completed") */
  stepStatus: string | undefined;
  onApprove: () => void;
  onModify: () => void;
}

export function GateApprovalCard({
  gateApproval,
  planStatus,
  stepStatus,
  onApprove,
  onModify,
}: GateApprovalCardProps) {
  // Step is approved if it has been completed, regardless of overall plan status
  const isApproved = stepStatus === "completed";
  const isDeclined = planStatus === "declined" || planStatus === "stopped";

  return (
    <div
      className="mt-4 rounded-xl border p-4 max-w-lg"
      style={{
        background: isApproved
          ? "rgba(34, 197, 94, 0.05)"
          : isDeclined
          ? "rgba(239, 68, 68, 0.05)"
          : "rgba(251, 191, 36, 0.05)",
        borderColor: isApproved
          ? "rgba(34, 197, 94, 0.2)"
          : isDeclined
          ? "rgba(239, 68, 68, 0.2)"
          : "rgba(251, 191, 36, 0.2)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{
            background: isApproved
              ? "rgba(34, 197, 94, 0.15)"
              : isDeclined
              ? "rgba(239, 68, 68, 0.15)"
              : "rgba(251, 191, 36, 0.15)",
          }}
        >
          {isApproved ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : isDeclined ? (
            <Pencil className="w-4 h-4 text-red-400" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-yellow-500" />
          )}
        </div>
        <div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Step {gateApproval.stepIndex + 1} — Approval Required
          </div>
        </div>
      </div>

      {/* Step description */}
      <p className="text-sm font-medium mb-1">
        {gateApproval.stepDescription}
      </p>
      <p className="text-xs text-muted-foreground mb-4">
        This action cannot be easily undone and requires your confirmation.
      </p>

      {/* Buttons */}
      {!isApproved && !isDeclined && (
        <div className="flex gap-2.5">
          <button
            onClick={onApprove}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            style={{
              background: "rgba(34, 197, 94, 0.15)",
              color: "rgb(34, 197, 94)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(34, 197, 94, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(34, 197, 94, 0.15)";
            }}
          >
            <Play className="w-3.5 h-3.5" />
            Approve & Continue
          </button>
          <button
            onClick={onModify}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              color: "rgba(239, 68, 68, 0.8)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
            }}
          >
            <Pencil className="w-3.5 h-3.5" />
            Modify Plan
          </button>
        </div>
      )}

      {/* Approved state */}
      {isApproved && (
        <div className="flex items-center gap-2 text-sm text-green-500">
          <Check className="w-4 h-4" />
          <span className="font-medium">Approved — continuing execution</span>
        </div>
      )}

      {/* Declined state */}
      {isDeclined && (
        <div className="flex items-center gap-2 text-sm text-red-400">
          <Pencil className="w-4 h-4" />
          <span className="font-medium">Plan modified — describe your changes below</span>
        </div>
      )}
    </div>
  );
}
