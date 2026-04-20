"use client";

import { ClientHomeTab } from "./client-home-tab";
import { Chat, Client } from "@/types/chat";

interface ClientsViewProps {
  clients: Client[];
  chats: Chat[];
  selectedClientId: string | null;
  onSelectChat: (chatId: string) => void;
}

export function ClientsView({
  clients,
  chats,
  selectedClientId,
  onSelectChat,
}: ClientsViewProps) {
  const client = clients.find((c) => c.id === selectedClientId);

  if (!client) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Select a client
      </div>
    );
  }

  const clientChats = chats.filter((c) => c.clientId === client.id);

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <ClientHomeTab
        client={client}
        chats={clientChats}
        onOpenChat={(chat) => onSelectChat(chat.id)}
      />
    </div>
  );
}
