"use client";

import { useEffect, useCallback } from "react";
import { Check, ShieldWarning, PencilSimple, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { StatusLabel } from "@/components/ui/status-label";
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
  const isApproved = stepStatus === "completed";
  const isDeclined = planStatus === "declined" || planStatus === "stopped";
  const isPending = !isApproved && !isDeclined;

  // Keyboard shortcut: Enter to approve when pending
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isPending) return;
      if (
        (e.target as HTMLElement).tagName === "INPUT" ||
        (e.target as HTMLElement).tagName === "TEXTAREA"
      )
        return;
      if (e.key === "Enter") {
        onApprove();
      }
    },
    [isPending, onApprove]
  );

  useEffect(() => {
    if (!isPending) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isPending, handleKeyDown]);

  // Approved state: compact summary
  if (isApproved) {
    return (
      <div className="mt-4 rounded-xl bg-card/50 px-4 py-3 max-w-[520px]" style={{ border: "1px solid color-mix(in srgb, var(--color-success) 20%, transparent)" }}>
        <StatusLabel variant="success">
          <Check size={12} />
          <span>Step {gateApproval.stepIndex + 1} approved</span>
        </StatusLabel>
        <p className="text-[13px] text-foreground/50 mt-1">
          {gateApproval.stepDescription}
        </p>
      </div>
    );
  }

  // Declined state: compact summary
  if (isDeclined) {
    return (
      <div className="mt-4 rounded-xl bg-card/50 px-4 py-3 max-w-[520px]" style={{ border: "1px solid color-mix(in srgb, var(--color-danger) 20%, transparent)" }}>
        <StatusLabel variant="danger">
          <X size={12} />
          <span>Step {gateApproval.stepIndex + 1} — plan modified</span>
        </StatusLabel>
        <p className="text-[13px] text-foreground/50 mt-1">
          Describe your changes below.
        </p>
      </div>
    );
  }

  // Pending state: big approval card
  return (
    <div className="mt-4 rounded-xl border border-border bg-card/50 overflow-hidden max-w-[520px]">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-3 border-b border-border bg-muted/30">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/60">
          <ShieldWarning className="w-4 h-4 text-foreground/40" />
        </div>
        <StatusLabel variant="muted">
          Step {gateApproval.stepIndex + 1} — Approval required
        </StatusLabel>
      </div>

      {/* Body */}
      <div className="p-5">
        <p className="text-[13px] text-foreground leading-relaxed mb-1.5">
          {gateApproval.stepDescription}
        </p>
        <p className="text-[11px] text-foreground/40">
          This action cannot be easily undone and requires your confirmation.
        </p>
      </div>

      {/* Action buttons */}
      <div className="p-3 px-5 border-t border-border flex gap-2.5">
        <Button onClick={onApprove} className="flex-1">
          <Check className="w-4 h-4" />
          Approve & continue
        </Button>
        <Button variant="danger-outline" onClick={onModify}>
          <PencilSimple className="w-4 h-4" />
          Modify
        </Button>
      </div>
    </div>
  );
}
