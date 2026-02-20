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
        "v6-chat-item p-3 cursor-pointer border-l-2 transition-all duration-200 relative group",
        isSelected
          ? "v6-chat-selected border-[#00fff0] bg-[rgba(0,255,240,0.08)]"
          : "border-transparent hover:bg-[rgba(0,255,240,0.04)] hover:border-[rgba(0,255,240,0.3)]"
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={cn(
            "w-2 h-2 flex-shrink-0 rounded-full transition-all duration-300",
            chat.hasUnread
              ? "bg-[#ff00ff] shadow-[0_0_8px_#ff00ff]"
              : ""
          )}
        />
        <span
          className={cn(
            "truncate text-sm",
            isSelected ? "font-medium text-[#00fff0]" : "text-[#c0c0e0] group-hover:text-[#e0e0ff]"
          )}
        >
          {chat.title}
        </span>
      </div>
      <div className="text-xs mt-1 ml-4 truncate text-[#5a6a8a] group-hover:text-[#7a8aaa]">
        {clientName ? `${clientName} // ` : ""}
        {formatTimeAgo(chat.updatedAt)}
      </div>
      {/* Neon edge glow on hover */}
      <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#00fff0] to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
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
    <div className="border-b border-[rgba(0,255,240,0.08)]">
      <div
        onClick={onToggleExpand}
        className="p-3 flex justify-between items-center cursor-pointer bg-[rgba(0,255,240,0.03)] hover:bg-[rgba(0,255,240,0.06)] transition-colors duration-200 group"
      >
        <div className="flex items-center gap-2">
          <span className="text-[#00fff0] text-xs font-mono opacity-50 group-hover:opacity-100 transition-opacity">
            {isExpanded ? "[-]" : "[+]"}
          </span>
          <span className="font-medium text-[#e0e0ff] text-sm tracking-wide">{client.name}</span>
        </div>
        {client.unreadCount > 0 && (
          <span className="bg-[#ff00ff] text-white text-xs px-1.5 py-0.5 rounded font-mono shadow-[0_0_10px_rgba(255,0,255,0.4)] animate-[v6cl-badge_2s_ease-in-out_infinite]">
            {client.unreadCount}
          </span>
        )}
      </div>
      {isExpanded && (
        <div className="bg-[rgba(5,5,20,0.5)]">
          <div
            onClick={(e) => {
              e.stopPropagation();
              onNewChat();
            }}
            className="pt-1 pb-2 pl-7 hover:bg-[rgba(57,255,20,0.05)] cursor-pointer transition-colors duration-200 group"
          >
            <div className="flex items-center gap-1.5 text-[#39ff14] hover:text-[#5fff3a] text-sm font-mono">
              <Plus className="w-3 h-3" />
              <span className="group-hover:tracking-wider transition-all duration-300">new_chat()</span>
            </div>
          </div>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={cn(
                "p-2.5 pl-7 flex items-center gap-2 cursor-pointer border-l-2 transition-all duration-200 group",
                selectedChatId === chat.id
                  ? "bg-[rgba(0,255,240,0.08)] border-[#00fff0]"
                  : "border-transparent hover:bg-[rgba(0,255,240,0.04)] hover:border-[rgba(0,255,240,0.2)]"
              )}
            >
              <span
                className={cn(
                  "w-2 h-2 flex-shrink-0 rounded-full",
                  chat.hasUnread ? "bg-[#ff00ff] shadow-[0_0_8px_#ff00ff]" : ""
                )}
              />
              <div className="flex-1 min-w-0">
                <div className={cn(
                  "text-sm truncate",
                  selectedChatId === chat.id ? "text-[#00fff0]" : "text-[#c0c0e0] group-hover:text-[#e0e0ff]"
                )}>
                  {chat.title}
                </div>
                <div className="text-xs text-[#5a6a8a] font-mono">
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

  const vars = {
    "--background": "#0a0a1a",
    "--foreground": "#e0e0ff",
    "--card": "rgba(10, 10, 30, 0.9)",
    "--primary": "#00fff0",
    "--primary-foreground": "#0a0a1a",
    "--muted": "rgba(0, 255, 240, 0.06)",
    "--muted-foreground": "#7a8aaa",
    "--accent": "rgba(255, 0, 255, 0.1)",
    "--border": "rgba(0, 255, 240, 0.1)",
  } as React.CSSProperties;

  return (
    <div
      className="w-72 border-r border-[rgba(0,255,240,0.1)] flex flex-col relative overflow-hidden"
      style={vars}
    >
      <style>{`
        @keyframes v6cl-scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        @keyframes v6cl-badge {
          0%, 100% { box-shadow: 0 0 10px rgba(255, 0, 255, 0.4); }
          50% { box-shadow: 0 0 20px rgba(255, 0, 255, 0.7); }
        }
        @keyframes v6cl-headerGlow {
          0%, 100% { box-shadow: inset 0 -1px 0 rgba(0, 255, 240, 0.1); }
          50% { box-shadow: inset 0 -1px 0 rgba(0, 255, 240, 0.3), 0 2px 20px rgba(0, 255, 240, 0.05); }
        }
        @keyframes v6cl-tabActive {
          0%, 100% { box-shadow: 0 0 8px rgba(0, 255, 240, 0.2); }
          50% { box-shadow: 0 0 15px rgba(0, 255, 240, 0.35); }
        }
        .v6cl-bg {
          background: linear-gradient(180deg, #0a0a1a 0%, #0d0d24 100%);
        }
        .v6cl-scanline {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 240, 0.04), transparent);
          animation: v6cl-scanline 6s linear infinite;
          pointer-events: none;
          z-index: 1;
        }
        .v6cl-grid {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(0, 255, 240, 0.015) 1px, transparent 1px);
          background-size: 100% 40px;
          pointer-events: none;
        }
        .v6cl-header {
          animation: v6cl-headerGlow 4s ease-in-out infinite;
        }
        .v6cl-tab-active {
          background: rgba(0, 255, 240, 0.1) !important;
          color: #00fff0 !important;
          border: 1px solid rgba(0, 255, 240, 0.25);
          animation: v6cl-tabActive 3s ease-in-out infinite;
        }
        .v6cl-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 240, 0.2), rgba(255, 0, 255, 0.1), transparent);
        }
        .v6cl-new-chat-btn:hover {
          text-shadow: 0 0 10px rgba(57, 255, 20, 0.5);
        }
        .v6-chat-selected::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #00fff0;
          box-shadow: 0 0 10px #00fff0, 0 0 20px rgba(0, 255, 240, 0.3);
        }
      `}</style>

      {/* Background layers */}
      <div className="v6cl-bg absolute inset-0" />
      <div className="v6cl-grid" />
      <div className="v6cl-scanline" />

      {/* Toggle header */}
      <div className="p-3 relative z-10 v6cl-header">
        <div className="v6cl-divider mb-3" />
        <div className="flex bg-[rgba(0,255,240,0.03)] rounded-lg p-1 border border-[rgba(0,255,240,0.08)]">
          <button
            onClick={() => setViewMode("recent")}
            className={cn(
              "flex-1 py-1.5 px-3 text-xs font-mono rounded-md transition-all duration-300 tracking-wider uppercase",
              viewMode === "recent"
                ? "v6cl-tab-active font-semibold"
                : "text-[#5a6a8a] hover:text-[#00fff0] hover:bg-[rgba(0,255,240,0.04)]"
            )}
          >
            Recent
          </button>
          <button
            onClick={() => setViewMode("clients")}
            className={cn(
              "flex-1 py-1.5 px-3 text-xs font-mono rounded-md transition-all duration-300 tracking-wider uppercase",
              viewMode === "clients"
                ? "v6cl-tab-active font-semibold"
                : "text-[#5a6a8a] hover:text-[#00fff0] hover:bg-[rgba(0,255,240,0.04)]"
            )}
          >
            Clients
          </button>
        </div>
        <div className="v6cl-divider mt-3" />
      </div>

      {viewMode === "recent" ? (
        <>
          <div className="p-3 relative z-10">
            <button
              onClick={() => {
                const firstClient = clients[0];
                if (firstClient) {
                  onNewChat(firstClient.id);
                }
              }}
              className="v6cl-new-chat-btn flex items-center gap-2 text-[#39ff14] hover:text-[#5fff3a] text-sm font-mono transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span className="tracking-wider">NEW_THREAD</span>
            </button>
            <div className="v6cl-divider mt-3" />
          </div>

          <ScrollArea className="flex-1 relative z-10">
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
        <div className="flex-1 overflow-y-auto relative z-10" style={{ scrollbarGutter: "stable" }}>
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

      {/* Bottom accent line */}
      <div className="relative z-10 px-3 py-2">
        <div className="v6cl-divider" />
        <div className="text-center font-mono text-[0.55rem] text-[rgba(0,255,240,0.2)] mt-1 tracking-[0.3em]">
          ENCRYPTED CHANNEL
        </div>
      </div>
    </div>
  );
}
