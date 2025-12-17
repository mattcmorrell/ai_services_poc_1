export interface AgentAttention {
  id: string;
  agentName: string;
  agentIcon: string;
  clientName: string;
  message: string;
  timestamp: Date;
  isUrgent: boolean;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface SuggestedAction {
  id: string;
  label: string;
  prompt: string;
}
