"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { House, Plus, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { Client, Chat } from "@/types/chat";
import type { ClientTab } from "../client-tab-bar";

// ─── Color palettes ───────────────────────────────────────────────

const DOT_COLORS = [
  "bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500",
  "bg-rose-500", "bg-cyan-500", "bg-indigo-500", "bg-teal-500",
  "bg-orange-500", "bg-pink-500",
];

// Chip backgrounds — subtle, low-saturation
const CHIP_COLORS = [
  "bg-blue-500/15", "bg-emerald-500/15", "bg-violet-500/15", "bg-amber-500/15",
  "bg-rose-500/15", "bg-cyan-500/15", "bg-indigo-500/15", "bg-teal-500/15",
  "bg-orange-500/15", "bg-pink-500/15",
];

// Active chip — slightly more saturated
const CHIP_ACTIVE_COLORS = [
  "bg-blue-500/25", "bg-emerald-500/25", "bg-violet-500/25", "bg-amber-500/25",
  "bg-rose-500/25", "bg-cyan-500/25", "bg-indigo-500/25", "bg-teal-500/25",
  "bg-orange-500/25", "bg-pink-500/25",
];

// Faint tab background for inactive tabs in the active group
const TAB_BG_COLORS = [
  "bg-blue-500/8", "bg-emerald-500/8", "bg-violet-500/8", "bg-amber-500/8",
  "bg-rose-500/8", "bg-cyan-500/8", "bg-indigo-500/8", "bg-teal-500/8",
  "bg-orange-500/8", "bg-pink-500/8",
];

// Active tab background — slightly stronger group color so it still belongs
const TAB_ACTIVE_BG_COLORS = [
  "bg-blue-500/15", "bg-emerald-500/15", "bg-violet-500/15", "bg-amber-500/15",
  "bg-rose-500/15", "bg-cyan-500/15", "bg-indigo-500/15", "bg-teal-500/15",
  "bg-orange-500/15", "bg-pink-500/15",
];

// Bottom border accent for the active tab
const BOTTOM_BORDER_COLORS = [
  "shadow-blue-500", "shadow-emerald-500", "shadow-violet-500", "shadow-amber-500",
  "shadow-rose-500", "shadow-cyan-500", "shadow-indigo-500", "shadow-teal-500",
  "shadow-orange-500", "shadow-pink-500",
];

// ─── Helpers ──────────────────────────────────────────────────────
function getColorIndex(clientId: string): number {
  let hash = 0;
  for (let i = 0; i < clientId.length; i++) {
    hash = clientId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % DOT_COLORS.length;
}

// ─── Props ────────────────────────────────────────────────────────
interface TabGroupsProps {
  clients: Client[];
  chats: Chat[];
  selectedClientId: string | null;
  onSelectClient: (clientId: string | null) => void;
  children: React.ReactNode;
  version: number;
  allClientTabs: Map<string, { tabs: ClientTab[]; activeTabId: string }>;
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onNewChat: () => void;
  onOpenChat: (chat: Chat) => void;
}

interface GroupData {
  client: Client;
  tabs: ClientTab[];
  localActiveTabId: string;
  unreadCount: number;
}

export function TabGroups({
  clients,
  chats,
  selectedClientId,
  onSelectClient,
  children,
  allClientTabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewChat,
  onOpenChat,
}: TabGroupsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Only the active group is expanded; all others are collapsed.
  // Selecting a client auto-expands it and collapses the previous one.
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(selectedClientId);

  // When selected client changes, expand that group (collapse others)
  useEffect(() => {
    if (selectedClientId) {
      setExpandedGroupId(selectedClientId);
    }
  }, [selectedClientId]);

  // Build group data from allClientTabs map
  const groups: GroupData[] = useMemo(() => {
    return clients
      .filter((c) => allClientTabs.has(c.id))
      .map((client) => {
        const state = allClientTabs.get(client.id)!;
        const clientChats = chats.filter((ch) => ch.clientId === client.id);
        const unreadCount = clientChats.filter((ch) => ch.hasUnread).length;
        return {
          client,
          tabs: state.tabs,
          localActiveTabId: state.activeTabId,
          unreadCount,
        };
      });
  }, [clients, chats, allClientTabs]);

  // Click group chip
  const handleChipClick = (clientId: string) => {
    if (expandedGroupId === clientId) {
      // Clicking the already-expanded group collapses it
      setExpandedGroupId(null);
    } else {
      // Expand this group + select its client
      setExpandedGroupId(clientId);
      if (clientId !== selectedClientId) {
        onSelectClient(clientId);
      }
    }
  };

  // Click the home icon for a group
  const handleHomeClick = (clientId: string) => {
    if (clientId !== selectedClientId) {
      onSelectClient(clientId);
    }
    onSelectTab("home");
  };

  // Click a chat tab within a group
  const handleTabClick = (tab: ClientTab, clientId: string) => {
    if (tab.type === "home") {
      handleHomeClick(clientId);
      return;
    }
    if (clientId !== selectedClientId) {
      onSelectClient(clientId);
      // For cross-group clicks, use onOpenChat to ensure tab exists after client switch
      const chat = chats.find((c) => c.id === tab.chatId);
      if (chat) {
        onOpenChat(chat);
        return;
      }
    }
    // Tab already exists in current client's state — just activate it
    onSelectTab(tab.id);
  };

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    onCloseTab(tabId);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Chrome-style grouped tab bar */}
      <div className="flex h-10 shrink-0 items-stretch border-b border-border bg-muted/30">
        <div
          ref={scrollRef}
          className="flex min-w-0 flex-1 items-stretch overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {groups.map((group, groupIdx) => {
            const cIdx = getColorIndex(group.client.id);
            const isActive = selectedClientId === group.client.id;
            const isExpanded = expandedGroupId === group.client.id;
            const chatTabs = group.tabs.filter((t) => t.type === "chat") as Extract<ClientTab, { type: "chat" }>[];
            const tabCount = chatTabs.length;

            return (
              <div key={group.client.id} className="flex items-stretch">
                {/* Separator between groups */}
                {groupIdx > 0 && <div className="my-2.5 w-px bg-border/60" />}

                {/* Group chip — compact colored pill */}
                <button
                  onClick={() => handleChipClick(group.client.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 mx-1 my-1.5 transition-all",
                    isActive
                      ? CHIP_ACTIVE_COLORS[cIdx]
                      : CHIP_COLORS[cIdx],
                    "hover:brightness-110",
                  )}
                  title={group.client.name}
                >
                  {/* Color dot */}
                  <span className={cn("h-2 w-2 shrink-0 rounded-full", DOT_COLORS[cIdx])} />

                  {/* Name — truncated to keep chips compact */}
                  <span className={cn(
                    "max-w-[72px] truncate text-[11px] font-medium leading-none",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}>
                    {group.client.name.split(/[\s-]+/)[0]}
                  </span>

                  {/* Collapsed: tab count in a subtle circle */}
                  {!isExpanded && tabCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground/10 px-1 text-[11px] font-medium leading-none text-muted-foreground">
                      {tabCount}
                    </span>
                  )}

                  {/* Unread badge */}
                  {group.unreadCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-medium leading-none text-primary-foreground">
                      {group.unreadCount}
                    </span>
                  )}
                </button>

                {/* Expanded: home icon + tabs + new chat button */}
                {isExpanded && (
                  <>
                    {/* Home icon */}
                    <button
                      onClick={() => handleHomeClick(group.client.id)}
                      className={cn(
                        "flex h-full w-8 shrink-0 items-center justify-center transition-colors",
                        isActive && activeTabId === "home"
                          ? cn(TAB_ACTIVE_BG_COLORS[cIdx], "text-foreground shadow-[inset_0_-2px_0_0]", BOTTOM_BORDER_COLORS[cIdx])
                          : isActive
                            ? cn("text-muted-foreground hover:text-foreground", TAB_BG_COLORS[cIdx])
                            : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      )}
                      title={`${group.client.name} home`}
                    >
                      <House className="h-3.5 w-3.5" />
                    </button>

                    {/* Chat tabs */}
                    {chatTabs.map((tab) => {
                      const isTabActive = isActive && activeTabId === tab.id;

                      return (
                        <div
                          key={tab.id}
                          onClick={() => handleTabClick(tab, group.client.id)}
                          className={cn(
                            "group relative flex h-full max-w-[150px] min-w-0 shrink-0 cursor-pointer items-center pl-2.5 pr-1 transition-colors",
                            isTabActive
                              ? cn(TAB_ACTIVE_BG_COLORS[cIdx], "text-foreground shadow-[inset_0_-2px_0_0]", BOTTOM_BORDER_COLORS[cIdx])
                              : isActive
                                ? cn("text-muted-foreground hover:text-foreground", TAB_BG_COLORS[cIdx])
                                : "text-muted-foreground hover:bg-accent hover:text-foreground",
                          )}
                        >
                          {tab.hasUnread && !isTabActive && (
                            <span className="mr-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          )}
                          <span className="flex-1 truncate text-xs">{tab.title}</span>
                          <button
                            onClick={(e) => handleCloseTab(e, tab.id)}
                            className={cn(
                              "ml-1 flex h-4 w-4 shrink-0 items-center justify-center rounded transition-colors hover:bg-muted-foreground/20",
                              isTabActive
                                ? "opacity-60 hover:opacity-100"
                                : "opacity-0 group-hover:opacity-60 group-hover:hover:opacity-100",
                            )}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })}

                    {/* + button (active group only) */}
                    {isActive && (
                      <div className="flex shrink-0 items-center px-0.5">
                        <button
                          onClick={onNewChat}
                          className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                          title="New chat"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Workspace content */}
      <main className="flex flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
