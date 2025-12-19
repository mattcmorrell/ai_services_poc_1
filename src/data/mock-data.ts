import { Client, Message, Chat } from "@/types/chat";

export const mockClients: Client[] = [
  { id: "1", name: "Aperture Science", unreadCount: 6 },
  { id: "2", name: "Umbrella Corporation", unreadCount: 0 },
  { id: "3", name: "Weyland-Yutani", unreadCount: 1 },
  { id: "4", name: "Black Mesa", unreadCount: 4 },
  { id: "5", name: "Cyberdyne Systems", unreadCount: 0 },
  { id: "6", name: "Tyrell Corporation", unreadCount: 2 },
];

const payrollMessages: Message[] = [
  {
    id: "msg-1",
    role: "assistant",
    content: `I'm ready to run payroll for Black Mesa. Here's my plan:

1. **Collect and Validate Data.** Gather all necessary input for the pay period, including employee hours worked, any changes in salary, and information about bonuses or commissions. This step also requires confirming that all tax withholding forms (like the W-4) and benefit deductions are accurate and current.

2. **Calculate Gross and Net Pay.** Determine the employee's gross pay before any deductions are taken out. Subsequently, calculate and subtract all mandatory deductions (federal/state taxes, FICA) and voluntary deductions (401(k), health insurance) to arrive at the final net pay.

3. **Disburse Payments and Provide Stubs.** Process the payment of the calculated net pay to the employees, usually through direct deposit or a physical check. Simultaneously, distribute a detailed pay stub to each employee showing a breakdown of their gross pay, all deductions, and final take-home amount.

4. **Report and Remit Taxes.** Deposit the withheld employee taxes and the employer's share of payroll taxes (like FICA match and unemployment taxes) to the proper government agencies by their deadlines. Finally, complete and file all required reports, such as quarterly Form 941 and annual W-2 forms.

Double check my work if you want, and approve when you're ready. I'll start as soon as it's approved.`,
    thinking: `The user is asking me to run payroll for Black Mesa Inc. This is a complex multi-step process that involves:
1. Data collection and validation
2. Payroll calculations
3. Payment processing
4. Tax reporting

I should break this down into clear steps and present a plan for approval before executing. This gives the HR consultant visibility into what I'm about to do and allows them to catch any issues before they become problems.

Let me structure this as a numbered list with clear explanations of each step...`,
    workflow: {
      id: "wf-1",
      name: "Black Mesa Payroll Workflow",
      description: "See workflow",
    },
    requiresApproval: true,
    approved: false,
    timestamp: new Date(),
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
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    messages: [],
    artifacts: [],
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
