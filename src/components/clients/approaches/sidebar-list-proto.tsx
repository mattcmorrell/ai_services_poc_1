"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Search, MessageSquare, ChevronLeft, ChevronRight, X, Bot, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAvatarStyle } from "@/lib/avatar-colors";
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

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getUrgencyColor(unreadCount: number): string | null {
  if (unreadCount >= 4) return "bg-red-500";
  if (unreadCount >= 1) return "bg-amber-500";
  return null;
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
  agentUpdates: number;
  lastActivity: Date | null;
}

export function SidebarListProto({
  clients,
  chats,
  selectedClientId,
  onSelectClient,
  children,
  tabBar,
  version,
}: ApproachProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isV2 = version >= 2;

  // Auto-select first client if none selected
  useEffect(() => {
    if (!selectedClientId && clients.length > 0) {
      onSelectClient(clients[0].id);
    }
  }, [selectedClientId, clients, onSelectClient]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const clientItems: ClientListItem[] = useMemo(() => {
    return clients.map((client) => {
      const clientChats = chats.filter((c) => c.clientId === client.id);
      const chatCount = clientChats.length;
      const unreadChats = clientChats.filter((c) => c.hasUnread).length;
      const agentUpdates = Math.max(0, client.unreadCount - unreadChats);
      const lastActivity = clientChats.length > 0
        ? new Date(Math.max(...clientChats.map((c) => c.updatedAt.getTime())))
        : null;
      return { client, chatCount, unreadChats, agentUpdates, lastActivity };
    });
  }, [clients, chats]);

  const filteredClientItems = useMemo(() => {
    if (!isV2 || !searchQuery.trim()) return clientItems;
    const query = searchQuery.toLowerCase();
    return clientItems.filter(({ client }) =>
      client.name.toLowerCase().includes(query)
    );
  }, [clientItems, searchQuery, isV2]);

  const handleSearchToggle = () => {
    if (searchOpen) {
      setSearchOpen(false);
      setSearchQuery("");
    } else {
      // Expand sidebar if collapsed when opening search
      if (collapsed) setCollapsed(false);
      setSearchOpen(true);
    }
  };

  const handleCollapseToggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    // Close search when collapsing
    if (next && searchOpen) {
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  // --- V1 render (original) ---
  if (!isV2) {
    return (
      <div className="flex h-full">
          <aside className="flex w-56 flex-shrink-0 flex-col border-r border-border bg-card">
            <div className="flex flex-shrink-0 items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Clients
              </h2>
              <button
                className={cn(
                  "inline-flex h-7 w-7 items-center justify-center rounded-md",
                  "text-muted-foreground transition-colors",
                  "hover:bg-muted hover:text-foreground",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                )}
                aria-label="Search clients"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-1" role="listbox" aria-label="Client list">
              {clientItems.map(({ client, chatCount }) => {
                const isActive = selectedClientId === client.id;

                return (
                  <button
                    key={client.id}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => onSelectClient(client.id)}
                    className={cn(
                      "group relative flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring",
                      isActive
                        ? "border-l-2 border-primary bg-accent"
                        : "border-l-2 border-transparent hover:bg-muted/50"
                    )}
                  >
                    <div
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                      style={getAvatarStyle(client.id)}
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

                        {client.unreadCount > 0 && (
                          <span
                            className={cn(
                              "flex h-5 min-w-5 flex-shrink-0 items-center justify-center",
                              "rounded-full bg-primary px-1.5 text-[10px] font-semibold leading-none text-primary-foreground"
                            )}
                          >
                            {client.unreadCount}
                          </span>
                        )}
                      </div>

                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MessageSquare className="h-3 w-3" />
                        {chatCount} {chatCount === 1 ? "chat" : "chats"}
                      </span>
                    </div>
                  </button>
                );
              })}

              {clients.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <p className="text-xs text-muted-foreground">No clients found</p>
                </div>
              )}
            </nav>
          </aside>

          <main className="flex flex-1 flex-col overflow-hidden">
            {tabBar}
            <div className="flex-1 overflow-hidden">{children}</div>
          </main>
      </div>
    );
  }

  // --- V2/V3/V4 render ---
  const isV3 = version >= 3;
  const isV4 = version >= 4;

  return (
    <div className="flex h-full">
      <aside
        className={cn(
          "flex flex-shrink-0 flex-col border-r border-border bg-card transition-all duration-200",
          collapsed ? "w-12" : "w-56"
        )}
      >
        {/* Sidebar header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-border px-2 py-3">
          {!collapsed && (
            <h2 className="pl-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Clients
            </h2>
          )}

          <div className={cn("flex items-center gap-0.5", collapsed && "mx-auto")}>
            {!collapsed && (
              <button
                onClick={handleSearchToggle}
                className={cn(
                  "inline-flex h-7 w-7 items-center justify-center rounded-md",
                  "text-muted-foreground transition-colors",
                  "hover:bg-muted hover:text-foreground",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  searchOpen && "bg-muted text-foreground"
                )}
                aria-label={searchOpen ? "Close search" : "Search clients"}
              >
                {searchOpen ? (
                  <X className="h-3.5 w-3.5" />
                ) : (
                  <Search className="h-3.5 w-3.5" />
                )}
              </button>
            )}

            <button
              onClick={handleCollapseToggle}
              className={cn(
                "inline-flex h-7 w-7 items-center justify-center rounded-md",
                "text-muted-foreground transition-colors",
                "hover:bg-muted hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              )}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="h-3.5 w-3.5" />
              ) : (
                <ChevronLeft className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Search input (slides down when open) */}
        {!collapsed && (
          <div
            className={cn(
              "overflow-hidden transition-all duration-200",
              searchOpen ? "max-h-12 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="flex items-center gap-2 border-b border-border px-3 py-2">
              <Search className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter clients..."
                className={cn(
                  "h-6 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground",
                  "focus:outline-none"
                )}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Client list */}
        <nav className="flex-1 overflow-y-auto py-1" role="listbox" aria-label="Client list">
          {filteredClientItems.map(({ client, chatCount, unreadChats, agentUpdates, lastActivity }) => {
            const isActive = selectedClientId === client.id;
            const urgencyDot = getUrgencyColor(client.unreadCount);

            if (collapsed) {
              // --- Collapsed row: avatar only, centered ---
              return (
                <button
                  key={client.id}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => onSelectClient(client.id)}
                  title={`${client.name}${client.unreadCount > 0 ? ` (${client.unreadCount} unread)` : ""}${chatCount > 0 ? ` · ${chatCount} chats` : ""}`}
                  className={cn(
                    "group relative flex w-full items-center justify-center py-2 transition-colors",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring",
                    isActive
                      ? "bg-accent"
                      : "hover:bg-muted/50"
                  )}
                >
                  {/* V3: left border indicator in collapsed mode for active client */}
                  {isV3 && isActive && (
                    <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                  )}
                  <div className="relative">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
                      style={getAvatarStyle(client.id)}
                    >
                      {getInitials(client.name)}
                    </div>

                    {/* Unread badge overlapping top-right */}
                    {client.unreadCount > 0 && (
                      <span
                        className={cn(
                          "absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center",
                          "rounded-full bg-primary px-1 text-[9px] font-semibold leading-none text-primary-foreground"
                        )}
                      >
                        {client.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              );
            }

            // --- Expanded row ---
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
                {/* Colored initial circle */}
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={getAvatarStyle(client.id)}
                >
                  {getInitials(client.name)}
                </div>

                {/* Name + chat count */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5">
                      {/* Urgency dot */}
                      {urgencyDot && (
                        <span
                          className={cn(
                            "inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full",
                            urgencyDot
                          )}
                        />
                      )}
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
                    </span>

                    {/* Unread badges */}
                    {isV4 ? (
                      <div className="flex items-center gap-1">
                        {unreadChats > 0 && (
                          <span className="flex items-center gap-0.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-medium leading-none text-primary">
                            <MessageSquare className="h-2.5 w-2.5" />
                            {unreadChats}
                          </span>
                        )}
                        {agentUpdates > 0 && (
                          <span className="flex items-center gap-0.5 rounded-full bg-violet-500/15 px-1.5 py-0.5 text-[9px] font-medium leading-none text-violet-400">
                            <Bot className="h-2.5 w-2.5" />
                            {agentUpdates}
                          </span>
                        )}
                      </div>
                    ) : (
                      client.unreadCount > 0 && (
                        <span
                          className={cn(
                            "flex h-5 min-w-5 flex-shrink-0 items-center justify-center",
                            "rounded-full bg-primary px-1.5 text-[10px] font-semibold leading-none text-primary-foreground"
                          )}
                        >
                          {client.unreadCount}
                        </span>
                      )
                    )}
                  </div>

                  {isV4 ? (
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-2.5 w-2.5" />
                      {lastActivity ? relativeTime(lastActivity) : "No activity"}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MessageSquare className="h-3 w-3" />
                      {chatCount} {chatCount === 1 ? "chat" : "chats"}
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          {/* Empty state */}
          {filteredClientItems.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-xs text-muted-foreground">
                {searchQuery ? "No matching clients" : "No clients found"}
              </p>
            </div>
          )}
        </nav>
      </aside>

      {/* Main workspace content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {tabBar}
        <div className="flex-1 overflow-hidden">{children}</div>
      </main>
    </div>
  );
}
