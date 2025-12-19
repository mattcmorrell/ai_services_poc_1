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
  title: "Run January Payroll",
  description: "Process payroll for all active employees at Black Mesa for the January pay period.",
  steps: [
    { id: "step-1", description: "Collect and validate employee hours and salary data", status: "pending" },
    { id: "step-2", description: "Calculate gross pay, deductions, and net pay", status: "pending" },
    { id: "step-3", description: "Process direct deposits and generate pay stubs", status: "pending" },
    { id: "step-4", description: "Report and remit payroll taxes", status: "pending" },
  ],
  metadata: {
    affectedCount: 47,
    affectedLabel: "employees",
    estimatedTime: "~5 min",
  },
  status: "pending",
};

const payrollMessages: Message[] = [
  {
    id: "msg-0",
    role: "user",
    content: "Run payroll for January",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: "msg-1",
    role: "assistant",
    content: "I'll run the January payroll for Black Mesa. Here's my plan - please review and approve when ready:",
    thinking: `The user is asking me to run payroll for Black Mesa Inc. This is a complex multi-step process that involves:
1. Data collection and validation
2. Payroll calculations
3. Payment processing
4. Tax reporting

I should break this down into clear steps and present a plan for approval before executing. This gives the HR consultant visibility into what I'm about to do and allows them to catch any issues before they become problems.`,
    actionPlan: payrollActionPlan,
    workflow: {
      id: "wf-1",
      name: "Black Mesa Payroll Workflow",
      description: "View detailed workflow",
    },
    timestamp: new Date(),
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
