export interface Client {
  id: string;
  name: string;
  unreadCount: number;
}

export interface ActionPlanStep {
  id: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
}

export interface ActionPlan {
  id: string;
  title: string;
  description: string;
  steps: ActionPlanStep[];
  metadata?: {
    affectedCount?: number;
    affectedLabel?: string; // e.g., "employees", "records"
    estimatedTime?: string; // e.g., "~5 min"
  };
  status: "pending" | "approved" | "executing" | "completed" | "declined";
  completionSummary?: string; // e.g., "47 employees paid, $284,392.18 total disbursed"
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  thinking?: string;
  workflow?: {
    id: string;
    name: string;
    description: string;
  };
  actionPlan?: ActionPlan;
  artifactIds?: string[]; // References to artifacts created in this message
  requiresApproval?: boolean;
  approved?: boolean;
  timestamp: Date;
}

export interface Artifact {
  id: string;
  title: string;
  type: "code" | "table" | "list" | "document";
  content: string;
  language?: string; // For code artifacts
  createdAt: Date;
  updatedAt: Date;
}

export interface Chat {
  id: string;
  clientId: string | null;
  agentId?: string | null;
  title: string;
  hasUnread: boolean;
  updatedAt: Date;
  messages: Message[];
  artifacts: Artifact[];
}
