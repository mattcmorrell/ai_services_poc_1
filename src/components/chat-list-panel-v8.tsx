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

const darkVars: Record<string, string> = {
  "--background": "#0E0E11",
  "--foreground": "rgba(255, 255, 255, 0.88)",
  "--card": "#161619",
  "--card-foreground": "rgba(255, 255, 255, 0.88)",
  "--popover": "#1A1A1E",
  "--popover-foreground": "rgba(255, 255, 255, 0.88)",
  "--primary": "#C9A96E",
  "--primary-foreground": "#0E0E11",
  "--secondary": "#1C1C20",
  "--secondary-foreground": "rgba(255, 255, 255, 0.75)",
  "--muted": "#1C1C20",
  "--muted-foreground": "rgba(255, 255, 255, 0.55)",
  "--accent": "#1E1E22",
  "--accent-foreground": "rgba(255, 255, 255, 0.88)",
  "--destructive": "#B35044",
  "--border": "rgba(201, 169, 110, 0.08)",
  "--input": "rgba(201, 169, 110, 0.08)",
  "--ring": "#C9A96E",
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
        "group relative cursor-pointer px-4 py-3 transition-all duration-400"
      )}
      style={{
        background: isSelected
          ? "linear-gradient(135deg, rgba(201, 169, 110, 0.08) 0%, rgba(201, 169, 110, 0.03) 100%)"
          : "transparent",
        borderRadius: "12px",
        margin: "2px 8px",
        border: isSelected
          ? "1px solid rgba(201, 169, 110, 0.12)"
          : "1px solid transparent",
      }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {chat.hasUnread && (
          <span
            className="w-1.5 h-1.5 flex-shrink-0 rounded-full"
            style={{ background: "#C9A96E" }}
          />
        )}
        <span
          className="truncate text-sm"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: isSelected
              ? "rgba(255, 255, 255, 0.92)"
              : "rgba(255, 255, 255, 0.6)",
            fontWeight: isSelected ? 500 : 400,
          }}
        >
          {chat.title}
        </span>
      </div>
      <div
        className="mt-1 flex items-center gap-1.5 text-[11px] ml-4"
        style={{
          color: "rgba(255, 255, 255, 0.35)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
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
      style={{ borderBottom: "1px solid rgba(201, 169, 110, 0.04)" }}
    >
      <div
        onClick={onToggleExpand}
        className="flex cursor-pointer items-center justify-between px-4 py-3 transition-colors duration-300"
        style={{
          borderRadius: "10px",
          margin: "0 4px",
        }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="text-[10px] transition-transform duration-300"
            style={{
              color: "rgba(201, 169, 110, 0.4)",
              transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
              display: "inline-block",
            }}
          >
            ▶
          </span>
          <span
            className="text-sm tracking-wide"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              color: "rgba(255, 255, 255, 0.75)",
              fontWeight: 500,
            }}
          >
            {client.name}
          </span>
        </div>
        {client.unreadCount > 0 && (
          <span
            className="rounded-full px-2 py-0.5 text-[10px]"
            style={{
              background: "rgba(201, 169, 110, 0.1)",
              color: "#C9A96E",
              fontWeight: 500,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
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
            <span
              className="text-xs tracking-wide"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400 }}
            >
              New chat
            </span>
          </div>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className="relative cursor-pointer py-2.5 pl-9 pr-3 transition-all duration-300"
              style={{
                background:
                  selectedChatId === chat.id
                    ? "rgba(201, 169, 110, 0.05)"
                    : "transparent",
                borderRadius: "10px",
                margin: "1px 8px",
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                {chat.hasUnread && (
                  <span
                    className="w-1.5 h-1.5 flex-shrink-0 rounded-full"
                    style={{ background: "#C9A96E" }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div
                    className="truncate text-sm"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      color:
                        selectedChatId === chat.id
                          ? "rgba(255, 255, 255, 0.9)"
                          : "rgba(255, 255, 255, 0.55)",
                      fontWeight: selectedChatId === chat.id ? 500 : 400,
                    }}
                  >
                    {chat.title}
                  </div>
                  <div
                    className="text-[11px]"
                    style={{
                      color: "rgba(255, 255, 255, 0.3)",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
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
      className="v8-list flex w-72 flex-col"
      style={{
        background: "linear-gradient(180deg, #121215 0%, #0E0E11 100%)",
        borderRight: "1px solid rgba(201, 169, 110, 0.06)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        ...darkVars,
      } as React.CSSProperties}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap');

        .v8-list * {
          border-color: rgba(201, 169, 110, 0.06) !important;
        }
        .v8-list [class*="rounded-xl"],
        .v8-list [class*="rounded-lg"] {
          border-radius: 12px !important;
        }
        .v8-list [class*="rounded-full"] {
          border-radius: 9999px !important;
        }
        .v8-list input, .v8-list textarea, .v8-list select {
          color: rgba(255, 255, 255, 0.88) !important;
          font-family: 'Plus Jakarta Sans', sans-serif !important;
        }
      `}</style>

      {/* Toggle */}
      <div className="p-3" style={{ borderBottom: "1px solid rgba(201, 169, 110, 0.05)" }}>
        <div
          className="flex p-0.5"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            borderRadius: "9999px",
            border: "1px solid rgba(201, 169, 110, 0.06)",
          }}
        >
          <button
            onClick={() => setViewMode("recent")}
            className="flex-1 py-1.5 px-3 text-xs transition-all duration-300 tracking-wide"
            style={{
              borderRadius: "9999px",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              background: viewMode === "recent"
                ? "linear-gradient(135deg, rgba(201, 169, 110, 0.12) 0%, rgba(201, 169, 110, 0.06) 100%)"
                : "transparent",
              boxShadow: viewMode === "recent"
                ? "0 1px 4px rgba(0, 0, 0, 0.3)"
                : "none",
              color: viewMode === "recent"
                ? "rgba(201, 169, 110, 0.9)"
                : "rgba(255, 255, 255, 0.35)",
              fontWeight: viewMode === "recent" ? 500 : 400,
            }}
          >
            Recent
          </button>
          <button
            onClick={() => setViewMode("clients")}
            className="flex-1 py-1.5 px-3 text-xs transition-all duration-300 tracking-wide"
            style={{
              borderRadius: "9999px",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              background: viewMode === "clients"
                ? "linear-gradient(135deg, rgba(201, 169, 110, 0.12) 0%, rgba(201, 169, 110, 0.06) 100%)"
                : "transparent",
              boxShadow: viewMode === "clients"
                ? "0 1px 4px rgba(0, 0, 0, 0.3)"
                : "none",
              color: viewMode === "clients"
                ? "rgba(201, 169, 110, 0.9)"
                : "rgba(255, 255, 255, 0.35)",
              fontWeight: viewMode === "clients" ? 500 : 400,
            }}
          >
            Clients
          </button>
        </div>
      </div>

      {viewMode === "recent" ? (
        <>
          <div className="p-3" style={{ borderBottom: "1px solid rgba(201, 169, 110, 0.04)" }}>
            <button
              onClick={() => {
                const firstClient = clients[0];
                if (firstClient) {
                  onNewChat(firstClient.id);
                }
              }}
              className="flex items-center gap-2 text-xs tracking-wide transition-colors duration-200"
              style={{
                color: "rgba(255, 255, 255, 0.4)",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 400,
              }}
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
