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

/* --- Colors --- */
const c = {
  bg: "#FAF7F2",
  bgCard: "#FFFFFF",
  bgHover: "#F5F0E8",
  bgActive: "#EDE7DB",
  bgMuted: "#F0EBE3",
  border: "rgba(200, 185, 166, 0.35)",
  borderLight: "rgba(200, 185, 166, 0.2)",
  text: "#3D3529",
  textMuted: "#9C9486",
  textSecondary: "#7A7062",
  accent: "#8B6F47",
  accentLight: "rgba(139, 111, 71, 0.12)",
  serif: "Georgia, 'Times New Roman', serif",
  sans: "'Inter', system-ui, sans-serif",
};

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
      className="cursor-pointer px-4 py-3 transition-colors"
      style={{
        background: isSelected ? c.bgActive : "transparent",
        borderLeft: isSelected ? `2px solid ${c.accent}` : "2px solid transparent",
        color: c.text,
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.background = c.bgHover;
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.background = "transparent";
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        {chat.hasUnread && (
          <span
            className="w-1.5 h-1.5 flex-shrink-0 rounded-full"
            style={{ background: c.accent }}
          />
        )}
        <span
          className="truncate text-sm"
          style={{
            fontWeight: isSelected ? 600 : 400,
            fontFamily: c.serif,
            color: c.text,
          }}
        >
          {chat.title}
        </span>
      </div>
      <div
        className="text-xs mt-1 truncate"
        style={{
          color: c.textMuted,
          fontFamily: c.sans,
          marginLeft: chat.hasUnread ? "14px" : "0",
        }}
      >
        {clientName ? `${clientName}  \u00B7  ` : ""}
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
    <div style={{ borderBottom: `1px solid ${c.border}` }}>
      <div
        onClick={onToggleExpand}
        className="px-4 py-3 flex justify-between items-center cursor-pointer transition-colors"
        style={{ background: c.bgMuted, color: c.text }}
        onMouseEnter={(e) => (e.currentTarget.style.background = c.bgHover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = c.bgMuted)}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: c.textMuted, fontSize: "0.65rem" }}>
            {isExpanded ? "\u25BC" : "\u25B6"}
          </span>
          <span
            style={{
              fontFamily: c.serif,
              fontWeight: 600,
              fontSize: "0.9rem",
              color: c.text,
            }}
          >
            {client.name}
          </span>
        </div>
        {client.unreadCount > 0 && (
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: c.accent,
              color: "#FFFAF4",
              fontFamily: c.sans,
              fontSize: "0.7rem",
            }}
          >
            {client.unreadCount}
          </span>
        )}
      </div>
      {isExpanded && (
        <div style={{ background: c.bg }}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onNewChat();
            }}
            className="pt-2 pb-2 pl-7 cursor-pointer transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.background = c.bgHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div className="flex items-center gap-1.5 text-sm" style={{ color: c.accent }}>
              <Plus className="w-3 h-3" />
              <span style={{ fontFamily: c.sans, fontSize: "0.8rem" }}>New conversation</span>
            </div>
          </div>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className="py-2.5 pl-7 pr-3 flex items-center gap-2 cursor-pointer transition-colors"
              style={{
                background: selectedChatId === chat.id ? c.bgActive : "transparent",
                borderLeft: selectedChatId === chat.id ? `2px solid ${c.accent}` : "2px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (selectedChatId !== chat.id) e.currentTarget.style.background = c.bgHover;
              }}
              onMouseLeave={(e) => {
                if (selectedChatId !== chat.id) e.currentTarget.style.background = "transparent";
              }}
            >
              {chat.hasUnread && (
                <span
                  className="w-1.5 h-1.5 flex-shrink-0 rounded-full"
                  style={{ background: c.accent }}
                />
              )}
              <div className="flex-1 min-w-0">
                <div
                  className="text-sm truncate"
                  style={{ fontFamily: c.serif, color: c.text }}
                >
                  {chat.title}
                </div>
                <div
                  className="text-xs"
                  style={{ color: c.textMuted, fontFamily: c.sans }}
                >
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

  const lightVars: Record<string, string> = {
    "--background": "#FAF7F2",
    "--foreground": "#3D3529",
    "--card": "#FFFFFF",
    "--card-foreground": "#3D3529",
    "--popover": "#FFFFFF",
    "--popover-foreground": "#3D3529",
    "--primary": "#8B6F47",
    "--primary-foreground": "#FAF7F2",
    "--secondary": "#F5F0E8",
    "--secondary-foreground": "#3D3529",
    "--muted": "#F0EBE3",
    "--muted-foreground": "#9C9486",
    "--accent": "#F0EBE3",
    "--accent-foreground": "#3D3529",
    "--destructive": "#C45D4A",
    "--border": "#E5DFD5",
    "--input": "#E5DFD5",
    "--ring": "#8B6F47",
  };

  return (
    <div
      className="w-72 flex flex-col"
      style={{
        background: c.bg,
        borderRight: `1px solid ${c.border}`,
        color: c.text,
        ...lightVars,
      } as React.CSSProperties}
    >
      {/* Header label */}
      <div
        className="px-4 pt-5 pb-1"
        style={{
          fontFamily: c.serif,
          fontSize: "1.1rem",
          fontWeight: 600,
          color: c.text,
          letterSpacing: "-0.01em",
        }}
      >
        Conversations
      </div>

      {/* Toggle */}
      <div className="px-4 py-3" style={{ borderBottom: `1px solid ${c.border}` }}>
        <div
          className="flex rounded-xl p-0.5"
          style={{ background: c.bgMuted }}
        >
          <button
            onClick={() => setViewMode("recent")}
            className="flex-1 py-1.5 px-3 text-sm rounded-lg transition-all"
            style={{
              background: viewMode === "recent" ? c.bgCard : "transparent",
              color: viewMode === "recent" ? c.text : c.textMuted,
              fontWeight: viewMode === "recent" ? 500 : 400,
              fontFamily: c.sans,
              fontSize: "0.8rem",
              boxShadow: viewMode === "recent" ? "0 1px 4px rgba(160, 140, 110, 0.1)" : "none",
            }}
          >
            Recent
          </button>
          <button
            onClick={() => setViewMode("clients")}
            className="flex-1 py-1.5 px-3 text-sm rounded-lg transition-all"
            style={{
              background: viewMode === "clients" ? c.bgCard : "transparent",
              color: viewMode === "clients" ? c.text : c.textMuted,
              fontWeight: viewMode === "clients" ? 500 : 400,
              fontFamily: c.sans,
              fontSize: "0.8rem",
              boxShadow: viewMode === "clients" ? "0 1px 4px rgba(160, 140, 110, 0.1)" : "none",
            }}
          >
            Clients
          </button>
        </div>
      </div>

      {viewMode === "recent" ? (
        <>
          <div className="px-4 py-3" style={{ borderBottom: `1px solid ${c.borderLight}` }}>
            <button
              onClick={() => {
                const firstClient = clients[0];
                if (firstClient) {
                  onNewChat(firstClient.id);
                }
              }}
              className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
              style={{ color: c.accent, fontFamily: c.sans, fontSize: "0.8rem" }}
            >
              <Plus className="w-3.5 h-3.5" />
              New conversation
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
