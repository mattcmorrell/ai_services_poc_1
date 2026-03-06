"use client";

import { AlertTriangle, Clock, ShieldAlert, FileCheck } from "lucide-react";
import { getUpcomingDeadlines, getDeadlineUrgency, formatDaysUntil } from "@/data/calendar-data";
import { mockClients } from "@/data/mock-data";

const urgencyStyles: Record<string, { badge: string; icon: string }> = {
  today: { badge: "bg-red-500/15 text-red-400", icon: "bg-red-500/15 text-red-400" },
  urgent: { badge: "bg-amber-500/15 text-amber-400", icon: "bg-amber-500/15 text-amber-400" },
  soon: { badge: "bg-blue-500/15 text-blue-400", icon: "bg-blue-500/15 text-blue-400" },
  upcoming: { badge: "bg-muted text-muted-foreground", icon: "bg-muted text-muted-foreground" },
};

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  COBRA: ShieldAlert,
  "I-9": FileCheck,
  Benefits: Clock,
};

export function UpcomingDeadlines() {
  const deadlines = getUpcomingDeadlines(5);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">Upcoming Deadlines</h3>
      </div>
      {deadlines.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">No upcoming deadlines</p>
      ) : (
        <div className="space-y-1">
          {deadlines.map((event) => {
            const urgency = getDeadlineUrgency(event);
            const styles = urgencyStyles[urgency];
            const clientName = event.clientId ? mockClients.find((c) => c.id === event.clientId)?.name : null;
            const IconComponent = (event.complianceCategory && categoryIcons[event.complianceCategory]) || AlertTriangle;

            return (
              <div key={event.id} className="flex items-center gap-3 rounded-lg p-2">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${styles.icon}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {event.complianceCategory ? `${event.complianceCategory} — ` : ""}
                    {clientName || event.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {event.description || event.title}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles.badge}`}>
                  {formatDaysUntil(event)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
