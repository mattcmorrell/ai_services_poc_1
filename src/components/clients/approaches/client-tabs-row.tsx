"use client";

import { useEffect, useMemo } from "react";
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

function getUrgencyRingColor(unreadCount: number): string {
  if (unreadCount >= 4) return "ring-red-500";
  if (unreadCount >= 1) return "ring-amber-500";
  return "ring-transparent";
}

export function ClientTabsRow({
  clients,
  selectedClientId,
  onSelectClient,
  children,
  tabBar,
}: ApproachProps) {
  // Auto-select first client if none selected
  useEffect(() => {
    if (!selectedClientId && clients.length > 0) {
      onSelectClient(clients[0].id);
    }
  }, [selectedClientId, clients, onSelectClient]);

  const clientsWithUnread = useMemo(() => {
    return clients.map((client) => ({
      client,
      isActive: selectedClientId === client.id,
    }));
  }, [clients, selectedClientId]);

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      {/* Horizontal client avatar bar */}
      <div className="flex flex-shrink-0 items-center gap-2 border-b border-border bg-card px-3 py-1">
        <span className="mr-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Clients
        </span>
        {clientsWithUnread.map(({ client, isActive }) => (
          <button
            key={client.id}
            onClick={() => onSelectClient(client.id)}
            title={`${client.name}${client.unreadCount > 0 ? ` (${client.unreadCount} unread)` : ""}`}
            className={cn(
              "group relative flex-shrink-0 transition-all",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:rounded-full"
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-semibold text-white",
                "ring-2 ring-offset-1 ring-offset-card transition-all",
                getAvatarColor(client.id),
                isActive
                  ? "ring-primary"
                  : client.unreadCount > 0
                    ? getUrgencyRingColor(client.unreadCount)
                    : "ring-transparent",
                !isActive && "opacity-70 hover:opacity-100"
              )}
            >
              {getInitials(client.name)}
            </div>

            {/* Unread badge overlapping top-right */}
            {client.unreadCount > 0 && (
              <span
                className={cn(
                  "absolute -right-1 -top-1 flex h-3.5 min-w-3.5 items-center justify-center",
                  "rounded-full bg-primary px-0.5 text-[8px] font-semibold leading-none text-primary-foreground"
                )}
              >
                {client.unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab bar (full width) */}
      {tabBar}
      {/* Workspace content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
