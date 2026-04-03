"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Client, Chat } from "@/types/chat";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mercury Dark Palette
const mercury = {
  bg: "#101214",
  card: "#222428",
  innerSurface: "#222428",
  accent: "#6878B8",
  accentBright: "#8E9AD0",
  alert: "#E08850",
  textBright: "#E8E9ED",
  textPrimary: "#E8E9ED",
  textSecondary: "#9DA0A8",
  success: "#7BAA82",
  danger: "#C07070",
  border: "rgba(180,185,200,0.07)",
};

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
          ? ""
          : ""
      )}
      style={{
        background: isSelected ? "rgba(104, 120, 184, 0.08)" : undefined,
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.background = "rgba(142, 154, 208, 0.04)";
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.background = "";
      }}
    >
      {/* Active indicator — steel blue bar */}
      {isSelected && (
        <div
          className="absolute inset-y-0 left-0 w-[2px]"
          style={{ background: mercury.accent }}
        />
      )}

      <div className="flex items-center gap-2.5 min-w-0">
        {chat.hasUnread && (
          <span
            className="w-1.5 h-1.5 flex-shrink-0 rounded-full"
            style={{ background: mercury.accentBright }}
          />
        )}
        <span className={cn(
          "truncate text-sm",
          isSelected ? "font-medium" : ""
        )} style={{ color: isSelected ? mercury.textBright : mercury.textSecondary }}>
          {chat.title}
        </span>
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-[11px] ml-4" style={{ color: mercury.textSecondary }}>
        {clientName && <span>{clientName}</span>}
        {clientName && <span style={{ color: "rgba(104, 120, 184, 0.4)" }}>·</span>}
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
    <div style={{ borderBottom: `1px solid ${mercury.border}` }}>
      <div
        onClick={onToggleExpand}
        className="flex cursor-pointer items-center justify-between px-4 py-3 transition-colors"
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(142, 154, 208, 0.04)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="text-[11px] transition-transform duration-200"
            style={{ color: mercury.accent, transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
          >
            ▶
          </span>
          <span className="text-sm font-medium tracking-wide" style={{ color: mercury.textPrimary }}>{client.name}</span>
        </div>
        {client.unreadCount > 0 && (
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
            style={{
              background: "rgba(104, 120, 184, 0.12)",
              color: mercury.accentBright,
              border: "1px solid rgba(104, 120, 184, 0.15)",
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
            className="flex cursor-pointer items-center gap-1.5 py-2 pl-9 text-sm transition-colors"
            style={{ color: mercury.accent }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(142, 154, 208, 0.04)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
          >
            <Plus className="w-3 h-3" />
            <span className="text-xs tracking-wide">New chat</span>
          </div>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className="relative cursor-pointer py-2.5 pl-9 pr-3 transition-all duration-200"
              style={{
                background: selectedChatId === chat.id ? "rgba(104, 120, 184, 0.08)" : undefined,
              }}
              onMouseEnter={(e) => {
                if (selectedChatId !== chat.id) e.currentTarget.style.background = "rgba(142, 154, 208, 0.04)";
              }}
              onMouseLeave={(e) => {
                if (selectedChatId !== chat.id) e.currentTarget.style.background = "";
              }}
            >
              {selectedChatId === chat.id && (
                <div
                  className="absolute inset-y-0 left-0 w-[2px]"
                  style={{ background: mercury.accent }}
                />
              )}
              <div className="flex items-center gap-2 min-w-0">
                {chat.hasUnread && (
                  <span className="w-1.5 h-1.5 flex-shrink-0 rounded-full" style={{ background: mercury.accentBright }} />
                )}
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm" style={{ color: mercury.textSecondary }}>{chat.title}</div>
                  <div className="text-[11px]" style={{ color: mercury.textSecondary }}>{formatTimeAgo(chat.updatedAt)}</div>
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
      className="flex w-72 flex-col"
      style={{
        background: mercury.bg,
        borderRight: `1px solid ${mercury.border}`,
      }}
    >
      {/* Toggle */}
      <div className="p-3" style={{ borderBottom: `1px solid ${mercury.border}` }}>
        <div className="flex rounded-lg p-0.5" style={{ background: mercury.innerSurface }}>
          <button
            onClick={() => setViewMode("recent")}
            className={cn(
              "flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-all duration-200 tracking-wide"
            )}
            style={viewMode === "recent" ? {
              background: mercury.card,
              color: mercury.accentBright,
              border: `1px solid ${mercury.border}`,
            } : {
              color: mercury.textSecondary,
            }}
          >
            Recent
          </button>
          <button
            onClick={() => setViewMode("clients")}
            className={cn(
              "flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-all duration-200 tracking-wide"
            )}
            style={viewMode === "clients" ? {
              background: mercury.card,
              color: mercury.accentBright,
              border: `1px solid ${mercury.border}`,
            } : {
              color: mercury.textSecondary,
            }}
          >
            Clients
          </button>
        </div>
      </div>

      {viewMode === "recent" ? (
        <>
          <div className="p-3" style={{ borderBottom: `1px solid ${mercury.border}` }}>
            <button
              onClick={() => {
                const firstClient = clients[0];
                if (firstClient) {
                  onNewChat(firstClient.id);
                }
              }}
              className="flex items-center gap-2 text-xs tracking-wide transition-colors"
              style={{ color: mercury.accent }}
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
