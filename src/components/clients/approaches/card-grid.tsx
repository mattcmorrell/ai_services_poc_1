"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ChatDots, Clock, Users, MagnifyingGlass } from "@phosphor-icons/react";
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
const CARD_COLORS = [
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

function getCardColor(clientId: string): string {
  let hash = 0;
  for (let i = 0; i < clientId.length; i++) {
    hash = clientId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CARD_COLORS[Math.abs(hash) % CARD_COLORS.length];
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

interface ClientCardData {
  client: Client;
  chatCount: number;
  lastActivity: Date | null;
}

export function CardGrid({
  clients,
  chats,
  selectedClientId,
  onSelectClient,
  children,
  tabBar,
  version,
}: ApproachProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const clientData: ClientCardData[] = useMemo(() => {
    return clients.map((client) => {
      const clientChats = chats.filter((c) => c.clientId === client.id);
      const lastActivity =
        clientChats.length > 0
          ? clientChats.reduce((latest, chat) => {
              const chatDate = new Date(chat.updatedAt);
              return chatDate > latest ? chatDate : latest;
            }, new Date(0))
          : null;

      return {
        client,
        chatCount: clientChats.length,
        lastActivity,
      };
    });
  }, [clients, chats]);

  // V2: filtered + sorted client data
  const v2ClientData = useMemo(() => {
    if (version < 2) return clientData;

    const filtered = searchQuery
      ? clientData.filter(({ client }) =>
          client.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : clientData;

    return [...filtered].sort((a, b) => {
      const aUnread = a.client.unreadCount ?? 0;
      const bUnread = b.client.unreadCount ?? 0;

      // Clients with unreads first, sorted by unread count descending
      if (aUnread > 0 && bUnread > 0) return bUnread - aUnread;
      if (aUnread > 0) return -1;
      if (bUnread > 0) return 1;

      // Then alphabetical
      return a.client.name.localeCompare(b.client.name);
    });
  }, [clientData, searchQuery, version]);

  // V2: resolve selected client name for the back button
  const selectedClientName = useMemo(() => {
    if (version < 2 || !selectedClientId) return null;
    const found = clients.find((c) => c.id === selectedClientId);
    return found?.name ?? null;
  }, [version, selectedClientId, clients]);

  // --- Selected client view: back button + workspace ---
  if (selectedClientId) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex-shrink-0 border-b border-border bg-background/80 px-4 py-2 backdrop-blur-sm">
          <button
            onClick={() => onSelectClient(null)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium",
              "text-muted-foreground transition-colors hover:text-foreground",
              "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            {version >= 2 && selectedClientName
              ? selectedClientName
              : "All Clients"}
          </button>
        </div>
        {tabBar}
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    );
  }

  // Determine which data set to render
  const displayData = version >= 2 ? v2ClientData : clientData;

  // --- Home screen: client card grid ---
  return (
    <div className="flex h-full flex-col overflow-auto bg-background">
      <div className="mx-auto w-full max-w-5xl px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Your Clients
            </h1>
          </div>
          <p className="text-sm text-muted-foreground ml-9">
            Select a client to view their workspace and conversations.
          </p>
        </div>

        {/* V2: Search / filter bar */}
        {version >= 2 && clients.length > 0 && (
          <div className="relative mb-6">
            <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients..."
              className={cn(
                "w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground",
                "placeholder:text-muted-foreground",
                "transition-colors focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-ring"
              )}
            />
          </div>
        )}

        {/* Card Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {displayData.map(({ client, chatCount, lastActivity }) => {
            const unread = client.unreadCount ?? 0;

            // V2: determine urgency accent
            const urgencyBorder =
              version >= 2 && unread >= 4
                ? "border-t-2 border-t-red-500"
                : version >= 2 && unread >= 1
                  ? "border-t-2 border-t-amber-500"
                  : version >= 2
                    ? "border-t-2 border-t-transparent"
                    : "";

            return (
              <button
                key={client.id}
                onClick={() => onSelectClient(client.id)}
                className={cn(
                  "group relative flex flex-col items-start gap-4 rounded-xl border border-border",
                  "bg-card p-5 text-left transition-all duration-150",
                  "hover:scale-[1.02] hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  urgencyBorder
                )}
              >
                {/* Unread badge */}
                {unread > 0 && (
                  <span
                    className={cn(
                      "absolute right-4 top-4 flex h-5 min-w-5 items-center justify-center",
                      "rounded-full bg-primary px-1.5 text-[11px] font-semibold leading-none text-primary-foreground"
                    )}
                  >
                    {unread}
                  </span>
                )}

                {/* Avatar + Name */}
                <div className="flex items-center gap-3.5">
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-white",
                      getCardColor(client.id)
                    )}
                  >
                    {getInitials(client.name)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {client.name}
                    </h3>
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex w-full items-center gap-4 border-t border-border/50 pt-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <ChatDots className="h-3.5 w-3.5" />
                    {chatCount} {chatCount === 1 ? "chat" : "chats"}
                  </span>
                  {lastActivity && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {timeAgo(lastActivity)}
                    </span>
                  )}
                </div>

                {/* V2: Status indicator */}
                {version >= 2 && unread >= 4 && (
                  <p className="text-xs font-medium text-red-400">Urgent</p>
                )}
                {version >= 2 && unread >= 1 && unread < 4 && (
                  <p className="text-xs font-medium text-amber-400">
                    Needs attention
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* V2: no results from search */}
        {version >= 2 && clients.length > 0 && displayData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <MagnifyingGlass className="mb-3 h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              No clients matching &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        )}

        {/* Empty state */}
        {clients.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Users className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <h2 className="text-lg font-medium text-foreground">
              No clients yet
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Clients will appear here once they&apos;re added to your account.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
