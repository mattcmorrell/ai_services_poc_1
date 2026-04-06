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

const severityConfig: Record<Severity, { label: string; className: string }> = {
  blocking: { label: "BLOCKING", className: "bg-red-500/15 text-red-400" },
  error: { label: "ERROR", className: "bg-amber-500/15 text-amber-400" },
  review: { label: "REVIEW", className: "bg-blue-500/15 text-blue-400" },
};

const planStatusConfig: Record<string, { label: string; className: string }> = {
  awaiting: { label: "Awaiting", className: "bg-amber-500/15 text-amber-400" },
  running: { label: "Running", className: "bg-emerald-500/15 text-emerald-400" },
  paused: { label: "Paused", className: "bg-zinc-500/15 text-zinc-400" },
};

const planBarColor: Record<string, string> = {
  awaiting: "bg-blue-500",
  running: "bg-blue-500",
  paused: "bg-blue-500/40",
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
        <div className="mb-6 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-5 py-3">
            <Warning className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-[0.06em]">Needs Attention</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[11px] font-medium text-foreground/70">
              {homeData.attentionItems.length}
            </span>
          </div>
          <div className="divide-y divide-border">
            {homeData.attentionItems.map((item) => {
              const sev = severityConfig[item.severity];
              return (
                <div key={item.id} className="flex items-start gap-4 px-5 py-4">
                  <span className={`mt-0.5 w-[72px] shrink-0 rounded px-2 py-0.5 text-center text-[11px] font-medium uppercase ${sev.className}`}>
                    {sev.label}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{item.description}</p>
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
                    <button className="rounded-md border border-primary/50 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10">
                      {item.primaryAction}
                    </button>
                    <button className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                      {item.secondaryAction}
                    </button>
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
        <div className="col-span-3 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="flex items-center gap-2">
              <ChatDots className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-[0.06em]">Recent Chats</span>
            </div>
            <button className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80">
              All chats <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="divide-y divide-border">
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
        <div className="col-span-2 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="flex items-center gap-2">
              <ClipboardText className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-[0.06em]">Active Plans</span>
            </div>
            <span className="text-xs text-muted-foreground">{homeData.activePlans.length} plans</span>
          </div>
          <div className="divide-y divide-border">
            {homeData.activePlans.map((plan) => {
              const pct = plan.totalSteps > 0 ? (plan.completedSteps / plan.totalSteps) * 100 : 0;
              const statusCfg = planStatusConfig[plan.status];
              const barColor = planBarColor[plan.status];
              return (
                <div key={plan.id} className="px-5 py-3">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">{plan.title}</span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${statusCfg.className}`}>
                      {statusCfg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {plan.completedSteps} / {plan.totalSteps} steps
                    </span>
                    <div className="h-1.5 flex-1 rounded-full bg-border">
                      <div
                        className={`h-1.5 rounded-full transition-all ${barColor}`}
                        style={{ width: `${pct}%` }}
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
        <div className="rounded-lg border border-border bg-card">
          <div className="grid grid-cols-2 divide-x divide-border">
            {/* Team column */}
            <div>
              <div className="flex items-center gap-2 border-b border-border px-5 py-2.5">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">Team</span>
              </div>
              <div className="divide-y divide-border">
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
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">Agents</span>
              </div>
              <div className="divide-y divide-border">
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
