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

const glassVars: Record<string, string> = {
  "--background": "#060608",
  "--foreground": "rgba(255, 255, 255, 0.85)",
  "--card": "rgba(255, 255, 255, 0.03)",
  "--card-foreground": "rgba(255, 255, 255, 0.85)",
  "--popover": "rgba(255, 255, 255, 0.06)",
  "--popover-foreground": "rgba(255, 255, 255, 0.85)",
  "--primary": "rgba(255, 255, 255, 0.9)",
  "--primary-foreground": "#060608",
  "--secondary": "rgba(255, 255, 255, 0.04)",
  "--secondary-foreground": "rgba(255, 255, 255, 0.7)",
  "--muted": "rgba(255, 255, 255, 0.04)",
  "--muted-foreground": "rgba(255, 255, 255, 0.4)",
  "--accent": "rgba(255, 255, 255, 0.06)",
  "--accent-foreground": "rgba(255, 255, 255, 0.85)",
  "--destructive": "rgba(180, 80, 60, 0.8)",
  "--border": "rgba(255, 255, 255, 0.06)",
  "--input": "rgba(255, 255, 255, 0.06)",
  "--ring": "rgba(255, 255, 255, 0.15)",
};

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
        "group relative cursor-pointer px-4 py-3 transition-all duration-300"
      )}
      style={{
        background: isSelected
          ? "linear-gradient(135deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.05) 100%)"
          : "transparent",
        borderRadius: "14px",
        margin: "2px 8px",
        border: isSelected ? "1px solid rgba(255, 255, 255, 0.10)" : "1px solid transparent",
        boxShadow: isSelected ? "inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 4px 16px rgba(0, 0, 0, 0.3)" : "none",
      }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {chat.hasUnread && (
          <span
            className="w-1.5 h-1.5 flex-shrink-0 rounded-full"
            style={{ background: "rgba(105, 134, 124, 0.8)" }}
          />
        )}
        <span
          className={cn("truncate text-sm")}
          style={{
            color: isSelected
              ? "rgba(255, 255, 255, 0.9)"
              : "rgba(255, 255, 255, 0.55)",
            fontWeight: isSelected ? 500 : 300,
          }}
        >
          {chat.title}
        </span>
      </div>
      <div
        className="mt-1 flex items-center gap-1.5 text-[11px] ml-4"
        style={{ color: "rgba(255, 255, 255, 0.25)" }}
      >
        {clientName && <span>{clientName}</span>}
        {clientName && <span style={{ color: "rgba(255, 255, 255, 0.15)" }}>·</span>}
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
    <div
      className="mb-1"
      style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}
    >
      <div
        onClick={onToggleExpand}
        className="flex cursor-pointer items-center justify-between px-4 py-3 transition-colors duration-200"
        style={{
          borderRadius: "12px",
          margin: "0 4px",
        }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="text-[10px] transition-transform duration-300"
            style={{
              color: "rgba(255, 255, 255, 0.25)",
              transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
              display: "inline-block",
            }}
          >
            ▶
          </span>
          <span
            className="text-sm tracking-wide"
            style={{
              color: "rgba(255, 255, 255, 0.65)",
              fontWeight: 400,
            }}
          >
            {client.name}
          </span>
        </div>
        {client.unreadCount > 0 && (
          <span
            className="rounded-full px-2 py-0.5 text-[10px]"
            style={{
              background: "rgba(105, 134, 124, 0.15)",
              color: "rgba(105, 134, 124, 0.9)",
              border: "1px solid rgba(105, 134, 124, 0.15)",
              fontWeight: 400,
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
            className="flex cursor-pointer items-center gap-1.5 py-2 pl-9 text-sm transition-colors duration-200"
            style={{ color: "rgba(255, 255, 255, 0.35)" }}
          >
            <Plus className="w-3 h-3" />
            <span className="text-xs font-light tracking-wide">New chat</span>
          </div>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className="relative cursor-pointer py-2.5 pl-9 pr-3 transition-all duration-300"
              style={{
                background:
                  selectedChatId === chat.id
                    ? "rgba(255, 255, 255, 0.05)"
                    : "transparent",
                borderRadius: "10px",
                margin: "1px 8px",
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                {chat.hasUnread && (
                  <span
                    className="w-1.5 h-1.5 flex-shrink-0 rounded-full"
                    style={{ background: "rgba(105, 134, 124, 0.8)" }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div
                    className="truncate text-sm"
                    style={{
                      color:
                        selectedChatId === chat.id
                          ? "rgba(255, 255, 255, 0.85)"
                          : "rgba(255, 255, 255, 0.5)",
                      fontWeight: selectedChatId === chat.id ? 400 : 300,
                    }}
                  >
                    {chat.title}
                  </div>
                  <div
                    className="text-[11px]"
                    style={{ color: "rgba(255, 255, 255, 0.2)" }}
                  >
                    {formatTimeAgo(chat.updatedAt)}
                  </div>
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
      className="v5-glass flex w-72 flex-col"
      style={{
        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)",
        borderRight: "1px solid rgba(255, 255, 255, 0.10)",
        backdropFilter: "blur(60px) saturate(1.2)",
        WebkitBackdropFilter: "blur(60px) saturate(1.2)",
        fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        boxShadow: "inset -1px 0 0 rgba(255, 255, 255, 0.04)",
        ...glassVars,
      } as React.CSSProperties}
    >
      <style>{`
        .v5-glass *, .v5-glass *::before, .v5-glass *::after {
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        .v5-glass [class*="rounded-xl"],
        .v5-glass [class*="rounded-lg"] {
          border-radius: 20px !important;
        }
        .v5-glass [class*="rounded-full"] {
          border-radius: 9999px !important;
        }
      `}</style>

      {/* Toggle */}
      <div className="p-3" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
        <div
          className="flex p-0.5"
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            borderRadius: "9999px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
          }}
        >
          <button
            onClick={() => setViewMode("recent")}
            className="flex-1 py-1.5 px-3 text-xs transition-all duration-300 tracking-wide"
            style={{
              borderRadius: "9999px",
              background: viewMode === "recent" ? "rgba(255, 255, 255, 0.10)" : "transparent",
              boxShadow: viewMode === "recent" ? "inset 0 1px 0 rgba(255, 255, 255, 0.10), 0 2px 8px rgba(0, 0, 0, 0.3)" : "none",
              color: viewMode === "recent" ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.3)",
              fontWeight: viewMode === "recent" ? 400 : 300,
            }}
          >
            Recent
          </button>
          <button
            onClick={() => setViewMode("clients")}
            className="flex-1 py-1.5 px-3 text-xs transition-all duration-300 tracking-wide"
            style={{
              borderRadius: "9999px",
              background: viewMode === "clients" ? "rgba(255, 255, 255, 0.10)" : "transparent",
              boxShadow: viewMode === "clients" ? "inset 0 1px 0 rgba(255, 255, 255, 0.10), 0 2px 8px rgba(0, 0, 0, 0.3)" : "none",
              color: viewMode === "clients" ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.3)",
              fontWeight: viewMode === "clients" ? 400 : 300,
            }}
          >
            Clients
          </button>
        </div>
      </div>

      {viewMode === "recent" ? (
        <>
          <div className="p-3" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
            <button
              onClick={() => {
                const firstClient = clients[0];
                if (firstClient) {
                  onNewChat(firstClient.id);
                }
              }}
              className="flex items-center gap-2 text-xs font-light tracking-wide transition-colors duration-200"
              style={{ color: "rgba(255, 255, 255, 0.35)" }}
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
