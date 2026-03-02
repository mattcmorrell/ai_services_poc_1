import { Client, Message, Chat, Artifact, ActionPlan } from "@/types/chat";

export const mockClients: Client[] = [
  { id: "1", name: "Aperture Science", unreadCount: 6 },
  { id: "2", name: "Umbrella Corporation", unreadCount: 0 },
  { id: "3", name: "Weyland-Yutani", unreadCount: 1 },
  { id: "4", name: "Black Mesa", unreadCount: 4 },
  { id: "5", name: "Cyberdyne Systems", unreadCount: 0 },
  { id: "6", name: "Tyrell Corporation", unreadCount: 2 },
];

const onboardingArtifact: Artifact = {
  id: "artifact-1",
  title: "New Employee Onboarding Checklist",
  type: "list",
  content: `## Pre-Start Date
- [ ] Send offer letter and employment contract
- [ ] Initiate background check
- [ ] Set up workstation and equipment
- [ ] Create email and system accounts
- [ ] Prepare welcome packet

## First Day
- [ ] Office tour and introductions
- [ ] Review company policies and handbook
- [ ] Complete I-9 and W-4 forms
- [ ] Set up direct deposit
- [ ] Assign mentor/buddy

## First Week
- [ ] Benefits enrollment orientation
- [ ] IT systems training
- [ ] Department-specific onboarding
- [ ] Schedule 30/60/90 day check-ins
- [ ] Review job responsibilities and expectations

## First Month
- [ ] Complete all required compliance training
- [ ] First performance check-in
- [ ] Gather initial feedback`,
  createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
};

const payrollActionPlan: ActionPlan = {
  id: "plan-1",
  title: "Run January Payroll for Black Mesa",
  description: "End-to-end payroll processing for 47 active employees, pay period Jan 1–31, 2026.",
  steps: [
    {
      id: "step-1",
      description: "Create payroll run for Jan 1–31",
      status: "completed",
      completedAt: new Date(Date.now() - 4 * 60 * 1000),
      thinkingLog: [
        "Confirmed biweekly pay schedule — this is the second January run (Jan 16-31).",
        "47 active employees on payroll. 2 status changes: Maria Chen started Jan 20 (prorate), Leon Webb terminated Jan 24 (final check needed).",
        "Pay date: Feb 5, 2026.",
      ],
    },
    {
      id: "step-2",
      description: "Collect and validate employee hours and salary data",
      status: "completed",
      completedAt: new Date(Date.now() - 3 * 60 * 1000),
      thinkingLog: [
        "Pulled timesheet data for 31 hourly employees. 16 salaried employees confirmed at current rates.",
        "3 employees had approved PTO overlapping this period — hours adjusted accordingly.",
        "1 missing timesheet flagged: Jeff Hardy — no hours submitted. Escalating to anomaly review.",
        "Leon Webb's final check requires payout of 42 accrued PTO hours at $34.50/hr.",
      ],
    },
    {
      id: "step-3",
      description: "Review individual employees against previous payroll",
      status: "in_progress",
      thinkingLog: [
        "Comparing current period against previous 3 pay periods for all 47 employees.",
        "ANOMALY: Jeff Hardy — 0 hours this period. Previous 3 periods: 84, 80, 82 hours (avg 82 hrs). No PTO request on file, no status change recorded.",
        "ANOMALY: Dr. Eli Vance — 58 overtime hours vs. 3-period average of 12 hrs. That's a 383% increase.",
        "ANOMALY: Barney Calhoun — new HSA deduction of $125/pay period starting this run. Verified against benefits enrollment effective Jan 15.",
        "Remaining 44 employees are within normal variance (<10% from averages).",
      ],
    },
    {
      id: "step-4",
      description: "Review total payroll amounts against previous payrolls",
      status: "pending",
      thinkingLog: [],
    },
    {
      id: "step-5",
      description: "Approve payroll run",
      status: "pending",
      nonUndoable: true,
      thinkingLog: [],
    },
    {
      id: "step-6",
      description: "Approve fund transfer",
      status: "pending",
      nonUndoable: true,
      thinkingLog: [],
    },
    {
      id: "step-7",
      description: "Process direct deposits and generate pay stubs",
      status: "pending",
      nonUndoable: true,
      thinkingLog: [],
    },
    {
      id: "step-8",
      description: "Report and remit payroll taxes",
      status: "pending",
      nonUndoable: true,
      thinkingLog: [],
    },
  ],
  metadata: {
    affectedCount: 47,
    affectedLabel: "employees",
    estimatedTime: "~10 min",
  },
  status: "executing",
};

const payrollMessages: Message[] = [
  {
    id: "msg-p-0",
    role: "user",
    content: "Run payroll for January",
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
  },
  {
    id: "msg-p-1",
    role: "assistant",
    content: "I'll run the January payroll for Black Mesa. This covers the Jan 16–31 pay period on your biweekly schedule, with a pay date of Feb 5. I have 47 active employees to process.\n\nHere's the full plan — every step requires your approval before I proceed:",
    thinking: `Black Mesa is on a biweekly pay schedule. January has two pay periods: Jan 1-15 and Jan 16-31. The user said "January" — I'll run the second period (Jan 16-31) since the first would have already been processed. 47 active employees on file. Pay date would be Feb 5 per the standard biweekly cadence.

This is a high-stakes process — I need to break it into clear steps with gates at every irreversible action. The anomaly review steps (3 and 4) are where I add the most value by catching errors before money moves.`,
    actionPlan: payrollActionPlan,
    timestamp: new Date(Date.now() - 7 * 60 * 1000),
  },
  {
    id: "msg-p-2",
    role: "user",
    content: "Looks good, go ahead",
    timestamp: new Date(Date.now() - 6 * 60 * 1000),
  },
  {
    id: "msg-p-3",
    role: "assistant",
    content: "**Step 1 complete — Payroll run created.**\n\nPay period: Jan 16–31, 2026 · Pay date: Feb 5, 2026\n\n- **47 active employees** included\n- **2 status changes** to note:\n  - **Maria Chen** — started Jan 20, prorated to 8 working days\n  - **Leon Webb** — terminated Jan 24, final check required (includes 42 hrs accrued PTO payout at $34.50/hr)\n\nMoving to Step 2 — collecting hours and salary data.",
    thinking: `Payroll run created. Two notable status changes during this period that will need special handling:

1. Maria Chen is a new hire starting Jan 20 — need to prorate her salary for 8 working days out of the 12 in this period.
2. Leon Webb was terminated Jan 24 — this is his final paycheck. Need to include payout of 42 accrued PTO hours at his rate of $34.50/hr = $1,449.00 added to final check. Also need to handle COBRA notification trigger.

Neither of these blocks proceeding, but both need to be visible to the consultant.`,
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: "msg-p-4",
    role: "assistant",
    content: "**Step 2 complete — Hours and salary data collected.**\n\n| Category | Count | Notes |\n|----------|-------|-------|\n| Hourly employees | 31 | Timesheets pulled |\n| Salaried employees | 16 | Rates confirmed |\n| Approved PTO overlaps | 3 | Hours adjusted |\n| Missing timesheets | 1 | Jeff Hardy — no hours submitted |\n| Final check | 1 | Leon Webb — includes 42 hrs PTO payout |\n\nOne gap: **Jeff Hardy has no timesheet on file for this period.** I'll flag this in the anomaly review next.\n\nMoving to Step 3 — reviewing individual employees against previous payrolls.",
    thinking: `Data collection complete. 31 hourly employees all have timesheets except Jeff Hardy — his is completely missing. No PTO request, no leave of absence, no status change. This is the kind of thing that needs to be caught before payroll runs.

3 employees had approved PTO that overlapped this period — their hours have been adjusted to reflect actual working hours plus PTO hours. Standard handling.

Leon Webb's final check is straightforward — regular hours through Jan 24 plus the 42-hour PTO payout.

The Jeff Hardy situation needs to go to the consultant in Step 3. Could be a simple oversight (forgot to submit) or something more concerning.`,
    timestamp: new Date(Date.now() - 4 * 60 * 1000),
  },
  {
    id: "msg-p-5",
    role: "assistant",
    content: "**Step 3 — Individual employee review: 3 anomalies found.**\n\nI compared all 47 employees against their previous 3 pay periods. 44 are within normal variance. Here are the 3 that need your attention:\n\n**1. Jeff Hardy — 0 hours (critical)**\nJeff logged 0 hours this period. His last 3 periods: 84, 80, 82 hours (avg 82 hrs biweekly). There's no PTO request, no leave of absence, and no status change on file. This looks like a missing timesheet — but I want you to decide how to handle it.\n\n**2. Dr. Eli Vance — 58 overtime hours**\nDr. Vance has 58 overtime hours this period vs. a 3-period average of 12 hours. That's a 383% increase. His base hours (80) are normal — it's the OT that's unusual. Could be a legitimate crunch period, but it's a $4,132.50 difference in gross pay.\n\n**3. Barney Calhoun — new HSA deduction**\nBarney has a new HSA deduction of $125/pay period starting this run. This matches a benefits enrollment change effective Jan 15 — just flagging it so you're aware.\n\nI need to know how to handle the first two before I can move on:",
    clarifyingQuestions: {
      questions: [
        {
          id: "hardy_zero_hours",
          header: "Hardy",
          question: "Jeff Hardy has 0 hours logged this period but averaged 82 hours over his last 3 pay periods. No PTO, leave, or status change on file. How should I handle this?",
          options: [
            { label: "Exclude from this run", description: "Skip Jeff entirely — pay him in a supplemental run once his timesheet is submitted" },
            { label: "Include at previous average", description: "Use his 82-hour average as a placeholder and reconcile next period" },
            { label: "Include with 0 hours", description: "Process him at 0 hours — he'll get a $0 check (deductions may still apply)" },
            { label: "Hold entire payroll", description: "Pause the run until Jeff's timesheet is resolved" },
          ],
          multiSelect: false,
        },
        {
          id: "vance_overtime",
          header: "Vance OT",
          question: "Dr. Eli Vance logged 58 overtime hours this period — 383% above his 3-period average of 12 hours. This adds $4,132.50 to his gross pay. How should I proceed?",
          options: [
            { label: "Approve as submitted", description: "The overtime is legitimate — process at 1.5x rate as reported" },
            { label: "Cap at department limit", description: "Apply the 30-hour departmental OT cap — excess requires manager sign-off" },
            { label: "Flag for manager review", description: "Process base pay now, hold OT portion pending manager approval" },
          ],
          multiSelect: false,
        },
      ],
      answered: false,
    },
    thinking: `Anomaly review complete. Three items to surface:

1. CRITICAL — Jeff Hardy at 0 hours. This is almost certainly a missing timesheet, not an actual zero-hour period. His history is consistent (80-84 hrs). Options: exclude him from this run and do a supplemental, use his average as placeholder, or process at 0. I'd recommend excluding — paying $0 is worse than paying late if it's just a missing timesheet.

2. NOTABLE — Dr. Vance's overtime is way outside normal range. 58 hours OT on top of 80 base = 138 total hours in a biweekly period. That's almost 10 hours/day every day including weekends. Could be legitimate for a research crunch, but the consultant should verify.

3. INFORMATIONAL — Barney's new HSA deduction is clean, just making it visible since it's a change from previous periods.

I'll present 1 and 2 as clarifying questions since they need decisions. Barney's is informational only.`,
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
  },
];

const newHireMessages: Message[] = [
  {
    id: "msg-nh-1",
    role: "user",
    content: "Can you create an onboarding checklist for Dr. Freeman?",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "msg-nh-2",
    role: "assistant",
    content: `I've created a comprehensive onboarding checklist for Dr. Freeman. This covers everything from pre-start preparations through the first month of employment.

[ARTIFACT:artifact-1]

Let me know if you'd like me to customize any of these items for Dr. Freeman's specific role in the research department.`,
    artifactIds: ["artifact-1"],
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

export const mockChats: Chat[] = [
  // Black Mesa chats
  {
    id: "chat-1",
    clientId: "4",
    agentId: "agent-payroll",
    title: "January Payroll",
    hasUnread: true,
    updatedAt: new Date(Date.now() - 2 * 60 * 1000), // 2 min ago
    messages: payrollMessages,
    artifacts: [],
  },
  {
    id: "chat-2",
    clientId: "4",
    title: "Benefits Enrollment Q1",
    hasUnread: true,
    updatedAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    messages: [],
    artifacts: [],
  },
  {
    id: "chat-3",
    clientId: "4",
    title: "Tax Forms Review 2024",
    hasUnread: false,
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    messages: [],
    artifacts: [],
  },
  {
    id: "chat-4",
    clientId: "4",
    title: "New Hire: Dr. Freeman",
    hasUnread: true,
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    messages: newHireMessages,
    artifacts: [onboardingArtifact],
  },
  // Aperture Science chats
  {
    id: "chat-5",
    clientId: "1",
    title: "Portal Gun Safety Training",
    hasUnread: true,
    updatedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
    messages: [],
    artifacts: [],
  },
  {
    id: "chat-6",
    clientId: "1",
    title: "GLaDOS Maintenance",
    hasUnread: false,
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    messages: [],
    artifacts: [],
  },
  // Umbrella Corporation chats
  {
    id: "chat-7",
    clientId: "2",
    title: "Virus Containment Protocol",
    hasUnread: false,
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    messages: [],
    artifacts: [],
  },
  // Tyrell Corporation chats
  {
    id: "chat-8",
    clientId: "6",
    title: "Replicant Benefits Package",
    hasUnread: true,
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    messages: [],
    artifacts: [],
  },
  // Cyberdyne chats
  {
    id: "chat-9",
    clientId: "5",
    title: "Skynet Integration",
    hasUnread: false,
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    messages: [],
    artifacts: [],
  },
  // Weyland-Yutani chats
  {
    id: "chat-10",
    clientId: "3",
    title: "Xenomorph Hazard Pay",
    hasUnread: true,
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    messages: [],
    artifacts: [],
  },
];

// Legacy export for backwards compatibility during migration
export const mockMessages: Record<string, Message[]> = {
  "chat-1": payrollMessages,
};
