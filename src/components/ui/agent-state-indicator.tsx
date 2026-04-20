"use client";

import { CircleNotch, WarningCircle } from "@phosphor-icons/react";
import { AlertPill } from "./alert-pill";
import { StatusBadge } from "./status-badge";

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

  if (state === 'running') {
    return (
      <StatusBadge variant="running" dot={false} className={className}>
        <CircleNotch weight="bold" className="h-2.5 w-2.5 flex-shrink-0 animate-spin" />
        {detail ? `Running · ${sentenceCase(detail)}` : 'Running'}
      </StatusBadge>
    );
  }

  if (state === 'needs-approval') {
    return (
      <AlertPill variant="attention" className={className}>
        <WarningCircle weight="fill" className="h-2.5 w-2.5 flex-shrink-0" />
        {detail ? sentenceCase(detail) : 'Needs approval'}
      </AlertPill>
    );
  }

  if (state === 'done') {
    return (
      <StatusBadge variant="done" className={className}>
        {detail ? sentenceCase(detail) : 'Done'}
      </StatusBadge>
    );
  }

  return null;
}
