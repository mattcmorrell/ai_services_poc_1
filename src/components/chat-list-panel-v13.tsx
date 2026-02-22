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
  "--background": "#050510",
  "--foreground": "#E8E0FF",
  "--card": "rgba(232, 224, 255, 0.03)",
  "--card-foreground": "#E8E0FF",
  "--popover": "#0A0A1A",
  "--popover-foreground": "#E8E0FF",
  "--primary": "#E930FF",
  "--primary-foreground": "#050510",
  "--secondary": "#0A0A1A",
  "--secondary-foreground": "rgba(232, 224, 255, 0.8)",
  "--muted": "#0A0A1A",
  "--muted-foreground": "rgba(232, 224, 255, 0.65)",
  "--accent": "#0F0F2A",
  "--accent-foreground": "#E8E0FF",
  "--destructive": "#FF3060",
  "--border": "rgba(233, 48, 255, 0.12)",
  "--input": "rgba(233, 48, 255, 0.12)",
  "--ring": "#30FFB0",
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "NOW";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays === 1) return "1d";
  return `${diffDays}d`;
}

const ACCENT_COLORS = ["#E930FF", "#30FFB0", "#FF3060", "#FFEE30", "#30B0FF"];

interface ChatItemProps {
  chat: Chat;
  clientName?: string;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

function ChatItem({ chat, clientName, isSelected, onSelect, index }: ChatItemProps) {
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];

  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative cursor-pointer px-4 py-3 transition-all duration-300"
      )}
      style={{
        background: isSelected
          ? "rgba(233, 48, 255, 0.04)"
          : "transparent",
        margin: "2px 6px",
        borderLeft: isSelected ? `2px solid ${accent}` : "2px solid transparent",
        boxShadow: isSelected ? `inset 0 0 20px rgba(233, 48, 255, 0.03), 0 0 10px rgba(233, 48, 255, 0.02)` : "none",
      }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {chat.hasUnread && (
          <span
            className="w-2 h-2 flex-shrink-0 rounded-full"
            style={{
              background: accent,
              boxShadow: `0 0 6px ${accent}, 0 0 12px ${accent}60`,
              animation: "v13-star-pulse 2s ease-in-out infinite",
            }}
          />
        )}
        <span
          className="truncate text-sm"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            color: isSelected ? "#E8E0FF" : "rgba(232, 224, 255, 0.55)",
            fontWeight: isSelected ? 600 : 400,
            fontSize: "12px",
            textShadow: isSelected ? `0 0 8px ${accent}30` : "none",
          }}
        >
          {chat.title}
        </span>
      </div>
      <div
        className="mt-1 flex items-center gap-1.5 ml-4"
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "10px",
          color: "rgba(232, 224, 255, 0.4)",
        }}
      >
        {clientName && (
          <span style={{ color: "rgba(48, 255, 176, 0.6)" }}>{clientName}</span>
        )}
        {clientName && <span style={{ color: "rgba(233, 48, 255, 0.3)" }}>◇</span>}
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
  const accent = ACCENT_COLORS[clientIndex % ACCENT_COLORS.length];
  const statusColor = client.unreadCount > 0 ? "#FFEE30" : "#30FFB0";

  return (
    <div
      className="mb-1"
      style={{ borderBottom: "1px solid rgba(233, 48, 255, 0.05)" }}
    >
      <div
        onClick={onToggleExpand}
        className="flex cursor-pointer items-center justify-between px-4 py-3 transition-colors duration-300"
        style={{ margin: "0 4px" }}
      >
        <div className="flex items-center gap-2.5">
          {/* Status light */}
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{
              background: statusColor,
              boxShadow: `0 0 4px ${statusColor}`,
            }}
          />
          <span
            className="text-[10px] transition-transform duration-300"
            style={{
              color: accent,
              transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
              display: "inline-block",
              filter: `drop-shadow(0 0 3px ${accent})`,
            }}
          >
            ▸
          </span>
          <span
            style={{
              fontFamily: "'Silkscreen', cursive",
              color: "rgba(232, 224, 255, 0.85)",
              fontSize: "9px",
              letterSpacing: "1px",
              textShadow: `0 0 6px ${accent}20`,
            }}
          >
            {client.name.toUpperCase()}
          </span>
        </div>
        {client.unreadCount > 0 && (
          <span
            className="px-2 py-0.5"
            style={{
              background: "rgba(255, 238, 48, 0.1)",
              border: "1px solid rgba(255, 238, 48, 0.2)",
              color: "#FFEE30",
              fontWeight: 600,
              fontFamily: "'Silkscreen', cursive",
              fontSize: "8px",
              textShadow: "0 0 4px rgba(255, 238, 48, 0.3)",
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
            style={{ color: "rgba(233, 48, 255, 0.5)" }}
          >
            <Plus className="w-3 h-3" />
            <span
              className="text-xs tracking-widest"
              style={{
                fontFamily: "'Creepster', cursive",
                fontWeight: 400,
                fontSize: "11px",
                letterSpacing: "2px",
              }}
            >
              OPEN PORTAL
            </span>
          </div>
          {chats.map((chat, idx) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className="relative cursor-pointer py-2.5 pl-9 pr-3 transition-all duration-300"
              style={{
                background:
                  selectedChatId === chat.id
                    ? "rgba(233, 48, 255, 0.03)"
                    : "transparent",
                margin: "1px 6px",
                borderLeft: selectedChatId === chat.id
                  ? `2px solid ${ACCENT_COLORS[(clientIndex + idx) % ACCENT_COLORS.length]}`
                  : "2px solid transparent",
                boxShadow: selectedChatId === chat.id
                  ? `inset 0 0 15px rgba(233, 48, 255, 0.02)`
                  : "none",
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                {chat.hasUnread && (
                  <span
                    className="w-1.5 h-1.5 flex-shrink-0 rounded-full"
                    style={{
                      background: ACCENT_COLORS[(clientIndex + idx) % ACCENT_COLORS.length],
                      boxShadow: `0 0 5px ${ACCENT_COLORS[(clientIndex + idx) % ACCENT_COLORS.length]}`,
                    }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div
                    className="truncate text-sm"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      color:
                        selectedChatId === chat.id
                          ? "#E8E0FF"
                          : "rgba(232, 224, 255, 0.5)",
                      fontWeight: selectedChatId === chat.id ? 600 : 400,
                      fontSize: "12px",
                    }}
                  >
                    {chat.title}
                  </div>
                  <div
                    style={{
                      color: "rgba(232, 224, 255, 0.35)",
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "10px",
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
      className="v13-panel flex w-72 flex-col"
      style={{
        background: "linear-gradient(180deg, #070714 0%, #050510 100%)",
        borderRight: "1px solid rgba(233, 48, 255, 0.08)",
        fontFamily: "'IBM Plex Mono', monospace",
        ...darkVars,
      } as React.CSSProperties}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Creepster&display=swap');

        @keyframes v13-star-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
        @keyframes v13-anomaly-pulse {
          0%, 100% { box-shadow: inset 0 0 10px rgba(233, 48, 255, 0.02); }
          50% { box-shadow: inset 0 0 20px rgba(233, 48, 255, 0.05); }
        }

        .v13-panel * {
          border-color: rgba(233, 48, 255, 0.06) !important;
        }
        .v13-panel input, .v13-panel textarea, .v13-panel select {
          color: #E8E0FF !important;
          font-family: 'IBM Plex Mono', monospace !important;
        }
      `}</style>

      {/* Sidebar star field */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${(i * 29 + 5) % 100}%`,
              top: `${(i * 41 + 11) % 100}%`,
              width: "1px",
              height: "1px",
              background: "#E930FF",
              borderRadius: "50%",
              opacity: 0.2 + (i % 3) * 0.1,
            }}
          />
        ))}
      </div>

      {/* Dimension toggle */}
      <div className="relative z-10 p-3" style={{ borderBottom: "1px solid rgba(233, 48, 255, 0.06)" }}>
        {/* Control panel header */}
        <div
          className="mb-2 text-center"
          style={{
            fontFamily: "'Silkscreen', cursive",
            fontSize: "7px",
            color: "rgba(48, 255, 176, 0.4)",
            letterSpacing: "3px",
          }}
        >
          ◈ NAV SYSTEMS ◈
        </div>
        <div
          className="flex p-0.5"
          style={{
            background: "rgba(232, 224, 255, 0.02)",
            border: "1px double rgba(233, 48, 255, 0.12)",
          }}
        >
          <button
            onClick={() => setViewMode("recent")}
            className="flex-1 py-2 px-3 text-xs transition-all duration-300"
            style={{
              fontFamily: "'Silkscreen', cursive",
              fontSize: "8px",
              letterSpacing: "1px",
              background: viewMode === "recent"
                ? "rgba(233, 48, 255, 0.08)"
                : "transparent",
              color: viewMode === "recent"
                ? "#E930FF"
                : "rgba(232, 224, 255, 0.35)",
              textShadow: viewMode === "recent" ? "0 0 8px rgba(233, 48, 255, 0.4)" : "none",
              borderBottom: viewMode === "recent" ? "1px solid #E930FF" : "1px solid transparent",
            }}
          >
            DIMENSION A
          </button>
          <button
            onClick={() => setViewMode("clients")}
            className="flex-1 py-2 px-3 text-xs transition-all duration-300"
            style={{
              fontFamily: "'Silkscreen', cursive",
              fontSize: "8px",
              letterSpacing: "1px",
              background: viewMode === "clients"
                ? "rgba(48, 255, 176, 0.06)"
                : "transparent",
              color: viewMode === "clients"
                ? "#30FFB0"
                : "rgba(232, 224, 255, 0.35)",
              textShadow: viewMode === "clients" ? "0 0 8px rgba(48, 255, 176, 0.4)" : "none",
              borderBottom: viewMode === "clients" ? "1px solid #30FFB0" : "1px solid transparent",
            }}
          >
            DIMENSION B
          </button>
        </div>
      </div>

      {viewMode === "recent" ? (
        <>
          <div className="relative z-10 p-3" style={{ borderBottom: "1px solid rgba(233, 48, 255, 0.04)" }}>
            <button
              onClick={() => {
                const firstClient = clients[0];
                if (firstClient) {
                  onNewChat(firstClient.id);
                }
              }}
              className="flex items-center gap-2 text-xs transition-colors duration-200"
              style={{
                color: "#E930FF",
                fontFamily: "'Creepster', cursive",
                fontSize: "12px",
                letterSpacing: "2px",
                textShadow: "0 0 6px rgba(233, 48, 255, 0.3)",
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              INITIATE CONTACT
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

      {/* Bottom system readout */}
      <div
        className="relative z-10 p-3 text-center"
        style={{
          borderTop: "1px double rgba(233, 48, 255, 0.06)",
          fontFamily: "'Silkscreen', cursive",
          fontSize: "6px",
          color: "rgba(48, 255, 176, 0.25)",
          letterSpacing: "3px",
        }}
      >
        SYS ● NOMINAL ● RIFT STABLE
      </div>
    </div>
  );
}
