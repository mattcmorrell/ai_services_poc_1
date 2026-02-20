"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Search,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
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

function timeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

interface ClientRow {
  client: Client;
  chatCount: number;
  unreadCount: number;
  lastActivity: Date | null;
}

type SortColumn = "name" | "chatCount" | "unreadCount" | "lastActivity";
type SortDirection = "asc" | "desc";

export function BreadcrumbNav({
  clients,
  chats,
  selectedClientId,
  onSelectClient,
  children,
  version,
}: ApproachProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<SortColumn>(
    version >= 2 ? "unreadCount" : "name"
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    version >= 2 ? "desc" : "asc"
  );
  const [quickSwitchOpen, setQuickSwitchOpen] = useState(false);
  const quickSwitchRef = useRef<HTMLDivElement>(null);

  const selectedClient = useMemo(
    () => clients.find((c) => c.id === selectedClientId) ?? null,
    [clients, selectedClientId]
  );

  // Close quick-switch dropdown on click outside
  useEffect(() => {
    if (!quickSwitchOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        quickSwitchRef.current &&
        !quickSwitchRef.current.contains(e.target as Node)
      ) {
        setQuickSwitchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [quickSwitchOpen]);

  const clientRows: ClientRow[] = useMemo(() => {
    return clients.map((client) => {
      const clientChats = chats.filter((c) => c.clientId === client.id);
      const chatCount = clientChats.length;
      const unreadCount = client.unreadCount;

      let lastActivity: Date | null = null;
      for (const chat of clientChats) {
        if (!lastActivity || chat.updatedAt > lastActivity) {
          lastActivity = chat.updatedAt;
        }
      }

      return { client, chatCount, unreadCount, lastActivity };
    });
  }, [clients, chats]);

  const sortedRows = useMemo(() => {
    const rows = [...clientRows];

    rows.sort((a, b) => {
      let cmp = 0;
      switch (sortColumn) {
        case "name":
          cmp = a.client.name.localeCompare(b.client.name);
          break;
        case "chatCount":
          cmp = a.chatCount - b.chatCount;
          break;
        case "unreadCount":
          cmp = a.unreadCount - b.unreadCount;
          break;
        case "lastActivity": {
          const aTime = a.lastActivity?.getTime() ?? 0;
          const bTime = b.lastActivity?.getTime() ?? 0;
          cmp = aTime - bTime;
          break;
        }
      }
      return sortDirection === "asc" ? cmp : -cmp;
    });

    return rows;
  }, [clientRows, sortColumn, sortDirection]);

  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return sortedRows;
    const query = searchQuery.toLowerCase().trim();
    return sortedRows.filter((row) =>
      row.client.name.toLowerCase().includes(query)
    );
  }, [sortedRows, searchQuery]);

  // Recently viewed: top 3 clients by most recent activity
  const recentClients = useMemo(() => {
    if (version < 2) return [];
    return [...clientRows]
      .filter((r) => r.lastActivity !== null)
      .sort(
        (a, b) =>
          (b.lastActivity?.getTime() ?? 0) - (a.lastActivity?.getTime() ?? 0)
      )
      .slice(0, 3);
  }, [clientRows, version]);

  const handleSort = useCallback(
    (column: SortColumn) => {
      if (version < 2) return;
      if (sortColumn === column) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortColumn(column);
        setSortDirection(column === "name" ? "asc" : "desc");
      }
    },
    [version, sortColumn]
  );

  function SortIndicator({ column }: { column: SortColumn }) {
    if (version < 2 || sortColumn !== column) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-0.5 inline h-3 w-3" />
    ) : (
      <ChevronDown className="ml-0.5 inline h-3 w-3" />
    );
  }

  const barHeight = version >= 2 ? "h-9" : "h-10";

  return (
    <div className="flex h-full flex-col">
      {/* Breadcrumb bar */}
      <div
        className={cn(
          "flex flex-shrink-0 items-center gap-2 border-b border-border bg-card px-4",
          barHeight
        )}
      >
        {selectedClient ? (
          // Mode 2: Client selected — breadcrumb with navigation
          <nav
            className="flex items-center gap-1 text-sm"
            aria-label="Breadcrumb"
          >
            <button
              onClick={() => {
                setQuickSwitchOpen(false);
                onSelectClient(null);
              }}
              className={cn(
                "text-muted-foreground transition-colors",
                "hover:text-foreground hover:underline",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:rounded-sm"
              )}
            >
              All Clients
            </button>
            <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/60" />
            {version >= 2 ? (
              // V2: Quick-switch dropdown on client name
              <div className="relative" ref={quickSwitchRef}>
                <button
                  onClick={() => setQuickSwitchOpen((prev) => !prev)}
                  className={cn(
                    "flex items-center gap-1 font-semibold text-foreground transition-colors",
                    "hover:text-primary",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:rounded-sm"
                  )}
                >
                  {selectedClient.name}
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 text-muted-foreground transition-transform",
                      quickSwitchOpen && "rotate-180"
                    )}
                  />
                </button>
                {quickSwitchOpen && (
                  <div
                    className={cn(
                      "absolute left-0 top-full z-50 mt-1 w-64 rounded-md border border-border bg-popover py-1 shadow-lg",
                      "animate-in fade-in-0 zoom-in-95"
                    )}
                  >
                    {clients
                      .filter((c) => c.id !== selectedClientId)
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((client) => (
                        <button
                          key={client.id}
                          onClick={() => {
                            onSelectClient(client.id);
                            setQuickSwitchOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-sm transition-colors",
                            "hover:bg-muted/60",
                            "focus-visible:outline-none focus-visible:bg-muted/60"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white",
                              getAvatarColor(client.id)
                            )}
                          >
                            {getInitials(client.name)}
                          </div>
                          <span className="flex-1 truncate text-foreground">
                            {client.name}
                          </span>
                          {client.unreadCount > 0 && (
                            <span
                              className={cn(
                                "inline-flex h-4 min-w-4 items-center justify-center",
                                "rounded-full bg-primary px-1 text-[9px] font-semibold leading-none text-primary-foreground"
                              )}
                            >
                              {client.unreadCount}
                            </span>
                          )}
                        </button>
                      ))}
                    {clients.filter((c) => c.id !== selectedClientId).length ===
                      0 && (
                      <div className="px-3 py-2 text-xs text-muted-foreground">
                        No other clients
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <span className="font-semibold text-foreground">
                {selectedClient.name}
              </span>
            )}
          </nav>
        ) : (
          // Mode 1: No client selected — breadcrumb label + search
          <div className="flex w-full items-center justify-between gap-3">
            <span className="text-sm font-semibold text-foreground">
              All Clients
            </span>
            <div className="relative max-w-xs flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Filter clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "h-7 w-full rounded-md border border-border bg-background pl-8 pr-3 text-xs",
                  "text-foreground placeholder:text-muted-foreground",
                  "transition-colors focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                )}
              />
            </div>
          </div>
        )}
      </div>

      {/* Content area */}
      {selectedClient ? (
        // Mode 2: Render workspace children
        <div className="flex-1 overflow-hidden">{children}</div>
      ) : (
        // Mode 1: Client table
        <div className="flex-1 overflow-y-auto bg-background">
          {/* V2: Recently Viewed quick-access bar */}
          {version >= 2 && recentClients.length > 0 && (
            <div className="flex items-center gap-3 border-b border-border/50 bg-muted/20 px-4 py-2">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
                Recent
              </span>
              <div className="flex items-center gap-2">
                {recentClients.map((row) => (
                  <button
                    key={row.client.id}
                    onClick={() => onSelectClient(row.client.id)}
                    title={row.client.name}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white transition-all",
                      "ring-2 ring-transparent hover:ring-primary/50 hover:scale-110",
                      "focus-visible:outline-none focus-visible:ring-primary",
                      getAvatarColor(row.client.id)
                    )}
                  >
                    {getInitials(row.client.name)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th
                  className={cn(
                    "px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground",
                    version >= 2 &&
                      "cursor-pointer select-none hover:text-foreground"
                  )}
                  onClick={() => handleSort("name")}
                >
                  Client
                  <SortIndicator column="name" />
                </th>
                <th
                  className={cn(
                    "px-4 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground",
                    version >= 2 &&
                      "cursor-pointer select-none hover:text-foreground"
                  )}
                  onClick={() => handleSort("chatCount")}
                >
                  Active Chats
                  <SortIndicator column="chatCount" />
                </th>
                <th
                  className={cn(
                    "px-4 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground",
                    version >= 2 &&
                      "cursor-pointer select-none hover:text-foreground"
                  )}
                  onClick={() => handleSort("unreadCount")}
                >
                  Unread
                  <SortIndicator column="unreadCount" />
                </th>
                <th
                  className={cn(
                    "px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground",
                    version >= 2 &&
                      "cursor-pointer select-none hover:text-foreground"
                  )}
                  onClick={() => handleSort("lastActivity")}
                >
                  Last Activity
                  <SortIndicator column="lastActivity" />
                </th>
                {/* V2: Extra column for hover action */}
                {version >= 2 && (
                  <th className="w-16 px-4 py-2.5" aria-label="Actions" />
                )}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr
                  key={row.client.id}
                  onClick={() => onSelectClient(row.client.id)}
                  className={cn(
                    "group cursor-pointer border-b border-border/50 transition-colors",
                    "hover:bg-muted/50",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring"
                  )}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectClient(row.client.id);
                    }
                  }}
                >
                  {/* Client name with avatar */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
                          getAvatarColor(row.client.id)
                        )}
                      >
                        {getInitials(row.client.name)}
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {row.client.name}
                      </span>
                    </div>
                  </td>

                  {/* Active chats */}
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {row.chatCount}
                    </span>
                  </td>

                  {/* Unread count */}
                  <td className="px-4 py-3 text-center">
                    {row.unreadCount > 0 ? (
                      <span
                        className={cn(
                          "inline-flex h-5 min-w-5 items-center justify-center",
                          "rounded-full bg-primary px-1.5 text-[10px] font-semibold leading-none text-primary-foreground"
                        )}
                      >
                        {row.unreadCount}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground/50">
                        &mdash;
                      </span>
                    )}
                  </td>

                  {/* Last activity */}
                  <td className="px-4 py-3 text-right">
                    {row.lastActivity ? (
                      <span className="text-sm text-muted-foreground">
                        {timeAgo(row.lastActivity)}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground/50">
                        No activity
                      </span>
                    )}
                  </td>

                  {/* V2: Row hover action */}
                  {version >= 2 && (
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        Open
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </td>
                  )}
                </tr>
              ))}

              {/* Empty states */}
              {filteredRows.length === 0 && searchQuery.trim() && (
                <tr>
                  <td
                    colSpan={version >= 2 ? 5 : 4}
                    className="px-4 py-12 text-center text-sm text-muted-foreground"
                  >
                    No clients matching &ldquo;{searchQuery.trim()}&rdquo;
                  </td>
                </tr>
              )}
              {clients.length === 0 && (
                <tr>
                  <td
                    colSpan={version >= 2 ? 5 : 4}
                    className="px-4 py-12 text-center text-sm text-muted-foreground"
                  >
                    No clients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
