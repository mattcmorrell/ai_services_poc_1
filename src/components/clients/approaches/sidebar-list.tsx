"use client";

import { useEffect, useMemo } from "react";
import { MessageSquare, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Client, Chat } from "@/types/chat";
import { ChatClientToggle } from "@/components/chat-client-toggle";
import { useResizable, ResizeHandle } from "@/components/ui/resize-handle";

interface SidebarListProps {
  clients: Client[];
  chats: Chat[];
  selectedClientId: string | null;
  onSelectClient: (clientId: string | null) => void;
  children: React.ReactNode;
  tabBar?: React.ReactNode;
  chatPanelMode: "recent" | "clients";
  onChatPanelModeChange: (mode: "recent" | "clients") => void;
}

// Deterministic color palette for client initials
const AVATAR_COLORS = [
  "bg-blue-600",
  "bg-emerald-600",
  "bg-violet-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-cyan-600",
  "bg-indigo-600",
  "bg-teal-600",
  "bg-orange-600",
  "bg-pink-600",
];

function getAvatarColor(clientId: string): string {
  let hash = 0;
  for (let i = 0; i < clientId.length; i++) {
    hash = clientId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function relativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

interface ClientListItem {
  client: Client;
  chatCount: number;
  unreadChats: number;
  lastActivity: Date | null;
}

export function SidebarList({
  clients,
  chats,
  selectedClientId,
  onSelectClient,
  children,
  tabBar,
  chatPanelMode,
  onChatPanelModeChange,
}: SidebarListProps) {
  const { width, onDragStart } = useResizable({
    defaultWidth: 288,
    minWidth: 200,
    maxWidth: 480,
    storageKey: "sidebar-width",
  });

  // Auto-select first client if none selected
  useEffect(() => {
    if (!selectedClientId && clients.length > 0) {
      onSelectClient(clients[0].id);
    }
  }, [selectedClientId, clients, onSelectClient]);

  const clientItems: ClientListItem[] = useMemo(() => {
    return clients.map((client) => {
      const clientChats = chats.filter((c) => c.clientId === client.id);
      const chatCount = clientChats.length;
      const unreadChats = clientChats.filter((c) => c.hasUnread).length;
      const lastActivity = clientChats.length > 0
        ? new Date(Math.max(...clientChats.map((c) => c.updatedAt.getTime())))
        : null;
      return { client, chatCount, unreadChats, lastActivity };
    });
  }, [clients, chats]);

  return (
    <div className="flex h-full flex-1">
      <aside className="flex flex-shrink-0" style={{ width }}><div className="flex min-w-0 flex-1 flex-col bg-card">
        {/* Sidebar header */}
        <div className="flex flex-shrink-0 border-b border-border p-3">
          <ChatClientToggle mode={chatPanelMode} onChange={onChatPanelModeChange} />
        </div>

        {/* Client list */}
        <nav className="flex-1 overflow-y-auto py-1" role="listbox" aria-label="Client list">
          {clientItems.map(({ client, unreadChats, lastActivity }) => {
            const isActive = selectedClientId === client.id;

            return (
              <button
                key={client.id}
                role="option"
                aria-selected={isActive}
                onClick={() => onSelectClient(client.id)}
                title={client.name}
                className={cn(
                  "group relative flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring",
                  isActive
                    ? "border-l-2 border-primary bg-accent"
                    : "border-l-2 border-transparent hover:bg-muted/50"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
                    getAvatarColor(client.id)
                  )}
                >
                  {getInitials(client.name)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "truncate text-sm font-medium transition-colors",
                        isActive
                          ? "text-foreground"
                          : "text-foreground/80 group-hover:text-foreground"
                      )}
                    >
                      {client.name}
                    </span>

                    {unreadChats > 0 && (
                      <span className="flex items-center gap-0.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-medium leading-none text-primary">
                        <MessageSquare className="h-2.5 w-2.5" />
                        {unreadChats}
                      </span>
                    )}
                  </div>

                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-2.5 w-2.5" />
                    {lastActivity ? relativeTime(lastActivity) : "No activity"}
                  </span>
                </div>
              </button>
            );
          })}

          {clientItems.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-xs text-muted-foreground">
                No clients found
              </p>
            </div>
          )}
        </nav>

      </div>
      <ResizeHandle onMouseDown={onDragStart} />
      </aside>

      {/* Main workspace content */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {tabBar}
        <div className="flex flex-1 overflow-hidden">{children}</div>
      </main>
    </div>
  );
}
