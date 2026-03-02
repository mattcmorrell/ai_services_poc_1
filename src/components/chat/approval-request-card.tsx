"use client";

import { useEffect, useCallback } from "react";
import { Check, ShieldCheck, X } from "lucide-react";

interface ApprovalRequestCardProps {
  question: string;
  title?: string;
  approved?: boolean;
  onApprove: () => void;
  onDecline: () => void;
}

export function ApprovalRequestCard({
  question,
  title,
  approved,
  onApprove,
  onDecline,
}: ApprovalRequestCardProps) {
  const isPending = approved === undefined;
  const isApproved = approved === true;
  const isDeclined = approved === false;

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
      <div className="mt-4 rounded-lg border border-emerald-500/20 bg-card/50 px-4 py-3 max-w-[520px]">
        <div className="flex items-center gap-2 text-[12px] tracking-wide uppercase text-emerald-500/70">
          <Check size={12} />
          <span>Approved</span>
        </div>
        {title && (
          <p className="text-[12px] text-foreground/50 mt-1">{title}</p>
        )}
      </div>
    );
  }

  // Declined state: compact summary
  if (isDeclined) {
    return (
      <div className="mt-4 rounded-lg border border-red-500/20 bg-card/50 px-4 py-3 max-w-[520px]">
        <div className="flex items-center gap-2 text-[12px] tracking-wide uppercase text-red-400/70">
          <X size={12} />
          <span>Declined</span>
        </div>
        {title && (
          <p className="text-[12px] text-foreground/50 mt-1">{title}</p>
        )}
      </div>
    );
  }

  // Pending state: big approval card
  return (
    <div className="mt-4 rounded-lg border border-border bg-card/50 overflow-hidden max-w-[520px]">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-3 border-b border-border bg-muted/30">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/60">
          <ShieldCheck className="w-4 h-4 text-foreground/40" />
        </div>
        <div className="text-[12px] font-medium tracking-wide uppercase text-muted-foreground">
          {title || "Approval required"}
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <p className="text-[13px] text-foreground leading-relaxed">
          {question}
        </p>
      </div>

      {/* Action buttons */}
      <div className="p-3 px-5 border-t border-border flex gap-2.5">
        <button
          onClick={onApprove}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-[12px] font-semibold tracking-wide transition-all duration-200 bg-emerald-600 text-white cursor-pointer hover:bg-emerald-500"
        >
          <Check className="w-3.5 h-3.5" />
          Approve
        </button>
        <button
          onClick={onDecline}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-[12px] font-semibold tracking-wide transition-all duration-200 bg-transparent text-red-400 cursor-pointer hover:bg-red-500/10 border border-red-500/30"
        >
          <X className="w-3.5 h-3.5" />
          Decline
        </button>
      </div>
    </div>
  );
}
