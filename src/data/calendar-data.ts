// Mock calendar data — simulates events synced from Google Calendar / Outlook
// Dates are relative to "now" so the prototype always looks current

export type CalendarEventType = "meeting" | "deadline" | "checkin" | "block";

export interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  /** Client ID from mock-data.ts, or null for personal events */
  clientId: string | null;
  /** When the event starts (or is due, for deadlines) */
  startTime: Date;
  /** When the event ends — null for deadlines */
  endTime: Date | null;
  /** e.g. "Google Meet", "Zoom", "In-person" */
  location?: string;
  /** Duration label, e.g. "45 min" */
  duration?: string;
  /** External attendees */
  attendees?: string[];
  /** Short description or agenda */
  description?: string;
  /** Whether this is a recurring event */
  recurring?: boolean;
  /** For deadlines: compliance category */
  complianceCategory?: string;
  /** For deadlines: number of affected employees */
  affectedCount?: number;
}

export interface MeetingPrepData {
  eventId: string;
  highlights: string[];
  openItems: number;
  lastMeetingDate?: Date;
}

// ─── Helper to create dates relative to now ───

function hoursFromNow(h: number): Date {
  return new Date(Date.now() + h * 60 * 60 * 1000);
}

function daysFromNow(d: number, hour = 9, min = 0): Date {
  const date = new Date();
  date.setDate(date.getDate() + d);
  date.setHours(hour, min, 0, 0);
  return date;
}

function todayAt(hour: number, min = 0): Date {
  const date = new Date();
  date.setHours(hour, min, 0, 0);
  return date;
}

// ─── Mock Events ───

export const mockCalendarEvents: CalendarEvent[] = [
  // Today
  {
    id: "cal-1",
    title: "Focus Time - Client Reviews",
    type: "block",
    clientId: null,
    startTime: todayAt(9, 0),
    endTime: todayAt(11, 0),
    duration: "2 hr",
  },
  {
    id: "cal-2",
    title: "Benefits Enrollment Review",
    type: "meeting",
    clientId: "4", // Black Mesa
    startTime: hoursFromNow(2),
    endTime: hoursFromNow(2.75),
    location: "Google Meet",
    duration: "45 min",
    attendees: ["Dr. Eli Vance", "Gordon Freeman"],
    description: "Review open enrollment progress, address dental plan tier question",
  },
  {
    id: "cal-3",
    title: "Weekly Check-in",
    type: "checkin",
    clientId: "5", // Cyberdyne Systems
    startTime: todayAt(14, 0),
    endTime: todayAt(14, 30),
    location: "Zoom",
    duration: "30 min",
    attendees: ["Miles Dyson"],
    recurring: true,
  },
  {
    id: "cal-4",
    title: "COBRA Notice Deadline",
    type: "deadline",
    clientId: "3", // Weyland-Yutani
    startTime: todayAt(17, 0),
    endTime: null,
    complianceCategory: "COBRA",
    affectedCount: 2,
    description: "44-day notification window closes today for 2 terminated employees",
  },

  // Tomorrow
  {
    id: "cal-5",
    title: "Payroll Sync",
    type: "meeting",
    clientId: "4", // Black Mesa
    startTime: daysFromNow(1, 9, 0),
    endTime: daysFromNow(1, 9, 30),
    location: "Google Meet",
    duration: "30 min",
    attendees: ["Dr. Eli Vance"],
  },
  {
    id: "cal-6",
    title: "I-9 Verification Deadline",
    type: "deadline",
    clientId: "5", // Cyberdyne Systems
    startTime: daysFromNow(2, 17, 0),
    endTime: null,
    complianceCategory: "I-9",
    affectedCount: 3,
    description: "Section 2 completion required for 3 new hires",
  },

  // This week
  {
    id: "cal-7",
    title: "Quarterly Performance Review",
    type: "meeting",
    clientId: "1", // Aperture Science
    startTime: daysFromNow(3, 14, 0),
    endTime: daysFromNow(3, 15, 0),
    location: "In-person",
    duration: "1 hr",
    attendees: ["Cave Johnson", "Caroline"],
    description: "Q4 performance review and compensation planning",
  },
  {
    id: "cal-8",
    title: "Open Enrollment Window Closes",
    type: "deadline",
    clientId: "2", // Umbrella Corporation
    startTime: daysFromNow(5, 17, 0),
    endTime: null,
    complianceCategory: "Benefits",
    affectedCount: 12,
    description: "12 of 47 employees have not completed enrollment",
  },

  // Next week
  {
    id: "cal-9",
    title: "Compliance Audit Prep",
    type: "meeting",
    clientId: "6", // Tyrell Corporation
    startTime: daysFromNow(7, 10, 0),
    endTime: daysFromNow(7, 11, 0),
    location: "Zoom",
    duration: "1 hr",
    attendees: ["Eldon Tyrell"],
    description: "Annual compliance audit preparation and document review",
  },
  {
    id: "cal-10",
    title: "Onboarding Kickoff",
    type: "meeting",
    clientId: "3", // Weyland-Yutani
    startTime: daysFromNow(8, 11, 0),
    endTime: daysFromNow(8, 12, 0),
    location: "Google Meet",
    duration: "1 hr",
    attendees: ["Carter Burke", "Ellen Ripley"],
    description: "New batch of 5 employees starting in Gateway Station",
  },
];

// ─── Mock Prep Data (pre-computed by "AI") ───

export const mockMeetingPrep: MeetingPrepData[] = [
  {
    eventId: "cal-2",
    highlights: [
      "Benefits enrollment: 78% complete (up from 62%)",
      "3 pending action items from last meeting",
      "Open question: dental plan tier selection",
    ],
    openItems: 3,
    lastMeetingDate: daysFromNow(-7),
  },
  {
    eventId: "cal-3",
    highlights: [
      "AI integration pilot: on track, 2 of 4 departments live",
      "1 open action item: finalize data access policy",
    ],
    openItems: 1,
    lastMeetingDate: daysFromNow(-7),
  },
  {
    eventId: "cal-7",
    highlights: [
      "Q4 performance data compiled for all 312 employees",
      "5 compensation adjustment requests pending review",
      "Training completion rate: 94%",
    ],
    openItems: 5,
    lastMeetingDate: daysFromNow(-90),
  },
];

// ─── Query Helpers ───

/** Get events for a specific client */
export function getClientEvents(clientId: string): CalendarEvent[] {
  return mockCalendarEvents
    .filter((e) => e.clientId === clientId)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
}

/** Get the next upcoming event for a client */
export function getNextClientEvent(clientId: string): CalendarEvent | null {
  const now = new Date();
  return getClientEvents(clientId).find((e) => e.startTime > now) ?? null;
}

/** Get the next upcoming meeting for a client */
export function getNextClientMeeting(clientId: string): CalendarEvent | null {
  const now = new Date();
  return getClientEvents(clientId).find(
    (e) => (e.type === "meeting" || e.type === "checkin") && e.startTime > now
  ) ?? null;
}

/** Get all deadlines for a client */
export function getClientDeadlines(clientId: string): CalendarEvent[] {
  return getClientEvents(clientId).filter((e) => e.type === "deadline");
}

/** Get prep data for an event */
export function getMeetingPrep(eventId: string): MeetingPrepData | null {
  return mockMeetingPrep.find((p) => p.eventId === eventId) ?? null;
}

/** Get today's events (all clients) */
export function getTodayEvents(): CalendarEvent[] {
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  return mockCalendarEvents
    .filter((e) => e.startTime >= startOfDay && e.startTime <= endOfDay)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
}

/** Get upcoming deadlines across all clients, sorted by soonest */
export function getUpcomingDeadlines(limit = 5): CalendarEvent[] {
  const now = new Date();
  return mockCalendarEvents
    .filter((e) => e.type === "deadline" && e.startTime >= new Date(now.getFullYear(), now.getMonth(), now.getDate()))
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    .slice(0, limit);
}

/** Get the soonest meeting across all clients that's within `withinHours` */
export function getProactivePrepEvent(withinHours = 3): { event: CalendarEvent; prep: MeetingPrepData | null } | null {
  const now = new Date();
  const cutoff = new Date(now.getTime() + withinHours * 60 * 60 * 1000);

  const upcoming = mockCalendarEvents
    .filter((e) => (e.type === "meeting" || e.type === "checkin") && e.startTime > now && e.startTime <= cutoff)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  if (upcoming.length === 0) return null;

  const event = upcoming[0];
  return { event, prep: getMeetingPrep(event.id) };
}

/** Format relative time for an event */
export function formatEventTime(event: CalendarEvent): string {
  const now = new Date();
  const diffMs = event.startTime.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / (1000 * 60));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  if (diffMs < 0) {
    // Event is in the past or happening now
    const endTime = event.endTime;
    if (endTime && endTime > now) return "Now";
    return "Earlier";
  }

  if (diffMins < 60) return `in ${diffMins}m`;
  if (diffHours < 24) return `in ${diffHours}h`;

  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (days === 1) return "Tomorrow";
  if (days < 7) {
    return event.startTime.toLocaleDateString("en-US", { weekday: "short" });
  }
  return event.startTime.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Format deadline urgency */
export function getDeadlineUrgency(event: CalendarEvent): "today" | "urgent" | "soon" | "upcoming" {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((event.startTime.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "today";
  if (diffDays <= 2) return "urgent";
  if (diffDays <= 5) return "soon";
  return "upcoming";
}

/** Format days until deadline */
export function formatDaysUntil(event: CalendarEvent): string {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((event.startTime.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return `${diffDays} days`;
}
