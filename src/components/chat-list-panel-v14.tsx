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
  "--background": "#5C94FC",
  "--foreground": "#1C1C1C",
  "--card": "#1C1C1C",
  "--card-foreground": "#FCFCFC",
  "--popover": "#2C2C2C",
  "--popover-foreground": "#FCFCFC",
  "--primary": "#E44028",
  "--primary-foreground": "#FCFCFC",
  "--secondary": "#2C2C2C",
  "--secondary-foreground": "#FCFCFC",
  "--muted": "#3C3C3C",
  "--muted-foreground": "rgba(252, 252, 252, 0.7)",
  "--accent": "#FAC000",
  "--accent-foreground": "#1C1C1C",
  "--destructive": "#E44028",
  "--border": "#5C5C5C",
  "--input": "#3C3C3C",
  "--ring": "#FAC000",
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

interface ChatItemProps {
  chat: Chat;
  clientName?: string;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

function ChatItem({ chat, clientName, isSelected, onSelect, index }: ChatItemProps) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative cursor-pointer px-3 py-2 transition-all"
      )}
      style={{
        background: isSelected ? "#2C2C2C" : "transparent",
        margin: "2px 4px",
        borderLeft: isSelected ? "4px solid #FAC000" : "4px solid transparent",
        imageRendering: "pixelated",
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        {/* Blinking selector arrow */}
        {isSelected && (
          <span
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "8px",
              color: "#FAC000",
              animation: "v14-blink 1s steps(1) infinite",
              textShadow: "0 0 4px #FAC000",
            }}
          >
            ▶
          </span>
        )}
        {chat.hasUnread && !isSelected && (
          <span
            style={{
              width: "8px",
              height: "8px",
              background: "#E44028",
              display: "inline-block",
              boxShadow: "2px 2px 0 #8C0000",
              flexShrink: 0,
            }}
          />
        )}
        <span
          className="truncate"
          style={{
            fontFamily: "'VT323', monospace",
            color: isSelected ? "#FAC000" : "#FCFCFC",
            fontWeight: isSelected ? 700 : 400,
            fontSize: "16px",
            textShadow: isSelected ? "2px 2px 0 #0C0C0C" : "none",
          }}
        >
          {chat.title.toUpperCase()}
        </span>
      </div>
      <div
        className="mt-0.5 flex items-center gap-1.5"
        style={{
          marginLeft: isSelected ? "20px" : chat.hasUnread ? "20px" : "0",
        }}
      >
        {clientName && (
          <span
            style={{
              fontFamily: "'VT323', monospace",
              fontSize: "14px",
              color: "#30A030",
            }}
          >
            {clientName.toUpperCase()}
          </span>
        )}
        {clientName && (
          <span
            style={{
              fontFamily: "'VT323', monospace",
              fontSize: "14px",
              color: "#F8D878",
              animation: "v14-coin-spin 1.5s steps(4) infinite",
              display: "inline-block",
            }}
          >
            ●
          </span>
        )}
        <span
          style={{
            fontFamily: "'VT323', monospace",
            fontSize: "14px",
            color: "rgba(252, 252, 252, 0.5)",
          }}
        >
          {formatTimeAgo(chat.updatedAt)}
        </span>
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
  const characterIcons = ["♠", "♣", "♥", "♦", "★"];
  const icon = characterIcons[clientIndex % characterIcons.length];

  return (
    <div
      className="mb-0"
      style={{ borderBottom: "2px solid #5C5C5C" }}
    >
      <div
        onClick={onToggleExpand}
        className="flex cursor-pointer items-center justify-between px-3 py-2"
      >
        <div className="flex items-center gap-2">
          <span
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "8px",
              color: isExpanded ? "#FAC000" : "#FCFCFC",
              textShadow: "2px 2px 0 #0C0C0C",
            }}
          >
            {isExpanded ? "▼" : "▶"}
          </span>
          <span
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "8px",
              color: "#F8D878",
              textShadow: "2px 2px 0 #0C0C0C",
            }}
          >
            {icon}
          </span>
          <span
            style={{
              fontFamily: "'Press Start 2P', cursive",
              color: "#FCFCFC",
              fontSize: "7px",
              letterSpacing: "1px",
              textShadow: "2px 2px 0 #0C0C0C",
            }}
          >
            {client.name.toUpperCase()}
          </span>
        </div>
        {client.unreadCount > 0 && (
          <span
            className="flex items-center gap-1"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "7px",
              color: "#F8D878",
              textShadow: "1px 1px 0 #0C0C0C",
            }}
          >
            <span style={{ animation: "v14-coin-spin 1.5s steps(4) infinite", display: "inline-block" }}>●</span>
            ×{String(client.unreadCount).padStart(2, "0")}
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
            className="flex cursor-pointer items-center gap-2 py-2 pl-8 transition-colors"
            style={{ color: "#30A030" }}
          >
            <Plus className="w-3 h-3" />
            <span
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: "6px",
                letterSpacing: "1px",
              }}
            >
              NEW GAME
            </span>
          </div>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className="relative cursor-pointer py-2 pl-8 pr-3"
              style={{
                background:
                  selectedChatId === chat.id
                    ? "#2C2C2C"
                    : "transparent",
                borderLeft: selectedChatId === chat.id
                  ? "4px solid #FAC000"
                  : "4px solid transparent",
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                {selectedChatId === chat.id && (
                  <span
                    style={{
                      fontFamily: "'Press Start 2P', cursive",
                      fontSize: "6px",
                      color: "#FAC000",
                      animation: "v14-blink 1s steps(1) infinite",
                    }}
                  >
                    ▶
                  </span>
                )}
                {chat.hasUnread && selectedChatId !== chat.id && (
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      background: "#E44028",
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div
                    className="truncate"
                    style={{
                      fontFamily: "'VT323', monospace",
                      color:
                        selectedChatId === chat.id
                          ? "#FAC000"
                          : "#FCFCFC",
                      fontWeight: selectedChatId === chat.id ? 700 : 400,
                      fontSize: "15px",
                      textShadow: selectedChatId === chat.id ? "2px 2px 0 #0C0C0C" : "none",
                    }}
                  >
                    {chat.title.toUpperCase()}
                  </div>
                  <div
                    style={{
                      color: "rgba(252, 252, 252, 0.5)",
                      fontFamily: "'VT323', monospace",
                      fontSize: "13px",
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
      className="v14-sidebar flex w-72 flex-col"
      style={{
        background: "#1C1C1C",
        borderRight: "4px solid #FCFCFC",
        fontFamily: "'VT323', monospace",
        imageRendering: "pixelated",
        ...lightVars,
      } as React.CSSProperties}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');

        @keyframes v14-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes v14-coin-spin {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.2); }
        }
        @keyframes v14-save-glow {
          0%, 100% { box-shadow: inset 0 0 6px rgba(250, 192, 0, 0.1); }
          50% { box-shadow: inset 0 0 12px rgba(250, 192, 0, 0.2); }
        }

        .v14-sidebar * {
          border-color: #5C5C5C !important;
          border-radius: 0 !important;
        }
        .v14-sidebar input, .v14-sidebar textarea, .v14-sidebar select {
          color: #FCFCFC !important;
          font-family: 'VT323', monospace !important;
          border-radius: 0 !important;
        }
        .v14-sidebar button {
          font-family: 'VT323', monospace !important;
          border-radius: 0 !important;
        }
        .v14-sidebar [class*="rounded"] {
          border-radius: 0 !important;
        }
      `}</style>

      {/* Title bar - like a game menu header */}
      <div
        className="relative z-10 p-3"
        style={{
          borderBottom: "4px double #5C5C5C",
          background: "linear-gradient(180deg, #2C2C2C 0%, #1C1C1C 100%)",
        }}
      >
        <div
          className="mb-2 text-center"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: "7px",
            color: "#FAC000",
            letterSpacing: "2px",
            textShadow: "2px 2px 0 #0C0C0C",
          }}
        >
          ★ SAVE FILES ★
        </div>
        {/* Mode select - like game mode selection */}
        <div
          className="flex"
          style={{
            border: "2px solid #FCFCFC",
            background: "#0C0C0C",
          }}
        >
          <button
            onClick={() => setViewMode("recent")}
            className="flex-1 py-2 px-3 text-xs"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "6px",
              letterSpacing: "1px",
              background: viewMode === "recent" ? "#E44028" : "transparent",
              color: viewMode === "recent" ? "#FCFCFC" : "rgba(252, 252, 252, 0.4)",
              textShadow: viewMode === "recent" ? "2px 2px 0 #8C0000" : "none",
              borderRight: "2px solid #5C5C5C",
            }}
          >
            RECENT
          </button>
          <button
            onClick={() => setViewMode("clients")}
            className="flex-1 py-2 px-3 text-xs"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "6px",
              letterSpacing: "1px",
              background: viewMode === "clients" ? "#00A800" : "transparent",
              color: viewMode === "clients" ? "#FCFCFC" : "rgba(252, 252, 252, 0.4)",
              textShadow: viewMode === "clients" ? "2px 2px 0 #005000" : "none",
            }}
          >
            PLAYERS
          </button>
        </div>
      </div>

      {viewMode === "recent" ? (
        <>
          <div
            className="relative z-10 p-3"
            style={{ borderBottom: "2px solid #5C5C5C" }}
          >
            <button
              onClick={() => {
                const firstClient = clients[0];
                if (firstClient) {
                  onNewChat(firstClient.id);
                }
              }}
              className="flex items-center gap-2"
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: "7px",
                color: "#30A030",
                letterSpacing: "1px",
                textShadow: "2px 2px 0 #003000",
              }}
            >
              <Plus className="w-3 h-3" />
              CONTINUE?
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

      {/* Bottom status — ground tiles */}
      <div className="relative z-10">
        <div
          style={{
            height: "8px",
            background: "repeating-linear-gradient(90deg, #C84C0C 0px, #C84C0C 8px, #A03C08 8px, #A03C08 16px)",
          }}
        />
        <div
          className="p-2 text-center"
          style={{
            background: "#8C6800",
            fontFamily: "'Press Start 2P', cursive",
            fontSize: "5px",
            color: "rgba(252, 252, 252, 0.4)",
            letterSpacing: "2px",
          }}
        >
          WORLD 1-1 ★ PLAYER 1
        </div>
      </div>
    </div>
  );
}
