"use client";

import { useState } from "react";
import {
  ChevronUp,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Pencil,
} from "lucide-react";
import { ProjectPlan, ProjectPhase, DateConfidence, AmbiguousItem } from "@/types/project-plan";

const phaseColors: Record<string, string> = {
  completed: "border-emerald-500",
  in_progress: "border-blue-500",
  not_started: "border-zinc-500",
};

const phaseStatusBadge: Record<string, { label: string; className: string }> = {
  completed: { label: "Complete", className: "bg-emerald-500/15 text-emerald-400" },
  in_progress: { label: "In Progress", className: "bg-blue-500/15 text-blue-400" },
  not_started: { label: "Not Started", className: "bg-zinc-500/15 text-zinc-400" },
};

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function ConfidenceIndicator({ confidence }: { confidence: DateConfidence }) {
  if (confidence === "exact") return null;
  if (confidence === "ambiguous") {
    return (
      <span className="ml-1.5 inline-flex items-center gap-0.5 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">
        <AlertTriangle className="h-2.5 w-2.5" />
        Ambiguous
      </span>
    );
  }
  return (
    <span className="ml-1.5 inline-flex items-center gap-0.5 rounded-full bg-zinc-500/15 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
      Inferred
    </span>
  );
}

function TodayMarker() {
  return (
    <div className="relative my-2 flex items-center gap-2">
      <div className="h-px flex-1 bg-red-500/60" />
      <span className="shrink-0 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400">
        Today
      </span>
      <div className="h-px flex-1 bg-red-500/60" />
    </div>
  );
}

interface ProjectPlanTimelineProps {
  plan: ProjectPlan;
  onCollapse: () => void;
  onResolveAmbiguity?: (planId: string, itemId: string, resolvedValue: string) => void;
}

export function ProjectPlanTimeline({ plan, onCollapse, onResolveAmbiguity }: ProjectPlanTimelineProps) {
  const [editingAmbiguity, setEditingAmbiguity] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const today = new Date().toISOString().split("T")[0];

  // Determine where "today" marker goes: between which phases
  const todayPhaseIndex = plan.phases.findIndex(
    (p) => p.startDate <= today && p.endDate >= today
  );

  const unresolvedCount = plan.ambiguousItems.filter((a) => !a.resolved).length;

  const handleSaveAmbiguity = (itemId: string) => {
    if (editValue && onResolveAmbiguity) {
      onResolveAmbiguity(plan.id, itemId, editValue);
    }
    setEditingAmbiguity(null);
    setEditValue("");
  };

  return (
    <div className="border-t border-border bg-card/50 px-5 py-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold">{plan.title} Timeline</h4>
          {unresolvedCount > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-400">
              <AlertTriangle className="h-3 w-3" />
              {unresolvedCount} ambiguous
            </span>
          )}
        </div>
        <button
          onClick={onCollapse}
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Collapse <ChevronUp className="h-3 w-3" />
        </button>
      </div>

      {/* Phase timeline */}
      <div className="space-y-0">
        {plan.phases.map((phase, idx) => {
          const statusCfg = phaseStatusBadge[phase.status];
          const borderColor = phaseColors[phase.status];
          const showTodayBefore = idx === todayPhaseIndex && phase.status === "in_progress";
          const showTodayAfterPrev =
            todayPhaseIndex === -1 &&
            idx > 0 &&
            plan.phases[idx - 1].endDate < today &&
            phase.startDate > today;

          return (
            <div key={phase.id}>
              {showTodayAfterPrev && <TodayMarker />}
              <div className={`border-l-2 ${borderColor} py-3 pl-4`}>
                {showTodayBefore && <TodayMarker />}
                {/* Phase header */}
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-sm font-medium">{phase.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusCfg.className}`}>
                    {statusCfg.label}
                  </span>
                </div>
                {/* Date range */}
                <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {formatDate(phase.startDate)}
                  <ConfidenceIndicator confidence={phase.startDateConfidence} />
                  <span className="mx-1">-</span>
                  {formatDate(phase.endDate)}
                  <ConfidenceIndicator confidence={phase.endDateConfidence} />
                </div>
                {phase.description && (
                  <p className="mb-2 text-xs text-muted-foreground/70">{phase.description}</p>
                )}
                {/* Milestones */}
                <div className="space-y-1.5">
                  {phase.milestones.map((ms) => (
                    <div key={ms.id} className="flex items-center gap-2">
                      {ms.completed ? (
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                      ) : (
                        <Circle className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
                      )}
                      <span className={`text-xs ${ms.completed ? "text-muted-foreground line-through" : ""}`}>
                        {ms.title}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{formatDate(ms.date)}</span>
                      <ConfidenceIndicator confidence={ms.dateConfidence} />
                      {ms.originalText && ms.dateConfidence !== "exact" && (
                        <span className="text-[10px] italic text-muted-foreground/50">
                          &quot;{ms.originalText}&quot;
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ambiguous items section */}
      {plan.ambiguousItems.filter((a) => !a.resolved).length > 0 && (
        <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
          <h5 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            Dates Needing Review
          </h5>
          <div className="space-y-2">
            {plan.ambiguousItems
              .filter((a) => !a.resolved)
              .map((item) => (
                <div key={item.id} className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-3 w-3 shrink-0 text-amber-400/60" />
                  <div className="flex-1">
                    <p className="text-xs">{item.description}</p>
                    <p className="text-[11px] text-muted-foreground">
                      Original: &quot;{item.originalText}&quot;
                      {item.suggestedValue && <> &middot; Suggested: {formatDate(item.suggestedValue)}</>}
                    </p>
                  </div>
                  {editingAmbiguity === item.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="date"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="rounded border border-border bg-background px-2 py-1 text-xs"
                      />
                      <button
                        onClick={() => handleSaveAmbiguity(item.id)}
                        className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingAmbiguity(item.id);
                        setEditValue(item.suggestedValue || "");
                      }}
                      className="flex shrink-0 items-center gap-1 rounded border border-border px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Pencil className="h-2.5 w-2.5" /> Set date
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Source info */}
      {plan.sourceFileName && (
        <div className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground/50">
          Source: {plan.sourceFileName} &middot; Imported {formatDate(plan.importedAt.split("T")[0])} &middot; v{plan.version}
        </div>
      )}
    </div>
  );
}
