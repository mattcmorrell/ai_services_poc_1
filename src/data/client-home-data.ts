// Per-client mock data for the v2-C Client Home Tab

export type Severity = "blocking" | "error" | "review";

export interface AttentionItem {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  lastSeen: { name: string; initials: string; color: string; timeAgo: string } | null;
  primaryAction: string;
  secondaryAction: string;
}

export interface ActivePlan {
  id: string;
  title: string;
  status: "awaiting" | "running" | "paused";
  completedSteps: number;
  totalSteps: number;
}

export interface TeamMember {
  name: string;
  initials: string;
  color: string;
}

export interface ActivityItem {
  id: string;
  name: string;
  initials: string;
  color: string;
  action: string;
  timeAgo: string;
}

export interface ClientHomeData {
  attentionItems: AttentionItem[];
  activePlans: ActivePlan[];
  teamMembers: TeamMember[];
  recentActivity: { team: ActivityItem[]; agents: ActivityItem[] };
}

const clientHomeData: Record<string, ClientHomeData> = {
  // Aperture Science
  "1": {
    attentionItems: [
      {
        id: "att-1-1",
        severity: "blocking",
        title: "Payroll Runner needs approval",
        description: "Q1 payroll calculation for 312 employees is ready and waiting for your sign-off.",
        lastSeen: { name: "Jessica", initials: "JP", color: "bg-pink-500", timeAgo: "1h ago" },
        primaryAction: "Approve",
        secondaryAction: "View Details",
      },
      {
        id: "att-1-2",
        severity: "error",
        title: "Benefits Enrollment failed",
        description: "Dental plan sync encountered an error during enrollment processing. 14 employees affected.",
        lastSeen: { name: "You", initials: "Y", color: "bg-blue-500", timeAgo: "30m ago" },
        primaryAction: "Investigate",
        secondaryAction: "Dismiss",
      },
      {
        id: "att-1-3",
        severity: "review",
        title: "Compliance Check complete",
        description: "Annual compliance audit finished. 2 policy items flagged for your review before filing.",
        lastSeen: null,
        primaryAction: "Review",
        secondaryAction: "Snooze",
      },
    ],
    activePlans: [
      { id: "plan-1-1", title: "Q1 Payroll Processing", status: "running", completedSteps: 4, totalSteps: 6 },
      { id: "plan-1-2", title: "New Hire Onboarding — Batch 12", status: "running", completedSteps: 2, totalSteps: 5 },
      { id: "plan-1-3", title: "Benefits Enrollment Setup", status: "paused", completedSteps: 1, totalSteps: 4 },
    ],
    teamMembers: [
      { name: "You", initials: "Y", color: "bg-blue-500" },
      { name: "Jessica Park", initials: "JP", color: "bg-pink-500" },
      { name: "Marcus Chen", initials: "MC", color: "bg-purple-500" },
    ],
    recentActivity: {
      team: [
        { id: "ta-1-1", name: "You", initials: "Y", color: "bg-blue-500", action: "updated benefits enrollment settings", timeAgo: "2h ago" },
        { id: "ta-1-2", name: "Jessica Park", initials: "JP", color: "bg-pink-500", action: "ran Q4 compensation report", timeAgo: "5h ago" },
        { id: "ta-1-3", name: "Marcus Chen", initials: "MC", color: "bg-purple-500", action: "resolved payroll discrepancy", timeAgo: "yesterday" },
        { id: "ta-1-4", name: "You", initials: "Y", color: "bg-blue-500", action: "approved time-off policy update", timeAgo: "2d ago" },
        { id: "ta-1-5", name: "Jessica Park", initials: "JP", color: "bg-pink-500", action: "uploaded org chart revision", timeAgo: "3d ago" },
      ],
      agents: [
        { id: "aa-1-1", name: "Payroll Runner", initials: "PR", color: "bg-orange-500", action: "completed Q1 calculations", timeAgo: "1h ago" },
        { id: "aa-1-2", name: "CX Oracle", initials: "CX", color: "bg-rose-500", action: "generated satisfaction report", timeAgo: "4h ago" },
        { id: "aa-1-3", name: "Compliance Bot", initials: "CB", color: "bg-violet-500", action: "flagged 2 regulation updates", timeAgo: "6h ago" },
        { id: "aa-1-4", name: "Handbook Writer", initials: "HW", color: "bg-emerald-500", action: "drafted PTO policy revision", timeAgo: "yesterday" },
        { id: "aa-1-5", name: "Benefits Agent", initials: "BA", color: "bg-cyan-500", action: "synced dental plan enrollments", timeAgo: "2d ago" },
      ],
    },
  },

  // Umbrella Corp
  "2": {
    attentionItems: [
      {
        id: "att-2-1",
        severity: "blocking",
        title: "Termination package awaiting review",
        description: "Severance calculations for 3 departing researchers need senior consultant sign-off.",
        lastSeen: { name: "Kim", initials: "KL", color: "bg-teal-500", timeAgo: "2h ago" },
        primaryAction: "Review",
        secondaryAction: "View Details",
      },
      {
        id: "att-2-2",
        severity: "error",
        title: "HRIS sync failure",
        description: "Employee records sync with BambooHR failed for 28 records. Data integrity at risk.",
        lastSeen: null,
        primaryAction: "Investigate",
        secondaryAction: "Dismiss",
      },
      {
        id: "att-2-3",
        severity: "review",
        title: "Overtime policy update ready",
        description: "Updated overtime calculations per new state regulations. Ready for compliance review.",
        lastSeen: { name: "You", initials: "Y", color: "bg-blue-500", timeAgo: "15m ago" },
        primaryAction: "Approve",
        secondaryAction: "Snooze",
      },
      {
        id: "att-2-4",
        severity: "review",
        title: "Annual review cycle kickoff",
        description: "Performance review templates are configured. 1,420 employees pending manager assignments.",
        lastSeen: null,
        primaryAction: "Review",
        secondaryAction: "Snooze",
      },
    ],
    activePlans: [
      { id: "plan-2-1", title: "Annual Performance Reviews", status: "awaiting", completedSteps: 0, totalSteps: 8 },
      { id: "plan-2-2", title: "HRIS Data Migration — Phase 2", status: "running", completedSteps: 5, totalSteps: 7 },
      { id: "plan-2-3", title: "Compliance Training Rollout", status: "running", completedSteps: 3, totalSteps: 5 },
    ],
    teamMembers: [
      { name: "You", initials: "Y", color: "bg-blue-500" },
      { name: "Kim Lee", initials: "KL", color: "bg-teal-500" },
    ],
    recentActivity: {
      team: [
        { id: "ta-2-1", name: "You", initials: "Y", color: "bg-blue-500", action: "updated overtime policy draft", timeAgo: "15m ago" },
        { id: "ta-2-2", name: "Kim Lee", initials: "KL", color: "bg-teal-500", action: "reviewed termination packages", timeAgo: "2h ago" },
        { id: "ta-2-3", name: "You", initials: "Y", color: "bg-blue-500", action: "configured review templates", timeAgo: "yesterday" },
        { id: "ta-2-4", name: "Kim Lee", initials: "KL", color: "bg-teal-500", action: "exported Q4 headcount report", timeAgo: "2d ago" },
        { id: "ta-2-5", name: "You", initials: "Y", color: "bg-blue-500", action: "escalated HRIS sync issue", timeAgo: "3d ago" },
      ],
      agents: [
        { id: "aa-2-1", name: "Payroll Runner", initials: "PR", color: "bg-orange-500", action: "processed bi-weekly payroll", timeAgo: "3h ago" },
        { id: "aa-2-2", name: "Compliance Bot", initials: "CB", color: "bg-violet-500", action: "completed overtime audit", timeAgo: "5h ago" },
        { id: "aa-2-3", name: "Performance Agent", initials: "PA", color: "bg-amber-500", action: "generated review schedule", timeAgo: "yesterday" },
        { id: "aa-2-4", name: "CX Oracle", initials: "CX", color: "bg-rose-500", action: "surveyed employee satisfaction", timeAgo: "2d ago" },
        { id: "aa-2-5", name: "Handbook Writer", initials: "HW", color: "bg-emerald-500", action: "updated safety protocols section", timeAgo: "3d ago" },
      ],
    },
  },

  // Weyland-Yutani
  "3": {
    attentionItems: [
      {
        id: "att-3-1",
        severity: "error",
        title: "Hazard pay calculation mismatch",
        description: "Station crew hazard differentials showing $12k variance from expected totals.",
        lastSeen: { name: "Raj", initials: "RP", color: "bg-amber-500", timeAgo: "45m ago" },
        primaryAction: "Investigate",
        secondaryAction: "View Details",
      },
      {
        id: "att-3-2",
        severity: "review",
        title: "Remote work policy finalized",
        description: "Updated remote work policy for station-based employees ready for your sign-off.",
        lastSeen: null,
        primaryAction: "Approve",
        secondaryAction: "Snooze",
      },
    ],
    activePlans: [
      { id: "plan-3-1", title: "Station Crew Rotation — Q2", status: "running", completedSteps: 3, totalSteps: 6 },
      { id: "plan-3-2", title: "Hazard Pay Reconciliation", status: "paused", completedSteps: 1, totalSteps: 4 },
    ],
    teamMembers: [
      { name: "You", initials: "Y", color: "bg-blue-500" },
      { name: "Raj Patel", initials: "RP", color: "bg-amber-500" },
      { name: "Dana Ripley", initials: "DR", color: "bg-green-500" },
    ],
    recentActivity: {
      team: [
        { id: "ta-3-1", name: "Raj Patel", initials: "RP", color: "bg-amber-500", action: "flagged hazard pay variance", timeAgo: "45m ago" },
        { id: "ta-3-2", name: "You", initials: "Y", color: "bg-blue-500", action: "finalized remote work policy", timeAgo: "3h ago" },
        { id: "ta-3-3", name: "Dana Ripley", initials: "DR", color: "bg-green-500", action: "updated crew rotation schedule", timeAgo: "yesterday" },
        { id: "ta-3-4", name: "You", initials: "Y", color: "bg-blue-500", action: "approved station transfer requests", timeAgo: "2d ago" },
        { id: "ta-3-5", name: "Raj Patel", initials: "RP", color: "bg-amber-500", action: "ran benefits eligibility check", timeAgo: "3d ago" },
      ],
      agents: [
        { id: "aa-3-1", name: "Payroll Runner", initials: "PR", color: "bg-orange-500", action: "calculated hazard differentials", timeAgo: "2h ago" },
        { id: "aa-3-2", name: "Compliance Bot", initials: "CB", color: "bg-violet-500", action: "verified station safety certs", timeAgo: "6h ago" },
        { id: "aa-3-3", name: "CX Oracle", initials: "CX", color: "bg-rose-500", action: "analyzed crew morale survey", timeAgo: "yesterday" },
        { id: "aa-3-4", name: "Benefits Agent", initials: "BA", color: "bg-cyan-500", action: "processed relocation packages", timeAgo: "2d ago" },
        { id: "aa-3-5", name: "Handbook Writer", initials: "HW", color: "bg-emerald-500", action: "drafted station safety handbook", timeAgo: "4d ago" },
      ],
    },
  },

  // Black Mesa
  "4": {
    attentionItems: [
      {
        id: "att-4-1",
        severity: "blocking",
        title: "Security clearance renewals overdue",
        description: "12 researchers have expired clearances. Lab access will be revoked in 48 hours.",
        lastSeen: null,
        primaryAction: "Review",
        secondaryAction: "View Details",
      },
      {
        id: "att-4-2",
        severity: "review",
        title: "Grant funding allocation ready",
        description: "Q2 research grant allocations mapped to 6 departments. Awaiting your confirmation.",
        lastSeen: { name: "You", initials: "Y", color: "bg-blue-500", timeAgo: "1h ago" },
        primaryAction: "Approve",
        secondaryAction: "Snooze",
      },
    ],
    activePlans: [
      { id: "plan-4-1", title: "Security Clearance Batch Renewal", status: "awaiting", completedSteps: 0, totalSteps: 5 },
      { id: "plan-4-2", title: "Q2 Grant Distribution", status: "running", completedSteps: 2, totalSteps: 4 },
      { id: "plan-4-3", title: "Lab Safety Re-certification", status: "running", completedSteps: 4, totalSteps: 6 },
    ],
    teamMembers: [
      { name: "You", initials: "Y", color: "bg-blue-500" },
      { name: "Alyx Torres", initials: "AT", color: "bg-indigo-500" },
    ],
    recentActivity: {
      team: [
        { id: "ta-4-1", name: "You", initials: "Y", color: "bg-blue-500", action: "reviewed grant allocation spreadsheet", timeAgo: "1h ago" },
        { id: "ta-4-2", name: "Alyx Torres", initials: "AT", color: "bg-indigo-500", action: "submitted clearance renewal batch", timeAgo: "4h ago" },
        { id: "ta-4-3", name: "You", initials: "Y", color: "bg-blue-500", action: "approved lab safety schedule", timeAgo: "yesterday" },
        { id: "ta-4-4", name: "Alyx Torres", initials: "AT", color: "bg-indigo-500", action: "updated researcher contact list", timeAgo: "2d ago" },
        { id: "ta-4-5", name: "You", initials: "Y", color: "bg-blue-500", action: "ran headcount variance report", timeAgo: "3d ago" },
      ],
      agents: [
        { id: "aa-4-1", name: "Compliance Bot", initials: "CB", color: "bg-violet-500", action: "flagged 12 expired clearances", timeAgo: "30m ago" },
        { id: "aa-4-2", name: "Payroll Runner", initials: "PR", color: "bg-orange-500", action: "processed stipend payments", timeAgo: "5h ago" },
        { id: "aa-4-3", name: "Handbook Writer", initials: "HW", color: "bg-emerald-500", action: "updated lab protocols document", timeAgo: "yesterday" },
        { id: "aa-4-4", name: "Benefits Agent", initials: "BA", color: "bg-cyan-500", action: "enrolled new hires in health plan", timeAgo: "3d ago" },
        { id: "aa-4-5", name: "CX Oracle", initials: "CX", color: "bg-rose-500", action: "compiled researcher feedback", timeAgo: "4d ago" },
      ],
    },
  },

  // Cyberdyne
  "5": {
    attentionItems: [
      {
        id: "att-5-1",
        severity: "error",
        title: "Contractor invoice discrepancy",
        description: "3 contractor invoices don't match approved PO amounts. Total variance: $8,400.",
        lastSeen: { name: "Sam", initials: "SW", color: "bg-lime-500", timeAgo: "3h ago" },
        primaryAction: "Investigate",
        secondaryAction: "View Details",
      },
      {
        id: "att-5-2",
        severity: "review",
        title: "Stock option vesting schedule",
        description: "Updated vesting schedule for 24 employees reflects new board-approved terms.",
        lastSeen: null,
        primaryAction: "Approve",
        secondaryAction: "Snooze",
      },
      {
        id: "att-5-3",
        severity: "review",
        title: "New hire paperwork incomplete",
        description: "2 of 5 new hires missing I-9 verification. Start dates in 3 business days.",
        lastSeen: { name: "You", initials: "Y", color: "bg-blue-500", timeAgo: "20m ago" },
        primaryAction: "Review",
        secondaryAction: "Dismiss",
      },
    ],
    activePlans: [
      { id: "plan-5-1", title: "New Hire Onboarding — March", status: "running", completedSteps: 3, totalSteps: 7 },
      { id: "plan-5-2", title: "Contractor Audit", status: "paused", completedSteps: 1, totalSteps: 3 },
    ],
    teamMembers: [
      { name: "You", initials: "Y", color: "bg-blue-500" },
      { name: "Sam Wright", initials: "SW", color: "bg-lime-500" },
    ],
    recentActivity: {
      team: [
        { id: "ta-5-1", name: "Sam Wright", initials: "SW", color: "bg-lime-500", action: "flagged contractor invoice issues", timeAgo: "3h ago" },
        { id: "ta-5-2", name: "You", initials: "Y", color: "bg-blue-500", action: "reviewed new hire paperwork", timeAgo: "20m ago" },
        { id: "ta-5-3", name: "Sam Wright", initials: "SW", color: "bg-lime-500", action: "updated stock option spreadsheet", timeAgo: "yesterday" },
        { id: "ta-5-4", name: "You", initials: "Y", color: "bg-blue-500", action: "approved contractor rate changes", timeAgo: "2d ago" },
        { id: "ta-5-5", name: "Sam Wright", initials: "SW", color: "bg-lime-500", action: "ran background check batch", timeAgo: "4d ago" },
      ],
      agents: [
        { id: "aa-5-1", name: "Payroll Runner", initials: "PR", color: "bg-orange-500", action: "flagged invoice discrepancies", timeAgo: "2h ago" },
        { id: "aa-5-2", name: "Compliance Bot", initials: "CB", color: "bg-violet-500", action: "checked I-9 completion status", timeAgo: "4h ago" },
        { id: "aa-5-3", name: "Benefits Agent", initials: "BA", color: "bg-cyan-500", action: "calculated vesting schedules", timeAgo: "yesterday" },
        { id: "aa-5-4", name: "CX Oracle", initials: "CX", color: "bg-rose-500", action: "generated onboarding feedback", timeAgo: "3d ago" },
        { id: "aa-5-5", name: "Handbook Writer", initials: "HW", color: "bg-emerald-500", action: "updated contractor handbook", timeAgo: "5d ago" },
      ],
    },
  },

  // Tyrell Corp
  "6": {
    attentionItems: [
      {
        id: "att-6-1",
        severity: "blocking",
        title: "Payroll tax filing deadline tomorrow",
        description: "State payroll tax filing for CA is due tomorrow. Final review required before submission.",
        lastSeen: { name: "Priya", initials: "PK", color: "bg-fuchsia-500", timeAgo: "30m ago" },
        primaryAction: "Approve",
        secondaryAction: "View Details",
      },
      {
        id: "att-6-2",
        severity: "error",
        title: "401k contribution errors",
        description: "Mismatch in employer match calculations affecting 18 employees. Provider notified.",
        lastSeen: null,
        primaryAction: "Investigate",
        secondaryAction: "Dismiss",
      },
      {
        id: "att-6-3",
        severity: "review",
        title: "Promotion cycle approvals pending",
        description: "8 promotion packages from engineering and design teams ready for final approval.",
        lastSeen: { name: "You", initials: "Y", color: "bg-blue-500", timeAgo: "2h ago" },
        primaryAction: "Review",
        secondaryAction: "Snooze",
      },
    ],
    activePlans: [
      { id: "plan-6-1", title: "Q1 Tax Filing", status: "running", completedSteps: 5, totalSteps: 6 },
      { id: "plan-6-2", title: "Promotion Cycle — Spring", status: "awaiting", completedSteps: 0, totalSteps: 5 },
      { id: "plan-6-3", title: "401k Reconciliation", status: "paused", completedSteps: 2, totalSteps: 4 },
    ],
    teamMembers: [
      { name: "You", initials: "Y", color: "bg-blue-500" },
      { name: "Priya Kumar", initials: "PK", color: "bg-fuchsia-500" },
      { name: "Leon Nash", initials: "LN", color: "bg-sky-500" },
    ],
    recentActivity: {
      team: [
        { id: "ta-6-1", name: "Priya Kumar", initials: "PK", color: "bg-fuchsia-500", action: "prepared tax filing documents", timeAgo: "30m ago" },
        { id: "ta-6-2", name: "You", initials: "Y", color: "bg-blue-500", action: "reviewed promotion packages", timeAgo: "2h ago" },
        { id: "ta-6-3", name: "Leon Nash", initials: "LN", color: "bg-sky-500", action: "investigated 401k discrepancies", timeAgo: "5h ago" },
        { id: "ta-6-4", name: "Priya Kumar", initials: "PK", color: "bg-fuchsia-500", action: "updated tax withholding tables", timeAgo: "yesterday" },
        { id: "ta-6-5", name: "You", initials: "Y", color: "bg-blue-500", action: "approved engineering salary bands", timeAgo: "2d ago" },
      ],
      agents: [
        { id: "aa-6-1", name: "Payroll Runner", initials: "PR", color: "bg-orange-500", action: "generated tax filing summary", timeAgo: "1h ago" },
        { id: "aa-6-2", name: "Benefits Agent", initials: "BA", color: "bg-cyan-500", action: "identified 401k match errors", timeAgo: "3h ago" },
        { id: "aa-6-3", name: "Performance Agent", initials: "PA", color: "bg-amber-500", action: "compiled promotion metrics", timeAgo: "6h ago" },
        { id: "aa-6-4", name: "Compliance Bot", initials: "CB", color: "bg-violet-500", action: "verified tax compliance status", timeAgo: "yesterday" },
        { id: "aa-6-5", name: "CX Oracle", initials: "CX", color: "bg-rose-500", action: "analyzed retention risk scores", timeAgo: "3d ago" },
      ],
    },
  },
};

export function getClientHomeData(clientId: string): ClientHomeData {
  return clientHomeData[clientId] ?? {
    attentionItems: [],
    activePlans: [],
    teamMembers: [],
    recentActivity: { team: [], agents: [] },
  };
}
