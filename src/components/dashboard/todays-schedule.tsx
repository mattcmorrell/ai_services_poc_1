"use client";

import { Clock, Video, MapPin, RefreshCw, AlertTriangle, Sparkles } from "lucide-react";
import { CalendarEvent, MeetingPrepData, getTodayEvents, getMeetingPrep, formatEventTime } from "@/data/calendar-data";
import { mockClients } from "@/data/mock-data";

interface TodaysScheduleProps {
  onPrepClick?: (event: CalendarEvent) => void;
}

const typeConfig: Record<string, { dotClass: string; label: string }> = {
  meeting: { dotClass: "bg-primary", label: "Meeting" },
  checkin: { dotClass: "bg-emerald-500", label: "Check-in" },
  deadline: { dotClass: "bg-amber-500", label: "Deadline" },
  block: { dotClass: "bg-muted-foreground/40", label: "Focus" },
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
    .replace(" AM", "a").replace(" PM", "p");
}

function isHappeningNow(event: CalendarEvent): boolean {
  const now = new Date();
  if (!event.endTime) return false;
  return event.startTime <= now && event.endTime > now;
}

function EventItem({ event, prep, onPrepClick }: { event: CalendarEvent; prep: MeetingPrepData | null; onPrepClick?: (event: CalendarEvent) => void }) {
  const config = typeConfig[event.type] || typeConfig.meeting;
  const now = isHappeningNow(event);
  const clientName = event.clientId ? mockClients.find((c) => c.id === event.clientId)?.name : null;

  return (
    <div className="flex gap-3 border-b border-border px-1 py-3 last:border-b-0">
      <div className="flex flex-col items-center gap-1 pt-0.5">
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${config.dotClass} ${now ? "ring-2 ring-primary/30" : ""}`}
        />
      </div>
      <div className="min-w-[52px] shrink-0 pt-0.5">
        <span className={`text-xs font-medium ${now ? "text-primary" : "text-muted-foreground"}`}>
          {now ? "Now" : event.type === "deadline" ? "EOD" : formatTime(event.startTime)}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{event.title}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
          {event.location && (
            <span className="flex items-center gap-1">
              {event.location === "In-person" ? <MapPin className="h-3 w-3" /> : <Video className="h-3 w-3" />}
              {event.location}
            </span>
          )}
          {event.duration && <span>{event.duration}</span>}
          {event.recurring && (
            <span className="flex items-center gap-1">
              <RefreshCw className="h-3 w-3" />
              Recurring
            </span>
          )}
          {event.attendees && event.attendees.length > 0 && (
            <span>with {event.attendees[0]}{event.attendees.length > 1 ? ` +${event.attendees.length - 1}` : ""}</span>
          )}
          {event.type === "deadline" && event.affectedCount && (
            <span className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-amber-400" />
              {event.affectedCount} employees
            </span>
          )}
        </div>
        {clientName && (
          <p className="mt-0.5 text-xs text-muted-foreground/70">{clientName}</p>
        )}

        {/* AI Prep Card */}
        {prep && (
          <div className="mt-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
            <div className="mb-1.5 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-xs font-semibold text-primary">AI Prep Ready</span>
              {onPrepClick && (
                <button
                  onClick={() => onPrepClick(event)}
                  className="ml-auto text-[11px] font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Open
                </button>
              )}
            </div>
            <ul className="space-y-0.5">
              {prep.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export function TodaysSchedule({ onPrepClick }: TodaysScheduleProps) {
  const events = getTodayEvents();

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">Today&apos;s Schedule</h3>
        <span className="text-xs text-muted-foreground">{events.length} events</span>
      </div>
      {events.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">No events today</p>
      ) : (
        <div>
          {events.map((event) => (
            <EventItem
              key={event.id}
              event={event}
              prep={getMeetingPrep(event.id)}
              onPrepClick={onPrepClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
