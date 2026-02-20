"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { ChevronDown, Check, Search, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Client, Chat } from "@/types/chat";

interface ApproachProps {
  clients: Client[];
  chats: Chat[];
  selectedClientId: string | null;
  onSelectClient: (clientId: string | null) => void;
  children: React.ReactNode;
  version: number;
}

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

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

export function DropdownSwitcher({
  clients,
  chats,
  selectedClientId,
  onSelectClient,
  children,
  version,
}: ApproachProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Auto-select first client if none selected
  useEffect(() => {
    if (!selectedClientId && clients.length > 0) {
      onSelectClient(clients[0].id);
    }
  }, [selectedClientId, clients, onSelectClient]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open) {
      // Small delay to allow the dropdown to render
      const timeout = setTimeout(() => searchRef.current?.focus(), 50);
      return () => clearTimeout(timeout);
    } else {
      setFilter("");
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const chatCountByClient = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const chat of chats) {
      if (chat.clientId) {
        counts[chat.clientId] = (counts[chat.clientId] || 0) + 1;
      }
    }
    return counts;
  }, [chats]);

  // V2: compute last activity timestamp per client from most recent chat updatedAt
  const lastActivityByClient = useMemo(() => {
    if (version < 2) return {};
    const activity: Record<string, Date> = {};
    for (const chat of chats) {
      if (chat.clientId) {
        const existing = activity[chat.clientId];
        if (!existing || chat.updatedAt > existing) {
          activity[chat.clientId] = chat.updatedAt;
        }
      }
    }
    return activity;
  }, [chats, version]);

  // V2: count clients that need attention (unreadCount > 0)
  const clientsNeedingAttention = useMemo(() => {
    if (version < 2) return 0;
    return clients.filter((c) => c.unreadCount > 0).length;
  }, [clients, version]);

  // V2: sort clients — unread pinned to top (desc by unread), then by most recent activity
  const sortedClients = useMemo(() => {
    if (version < 2) return clients;
    return [...clients].sort((a, b) => {
      const aUnread = a.unreadCount > 0;
      const bUnread = b.unreadCount > 0;
      if (aUnread && !bUnread) return -1;
      if (!aUnread && bUnread) return 1;
      if (aUnread && bUnread) return b.unreadCount - a.unreadCount;
      // Both have no unreads — sort by most recent activity
      const aTime = lastActivityByClient[a.id]?.getTime() ?? 0;
      const bTime = lastActivityByClient[b.id]?.getTime() ?? 0;
      return bTime - aTime;
    });
  }, [clients, version, lastActivityByClient]);

  const selectedClient = useMemo(
    () => clients.find((c) => c.id === selectedClientId) ?? null,
    [clients, selectedClientId]
  );

  const filteredClients = useMemo(() => {
    const source = version >= 2 ? sortedClients : clients;
    if (!filter.trim()) return source;
    const query = filter.toLowerCase().trim();
    return source.filter((c) => c.name.toLowerCase().includes(query));
  }, [clients, sortedClients, filter, version]);

  const handleSelect = useCallback(
    (clientId: string) => {
      onSelectClient(clientId);
      setOpen(false);
      triggerRef.current?.focus();
    },
    [onSelectClient]
  );

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="relative flex h-10 flex-shrink-0 items-center border-b border-border bg-background/80 px-3 backdrop-blur-sm">
        <button
          ref={triggerRef}
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            "inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium",
            "transition-colors duration-100",
            "hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            open && "bg-muted/60",
            selectedClient ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {selectedClient ? (
            <>
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold leading-none text-white",
                  getAvatarColor(selectedClient.id)
                )}
              >
                {getInitials(selectedClient.name)}
              </span>
              <span className="max-w-[180px] truncate">
                {selectedClient.name}
              </span>
              {version >= 2 && clientsNeedingAttention > 0 && (
                <span className="text-amber-400 text-[11px] font-normal whitespace-nowrap">
                  · {clientsNeedingAttention} need attention
                </span>
              )}
            </>
          ) : (
            <span>Select a client&hellip;</span>
          )}
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-muted-foreground transition-transform duration-150",
              open && "rotate-180"
            )}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <>
            {/* Backdrop overlay — closes dropdown on click */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />

            {/* Dropdown panel */}
            <div
              ref={dropdownRef}
              className={cn(
                "absolute left-2 top-full z-50 mt-1",
                version >= 2 ? "w-80" : "w-72",
                "rounded-lg border border-border bg-popover shadow-xl shadow-black/10",
                "animate-in fade-in-0 zoom-in-95 slide-in-from-top-1",
                "origin-top-left duration-150"
              )}
            >
              {/* Search */}
              <div className="border-b border-border p-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search clients..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className={cn(
                      "w-full rounded-md bg-muted/50 py-1.5 pl-8 pr-3 text-sm text-foreground",
                      "placeholder:text-muted-foreground/60",
                      "outline-none ring-0 focus:bg-muted/80",
                      "transition-colors duration-100"
                    )}
                  />
                </div>
              </div>

              {/* Client list */}
              <div className="max-h-80 overflow-y-auto overscroll-contain py-1">
                {filteredClients.length === 0 ? (
                  <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                    No clients found
                  </div>
                ) : (
                  filteredClients.map((client) => {
                    const isActive = client.id === selectedClientId;
                    const chatCount = chatCountByClient[client.id] || 0;

                    return (
                      <button
                        key={client.id}
                        onClick={() => handleSelect(client.id)}
                        className={cn(
                          "flex w-full items-center gap-2.5 px-2.5 py-2 text-left text-sm",
                          "transition-colors duration-75",
                          isActive
                            ? "bg-primary/10 text-foreground"
                            : "text-foreground/90 hover:bg-muted/60"
                        )}
                      >
                        {/* Initial circle */}
                        <span
                          className={cn(
                            "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-semibold leading-none text-white",
                            getAvatarColor(client.id)
                          )}
                        >
                          {getInitials(client.name)}
                        </span>

                        {/* Name + chat count */}
                        <div className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate font-medium">
                            {client.name}
                          </span>
                          {chatCount > 0 && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                              <MessageSquare className="h-3 w-3" />
                              {chatCount} {chatCount === 1 ? "chat" : "chats"}
                            </span>
                          )}
                        </div>

                        {/* V2: last activity timestamp */}
                        {version >= 2 && lastActivityByClient[client.id] && (
                          <span className="flex-shrink-0 text-muted-foreground text-[11px]">
                            {timeAgo(lastActivityByClient[client.id])}
                          </span>
                        )}

                        {/* Unread badge */}
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

                        {/* Check mark for active */}
                        {isActive && (
                          <Check className="h-4 w-4 flex-shrink-0 text-primary" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* V2+: keyboard hint footer */}
              {version >= 2 && (
                <div className="border-t border-border px-3 py-1.5 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">
                    ⌘K to quick search
                  </span>
                  {version >= 3 && clientsNeedingAttention > 0 && (
                    <span className="text-[10px] text-muted-foreground">
                      {filteredClients.length} clients
                    </span>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Workspace content */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
