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

  if (diffMins < 1) return "NOW";
  if (diffMins < 60) return `${diffMins}M AGO`;
  if (diffHours < 24) return `${diffHours}H AGO`;
  if (diffDays === 1) return "1D AGO";
  return `${diffDays}D AGO`;
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
      className={cn("cursor-pointer border-l-3 p-3 transition-none")}
      style={{
        borderLeftColor: isSelected ? "#ff3b00" : "transparent",
        background: isSelected ? "#1a1a1a" : "transparent",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.background = "#141414";
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.background = "transparent";
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="w-2 h-2 flex-shrink-0"
          style={{
            background: chat.hasUnread ? "#ff3b00" : "transparent",
            border: chat.hasUnread ? "none" : "1px solid #333",
          }}
        />
        <span
          className={cn(
            "truncate text-xs uppercase tracking-wide",
            isSelected ? "font-bold" : "font-normal"
          )}
          style={{ color: isSelected ? "#fff" : "#aaa" }}
        >
          {chat.title}
        </span>
      </div>
      <div
        className="text-xs mt-1 ml-4 truncate uppercase tracking-wider"
        style={{ color: "#555", fontSize: "10px" }}
      >
        {clientName ? `${clientName} // ` : ""}
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
    <div className="border-b-2" style={{ borderColor: "#222" }}>
      <div
        onClick={onToggleExpand}
        className="flex cursor-pointer items-center justify-between p-3"
        style={{
          background: "#111",
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#161616")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#111")}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold"
            style={{ color: "#ff3b00" }}
          >
            {isExpanded ? "[-]" : "[+]"}
          </span>
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "#ddd" }}
          >
            {client.name}
          </span>
        </div>
        {client.unreadCount > 0 && (
          <span
            className="px-1.5 py-0.5 text-xs font-bold"
            style={{
              background: "#ff3b00",
              color: "#000",
            }}
          >
            {client.unreadCount}
          </span>
        )}
      </div>
      {isExpanded && (
        <div style={{ background: "#0a0a0a" }}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onNewChat();
            }}
            className="cursor-pointer pb-2 pl-7 pt-1"
            onMouseEnter={(e) => (e.currentTarget.style.background = "#141414")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
              style={{ color: "#ff3b00" }}
            >
              <Plus className="h-3 w-3" strokeWidth={3} />
              <span>NEW SESSION</span>
            </div>
          </div>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={cn(
                "flex cursor-pointer items-center gap-2 border-l-3 p-2.5 pl-7"
              )}
              style={{
                borderLeftColor: selectedChatId === chat.id ? "#ff3b00" : "transparent",
                background: selectedChatId === chat.id ? "#1a1a1a" : "transparent",
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
              }}
              onMouseEnter={(e) => {
                if (selectedChatId !== chat.id) e.currentTarget.style.background = "#141414";
              }}
              onMouseLeave={(e) => {
                if (selectedChatId !== chat.id) e.currentTarget.style.background = "transparent";
              }}
            >
              <span
                className="h-2 w-2 flex-shrink-0"
                style={{
                  background: chat.hasUnread ? "#ff3b00" : "transparent",
                  border: chat.hasUnread ? "none" : "1px solid #333",
                }}
              />
              <div className="min-w-0 flex-1">
                <div
                  className="truncate text-xs uppercase tracking-wide"
                  style={{ color: selectedChatId === chat.id ? "#fff" : "#aaa" }}
                >
                  {chat.title}
                </div>
                <div
                  className="text-xs uppercase tracking-wider"
                  style={{ color: "#555", fontSize: "10px" }}
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
      className="flex w-72 flex-col border-r-2"
      style={{
        borderColor: "#333",
        background: "#0a0a0a",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      }}
    >
      {/* Header */}
      <div
        className="border-b-2 px-3 py-2"
        style={{ borderColor: "#333", background: "#111" }}
      >
        <div
          className="mb-2 text-xs font-bold uppercase tracking-[0.3em]"
          style={{ color: "#ff3b00" }}
        >
          SESSIONS
        </div>
        {/* Toggle */}
        <div className="flex gap-0">
          <button
            onClick={() => setViewMode("recent")}
            className="flex-1 py-1.5 px-3 text-xs font-bold uppercase tracking-wider transition-none border-2"
            style={{
              borderColor: "#333",
              background: viewMode === "recent" ? "#ff3b00" : "transparent",
              color: viewMode === "recent" ? "#000" : "#666",
            }}
          >
            RECENT
          </button>
          <button
            onClick={() => setViewMode("clients")}
            className="flex-1 py-1.5 px-3 text-xs font-bold uppercase tracking-wider transition-none border-2 border-l-0"
            style={{
              borderColor: "#333",
              background: viewMode === "clients" ? "#ff3b00" : "transparent",
              color: viewMode === "clients" ? "#000" : "#666",
            }}
          >
            CLIENTS
          </button>
        </div>
      </div>

      {viewMode === "recent" ? (
        <>
          {/* New Session button */}
          <div
            className="border-b-2 p-3"
            style={{ borderColor: "#222" }}
          >
            <button
              onClick={() => {
                const firstClient = clients[0];
                if (firstClient) {
                  onNewChat(firstClient.id);
                }
              }}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
              style={{ color: "#ff3b00" }}
            >
              <Plus className="h-4 w-4" strokeWidth={3} />
              NEW SESSION
            </button>
          </div>

          {/* Chat list */}
          <ScrollArea className="flex-1">
            {sortedChats.length === 0 && (
              <div
                className="p-4 text-center text-xs uppercase tracking-wider"
                style={{ color: "#444" }}
              >
                NO SESSIONS
              </div>
            )}
            {sortedChats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                clientName={
                  chat.clientId
                    ? clientsMap.get(chat.clientId)?.name
                    : undefined
                }
                isSelected={selectedChatId === chat.id}
                onSelect={() => onSelectChat(chat.id)}
              />
            ))}
          </ScrollArea>
        </>
      ) : (
        <div
          className="flex-1 overflow-y-auto"
          style={{ scrollbarGutter: "stable" }}
        >
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

      {/* Bottom status */}
      <div
        className="border-t-2 px-3 py-1.5"
        style={{ borderColor: "#333", background: "#111" }}
      >
        <div
          className="text-center text-xs uppercase tracking-wider"
          style={{ color: "#333", fontSize: "10px" }}
        >
          {chats.length} TOTAL SESSIONS
        </div>
      </div>
    </div>
  );
}
