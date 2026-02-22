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
  "--background": "#0A0A0A",
  "--foreground": "#FFFFFF",
  "--card": "rgba(255, 255, 255, 0.03)",
  "--card-foreground": "#FFFFFF",
  "--popover": "#111111",
  "--popover-foreground": "#FFFFFF",
  "--primary": "#FF2D6B",
  "--primary-foreground": "#0A0A0A",
  "--secondary": "#111111",
  "--secondary-foreground": "rgba(255, 255, 255, 0.8)",
  "--muted": "#111111",
  "--muted-foreground": "rgba(255, 255, 255, 0.6)",
  "--accent": "#1A1A1A",
  "--accent-foreground": "#FFFFFF",
  "--destructive": "#FF2D6B",
  "--border": "rgba(255, 45, 107, 0.15)",
  "--input": "rgba(255, 45, 107, 0.15)",
  "--ring": "#00FF88",
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "NOW!";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays === 1) return "YST";
  return `${diffDays}d`;
}

const NEON_COLORS = ["#FF2D6B", "#00FF88", "#FFD700", "#00DDFF"];

interface ChatItemProps {
  chat: Chat;
  clientName?: string;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

function ChatItem({ chat, clientName, isSelected, onSelect, index }: ChatItemProps) {
  const accentColor = NEON_COLORS[index % NEON_COLORS.length];

  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative cursor-pointer px-4 py-3 transition-all duration-200"
      )}
      style={{
        background: isSelected
          ? "rgba(255, 255, 255, 0.04)"
          : "transparent",
        margin: "2px 6px",
        borderLeft: isSelected ? `3px solid ${accentColor}` : "3px solid transparent",
        borderRight: isSelected ? `1px dashed rgba(255, 255, 255, 0.06)` : "1px dashed transparent",
      }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {chat.hasUnread && (
          <span
            className="w-2 h-2 flex-shrink-0"
            style={{
              background: accentColor,
              boxShadow: `0 0 8px ${accentColor}`,
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            }}
          />
        )}
        <span
          className="truncate text-sm"
          style={{
            fontFamily: "'Space Mono', monospace",
            color: isSelected ? "#FFFFFF" : "rgba(255, 255, 255, 0.6)",
            fontWeight: isSelected ? 700 : 400,
            fontSize: "12px",
            textShadow: isSelected ? `0 0 10px ${accentColor}40` : "none",
          }}
        >
          {isSelected ? "> " : ""}{chat.title}
        </span>
      </div>
      <div
        className="mt-1 flex items-center gap-1.5 ml-4"
        style={{
          fontFamily: "'Comic Neue', cursive",
          fontSize: "11px",
          color: "rgba(255, 255, 255, 0.4)",
        }}
      >
        {clientName && <span style={{ color: "rgba(0, 255, 136, 0.5)" }}>{clientName}</span>}
        {clientName && <span style={{ color: "rgba(255, 215, 0, 0.3)" }}>⚡</span>}
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
  clientIndex: number;
}

function ClientSection({
  client,
  chats,
  selectedChatId,
  onSelectChat,
  onNewChat,
  isExpanded,
  onToggleExpand,
  clientIndex,
}: ClientSectionProps) {
  const accentColor = NEON_COLORS[clientIndex % NEON_COLORS.length];

  return (
    <div
      className="mb-1"
      style={{ borderBottom: "1px dashed rgba(255, 255, 255, 0.04)" }}
    >
      <div
        onClick={onToggleExpand}
        className="flex cursor-pointer items-center justify-between px-4 py-3 transition-colors duration-200"
        style={{
          margin: "0 4px",
        }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="text-[10px] transition-transform duration-300"
            style={{
              color: accentColor,
              transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
              display: "inline-block",
              filter: `drop-shadow(0 0 4px ${accentColor})`,
            }}
          >
            ▶
          </span>
          <span
            className="text-sm"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              color: "rgba(255, 255, 255, 0.85)",
              fontSize: "9px",
              letterSpacing: "1px",
              textShadow: `1px 0 ${accentColor}40, -1px 0 rgba(0, 221, 255, 0.2)`,
            }}
          >
            {client.name.toUpperCase()}
          </span>
        </div>
        {client.unreadCount > 0 && (
          <span
            className="px-2 py-0.5 text-[9px]"
            style={{
              background: accentColor,
              color: "#0A0A0A",
              fontWeight: 700,
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "7px",
              clipPath: "polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)",
              padding: "3px 10px",
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
            style={{ color: "rgba(0, 255, 136, 0.5)" }}
          >
            <Plus className="w-3 h-3" />
            <span
              className="text-xs tracking-wide"
              style={{
                fontFamily: "'Comic Neue', cursive",
                fontWeight: 700,
              }}
            >
              + NEW GAME
            </span>
          </div>
          {chats.map((chat, idx) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className="relative cursor-pointer py-2.5 pl-9 pr-3 transition-all duration-200"
              style={{
                background:
                  selectedChatId === chat.id
                    ? "rgba(255, 255, 255, 0.03)"
                    : "transparent",
                margin: "1px 6px",
                borderLeft: selectedChatId === chat.id
                  ? `3px solid ${NEON_COLORS[(clientIndex + idx) % NEON_COLORS.length]}`
                  : "3px solid transparent",
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                {chat.hasUnread && (
                  <span
                    className="w-1.5 h-1.5 flex-shrink-0"
                    style={{
                      background: NEON_COLORS[(clientIndex + idx) % NEON_COLORS.length],
                      boxShadow: `0 0 6px ${NEON_COLORS[(clientIndex + idx) % NEON_COLORS.length]}`,
                    }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div
                    className="truncate text-sm"
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      color:
                        selectedChatId === chat.id
                          ? "#FFFFFF"
                          : "rgba(255, 255, 255, 0.55)",
                      fontWeight: selectedChatId === chat.id ? 700 : 400,
                      fontSize: "12px",
                    }}
                  >
                    {selectedChatId === chat.id ? "> " : ""}{chat.title}
                  </div>
                  <div
                    className="text-[11px]"
                    style={{
                      color: "rgba(255, 255, 255, 0.35)",
                      fontFamily: "'Comic Neue', cursive",
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
      className="v12-list flex w-72 flex-col"
      style={{
        background: "#0A0A0A",
        borderRight: "2px solid rgba(255, 45, 107, 0.1)",
        fontFamily: "'Space Mono', monospace",
        ...darkVars,
      } as React.CSSProperties}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Comic+Neue:wght@400;700&display=swap');

        @keyframes v12-border-dance {
          0% { border-color: #FF2D6B; }
          25% { border-color: #00FF88; }
          50% { border-color: #FFD700; }
          75% { border-color: #00DDFF; }
          100% { border-color: #FF2D6B; }
        }
        @keyframes v12-neon-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .v12-list * {
          border-color: rgba(255, 45, 107, 0.08) !important;
        }
        .v12-list input, .v12-list textarea, .v12-list select {
          color: #FFFFFF !important;
          font-family: 'Space Mono', monospace !important;
        }
      `}</style>

      {/* Neon grid on sidebar */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 45, 107, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 45, 107, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Toggle */}
      <div className="relative z-10 p-3" style={{ borderBottom: "1px dashed rgba(255, 45, 107, 0.12)" }}>
        <div
          className="flex p-0.5"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 45, 107, 0.12)",
          }}
        >
          <button
            onClick={() => setViewMode("recent")}
            className="flex-1 py-1.5 px-3 text-xs transition-all duration-200 tracking-widest"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "7px",
              background: viewMode === "recent"
                ? "rgba(255, 45, 107, 0.15)"
                : "transparent",
              color: viewMode === "recent"
                ? "#FF2D6B"
                : "rgba(255, 255, 255, 0.35)",
              fontWeight: 400,
              textShadow: viewMode === "recent" ? "0 0 10px rgba(255, 45, 107, 0.5)" : "none",
              borderBottom: viewMode === "recent" ? "2px solid #FF2D6B" : "2px solid transparent",
            }}
          >
            RECENT
          </button>
          <button
            onClick={() => setViewMode("clients")}
            className="flex-1 py-1.5 px-3 text-xs transition-all duration-200 tracking-widest"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "7px",
              background: viewMode === "clients"
                ? "rgba(0, 255, 136, 0.1)"
                : "transparent",
              color: viewMode === "clients"
                ? "#00FF88"
                : "rgba(255, 255, 255, 0.35)",
              fontWeight: 400,
              textShadow: viewMode === "clients" ? "0 0 10px rgba(0, 255, 136, 0.5)" : "none",
              borderBottom: viewMode === "clients" ? "2px solid #00FF88" : "2px solid transparent",
            }}
          >
            PLAYERS
          </button>
        </div>
      </div>

      {viewMode === "recent" ? (
        <>
          <div className="relative z-10 p-3" style={{ borderBottom: "1px dashed rgba(255, 255, 255, 0.04)" }}>
            <button
              onClick={() => {
                const firstClient = clients[0];
                if (firstClient) {
                  onNewChat(firstClient.id);
                }
              }}
              className="flex items-center gap-2 text-xs tracking-widest transition-colors duration-200"
              style={{
                color: "#FFD700",
                fontFamily: "'Press Start 2P', cursive",
                fontSize: "7px",
                textShadow: "0 0 8px rgba(255, 215, 0, 0.3)",
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              NEW GAME
            </button>
          </div>
          <ScrollArea className="relative z-10 flex-1">
            {sortedChats.map((chat, idx) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                clientName={chat.clientId ? clientsMap.get(chat.clientId)?.name : undefined}
                isSelected={selectedChatId === chat.id}
                onSelect={() => onSelectChat(chat.id)}
                index={idx}
              />
            ))}
          </ScrollArea>
        </>
      ) : (
        <div className="relative z-10 flex-1 overflow-y-auto" style={{ scrollbarGutter: "stable" }}>
          {clients.map((client, idx) => (
            <ClientSection
              key={client.id}
              client={client}
              chats={chatsByClient.get(client.id) || []}
              selectedChatId={selectedChatId}
              onSelectChat={onSelectChat}
              onNewChat={() => onNewChat(client.id)}
              isExpanded={expandedClients.has(client.id)}
              onToggleExpand={() => toggleClientExpanded(client.id)}
              clientIndex={idx}
            />
          ))}
        </div>
      )}
    </div>
  );
}
