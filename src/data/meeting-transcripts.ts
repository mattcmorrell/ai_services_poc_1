// Mock Google Meet / Zoom structured meeting summaries
// In production, these come from the Google Meet API or Zoom API
// We use the structured output (decisions, action items, key topics) — not raw transcripts

export interface MeetingDecision {
  text: string;
  madeBy?: string;
}

export interface MeetingActionItem {
  text: string;
  assignee?: string;
  dueDate?: string;
  /** ID of an existing action plan this maps to, if any */
  linkedPlanId?: string;
}

export interface MeetingTranscriptSummary {
  id: string;
  /** Calendar event ID this is linked to */
  calendarEventId: string;
  /** Client ID */
  clientId: string;
  /** When the meeting happened */
  meetingDate: Date;
  /** Meeting title */
  title: string;
  /** Duration in minutes */
  durationMinutes: number;
  /** Attendees */
  attendees: string[];
  /** High-level summary (1-3 sentences) */
  summary: string;
  /** Key topics discussed */
  keyTopics: string[];
  /** Decisions made during the meeting */
  decisions: MeetingDecision[];
  /** Action items captured */
  actionItems: MeetingActionItem[];
  /** Open questions that weren't resolved */
  unresolvedQuestions: string[];
  /** Source: "google_meet" | "zoom" | "manual" */
  source: "google_meet" | "zoom" | "manual";
}

function daysAgo(d: number, hour = 10, min = 0): Date {
  const date = new Date();
  date.setDate(date.getDate() - d);
  date.setHours(hour, min, 0, 0);
  return date;
}

// ─── Mock Meeting Summaries ───

export const mockMeetingTranscripts: MeetingTranscriptSummary[] = [
  // Black Mesa — last week's benefits check-in
  {
    id: "transcript-1",
    calendarEventId: "past-cal-1",
    clientId: "4",
    meetingDate: daysAgo(7, 12, 30),
    title: "Benefits Enrollment Check-in",
    durationMinutes: 40,
    attendees: ["Dr. Eli Vance", "Gordon Freeman", "You"],
    summary:
      "Reviewed benefits enrollment progress (was at 62%). Discussed dental plan options — client undecided between tier 1 and tier 2. Agreed to push enrollment deadline reminder to remaining employees.",
    keyTopics: [
      "Benefits enrollment progress",
      "Dental plan tier selection",
      "Employee communication plan",
    ],
    decisions: [
      { text: "Send enrollment reminder to all unenrolled employees by EOW", madeBy: "You" },
      { text: "Defer dental plan tier decision to next meeting — need cost comparison", madeBy: "Dr. Eli Vance" },
    ],
    actionItems: [
      {
        text: "Prepare dental plan tier 1 vs tier 2 cost comparison",
        assignee: "You",
        dueDate: "Before next meeting",
      },
      {
        text: "Send enrollment reminder email to 18 unenrolled employees",
        assignee: "You",
        dueDate: "End of week",
      },
      {
        text: "Share updated benefits guide PDF with Gordon",
        assignee: "You",
        dueDate: "Tomorrow",
      },
    ],
    unresolvedQuestions: [
      "Which dental plan tier to go with? Needs cost comparison first.",
      "Should we extend the enrollment window if participation stays below 80%?",
    ],
    source: "google_meet",
  },

  // Black Mesa — payroll sync 2 weeks ago
  {
    id: "transcript-2",
    calendarEventId: "past-cal-2",
    clientId: "4",
    meetingDate: daysAgo(14, 9, 0),
    title: "January Payroll Kickoff",
    durationMinutes: 25,
    attendees: ["Dr. Eli Vance", "You"],
    summary:
      "Kicked off January payroll planning. Confirmed 47 active employees. Discussed Maria Chen's prorated start and Leon Webb's termination with PTO payout. Eli flagged that Jeff Hardy might have timesheet issues.",
    keyTopics: [
      "January payroll timeline",
      "New hire proration (Maria Chen)",
      "Termination final check (Leon Webb)",
      "Potential timesheet issue (Jeff Hardy)",
    ],
    decisions: [
      { text: "Pay date confirmed as Feb 5 for Jan 16-31 period", madeBy: "Dr. Eli Vance" },
      { text: "Include Leon Webb's 42hr PTO payout in final check", madeBy: "You" },
    ],
    actionItems: [
      {
        text: "Run payroll for January with 47 employees",
        assignee: "You",
        linkedPlanId: "plan-1",
      },
      {
        text: "Follow up with Jeff Hardy's manager about timesheet submission",
        assignee: "Dr. Eli Vance",
      },
      {
        text: "Calculate Maria Chen's prorated salary for 8 working days",
        assignee: "Payroll Runner agent",
      },
    ],
    unresolvedQuestions: [
      "Will Jeff Hardy's timesheet be submitted in time for this payroll run?",
    ],
    source: "google_meet",
  },

  // Cyberdyne Systems — last week's check-in
  {
    id: "transcript-3",
    calendarEventId: "past-cal-3",
    clientId: "5",
    meetingDate: daysAgo(7, 14, 0),
    title: "Weekly Check-in",
    durationMinutes: 28,
    attendees: ["Miles Dyson", "You"],
    summary:
      "AI integration pilot update: 2 of 4 departments now live. Engineering and R&D are onboarded. Operations and HR still pending. Discussed data access policy concerns raised by legal team.",
    keyTopics: [
      "AI pilot rollout status",
      "Data access policy concerns",
      "I-9 verification for new hires",
    ],
    decisions: [
      { text: "Pause Operations department rollout until data policy is finalized", madeBy: "Miles Dyson" },
      { text: "Prioritize I-9 completion for 3 new hires before Friday deadline", madeBy: "You" },
    ],
    actionItems: [
      {
        text: "Draft data access policy for AI tools — share with legal by Thursday",
        assignee: "You",
      },
      {
        text: "Complete I-9 Section 2 for Chen, Park, and Williams",
        assignee: "You",
        dueDate: "Friday",
      },
      {
        text: "Schedule meeting with Operations lead for rollout planning",
        assignee: "Miles Dyson",
      },
    ],
    unresolvedQuestions: [
      "What level of employee data access should AI tools have?",
      "Timeline for Operations department rollout?",
    ],
    source: "zoom",
  },

  // Aperture Science — quarterly review 3 months ago
  {
    id: "transcript-4",
    calendarEventId: "past-cal-4",
    clientId: "1",
    meetingDate: daysAgo(90, 14, 0),
    title: "Q3 Quarterly Review",
    durationMinutes: 55,
    attendees: ["Cave Johnson", "Caroline", "You"],
    summary:
      "Comprehensive Q3 review. Headcount grew from 298 to 312. Training completion rate at 91%. Cave raised concerns about compensation competitiveness in the Cleveland market. Agreed to run a compensation analysis.",
    keyTopics: [
      "Q3 headcount changes",
      "Training completion rates",
      "Compensation competitiveness",
      "Benefits utilization review",
    ],
    decisions: [
      { text: "Run full compensation market analysis before Q4 review", madeBy: "Cave Johnson" },
      { text: "Extend portal gun safety recertification deadline by 2 weeks", madeBy: "Caroline" },
      { text: "Approve 5 open compensation adjustment requests from Q3", madeBy: "Cave Johnson" },
    ],
    actionItems: [
      {
        text: "Compile Q4 compensation market analysis for 312 employees",
        assignee: "You",
        dueDate: "Before Q4 review",
      },
      {
        text: "Process 5 approved compensation adjustments",
        assignee: "Payroll Runner agent",
      },
      {
        text: "Update training portal with new safety recertification deadline",
        assignee: "Caroline",
      },
    ],
    unresolvedQuestions: [
      "Are we losing candidates to competitors on compensation? Need data.",
      "Should we adjust benefits package to be more competitive?",
    ],
    source: "google_meet",
  },

  // Weyland-Yutani — onboarding meeting
  {
    id: "transcript-5",
    calendarEventId: "past-cal-5",
    clientId: "3",
    meetingDate: daysAgo(21, 11, 0),
    title: "New Hire Onboarding Planning",
    durationMinutes: 35,
    attendees: ["Carter Burke", "You"],
    summary:
      "Planned onboarding for 5 new Gateway Station employees starting next month. Discussed remote onboarding challenges for space station postings. Burke confirmed 2 terminations that need COBRA notices sent within the 44-day window.",
    keyTopics: [
      "Batch onboarding for 5 new hires",
      "Remote/space station onboarding process",
      "COBRA notices for 2 terminated employees",
    ],
    decisions: [
      { text: "Use virtual onboarding flow for all 5 Gateway Station hires", madeBy: "Carter Burke" },
      { text: "Send COBRA notices immediately — 44-day window is tight", madeBy: "You" },
    ],
    actionItems: [
      {
        text: "Prepare onboarding packets for 5 Gateway Station employees",
        assignee: "You",
      },
      {
        text: "Send COBRA continuation notices to 2 terminated employees",
        assignee: "You",
        dueDate: "ASAP — 44-day window",
      },
      {
        text: "Confirm Gateway Station has digital signature capability for I-9s",
        assignee: "Carter Burke",
      },
    ],
    unresolvedQuestions: [
      "Can I-9 Section 2 be completed remotely for space station employees?",
    ],
    source: "google_meet",
  },
];

// ─── Query Helpers ───

/** Get all transcript summaries for a client, sorted newest first */
export function getClientTranscripts(clientId: string): MeetingTranscriptSummary[] {
  return mockMeetingTranscripts
    .filter((t) => t.clientId === clientId)
    .sort((a, b) => b.meetingDate.getTime() - a.meetingDate.getTime());
}

/** Get the most recent transcript for a client */
export function getLatestClientTranscript(clientId: string): MeetingTranscriptSummary | null {
  const transcripts = getClientTranscripts(clientId);
  return transcripts[0] ?? null;
}

/** Get all unresolved questions across a client's meetings */
export function getUnresolvedQuestions(clientId: string): string[] {
  return getClientTranscripts(clientId).flatMap((t) => t.unresolvedQuestions);
}

/** Get all open action items across a client's meetings */
export function getOpenActionItems(clientId: string): MeetingActionItem[] {
  return getClientTranscripts(clientId).flatMap((t) => t.actionItems);
}
