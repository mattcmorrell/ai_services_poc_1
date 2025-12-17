"use client";

import {
  Banknote,
  Presentation,
  PartyPopper,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { AgentAttention } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface AgentsAttentionProps {
  agents: AgentAttention[];
  onAgentClick: (agentId: string) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  banknote: Banknote,
  presentation: Presentation,
  "party-popper": PartyPopper,
  sparkles: Sparkles,
};

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
}

export function AgentsAttention({ agents, onAgentClick }: AgentsAttentionProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold">
        {agents.length} agents need your attention
      </h3>
      <div className="space-y-4">
        {agents.map((agent) => {
          const IconComponent = iconMap[agent.agentIcon] || Sparkles;
          return (
            <button
              key={agent.id}
              onClick={() => onAgentClick(agent.id)}
              className="flex w-full items-start gap-3 rounded-lg p-2 text-left transition-colors hover:bg-accent"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                <IconComponent className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{agent.agentName}</span>
                  {agent.isUrgent && (
                    <span className="inline-flex items-center gap-1 rounded bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                      <AlertTriangle className="h-3 w-3" />
                      Urgent
                    </span>
                  )}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {formatTimestamp(agent.timestamp)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {agent.clientName}
                </div>
                <div className="mt-1 truncate text-sm">{agent.message}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
