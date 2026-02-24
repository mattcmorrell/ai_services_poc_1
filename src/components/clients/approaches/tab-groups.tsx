"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Home, Plus, X, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Client, Chat } from "@/types/chat";

interface ApproachProps {
  clients: Client[];
  chats: Chat[];
  selectedClientId: string | null;
  onSelectClient: (clientId: string | null) => void;
  children: React.ReactNode;
  tabBar?: React.ReactNode;
  version: number;
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

// Matching border/accent colors for group separators
const GROUP_BORDER_COLORS = [
  "border-blue-600/40",
  "border-emerald-600/40",
  "border-violet-600/40",
  "border-amber-600/40",
  "border-rose-600/40",
  "border-cyan-600/40",
  "border-indigo-600/40",
  "border-teal-600/40",
  "border-orange-600/40",
  "border-pink-600/40",
];

const GROUP_BG_COLORS = [
  "bg-blue-600/10",
  "bg-emerald-600/10",
  "bg-violet-600/10",
  "bg-amber-600/10",
  "bg-rose-600/10",
  "bg-cyan-600/10",
  "bg-indigo-600/10",
  "bg-teal-600/10",
  "bg-orange-600/10",
  "bg-pink-600/10",
];

const GROUP_ACTIVE_BG_COLORS = [
  "bg-blue-600/20",
  "bg-emerald-600/20",
  "bg-violet-600/20",
  "bg-amber-600/20",
  "bg-rose-600/20",
  "bg-cyan-600/20",
  "bg-indigo-600/20",
  "bg-teal-600/20",
  "bg-orange-600/20",
  "bg-pink-600/20",
];

function getColorIndex(clientId: string): number {
  let hash = 0;
  for (let i = 0; i < clientId.length; i++) {
    hash = clientId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % AVATAR_COLORS.length;
}

function getAvatarColor(clientId: string): string {
  return AVATAR_COLORS[getColorIndex(clientId)];
}

function getGroupBorderColor(clientId: string): string {
  return GROUP_BORDER_COLORS[getColorIndex(clientId)];
}

function getGroupBgColor(clientId: string): string {
  return GROUP_BG_COLORS[getColorIndex(clientId)];
}

function getGroupActiveBgColor(clientId: string): string {
  return GROUP_ACTIVE_BG_COLORS[getColorIndex(clientId)];
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

interface TabItem {
  id: string;
  chatId: string;
  clientId: string;
  title: string;
  hasUnread: boolean;
}

interface ClientGroup {
  client: Client;
  tabs: TabItem[];
  groupUnread: number;
}

export function TabGroups({
  clients,
  chats,
  selectedClientId,
  onSelectClient,
  children,
  tabBar,
  version,
}: ApproachProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  // Build grouped tabs: each client with their chats
  const clientGroups: ClientGroup[] = useMemo(() => {
    return clients.map((client) => {
      const clientChats = chats.filter((c) => c.clientId === client.id);
      const tabs: TabItem[] = clientChats.map((chat) => ({
        id: chat.id,
        chatId: chat.id,
        clientId: client.id,
        title: chat.title,
        hasUnread: chat.hasUnread,
      }));
      const groupUnread = clientChats.filter((c) => c.hasUnread).length;
      return { client, tabs, groupUnread };
    });
  }, [clients, chats]);

  // Auto-select first client and first tab if nothing selected
  useEffect(() => {
    if (!selectedClientId && clientGroups.length > 0) {
      const firstGroup = clientGroups[0];
      onSelectClient(firstGroup.client.id);
      if (firstGroup.tabs.length > 0) {
        setActiveTabId(firstGroup.tabs[0].id);
      }
    }
  }, [selectedClientId, clientGroups, onSelectClient]);

  // When selecting a client via header click, activate the "home" context for that client
  const handleGroupHeaderClick = (clientId: string) => {
    onSelectClient(clientId);
    setActiveTabId(`home-${clientId}`);
  };

  const handleTabClick = (tab: TabItem) => {
    onSelectClient(tab.clientId);
    setActiveTabId(tab.id);
  };

  // Determine if active tab is a "home" pseudo-tab
  const isHomeActive = activeTabId?.startsWith("home-") ?? false;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Grouped tab bar */}
      <div className="flex h-10 shrink-0 items-stretch border-b border-border bg-card">
        <div
          ref={scrollRef}
          className="flex min-w-0 items-stretch overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {clientGroups.map((group, groupIdx) => {
            const isGroupActive = selectedClientId === group.client.id;
            const colorIdx = getColorIndex(group.client.id);

            return (
              <div key={group.client.id} className="flex items-stretch">
                {/* Separator between groups */}
                {groupIdx > 0 && (
                  <div className="my-1.5 w-px bg-border" />
                )}

                {/* Client group header chip */}
                <button
                  onClick={() => handleGroupHeaderClick(group.client.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 px-2.5 transition-colors",
                    "border-r border-border",
                    isGroupActive && isHomeActive
                      ? "bg-background shadow-[inset_0_-2px_0_0] shadow-primary"
                      : isGroupActive
                        ? getGroupBgColor(group.client.id)
                        : "hover:bg-muted/50"
                  )}
                  title={group.client.name}
                >
                  {/* Avatar circle */}
                  <div
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white",
                      getAvatarColor(group.client.id)
                    )}
                  >
                    {getInitials(group.client.name)}
                  </div>

                  {/* Client name (abbreviated) */}
                  <span
                    className={cn(
                      "max-w-[80px] truncate text-[11px] font-semibold",
                      isGroupActive ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {group.client.name.split(/\s+/)[0]}
                  </span>

                  {/* Group unread badge */}
                  {group.groupUnread > 0 && (
                    <span
                      className={cn(
                        "flex h-4 min-w-4 items-center justify-center",
                        "rounded-full bg-primary px-1 text-[9px] font-semibold leading-none text-primary-foreground"
                      )}
                    >
                      {group.groupUnread}
                    </span>
                  )}
                </button>

                {/* Chat tabs for this client */}
                {group.tabs.map((tab) => {
                  const isActive = activeTabId === tab.id;

                  return (
                    <div
                      key={tab.id}
                      onClick={() => handleTabClick(tab)}
                      className={cn(
                        "group relative flex h-full max-w-[160px] min-w-0 shrink-0 cursor-pointer items-center border-r border-border pl-2.5 pr-1 transition-colors",
                        isActive
                          ? "bg-background text-foreground shadow-[inset_0_-2px_0_0] shadow-primary"
                          : isGroupActive
                            ? cn(
                                "text-muted-foreground hover:text-foreground",
                                getGroupBgColor(group.client.id),
                                `hover:${getGroupActiveBgColor(group.client.id)}`
                              )
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      {/* Unread dot */}
                      {tab.hasUnread && !isActive && (
                        <span className="mr-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      )}
                      <span className="flex-1 truncate text-xs">{tab.title}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Add tab button */}
        <div className="flex shrink-0 items-center px-1">
          <button
            className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            title="New chat"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Per-client tab bar (full width) */}
      {tabBar}
      {/* Workspace content */}
      <main className="flex flex-1 overflow-hidden">
        {children ? (
          children
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <MessageSquare className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Select a tab to get started</p>
          </div>
        )}
      </main>
    </div>
  );
}
