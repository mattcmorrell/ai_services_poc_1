import { AgentAttention, TodoItem, SuggestedAction } from "@/types/dashboard";

export const mockAgentAttention: AgentAttention[] = [
  {
    id: "agent-1",
    agentName: "Payroll Runner",
    agentIcon: "banknote",
    clientName: "Cactus Jack's Jerky Shack",
    message: "I need you to authorize something. We need to do something about it pretty soon.",
    timestamp: new Date(Date.now() - 1000 * 60 * 43), // 5:17 AM equivalent
    isUrgent: true,
  },
  {
    id: "agent-2",
    agentName: "Powerpoint Builder",
    agentIcon: "presentation",
    clientName: "Acme Corp.",
    message: 'The deck "Super Important Q4 Thing" is ready.',
    timestamp: new Date(Date.now() - 1000 * 60 * 90), // 4:30 AM equivalent
    isUrgent: true,
  },
  {
    id: "agent-3",
    agentName: "Party Planner",
    agentIcon: "party-popper",
    clientName: "Coconut Grove LLC.",
    message: "Something broke and you have to fix it",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // Yesterday
    isUrgent: false,
  },
  {
    id: "agent-4",
    agentName: "CX Oracle",
    agentIcon: "sparkles",
    clientName: "Widget Wizards LLC",
    message: "Customer satisfaction report is ready for review.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // Dec 12
    isUrgent: false,
  },
];

export const mockTodos: TodoItem[] = [
  { id: "todo-1", text: "Something that needs to be done", completed: false },
  { id: "todo-2", text: "Something that is done", completed: true },
  { id: "todo-3", text: "Review Q4 performance reports", completed: true },
  { id: "todo-4", text: "Schedule team sync meeting", completed: true },
  { id: "todo-5", text: "Update client onboarding docs", completed: true },
  { id: "todo-6", text: "Prepare benefits enrollment summary", completed: true },
];

export const suggestedActions: SuggestedAction[] = [
  {
    id: "action-1",
    label: "Run payroll for all clients",
    prompt: "Run payroll for all clients that have payroll due this week",
  },
  {
    id: "action-2",
    label: "Check compliance deadlines",
    prompt: "What compliance deadlines are coming up in the next 30 days?",
  },
  {
    id: "action-3",
    label: "Generate weekly summary",
    prompt: "Generate a summary of all HR activities across my clients this week",
  },
];
