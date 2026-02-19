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
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
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
        "group relative cursor-pointer px-4 py-3 transition-all duration-200",
        isSelected
          ? "bg-[oklch(0.18_0.01_65_/_0.5)]"
          : "hover:bg-[oklch(0.15_0.005_280_/_0.3)]"
      )}
    >
      {/* Active indicator — gold bar */}
      {isSelected && (
        <div
          className="absolute inset-y-0 left-0 w-[2px]"
          style={{ background: "linear-gradient(180deg, oklch(0.7 0.15 65), oklch(0.55 0.12 65))" }}
        />
      )}

      <div className="flex items-center gap-2.5 min-w-0">
        {chat.hasUnread && (
          <span
            className="w-1.5 h-1.5 flex-shrink-0 rounded-full"
            style={{ background: "oklch(0.7 0.18 65)" }}
          />
        )}
        <span className={cn(
          "truncate text-sm",
          isSelected ? "font-medium text-[oklch(0.92_0_0)]" : "text-[oklch(0.7_0_0)]"
        )}>
          {chat.title}
        </span>
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[oklch(0.45_0_0)] ml-4">
        {clientName && <span>{clientName}</span>}
        {clientName && <span style={{ color: "oklch(0.3 0.06 65)" }}>·</span>}
        <span>{formatTimeAgo(chat.updatedAt)}</span>
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
    <div className="border-b border-[oklch(1_0_0_/_0.04)]">
      <div
        onClick={onToggleExpand}
        className="flex cursor-pointer items-center justify-between px-4 py-3 transition-colors hover:bg-[oklch(0.15_0.005_280_/_0.3)]"
      >
        <div className="flex items-center gap-2.5">
          <span
            className="text-[10px] transition-transform duration-200"
            style={{ color: "oklch(0.45 0.06 65)", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
          >
            ▶
          </span>
          <span className="text-sm font-medium tracking-wide text-[oklch(0.8_0_0)]">{client.name}</span>
        </div>
        {client.unreadCount > 0 && (
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={{
              background: "oklch(0.7 0.18 65 / 0.15)",
              color: "oklch(0.75 0.15 65)",
              border: "1px solid oklch(0.6 0.15 65 / 0.2)",
            }}
          >
            {client.unreadCount}
          </span>
        )}
      </div>
      {isExpanded && (
        <div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onNewChat();
            }}
            className="flex cursor-pointer items-center gap-1.5 py-2 pl-9 text-sm transition-colors hover:bg-[oklch(0.15_0.005_280_/_0.3)]"
            style={{ color: "oklch(0.6 0.12 65)" }}
          >
            <Plus className="w-3 h-3" />
            <span className="text-xs tracking-wide">New chat</span>
          </div>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={cn(
                "relative cursor-pointer py-2.5 pl-9 pr-3 transition-all duration-200",
                selectedChatId === chat.id
                  ? "bg-[oklch(0.18_0.01_65_/_0.5)]"
                  : "hover:bg-[oklch(0.15_0.005_280_/_0.3)]"
              )}
            >
              {selectedChatId === chat.id && (
                <div
                  className="absolute inset-y-0 left-0 w-[2px]"
                  style={{ background: "linear-gradient(180deg, oklch(0.7 0.15 65), oklch(0.55 0.12 65))" }}
                />
              )}
              <div className="flex items-center gap-2 min-w-0">
                {chat.hasUnread && (
                  <span className="w-1.5 h-1.5 flex-shrink-0 rounded-full" style={{ background: "oklch(0.7 0.18 65)" }} />
                )}
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm text-[oklch(0.75_0_0)]">{chat.title}</div>
                  <div className="text-[11px] text-[oklch(0.4_0_0)]">{formatTimeAgo(chat.updatedAt)}</div>
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
    new Set(["4", "1"])
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
    <div
      className="flex w-72 flex-col border-r"
      style={{
        background: "linear-gradient(180deg, oklch(0.11 0.005 280) 0%, oklch(0.08 0 0) 100%)",
        borderColor: "oklch(1 0 0 / 0.06)",
      }}
    >
      {/* Toggle */}
      <div className="p-3 border-b" style={{ borderColor: "oklch(1 0 0 / 0.06)" }}>
        <div className="flex rounded-lg p-0.5" style={{ background: "oklch(0.06 0 0 / 0.5)" }}>
          <button
            onClick={() => setViewMode("recent")}
            className={cn(
              "flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-all duration-200 tracking-wide",
              viewMode === "recent"
                ? "shadow-sm"
                : "text-[oklch(0.5_0_0)] hover:text-[oklch(0.7_0_0)]"
            )}
            style={viewMode === "recent" ? {
              background: "linear-gradient(135deg, oklch(0.18 0.02 65), oklch(0.14 0.01 280))",
              color: "oklch(0.8 0.08 65)",
              border: "1px solid oklch(0.5 0.1 65 / 0.15)",
            } : undefined}
          >
            Recent
          </button>
          <button
            onClick={() => setViewMode("clients")}
            className={cn(
              "flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-all duration-200 tracking-wide",
              viewMode === "clients"
                ? "shadow-sm"
                : "text-[oklch(0.5_0_0)] hover:text-[oklch(0.7_0_0)]"
            )}
            style={viewMode === "clients" ? {
              background: "linear-gradient(135deg, oklch(0.18 0.02 65), oklch(0.14 0.01 280))",
              color: "oklch(0.8 0.08 65)",
              border: "1px solid oklch(0.5 0.1 65 / 0.15)",
            } : undefined}
          >
            Clients
          </button>
        </div>
      </div>

      {viewMode === "recent" ? (
        <>
          <div className="p-3 border-b" style={{ borderColor: "oklch(1 0 0 / 0.06)" }}>
            <button
              onClick={() => {
                const firstClient = clients[0];
                if (firstClient) {
                  onNewChat(firstClient.id);
                }
              }}
              className="flex items-center gap-2 text-xs tracking-wide transition-colors"
              style={{ color: "oklch(0.6 0.12 65)" }}
            >
              <Plus className="w-3.5 h-3.5" />
              New Chat
            </button>
          </div>
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
        <div className="flex-1 overflow-y-auto" style={{ scrollbarGutter: "stable" }}>
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
