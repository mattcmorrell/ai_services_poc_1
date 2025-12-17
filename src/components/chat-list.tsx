"use client";

import { Building2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Client } from "@/types/chat";

interface ChatListProps {
  clients: Client[];
  selectedClientId: string | null;
  onSelectClient: (clientId: string) => void;
}

export function ChatList({ clients, selectedClientId, onSelectClient }: ChatListProps) {
  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="border-b border-border p-4">
        <h2 className="text-xl font-semibold">Chats</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {clients.map((client) => (
            <button
              key={client.id}
              onClick={() => onSelectClient(client.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent",
                selectedClientId === client.id && "bg-accent"
              )}
            >
              <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate text-sm">{client.name}</span>
              {client.unreadCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-medium">
                  {client.unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
