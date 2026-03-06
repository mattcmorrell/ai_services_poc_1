"use client";

import { useState } from "react";
import {
  MessageSquare,
  Building2,
  MapPin,
  Phone,
  AlertTriangle,
  ClipboardList,
  ArrowRight,
  Sparkles,
  Users,
  CalendarDays,
  ChevronDown,
  Upload,
  FileText,
} from "lucide-react";
import { Client, Chat } from "@/types/chat";
import { getClientHomeData, type Severity } from "@/data/client-home-data";
import { ProjectPlan, ExtractedPlanData } from "@/types/project-plan";
import { ProjectPlanTimeline } from "./project-plan-timeline";
import { ProjectPlanImportDialog } from "./project-plan-import-dialog";
import {
  getNextClientMeeting,
  getClientDeadlines,
  getMeetingPrep,
  formatEventTime,
  getDeadlineUrgency,
  formatDaysUntil,
  type CalendarEvent,
} from "@/data/calendar-data";

interface ClientHomeTabProps {
  client: Client;
  chats: Chat[];
  onOpenChat: (chat: Chat) => void;
  projectPlans?: ProjectPlan[];
  onImportProjectPlan?: (clientId: string, extractedPlan: ExtractedPlanData) => void;
  onResolveAmbiguity?: (planId: string, itemId: string, resolvedValue: string) => void;
  onPrepBrief?: (clientId: string) => void;
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

function getCurrentPhaseName(plan: ProjectPlan): { current: string; index: number; total: number } | null {
  const inProgress = plan.phases.find((p) => p.status === "in_progress");
  if (inProgress) {
    return { current: inProgress.name, index: inProgress.order, total: plan.phases.length };
  }
  const nextPhase = plan.phases.find((p) => p.status === "not_started");
  if (nextPhase) {
    return { current: nextPhase.name, index: nextPhase.order, total: plan.phases.length };
  }
  return { current: "Complete", index: plan.phases.length, total: plan.phases.length };
}

function getNextMilestone(plan: ProjectPlan): { title: string; date: string } | null {
  const today = new Date().toISOString().split("T")[0];
  for (const phase of plan.phases) {
    for (const ms of phase.milestones) {
      if (!ms.completed && ms.date >= today) {
        return { title: ms.title, date: ms.date };
      }
    }
  }
  return null;
}

function formatShortDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ClientHomeTab({ client, chats, onOpenChat, projectPlans = [], onImportProjectPlan, onResolveAmbiguity, onPrepBrief }: ClientHomeTabProps) {
  const [showMoreActivity, setShowMoreActivity] = useState(false);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const meta = clientMeta[client.id];
  const homeData = getClientHomeData(client.id);
  const nextMeeting = getNextClientMeeting(client.id);
  const meetingPrep = nextMeeting ? getMeetingPrep(nextMeeting.id) : null;
  const deadlines = getClientDeadlines(client.id);

  const visibleTeam = showMoreActivity ? homeData.recentActivity.team : homeData.recentActivity.team.slice(0, 3);
  const visibleAgents = showMoreActivity ? homeData.recentActivity.agents : homeData.recentActivity.agents.slice(0, 3);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-background p-8">
      {/* Client header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg font-semibold text-primary">
            {client.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-semibold">{client.name}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {meta && (
                <>
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
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

      {/* --- Next Meeting + Deadlines --- */}
      {(nextMeeting || deadlines.length > 0) && (
        <div className="mb-6 grid grid-cols-5 gap-6">
          {/* Next Meeting */}
          {nextMeeting && (
            <div className={`${deadlines.length > 0 ? "col-span-3" : "col-span-5"} rounded-lg border border-border bg-card`}>
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Next Meeting</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                    {formatEventTime(nextMeeting)}
                  </span>
                </div>
              </div>
              <div className="px-5 py-4">
                <h4 className="text-sm font-medium">{nextMeeting.title}</h4>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                  {nextMeeting.location && <span>{nextMeeting.location}</span>}
                  {nextMeeting.duration && <span>{nextMeeting.duration}</span>}
                  {nextMeeting.attendees && nextMeeting.attendees.length > 0 && (
                    <span>with {nextMeeting.attendees.join(", ")}</span>
                  )}
                </div>
                {nextMeeting.description && (
                  <p className="mt-2 text-sm text-muted-foreground">{nextMeeting.description}</p>
                )}

                {/* AI Prep Card */}
                {meetingPrep && (
                  <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
                    <div className="mb-2 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-semibold text-primary">AI Prep Ready</span>
                      <span className="ml-auto text-[11px] text-muted-foreground">
                        {meetingPrep.openItems} open item{meetingPrep.openItems !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {meetingPrep.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                          {h}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => onPrepBrief?.(client.id)}
                      className="mt-2.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Prep Full Brief
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Deadlines */}
          {deadlines.length > 0 && (
            <div className={`${nextMeeting ? "col-span-2" : "col-span-5"} rounded-lg border border-border bg-card`}>
              <div className="flex items-center gap-2 border-b border-border px-5 py-3">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-semibold uppercase tracking-wide">Deadlines</span>
              </div>
              <div className="divide-y divide-border">
                {deadlines.map((dl) => {
                  const urgency = getDeadlineUrgency(dl);
                  const urgencyClass = urgency === "today" ? "bg-red-500/15 text-red-400"
                    : urgency === "urgent" ? "bg-amber-500/15 text-amber-400"
                    : "bg-blue-500/15 text-blue-400";
                  return (
                    <div key={dl.id} className="flex items-center gap-3 px-5 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{dl.complianceCategory || dl.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{dl.description}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${urgencyClass}`}>
                        {formatDaysUntil(dl)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- Needs Attention --- */}
      {homeData.attentionItems.length > 0 && (
        <div className="mb-6 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-5 py-3">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-wide">Needs Attention</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[11px] font-semibold text-foreground/70">
              {homeData.attentionItems.length}
            </span>
          </div>
          <div className="divide-y divide-border">
            {homeData.attentionItems.map((item) => {
              const sev = severityConfig[item.severity];
              return (
                <div key={item.id} className="flex items-start gap-4 px-5 py-4">
                  <span className={`mt-0.5 w-[72px] shrink-0 rounded px-2 py-0.5 text-center text-[11px] font-bold uppercase ${sev.className}`}>
                    {sev.label}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{item.description}</p>
                    {item.lastSeen ? (
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white ${item.lastSeen.color}`}>
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
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-wide">Recent Chats</span>
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
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-wide">Active Plans</span>
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

      {/* --- Project Plans --- */}
      <div className="mb-6 rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wide">Project Plans</span>
            {projectPlans.length > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[11px] font-semibold text-foreground/70">
                {projectPlans.length}
              </span>
            )}
          </div>
          <button
            onClick={() => setImportDialogOpen(true)}
            className="flex items-center gap-1.5 rounded-md border border-primary/50 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
          >
            <Upload className="h-3 w-3" />
            Import
          </button>
        </div>

        {projectPlans.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-5 py-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <FileText className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">No project plans yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Import a project plan to track phases, milestones, and deadlines
              </p>
            </div>
            <button
              onClick={() => setImportDialogOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Upload className="h-3 w-3" />
              Import your first project plan
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {projectPlans.map((plan) => {
              const phaseInfo = getCurrentPhaseName(plan);
              const nextMs = getNextMilestone(plan);
              const unresolvedCount = plan.ambiguousItems.filter((a) => !a.resolved).length;
              const isExpanded = expandedPlanId === plan.id;
              const completedPhases = plan.phases.filter((p) => p.status === "completed").length;
              const phasePct = plan.phases.length > 0 ? (completedPhases / plan.phases.length) * 100 : 0;

              return (
                <div key={plan.id}>
                  <button
                    onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
                    className="flex w-full items-start gap-3 px-5 py-3 text-left transition-colors hover:bg-accent"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{plan.title}</span>
                        {unresolvedCount > 0 && (
                          <span className="flex items-center gap-0.5 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">
                            <AlertTriangle className="h-2.5 w-2.5" />
                            {unresolvedCount}
                          </span>
                        )}
                      </div>
                      {plan.sourceFileName && (
                        <p className="mt-0.5 text-[11px] text-muted-foreground">{plan.sourceFileName}</p>
                      )}
                      {/* Phase progress */}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1.5 w-24 rounded-full bg-border">
                          <div
                            className="h-1.5 rounded-full bg-blue-500 transition-all"
                            style={{ width: `${phasePct}%` }}
                          />
                        </div>
                        {phaseInfo && (
                          <span className="text-xs text-muted-foreground">
                            Phase {phaseInfo.index} of {phaseInfo.total} — {phaseInfo.current}
                          </span>
                        )}
                      </div>
                      {/* Next milestone */}
                      {nextMs && (
                        <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <CalendarDays className="h-3 w-3" />
                          Next: {nextMs.title}
                          <span className="text-foreground/70">{formatShortDate(nextMs.date)}</span>
                        </p>
                      )}
                    </div>
                    <ChevronDown
                      className={`mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isExpanded && (
                    <ProjectPlanTimeline
                      plan={plan}
                      onCollapse={() => setExpandedPlanId(null)}
                      onResolveAmbiguity={onResolveAmbiguity}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Import dialog */}
      <ProjectPlanImportDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        clientId={client.id}
        clientName={client.name}
        onImport={onImportProjectPlan || (() => {})}
      />

      {/* --- Recent Activity --- */}
      <div className="mb-2">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-semibold uppercase tracking-wide">Recent Activity</span>
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
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Team</span>
              </div>
              <div className="divide-y divide-border">
                {visibleTeam.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 px-5 py-2.5">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${item.color}`}>
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
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Agents</span>
              </div>
              <div className="divide-y divide-border">
                {visibleAgents.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 px-5 py-2.5">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${item.color}`}>
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
