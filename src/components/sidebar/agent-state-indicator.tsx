"use client";

import { CircleNotch, WarningCircle, CheckCircle } from "@phosphor-icons/react";

interface AgentStateIndicatorProps {
  state?: 'running' | 'needs-approval' | 'done' | 'idle';
  detail?: string;
}

export function AgentStateIndicator({ state, detail }: AgentStateIndicatorProps) {
  if (!state || state === 'idle') return null;

  if (state === 'running') {
    return (
      <span className="inline-flex items-center gap-1 type-status text-primary">
        <CircleNotch className="h-3 w-3 flex-shrink-0 animate-spin" />
        {detail ? `Running · ${detail}` : 'Running'}
      </span>
    );
  }

  if (state === 'needs-approval') {
    return (
      <span className="inline-flex items-center gap-1 type-status text-[color:var(--color-warning)]">
        <WarningCircle className="h-3 w-3 flex-shrink-0" />
        {detail ?? 'Needs approval'}
      </span>
    );
  }

  if (state === 'done') {
    return (
      <span className="inline-flex items-center gap-1 type-status text-[color:var(--color-success)]">
        <CheckCircle className="h-3 w-3 flex-shrink-0" />
        {detail ?? 'Done'}
      </span>
    );
  }

  return null;
}
