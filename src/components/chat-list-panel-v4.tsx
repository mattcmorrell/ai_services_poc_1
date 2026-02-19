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

const font = "'Helvetica Neue', Helvetica, Arial, sans-serif";

const lightVars: Record<string, string> = {
  "--background": "#FFFFFF",
  "--foreground": "#000000",
  "--card": "#FFFFFF",
  "--card-foreground": "#000000",
  "--popover": "#FFFFFF",
  "--popover-foreground": "#000000",
  "--primary": "#FF0000",
  "--primary-foreground": "#FFFFFF",
  "--secondary": "#F5F5F5",
  "--secondary-foreground": "#000000",
  "--muted": "#F5F5F5",
  "--muted-foreground": "#666666",
  "--accent": "#F5F5F5",
  "--accent-foreground": "#000000",
  "--destructive": "#FF0000",
  "--border": "#000000",
  "--input": "#E5E5E5",
  "--ring": "#FF0000",
};

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
      className="cursor-pointer px-4 py-3 transition-colors"
      style={{
        background: isSelected ? "#FFFFFF" : "transparent",
        borderLeft: isSelected ? "4px solid #FF0000" : "4px solid transparent",
        borderBottom: "1px solid #000000",
        color: "#000000",
        fontFamily: font,
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.background = "#F5F5F5";
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.background = "transparent";
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        {chat.hasUnread && (
          <span
            className="w-2 h-2 flex-shrink-0"
            style={{ background: "#FF0000" }}
          />
        )}
        <span
          className="truncate text-sm"
          style={{
            fontWeight: isSelected ? 700 : 400,
            fontFamily: font,
            color: "#000000",
            fontSize: "0.85rem",
          }}
        >
          {chat.title}
        </span>
      </div>
      <div
        className="text-xs mt-1 truncate"
        style={{
          color: "#666666",
          fontFamily: font,
          fontSize: "0.65rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginLeft: chat.hasUnread ? "16px" : "0",
        }}
      >
        {clientName ? `${clientName}  /  ` : ""}
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
    <div style={{ borderBottom: "2px solid #000000" }}>
      <div
        onClick={onToggleExpand}
        className="px-4 py-3 flex justify-between items-center cursor-pointer transition-colors"
        style={{
          background: "#F5F5F5",
          color: "#000000",
          fontFamily: font,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#E5E5E5")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#F5F5F5")}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: "#000000", fontSize: "0.5rem", fontFamily: font }}>
            {isExpanded ? "\u25BC" : "\u25B6"}
          </span>
          <span
            style={{
              fontFamily: font,
              fontWeight: 700,
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#000000",
            }}
          >
            {client.name}
          </span>
        </div>
        {client.unreadCount > 0 && (
          <span
            className="text-xs px-2 py-0.5"
            style={{
              background: "#FF0000",
              color: "#FFFFFF",
              fontFamily: font,
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
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
            className="pt-2 pb-2 pl-7 cursor-pointer transition-colors"
            style={{ borderBottom: "1px solid #000000" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F5")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div className="flex items-center gap-1.5 text-sm" style={{ color: "#FF0000" }}>
              <Plus className="w-3 h-3" />
              <span
                style={{
                  fontFamily: font,
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                NEW CONVERSATION
              </span>
            </div>
          </div>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className="py-2.5 pl-7 pr-3 flex items-center gap-2 cursor-pointer transition-colors"
              style={{
                background: selectedChatId === chat.id ? "#FFFFFF" : "transparent",
                borderLeft: selectedChatId === chat.id ? "4px solid #FF0000" : "4px solid transparent",
                borderBottom: "1px solid #E5E5E5",
              }}
              onMouseEnter={(e) => {
                if (selectedChatId !== chat.id) e.currentTarget.style.background = "#F5F5F5";
              }}
              onMouseLeave={(e) => {
                if (selectedChatId !== chat.id) e.currentTarget.style.background = "transparent";
              }}
            >
              {chat.hasUnread && (
                <span
                  className="w-2 h-2 flex-shrink-0"
                  style={{ background: "#FF0000" }}
                />
              )}
              <div className="flex-1 min-w-0">
                <div
                  className="text-sm truncate"
                  style={{ fontFamily: font, color: "#000000", fontSize: "0.85rem" }}
                >
                  {chat.title}
                </div>
                <div
                  className="text-xs"
                  style={{
                    color: "#666666",
                    fontFamily: font,
                    fontSize: "0.6rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
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

  return (
    <div
      className="v4-list w-72 flex flex-col"
      style={{
        background: "#FFFFFF",
        borderRight: "2px solid #000000",
        color: "#000000",
        fontFamily: font,
        ...lightVars,
      } as React.CSSProperties}
    >
      <style>{`
        .v4-list * {
          border-radius: 0 !important;
        }
      `}</style>
      {/* Header */}
      <div
        className="px-4 pt-6 pb-1"
        style={{
          fontFamily: font,
          fontSize: "0.6rem",
          fontWeight: 700,
          color: "#000000",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
        }}
      >
        CONVERSATIONS
      </div>

      {/* Thick red rule */}
      <div
        className="mx-4"
        style={{ height: "3px", background: "#FF0000", marginTop: "8px", marginBottom: "0" }}
      />

      {/* Toggle */}
      <div className="px-4 py-3" style={{ borderBottom: "2px solid #000000" }}>
        <div className="flex gap-0">
          <button
            onClick={() => setViewMode("recent")}
            className="flex-1 py-2 px-3 text-sm transition-all"
            style={{
              background: viewMode === "recent" ? "#000000" : "#FFFFFF",
              color: viewMode === "recent" ? "#FFFFFF" : "#000000",
              fontWeight: 700,
              fontFamily: font,
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              border: "2px solid #000000",
              borderRadius: 0,
            }}
          >
            RECENT
          </button>
          <button
            onClick={() => setViewMode("clients")}
            className="flex-1 py-2 px-3 text-sm transition-all"
            style={{
              background: viewMode === "clients" ? "#000000" : "#FFFFFF",
              color: viewMode === "clients" ? "#FFFFFF" : "#000000",
              fontWeight: 700,
              fontFamily: font,
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              border: "2px solid #000000",
              borderLeft: "none",
              borderRadius: 0,
            }}
          >
            CLIENTS
          </button>
        </div>
      </div>

      {viewMode === "recent" ? (
        <>
          <div className="px-4 py-3" style={{ borderBottom: "1px solid #000000" }}>
            <button
              onClick={() => {
                const firstClient = clients[0];
                if (firstClient) {
                  onNewChat(firstClient.id);
                }
              }}
              className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
              style={{
                color: "#FF0000",
                fontFamily: font,
                fontSize: "0.6rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              NEW CONVERSATION
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
