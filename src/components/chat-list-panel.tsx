"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Client, Chat } from "@/types/chat";
import { ScrollArea } from "@/components/ui/scroll-area";

type ViewMode = "recent" | "clients";

interface ChatListPanelProps {
  clients: Client[];
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: (clientId: string) => void;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

interface ChatItemProps {
  chat: Chat;
  clientName?: string;
  isSelected: boolean;
  onSelect: () => void;
}

function ChatItem({ chat, clientName, isSelected, onSelect }: ChatItemProps) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "p-3 cursor-pointer border-l-2",
        isSelected
          ? "bg-accent border-primary"
          : "border-transparent hover:bg-accent/50"
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={cn(
            "w-2 h-2 flex-shrink-0 rounded-full",
            chat.hasUnread ? "bg-primary" : ""
          )}
        />
        <span className={cn("truncate", isSelected && "font-medium")}>
          {chat.title}
        </span>
      </div>
      <div className="text-xs text-muted-foreground mt-1 ml-4 truncate">
        {clientName ? `${clientName} · ` : ""}
        {formatTimeAgo(chat.updatedAt)}
      </div>
    </div>
  );
}

interface ClientSectionProps {
  client: Client;
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

function ClientSection({
  client,
  chats,
  selectedChatId,
  onSelectChat,
  onNewChat,
  isExpanded,
  onToggleExpand,
}: ClientSectionProps) {
  return (
    <div className="border-b border-border">
      <div
        onClick={onToggleExpand}
        className="p-3 flex justify-between items-center cursor-pointer bg-muted/50 hover:bg-muted"
      >
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">
            {isExpanded ? "▼" : "▶"}
          </span>
          <span className="font-medium">{client.name}</span>
        </div>
        {client.unreadCount > 0 && (
          <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
            {client.unreadCount}
          </span>
        )}
      </div>
      {isExpanded && (
        <div className="bg-background">
          <div
            onClick={(e) => {
              e.stopPropagation();
              onNewChat();
            }}
            className="pt-1 pb-2 pl-7 hover:bg-accent/50 cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-primary hover:text-primary/80 text-sm">
              <Plus className="w-3 h-3" />
              <span>New chat</span>
            </div>
          </div>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={cn(
                "p-2.5 pl-7 flex items-center gap-2 cursor-pointer border-l-2",
                selectedChatId === chat.id
                  ? "bg-accent border-primary"
                  : "border-transparent hover:bg-accent/50"
              )}
            >
              <span
                className={cn(
                  "w-2 h-2 flex-shrink-0 rounded-full",
                  chat.hasUnread ? "bg-primary" : ""
                )}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{chat.title}</div>
                <div className="text-xs text-muted-foreground">
                  {formatTimeAgo(chat.updatedAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ChatListPanel({
  clients,
  chats,
  selectedChatId,
  onSelectChat,
  onNewChat,
}: ChatListPanelProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("recent");
  const [expandedClients, setExpandedClients] = useState<Set<string>>(
    new Set(["4", "1"]) // Black Mesa and Aperture expanded by default
  );

  const sortedChats = useMemo(() => {
    return [...chats].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }, [chats]);

  const clientsMap = useMemo(() => {
    const map = new Map<string, Client>();
    clients.forEach((client) => map.set(client.id, client));
    return map;
  }, [clients]);

  const chatsByClient = useMemo(() => {
    const map = new Map<string | null, Chat[]>();
    chats.forEach((chat) => {
      const existing = map.get(chat.clientId) || [];
      existing.push(chat);
      map.set(chat.clientId, existing);
    });
    // Sort chats within each client by updatedAt
    map.forEach((clientChats, clientId) => {
      map.set(
        clientId,
        clientChats.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      );
    });
    return map;
  }, [chats]);

  const toggleClientExpanded = (clientId: string) => {
    setExpandedClients((prev) => {
      const next = new Set(prev);
      if (next.has(clientId)) {
        next.delete(clientId);
      } else {
        next.add(clientId);
      }
      return next;
    });
  };

  return (
    <div className="w-72 border-r border-border flex flex-col bg-background">
      {/* Toggle */}
      <div className="p-3 border-b border-border">
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => setViewMode("recent")}
            className={cn(
              "flex-1 py-1.5 px-3 text-sm rounded-md transition-colors",
              viewMode === "recent"
                ? "bg-background font-medium shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Recent Chats
          </button>
          <button
            onClick={() => setViewMode("clients")}
            className={cn(
              "flex-1 py-1.5 px-3 text-sm rounded-md transition-colors",
              viewMode === "clients"
                ? "bg-background font-medium shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Clients
          </button>
        </div>
      </div>

      {viewMode === "recent" ? (
        <>
          {/* New Chat button for Recent view */}
          <div className="p-3 border-b border-border">
            <button
              onClick={() => {
                // For now, default to first client - we'll add a dialog later
                const firstClient = clients[0];
                if (firstClient) {
                  onNewChat(firstClient.id);
                }
              }}
              className="flex items-center gap-2 text-primary hover:text-primary/80 text-sm"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>
          </div>

          {/* Recent chats list */}
          <ScrollArea className="flex-1">
            {sortedChats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                clientName={chat.clientId ? clientsMap.get(chat.clientId)?.name : undefined}
                isSelected={selectedChatId === chat.id}
                onSelect={() => onSelectChat(chat.id)}
              />
            ))}
          </ScrollArea>
        </>
      ) : (
        /* Clients view */
        <div className="flex-1 overflow-y-auto" style={{ scrollbarGutter: 'stable' }}>
          {clients.map((client) => (
            <ClientSection
              key={client.id}
              client={client}
              chats={chatsByClient.get(client.id) || []}
              selectedChatId={selectedChatId}
              onSelectChat={onSelectChat}
              onNewChat={() => onNewChat(client.id)}
              isExpanded={expandedClients.has(client.id)}
              onToggleExpand={() => toggleClientExpanded(client.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
