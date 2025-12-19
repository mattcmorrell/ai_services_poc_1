export interface Client {
  id: string;
  name: string;
  unreadCount: number;
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
  title: string;
  hasUnread: boolean;
  updatedAt: Date;
  messages: Message[];
  artifacts: Artifact[];
}
