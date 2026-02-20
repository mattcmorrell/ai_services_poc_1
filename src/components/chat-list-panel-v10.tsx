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

const lightVars: Record<string, string> = {
  "--background": "#FAF8F5",
  "--foreground": "#2D2D2D",
  "--card": "#FFFFFF",
  "--card-foreground": "#2D2D2D",
  "--popover": "#FFFFFF",
  "--popover-foreground": "#2D2D2D",
  "--primary": "#E07A5F",
  "--primary-foreground": "#FFFFFF",
  "--secondary": "#F3EFEB",
  "--secondary-foreground": "#444444",
  "--muted": "#F3EFEB",
  "--muted-foreground": "#777777",
  "--accent": "#FDF0EB",
  "--accent-foreground": "#2D2D2D",
  "--destructive": "#C1392B",
  "--border": "#E8E4DF",
  "--input": "#E8E4DF",
  "--ring": "#E07A5F",
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
      className="cursor-pointer px-4 py-3 transition-all duration-200"
      style={{
        background: isSelected ? "#FDF0EB" : "transparent",
        borderLeft: isSelected ? "2px solid #E07A5F" : "2px solid transparent",
        borderBottom: "1px solid rgba(232, 228, 223, 0.6)",
      }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {chat.hasUnread && (
          <span
            className="w-1.5 h-1.5 flex-shrink-0 rounded-full"
            style={{ background: "#E07A5F" }}
          />
        )}
        <span
          className="truncate text-sm"
          style={{
            fontFamily: "'Karla', sans-serif",
            color: isSelected ? "#2D2D2D" : "#555555",
            fontWeight: isSelected ? 600 : 400,
          }}
        >
          {chat.title}
        </span>
      </div>
      <div
        className="mt-1 flex items-center gap-1.5 text-[11px] ml-4"
        style={{
          color: "#999999",
          fontFamily: "'Karla', sans-serif",
        }}
      >
        {clientName && <span>{clientName}</span>}
        {clientName && <span style={{ color: "#CCCCCC" }}>&middot;</span>}
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
    <div style={{ borderBottom: "1px solid #E8E4DF" }}>
      <div
        onClick={onToggleExpand}
        className="flex cursor-pointer items-center justify-between px-4 py-3 transition-colors duration-200"
        style={{
          background: isExpanded ? "rgba(243, 239, 235, 0.5)" : "transparent",
        }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="text-[10px] transition-transform duration-200"
            style={{
              color: "#E07A5F",
              transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
              display: "inline-block",
            }}
          >
            &#9654;
          </span>
          <span
            className="text-sm"
            style={{
              fontFamily: "'Spectral', serif",
              color: "#2D2D2D",
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
              background: "#E07A5F",
              color: "#FFFFFF",
              fontWeight: 600,
              fontFamily: "'Karla', sans-serif",
            }}
          >
            {client.unreadCount}
          </span>
        )}
      </div>
      {isExpanded && (
        <div style={{ background: "#FFFFFF" }}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onNewChat();
            }}
            className="flex cursor-pointer items-center gap-1.5 py-2 pl-9 text-sm transition-colors duration-200"
            style={{ color: "#E07A5F" }}
          >
            <Plus className="w-3 h-3" />
            <span
              className="text-xs"
              style={{ fontFamily: "'Karla', sans-serif", fontWeight: 500 }}
            >
              New chat
            </span>
          </div>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className="relative cursor-pointer py-2.5 pl-9 pr-3 transition-all duration-200"
              style={{
                background: selectedChatId === chat.id ? "#FDF0EB" : "transparent",
                borderLeft: selectedChatId === chat.id ? "2px solid #E07A5F" : "2px solid transparent",
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                {chat.hasUnread && (
                  <span
                    className="w-1.5 h-1.5 flex-shrink-0 rounded-full"
                    style={{ background: "#E07A5F" }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div
                    className="truncate text-sm"
                    style={{
                      fontFamily: "'Karla', sans-serif",
                      color: selectedChatId === chat.id ? "#2D2D2D" : "#555555",
                      fontWeight: selectedChatId === chat.id ? 600 : 400,
                    }}
                  >
                    {chat.title}
                  </div>
                  <div
                    className="text-[11px]"
                    style={{
                      color: "#999999",
                      fontFamily: "'Karla', sans-serif",
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
      className="v10-paper flex w-72 flex-col"
      style={{
        background: "#FAF8F5",
        borderRight: "1px solid #E8E4DF",
        fontFamily: "'Karla', sans-serif",
        color: "#2D2D2D",
        ...lightVars,
      } as React.CSSProperties}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,500;0,600;1,400&family=Karla:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap');

        .v10-paper * {
          border-color: #E8E4DF !important;
        }
        .v10-paper [class*="rounded-xl"],
        .v10-paper [class*="rounded-lg"] {
          border-radius: 6px !important;
        }
        .v10-paper [class*="rounded-full"] {
          border-radius: 9999px !important;
        }
        .v10-paper input, .v10-paper textarea, .v10-paper select {
          color: #2D2D2D !important;
          font-family: 'Karla', sans-serif !important;
        }
        .v10-paper input::placeholder, .v10-paper textarea::placeholder {
          color: #999999 !important;
        }
      `}</style>

      {/* Toggle */}
      <div className="p-3" style={{ borderBottom: "1px solid #E8E4DF" }}>
        <div
          className="flex p-0.5"
          style={{
            background: "#F3EFEB",
            borderRadius: "6px",
            border: "1px solid #E8E4DF",
          }}
        >
          <button
            onClick={() => setViewMode("recent")}
            className="flex-1 py-1.5 px-3 text-xs transition-all duration-200"
            style={{
              borderRadius: "4px",
              fontFamily: "'Karla', sans-serif",
              background: viewMode === "recent" ? "#FFFFFF" : "transparent",
              boxShadow: viewMode === "recent" ? "0 1px 2px rgba(0, 0, 0, 0.06)" : "none",
              color: viewMode === "recent" ? "#2D2D2D" : "#999999",
              fontWeight: viewMode === "recent" ? 600 : 400,
            }}
          >
            Recent
          </button>
          <button
            onClick={() => setViewMode("clients")}
            className="flex-1 py-1.5 px-3 text-xs transition-all duration-200"
            style={{
              borderRadius: "4px",
              fontFamily: "'Karla', sans-serif",
              background: viewMode === "clients" ? "#FFFFFF" : "transparent",
              boxShadow: viewMode === "clients" ? "0 1px 2px rgba(0, 0, 0, 0.06)" : "none",
              color: viewMode === "clients" ? "#2D2D2D" : "#999999",
              fontWeight: viewMode === "clients" ? 600 : 400,
            }}
          >
            Clients
          </button>
        </div>
      </div>

      {viewMode === "recent" ? (
        <>
          <div className="p-3" style={{ borderBottom: "1px solid #E8E4DF" }}>
            <button
              onClick={() => {
                const firstClient = clients[0];
                if (firstClient) {
                  onNewChat(firstClient.id);
                }
              }}
              className="flex items-center gap-2 text-xs transition-colors duration-200"
              style={{
                color: "#E07A5F",
                fontFamily: "'Karla', sans-serif",
                fontWeight: 500,
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
