"use client";

import { useState } from "react";
import {
  ChatDots,
  Buildings,
  MapPin,
  Phone,
  Warning,
  ClipboardText,
  ArrowRight,
  Sparkle,
  Users,
} from "@phosphor-icons/react";
import { Client, Chat } from "@/types/chat";
import { getClientHomeData, type Severity } from "@/data/client-home-data";
import { getAvatarStyle } from "@/lib/avatar-colors";
import { Button } from "@/components/ui/button";
import { AlertPill } from "@/components/ui/alert-pill";

interface ClientHomeTabProps {
  client: Client;
  chats: Chat[];
  onOpenChat: (chat: Chat) => void;
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const severityPill: Record<Severity, { label: string; variant: "urgent" | "attention" | "info" }> = {
  blocking: { label: "Blocking", variant: "attention" },
  error: { label: "Error", variant: "urgent" },
  review: { label: "Review", variant: "info" },
};

const planStatusConfig: Record<string, { label: string; bg: string; color: string }> = {
  awaiting: { label: "Awaiting", bg: "var(--color-warning-muted)", color: "var(--color-warning)" },
  running: { label: "Running", bg: "var(--color-info-muted)", color: "var(--color-info)" },
  paused: { label: "Paused", bg: "var(--muted)", color: "var(--muted-foreground)" },
};

// Mock enrichment data per client — in production this comes from the API
const clientMeta: Record<string, { industry: string; employees: number; location: string; contact: string }> = {
  "1": { industry: "Research & Development", employees: 312, location: "Cleveland, OH", contact: "Cave Johnson" },
  "2": { industry: "Pharmaceuticals", employees: 1420, location: "Raccoon City, CO", contact: "Albert Wesker" },
  "3": { industry: "Space Exploration", employees: 890, location: "Gateway Station", contact: "Carter Burke" },
  "4": { industry: "Theoretical Physics", employees: 47, location: "Black Mesa, NM", contact: "Dr. Eli Vance" },
  "5": { industry: "Defense Technology", employees: 156, location: "Sunnyvale, CA", contact: "Miles Dyson" },
  "6": { industry: "Bioengineering", employees: 620, location: "Los Angeles, CA", contact: "Eldon Tyrell" },
};

export function ClientHomeTab({ client, chats, onOpenChat }: ClientHomeTabProps) {
  const [showMoreActivity, setShowMoreActivity] = useState(false);
  const meta = clientMeta[client.id];
  const homeData = getClientHomeData(client.id);

  const visibleTeam = showMoreActivity ? homeData.recentActivity.team : homeData.recentActivity.team.slice(0, 3);
  const visibleAgents = showMoreActivity ? homeData.recentActivity.agents : homeData.recentActivity.agents.slice(0, 3);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-background p-8">
      {/* Client header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-[18px] font-medium text-primary">
            {client.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-[18px] font-medium">{client.name}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {meta && (
                <>
                  <span className="flex items-center gap-1">
                    <Buildings className="h-3 w-3" />
                    {meta.industry}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {meta.location}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        {meta && (
          <div className="ml-[52px] flex items-center gap-1 text-xs text-muted-foreground">
            <Phone className="h-3 w-3" />
            Primary contact: <span className="text-foreground">{meta.contact}</span>
          </div>
        )}
      </div>

      {/* --- Needs Attention --- */}
      {homeData.attentionItems.length > 0 && (
        <div className="mb-6 rounded-[14px] border border-border bg-card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border px-5 py-3">
            <Warning className="h-4 w-4" style={{ color: "var(--color-warning)" }} />
            <span className="text-xs font-semibold uppercase tracking-[0.06em]">Needs Attention</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[11px] font-medium text-foreground/70">
              {homeData.attentionItems.length}
            </span>
          </div>
          <div className="divide-inset">
            {homeData.attentionItems.map((item) => {
              const sev = severityPill[item.severity];
              return (
                <div key={item.id} className="flex items-start gap-3 px-5 py-4">
                  <AlertPill variant={sev.variant} className="mt-px w-[100px] shrink-0 justify-center uppercase">
                    {sev.variant === "urgent" && <Warning size={12} />}
                    {sev.variant === "attention" && <span className="h-1.5 w-1.5 rounded-full" style={{ background: "currentColor" }} />}
                    {sev.label}
                  </AlertPill>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="mt-0.5 text-[13px] text-muted-foreground">{item.description}</p>
                    {item.lastSeen ? (
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-medium text-white" style={getAvatarStyle(item.lastSeen.name)}>
                          {item.lastSeen.initials.charAt(0)}
                        </span>
                        {item.lastSeen.name} viewed {item.lastSeen.timeAgo}
                      </div>
                    ) : (
                      <p className="mt-1.5 text-xs text-muted-foreground/60">No one has viewed this yet</p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <Button variant="outline" size="sm">
                      {item.primaryAction}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      {item.secondaryAction}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- Recent Chats + Active Plans --- */}
      <div className="mb-6 grid grid-cols-5 gap-6">
        {/* Recent Chats — 3 cols */}
        <div className="col-span-3 rounded-[14px] border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="flex items-center gap-2">
              <ChatDots className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-[0.06em]">Recent Chats</span>
            </div>
            <button className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80">
              All chats <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="divide-inset">
            {chats
              .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
              .slice(0, 5)
              .map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onOpenChat(chat)}
                  className="flex w-full items-center gap-3 px-5 py-2.5 text-left transition-colors hover:bg-accent"
                >
                  {chat.hasUnread ? (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  ) : (
                    <span className="h-1.5 w-1.5 shrink-0" />
                  )}
                  <span className={`flex-1 truncate text-sm ${chat.hasUnread ? "font-semibold" : ""}`}>
                    {chat.title}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground" suppressHydrationWarning>
                    {timeAgo(chat.updatedAt)}
                  </span>
                </button>
              ))}
          </div>
        </div>

        {/* Active Plans — 2 cols */}
        <div className="col-span-2 rounded-[14px] border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="flex items-center gap-2">
              <ClipboardText className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-[0.06em]">Active Plans</span>
            </div>
            <span className="font-mono text-xs text-muted-foreground">{homeData.activePlans.length} plans</span>
          </div>
          <div className="divide-inset">
            {homeData.activePlans.map((plan) => {
              const pct = plan.totalSteps > 0 ? (plan.completedSteps / plan.totalSteps) * 100 : 0;
              const statusCfg = planStatusConfig[plan.status];
              const isPaused = plan.status === "paused";
              return (
                <div key={plan.id} className="px-5 py-3">
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">{plan.title}</span>
                    <span className="shrink-0 rounded-full font-mono text-xs font-semibold" style={{ background: statusCfg.bg, color: statusCfg.color, padding: "3px 10px" }}>
                      {statusCfg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">
                      {plan.completedSteps} / {plan.totalSteps} steps
                    </span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-[3px] bg-secondary">
                      <div
                        className="h-full rounded-[3px] transition-all"
                        style={{
                          width: `${pct}%`,
                          background: isPaused
                            ? "var(--muted-foreground)"
                            : "linear-gradient(90deg, color-mix(in srgb, var(--primary) 70%, var(--background)), var(--primary))",
                          opacity: isPaused ? 0.4 : 1,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- Recent Activity --- */}
      <div className="mb-2">
        <div className="mb-3 flex items-center gap-2">
          <Sparkle className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-semibold uppercase tracking-[0.06em]">Recent Activity</span>
          {homeData.recentActivity.team.length > 3 && (
            <button
              onClick={() => setShowMoreActivity((v) => !v)}
              className="ml-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
            >
              {showMoreActivity ? "Show less" : "Show more"}
            </button>
          )}
        </div>
        <div className="rounded-[14px] border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-border">
            {/* Team column */}
            <div>
              <div className="flex items-center gap-2 border-b border-border px-5 py-2.5">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">Team</span>
              </div>
              <div className="divide-inset">
                {visibleTeam.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 px-5 py-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-medium text-white" style={getAvatarStyle(item.name)}>
                      {item.initials}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm">
                      <span className="font-medium">{item.name}</span>{" "}
                      <span className="text-muted-foreground">{item.action}</span>
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">{item.timeAgo}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Agents column */}
            <div>
              <div className="flex items-center gap-2 border-b border-border px-5 py-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">Agents</span>
              </div>
              <div className="divide-inset">
                {visibleAgents.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 px-5 py-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-medium text-white" style={getAvatarStyle(item.name)}>
                      {item.initials}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm">
                      <span className="font-medium">{item.name}</span>{" "}
                      <span className="text-muted-foreground">{item.action}</span>
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">{item.timeAgo}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
