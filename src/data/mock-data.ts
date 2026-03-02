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

// --- Benefits Enrollment Q1 (Black Mesa, chat-2) ---
const benefitsMessages: Message[] = [
  {
    id: "msg-be-1",
    role: "user",
    content: "We need to start Q1 benefits enrollment for Black Mesa. 14 employees elected changes during open enrollment.",
    timestamp: new Date(Date.now() - 65 * 60 * 1000),
  },
  {
    id: "msg-be-2",
    role: "assistant",
    content: "I've pulled the Q1 enrollment changes for Black Mesa. Here's the summary:\n\n**14 employees** elected benefits changes effective January 1:\n\n| Change Type | Count | Details |\n|------------|-------|---------|\n| Medical plan upgrade | 5 | Moving from Bronze to Silver tier |\n| Added dental | 3 | New enrollments in dental PPO |\n| HSA contribution change | 4 | Increased contributions (avg +$75/pay period) |\n| Dependent add | 2 | Adding spouse/children to existing plans |\n\nI'll need to sync these with your benefits provider. Before I proceed — **3 of the dental enrollments** are flagged because the employees missed the original enrollment window. They're citing qualifying life events:\n\n- **Barney Calhoun** — marriage (Dec 12)\n- **Alyx Vance** — new dependent (Dec 28)\n- **Isaac Kleiner** — loss of spouse's coverage (Jan 2)\n\nDo you want me to verify the qualifying life events and process all 14, or handle the 11 clean ones first?",
    thinking: "14 enrollment changes is a moderate batch. The 3 dental enrollments with QLE claims need attention — if they don't have proper documentation, the carrier could reject them. Better to flag these upfront than process and get denials later.",
    timestamp: new Date(Date.now() - 63 * 60 * 1000),
  },
  {
    id: "msg-be-3",
    role: "user",
    content: "Process the 11 clean ones now. I'll get documentation for the QLE claims and we can handle those separately.",
    timestamp: new Date(Date.now() - 61 * 60 * 1000),
  },
  {
    id: "msg-be-4",
    role: "assistant",
    content: "Processing the 11 clean enrollment changes now.\n\nI've submitted the batch to the benefits provider. Here's the status:\n\n- **5 medical upgrades** — confirmed, effective Jan 1\n- **4 HSA contribution changes** — confirmed, will reflect in next pay period\n- **2 dependent additions** — submitted, pending carrier confirmation (typically 24-48 hrs)\n\nThe 3 QLE claims are parked. When you have the documentation, just drop it here and I'll process them.\n\nOne thing to note: the 5 medical upgrades will increase Black Mesa's monthly premium by approximately **$2,340/month**. This is within the budgeted range but worth flagging for Cave Johnson's awareness.",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
  },
];

// --- Tax Forms Review 2024 (Black Mesa, chat-3) ---
const taxFormsMessages: Message[] = [
  {
    id: "msg-tf-1",
    role: "user",
    content: "We need to review the 2024 tax forms for Black Mesa before filing. Can you pull the W-2s?",
    timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000),
  },
  {
    id: "msg-tf-2",
    role: "assistant",
    content: "I've generated the 2024 W-2s for all 47 Black Mesa employees. Here's the review summary:\n\n**W-2 Generation Status:**\n- 44 employees — clean, ready for distribution\n- 3 employees need attention:\n\n**1. Leon Webb** — Terminated Jan 24, 2025. His W-2 includes a PTO payout of $1,449.00 in Box 1. The withholding on supplemental wages was calculated at the flat 22% rate. Verify this is correct for his tax situation.\n\n**2. Maria Chen** — Started Jan 20, 2025. Only has 8 working days of wages. Her W-2 looks unusually low ($3,840) but is correct given her start date.\n\n**3. Dr. Eli Vance** — Total compensation of $287,450 includes $62,000 in overtime. Box 1 is correct but notably higher than his base salary of $225,450. May trigger questions.\n\nAll 47 W-2s need to be distributed by **January 31, 2025**. That gives us 5 business days.\n\nWant me to queue the 44 clean ones for distribution while you review the 3 flagged employees?",
    thinking: "Standard W-2 review. The three flagged employees all have legitimate explanations but the consultant should verify before distribution. Leon's supplemental wage withholding, Maria's short-year W-2, and Eli's high OT are all things that could generate employee questions.",
    timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000),
  },
  {
    id: "msg-tf-3",
    role: "user",
    content: "Yes, send the 44 clean ones. I'll review the flagged three and get back to you.",
    timestamp: new Date(Date.now() - 24.5 * 60 * 60 * 1000),
  },
  {
    id: "msg-tf-4",
    role: "assistant",
    content: "Done. 44 W-2s are queued for electronic distribution. Employees with portal access will see them within 2 hours. Paper copies will mail tomorrow.\n\nI've placed holds on Webb, Chen, and Vance W-2s until you confirm. Let me know when you're ready to release them.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

// --- Portal Gun Safety Training (Aperture Science, chat-5) ---
const portalGunMessages: Message[] = [
  {
    id: "msg-pg-1",
    role: "user",
    content: "We need to set up compliance training for Aperture Science's portal gun operators. OSHA flagged them on the last inspection.",
    timestamp: new Date(Date.now() - 35 * 60 * 1000),
  },
  {
    id: "msg-pg-2",
    role: "assistant",
    content: "I've reviewed Aperture Science's compliance file. The OSHA citation from December 15 specifically flagged:\n\n1. **No documented safety training** for portal device operators (28 employees)\n2. **Missing PPE compliance records** for the testing chambers\n3. **Overdue hazard communication training** — last completed 18 months ago\n\nThe deadline for corrective action is **February 15, 2025**. Here's what I recommend:\n\n- **Week 1:** Deploy the portal device safety module to all 28 operators. I can generate the training content from the manufacturer's safety data sheets and Aperture's existing SOPs.\n- **Week 2:** Schedule PPE fit-testing sessions (I'll coordinate with the safety officer)\n- **Week 3:** Run the annual HazCom refresher for all 312 employees\n\nShall I draft the training plan and send it to Cave Johnson for approval?",
    thinking: "OSHA citations need to be addressed within the corrective action period or fines escalate. The portal device training is the highest priority since it was the primary citation. The other two are secondary but should be bundled since we're already organizing training.",
    timestamp: new Date(Date.now() - 33 * 60 * 1000),
  },
  {
    id: "msg-pg-3",
    role: "user",
    content: "Yes, draft the plan. Also check if any of the 28 operators have expired certifications — Cave mentioned some might need recertification.",
    timestamp: new Date(Date.now() - 31 * 60 * 1000),
  },
  {
    id: "msg-pg-4",
    role: "assistant",
    content: "I've cross-referenced the 28 portal device operators against Aperture's certification records:\n\n- **19 operators** — certifications current (renewed within 12 months)\n- **6 operators** — certifications expired within the last 90 days (can do abbreviated recertification)\n- **3 operators** — certifications expired 6+ months ago (full recertification required)\n\nThe 3 needing full recertification are:\n- **Doug Rattmann** — expired July 2024\n- **Chell Johnson** — expired August 2024  \n- **Wheatley Morris** — expired June 2024\n\nI've drafted the training plan and sent it to Cave Johnson for review. He should have it in his inbox now. I also flagged that Doug, Chell, and Wheatley should be temporarily reassigned from portal operations until recertified — that's an OSHA requirement.\n\nWant me to generate the reassignment notices?",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
  },
];

// --- GLaDOS Maintenance (Aperture Science, chat-6) ---
const gladosMessages: Message[] = [
  {
    id: "msg-gl-1",
    role: "user",
    content: "The GLaDOS system is scheduled for its quarterly maintenance window. Can you check if any employees will be affected by the downtime?",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "msg-gl-2",
    role: "assistant",
    content: "I've checked the maintenance window (Saturday Feb 8, 2am–8am EST) against Aperture Science's workforce data:\n\n**Affected employees:**\n- **12 employees** scheduled for Saturday shifts during the maintenance window\n- **3 employees** in the middle of multi-day testing sequences that use GLaDOS-dependent systems\n- **0 remote employees** affected (GLaDOS access isn't required for remote work)\n\nThe 3 employees in testing sequences are the main concern — interrupting mid-sequence could invalidate their test data:\n- **Chell Johnson** — Test sequence 14-B (started Thursday)\n- **Atlas Rivera** — Cooperative testing module 7\n- **P-Body Chen** — Cooperative testing module 7 (paired with Atlas)\n\nOptions:\n1. Reschedule their sequences to complete before Saturday 2am\n2. Pause sequences Friday night and resume after maintenance\n3. Move the maintenance window to the following weekend\n\nCave Johnson's team says option 2 is fine — test data is checkpointed every 4 hours. Want me to notify the affected 15 employees?",
    timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
  },
  {
    id: "msg-gl-3",
    role: "user",
    content: "Go with option 2. Send notifications to all 15.",
    timestamp: new Date(Date.now() - 3.2 * 60 * 60 * 1000),
  },
  {
    id: "msg-gl-4",
    role: "assistant",
    content: "Notifications sent to all 15 affected employees. Here's what I included:\n\n- **12 Saturday shift workers:** Notified of potential system intermittency during 2–8am window. Recommended saving work frequently.\n- **3 testing sequence employees:** Notified that sequences will auto-pause Friday at 11pm and resume Saturday at 8am. No data loss expected.\n\nI also CC'd the shift supervisors and Cave Johnson's office. Everyone has been asked to confirm receipt by end of day Friday.\n\nWant me to set a reminder to verify confirmations Friday afternoon?",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
];

// --- Virus Containment Protocol (Umbrella Corporation, chat-7) ---
const virusMessages: Message[] = [
  {
    id: "msg-vc-1",
    role: "user",
    content: "Umbrella Corp is updating their containment protocol. This affects the hazard pay structure for lab workers. Can you pull the current setup?",
    timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
  },
  {
    id: "msg-vc-2",
    role: "assistant",
    content: "Here's Umbrella Corporation's current hazard pay structure for laboratory personnel:\n\n| Risk Tier | Employees | Base Premium | Current Rate |\n|-----------|-----------|-------------|-------------|\n| Tier 1 (BSL-4) | 23 | 35% of base | $18.50–$42.00/hr premium |\n| Tier 2 (BSL-3) | 67 | 20% of base | $10.00–$28.00/hr premium |\n| Tier 3 (BSL-2) | 145 | 10% of base | $5.00–$14.00/hr premium |\n| Admin/Non-lab | 1,185 | None | Standard rate |\n\nThe new containment protocol would reclassify some roles:\n- **12 Tier 2 employees** would move to Tier 1 (higher exposure risk under new protocol)\n- **8 Tier 3 employees** would move to Tier 2\n- **3 new positions** created at Tier 1\n\nAnnual cost impact of the reclassifications: approximately **$340,000/year** in additional hazard premiums.\n\nAlbert Wesker's office has approved the budget. Want me to draft the compensation adjustment letters for the 20 affected employees?",
    timestamp: new Date(Date.now() - 2.3 * 60 * 60 * 1000),
  },
  {
    id: "msg-vc-3",
    role: "user",
    content: "Draft the letters. Make sure they clearly explain the reclassification reason and the new premium rate for each employee.",
    timestamp: new Date(Date.now() - 2.1 * 60 * 60 * 1000),
  },
  {
    id: "msg-vc-4",
    role: "assistant",
    content: "I've drafted 20 individualized compensation adjustment letters. Each letter includes:\n\n- Employee's current tier and premium rate\n- New tier assignment and updated premium rate\n- Explanation that the change is due to the updated containment protocol (effective March 1)\n- Breakdown of the pay period impact\n\nHere's a sample of the financial impact for a few employees:\n\n- **Ada Wong** (Tier 2 → Tier 1): Premium increases from $22.40/hr to $36.75/hr (+$14.35/hr)\n- **Carlos Oliveira** (Tier 3 → Tier 2): Premium increases from $8.50/hr to $17.00/hr (+$8.50/hr)\n- **Jill Valentine** (Tier 2 → Tier 1): Premium increases from $28.00/hr to $42.00/hr (+$14.00/hr)\n\nAll letters are ready for your review. I've also prepared a summary document for Albert Wesker showing the aggregate cost impact by department.\n\nShould I send these for your approval, or would you like to make edits first?",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
];

// --- Replicant Benefits Package (Tyrell Corporation, chat-8) ---
const replicantMessages: Message[] = [
  {
    id: "msg-rb-1",
    role: "user",
    content: "Tyrell Corporation wants to create a new benefits tier for their Nexus-6 workforce. This is a unique situation — can you help structure it?",
    timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
  },
  {
    id: "msg-rb-2",
    role: "assistant",
    content: "Interesting challenge. Tyrell's Nexus-6 workforce has unique employment characteristics that don't fit standard benefits structures. Based on their employee records:\n\n**Current Nexus-6 workforce:** 180 employees\n**Average tenure:** 3.2 years\n**Turnover rate:** ~25% annually (significantly higher than industry avg of 15%)\n\nGiven the shorter average tenure and high turnover, here's a benefits structure that makes sense:\n\n**Proposed Nexus-6 Benefits Tier:**\n\n- **Medical:** High-deductible plan with employer-funded HSA ($2,000/yr contribution). Lower premium, immediate vesting — good for shorter tenures.\n- **Retirement:** 3% match with immediate vesting (vs. the standard 4-year cliff for other tiers). No point in a vesting schedule they may not complete.\n- **PTO:** 20 days from day 1 (no accrual ramp). Competitive for retention.\n- **Life/Disability:** Standard coverage, 1x salary.\n- **Unique addition:** \"Longevity bonus\" — $5,000 retention bonus at each annual anniversary to combat turnover.\n\nEstimated annual cost per Nexus-6 employee: **$18,400** (vs. $22,100 for standard tier — savings from the HDHP offset the HSA contributions and retention bonuses).\n\nWant me to model this against Tyrell's current spend?",
    thinking: "The high turnover rate means traditional benefits with vesting schedules are essentially wasted spend. Immediate vesting on retirement, HSA funding, and retention bonuses are more cost-effective for this population. Eldon Tyrell will care about the bottom line.",
    timestamp: new Date(Date.now() - 3.3 * 60 * 60 * 1000),
  },
  {
    id: "msg-rb-3",
    role: "user",
    content: "This is great. Model it against current spend and also add a wellness stipend — Eldon mentioned wanting that.",
    timestamp: new Date(Date.now() - 3.1 * 60 * 60 * 1000),
  },
  {
    id: "msg-rb-4",
    role: "assistant",
    content: "Here's the cost comparison with the wellness stipend added:\n\n| Component | Current (Standard Tier) | Proposed (Nexus-6 Tier) | Difference |\n|-----------|------------------------|------------------------|------------|\n| Medical premiums | $8,400/yr | $5,200/yr | -$3,200 |\n| HSA contribution | $0 | $2,000/yr | +$2,000 |\n| Retirement match | $4,500/yr (mostly unvested) | $3,600/yr (fully vested) | -$900 |\n| PTO value | $3,800/yr | $4,600/yr | +$800 |\n| Life/Disability | $1,400/yr | $1,400/yr | $0 |\n| Wellness stipend | $0 | $1,200/yr ($100/mo) | +$1,200 |\n| Longevity bonus (amortized) | $0 | $2,500/yr | +$2,500 |\n| **Total per employee** | **$18,100/yr** | **$20,500/yr** | **+$2,400** |\n| **Total for 180 employees** | **$3,258,000/yr** | **$3,690,000/yr** | **+$432,000** |\n\nThe net increase is $432K annually, but if the longevity bonuses reduce turnover by even 5 percentage points, the savings on recruiting and training ($12K per replacement) would offset roughly $216K — making the real cost closer to **+$216K/year**.\n\nI'll prepare a proposal deck for Eldon Tyrell. Want me to include the turnover ROI projections?",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
];

// --- Skynet Integration (Cyberdyne Systems, chat-9) ---
const skynetMessages: Message[] = [
  {
    id: "msg-si-1",
    role: "user",
    content: "Cyberdyne is deploying a new AI system for workforce scheduling. We need to make sure the HR policies are updated to cover automated scheduling decisions.",
    timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000),
  },
  {
    id: "msg-si-2",
    role: "assistant",
    content: "Good call — automated scheduling decisions have compliance implications. I've reviewed Cyberdyne's current policies and here are the gaps:\n\n**Policy gaps for AI-driven scheduling:**\n\n1. **Predictive scheduling laws** — Cyberdyne operates in Sunnyvale, CA. California's predictive scheduling requirements mandate 14-day advance notice for schedule changes. The AI system needs guardrails to enforce this.\n\n2. **Overtime distribution** — The current policy says OT is distributed \"equitably.\" If the AI optimizes for cost, it might concentrate OT on lower-paid employees. Need explicit fairness criteria.\n\n3. **Rest period compliance** — California requires minimum 8-hour rest between shifts. The AI must enforce this as a hard constraint, not a soft preference.\n\n4. **Employee preference accommodation** — ADA and religious accommodation requests need to be inputs to the scheduling algorithm, not overrides applied after.\n\n5. **Transparency requirement** — Employees should be informed that scheduling is AI-assisted and have a clear appeal process.\n\nI can draft updated policy language for all 5 areas. Miles Dyson's team should also review the AI vendor's compliance documentation.\n\nWant me to start with the policy drafts?",
    timestamp: new Date(Date.now() - 24.8 * 60 * 60 * 1000),
  },
  {
    id: "msg-si-3",
    role: "user",
    content: "Draft all 5. Priority on the California compliance ones.",
    timestamp: new Date(Date.now() - 24.5 * 60 * 60 * 1000),
  },
  {
    id: "msg-si-4",
    role: "assistant",
    content: "I've drafted all 5 policy updates. Here's a summary of each:\n\n**1. Predictive Scheduling Policy (California-specific)**\nAI-generated schedules must be published 14 days in advance. Any changes within the 14-day window require manager approval and trigger premium pay per CA Labor Code. The AI system cannot auto-publish schedule changes within the protected period.\n\n**2. Overtime Equity Policy**\nOT distribution must be tracked monthly by the AI system and reported to HR. No employee can be assigned more than 150% of the department average OT hours without manager review. The AI must rotate OT opportunities equitably across qualified employees.\n\n**3. Rest Period Enforcement**\nMinimum 8-hour gap between shifts is a hard constraint in the scheduling algorithm. The AI cannot override this under any circumstance. Violations generate automatic alerts to HR and the shift supervisor.\n\n**4. Accommodation Integration**\nAll ADA accommodations and religious scheduling requests are loaded as primary constraints before optimization runs. These are not subject to cost-optimization trade-offs.\n\n**5. AI Transparency & Appeals**\nNew hire orientation includes disclosure of AI-assisted scheduling. Employee self-service portal shows the reason for each scheduling decision. Appeals go through existing HR channels with a 48-hour response SLA.\n\nFull policy documents are ready for Miles Dyson's legal review. Want me to send them over?",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

// --- Xenomorph Hazard Pay (Weyland-Yutani, chat-10) ---
const xenomorphMessages: Message[] = [
  {
    id: "msg-xh-1",
    role: "user",
    content: "Weyland-Yutani's Gateway Station crew is requesting hazard pay increases. The current structure hasn't been updated since the last... incident.",
    timestamp: new Date(Date.now() - 4.5 * 60 * 60 * 1000),
  },
  {
    id: "msg-xh-2",
    role: "assistant",
    content: "I've pulled the Gateway Station compensation data and the incident report from last quarter. Here's where things stand:\n\n**Current hazard pay structure (established 18 months ago):**\n- Deep space premium: 15% of base\n- Isolation premium: $500/month flat\n- Specimen handling: 25% of base (only 12 employees certified)\n\n**What's changed since the last review:**\n- The incident resulted in 3 workers' comp claims (all resolved)\n- Station insurance premiums increased 40%\n- 6 employees have requested transfers to Earth-side positions citing safety concerns\n- Competitor (Seegson Corp) is offering 20% deep space premiums\n\n**Crew breakdown — 890 employees:**\n- 340 — general station operations\n- 280 — research & specimen handling\n- 170 — engineering & maintenance\n- 100 — security & containment\n\nThe security & containment team has the strongest case — they're the ones directly exposed during incidents, and they're being poached by competitors.\n\nI'd recommend a tiered increase:\n- Security & containment: deep space premium to 25% (+$1.2M/yr)\n- Specimen handling: premium to 30% (+$680K/yr)\n- All others: premium to 18% (+$890K/yr)\n\nTotal annual increase: **$2.77M** — which is less than the cost of replacing the 6 employees requesting transfers ($840K in recruiting and relocation alone).\n\nWant me to prepare this proposal for Carter Burke?",
    thinking: "The retention angle is the strongest argument here. Losing experienced station crew is extremely expensive given the specialized training and relocation costs. The premium increases are significant but defensible against the alternative.",
    timestamp: new Date(Date.now() - 4.2 * 60 * 60 * 1000),
  },
  {
    id: "msg-xh-3",
    role: "user",
    content: "Prepare it. Also include a comparison to Seegson's package — Carter will want to see how we stack up competitively.",
    timestamp: new Date(Date.now() - 4.1 * 60 * 60 * 1000),
  },
  {
    id: "msg-xh-4",
    role: "assistant",
    content: "Proposal drafted with competitive analysis. Here's the comparison:\n\n| Component | Weyland-Yutani (Current) | Weyland-Yutani (Proposed) | Seegson Corp |\n|-----------|-------------------------|--------------------------|-------------|\n| Deep space premium | 15% | 18–25% | 20% |\n| Isolation pay | $500/mo | $500/mo | $750/mo |\n| Specimen handling | 25% | 30% | N/A (no program) |\n| Hazard insurance | Company-paid | Company-paid | Employee cost-share |\n| Rotation schedule | 6mo on / 2mo off | 6mo on / 2mo off | 8mo on / 1mo off |\n| Evac guarantee | Standard | Standard | None documented |\n\nThe proposed package would make Weyland-Yutani competitive on premiums and significantly better on rotation schedule and insurance — which employees care about more than the raw percentage.\n\nI've attached the full proposal document for Carter Burke. Should I also flag the 6 transfer requests to him as supporting evidence?",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
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
    messages: benefitsMessages,
    artifacts: [],
  },
  {
    id: "chat-3",
    clientId: "4",
    title: "Tax Forms Review 2024",
    hasUnread: false,
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    messages: taxFormsMessages,
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
    messages: portalGunMessages,
    artifacts: [],
  },
  {
    id: "chat-6",
    clientId: "1",
    title: "GLaDOS Maintenance",
    hasUnread: false,
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    messages: gladosMessages,
    artifacts: [],
  },
  // Umbrella Corporation chats
  {
    id: "chat-7",
    clientId: "2",
    title: "Virus Containment Protocol",
    hasUnread: false,
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    messages: virusMessages,
    artifacts: [],
  },
  // Tyrell Corporation chats
  {
    id: "chat-8",
    clientId: "6",
    title: "Replicant Benefits Package",
    hasUnread: true,
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    messages: replicantMessages,
    artifacts: [],
  },
  // Cyberdyne chats
  {
    id: "chat-9",
    clientId: "5",
    title: "Skynet Integration",
    hasUnread: false,
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    messages: skynetMessages,
    artifacts: [],
  },
  // Weyland-Yutani chats
  {
    id: "chat-10",
    clientId: "3",
    title: "Xenomorph Hazard Pay",
    hasUnread: true,
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    messages: xenomorphMessages,
    artifacts: [],
  },
];

// Legacy export for backwards compatibility during migration
export const mockMessages: Record<string, Message[]> = {
  "chat-1": payrollMessages,
};
