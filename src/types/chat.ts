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
  requiresApproval?: boolean;
  approved?: boolean;
  timestamp: Date;
}

export interface Chat {
  id: string;
  clientId: string;
  title: string;
  hasUnread: boolean;
  updatedAt: Date;
  messages: Message[];
}
