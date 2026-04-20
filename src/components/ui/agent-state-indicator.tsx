"use client";

import { CircleNotch, WarningCircle, CheckCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type AgentState = 'running' | 'needs-approval' | 'done' | 'idle';

interface AgentStateIndicatorProps {
  state?: AgentState;
  detail?: string;
  className?: string;
}

function sentenceCase(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

export function AgentStateIndicator({ state, detail, className }: AgentStateIndicatorProps) {
  if (!state || state === 'idle') return null;

  const base = "inline-flex items-center gap-1 type-meta font-semibold!";

  if (state === 'running') {
    return (
      <span className={cn(base, "text-primary", className)}>
        <CircleNotch weight="bold" className="h-3 w-3 flex-shrink-0 animate-spin" />
        {detail ? `Running · ${sentenceCase(detail)}` : 'Running'}
      </span>
    );
  }

  if (state === 'needs-approval') {
    return (
      <span className={cn(base, "text-[color:var(--color-warning)]", className)}>
        <WarningCircle weight="fill" className="h-3 w-3 flex-shrink-0" />
        {detail ? sentenceCase(detail) : 'Needs approval'}
      </span>
    );
  }

  if (state === 'done') {
    return (
      <span className={cn(base, "text-[color:var(--color-success)]", className)}>
        <CheckCircle weight="fill" className="h-3 w-3 flex-shrink-0" />
        {detail ? sentenceCase(detail) : 'Done'}
      </span>
    );
  }

  return null;
}
