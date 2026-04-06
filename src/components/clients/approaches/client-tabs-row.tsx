"use client";

import { useEffect, useMemo } from "react";
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
        <span className="mr-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
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
                "flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-medium text-white",
                "ring-2 ring-offset-1 ring-offset-card transition-all",
                isActive
                  ? "ring-primary"
                  : client.unreadCount > 0
                    ? getUrgencyRingColor(client.unreadCount)
                    : "ring-transparent",
                !isActive && "opacity-70 hover:opacity-100"
              )}
              style={getAvatarStyle(client.id)}
            >
              {getInitials(client.name)}
            </div>

            {/* Unread badge overlapping top-right */}
            {client.unreadCount > 0 && (
              <span
                className={cn(
                  "absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center",
                  "rounded-full bg-primary px-0.5 text-[11px] font-medium leading-none text-primary-foreground"
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
