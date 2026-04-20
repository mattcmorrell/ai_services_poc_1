"use client";

import { useMemo } from "react";
import { Chat, Client } from "@/types/chat";
import { cn } from "@/lib/utils";
import { formatTimeAgoCompact } from "@/lib/format-time";
import { AgentStateIndicator } from "@/components/ui/agent-state-indicator";

interface RecentListProps {
  chats: Chat[];
  clients: Client[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
}

export function RecentList({ chats, clients, selectedChatId, onSelectChat }: RecentListProps) {
  const clientMap = useMemo(() => {
    const m = new Map<string, string>();
    clients.forEach((c) => m.set(c.id, c.name));
    return m;
  }, [clients]);

  const sorted = useMemo(
    () => [...chats].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
    [chats]
  );

  if (sorted.length === 0) {
    return (
      <div className="px-4 py-6 text-center type-meta text-muted-foreground">
        No chats yet
      </div>
    );
  }

  return (
    <div className="flex flex-col py-1 px-[22px]">
      {sorted.map((chat) => {
        const isSelected = chat.id === selectedChatId;
        const hasState = chat.state && chat.state !== 'idle';
        return (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={cn(
              "grid w-full grid-cols-[18px_1fr] gap-x-2 gap-y-[3px] py-2 pl-3 pr-2.5 text-left rounded-md",
              isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent"
            )}
          >
            {/* Col 1: unread dot */}
            <span className="flex items-start justify-center pt-1.5">
              {chat.hasUnread && !isSelected && (
                <span className="h-[7px] w-[7px] rounded-full bg-primary" />
              )}
            </span>

            {/* Col 2: title */}
            <span className={cn(
              "col-start-2 truncate type-chat-name",
              (chat.hasUnread || isSelected) && "font-semibold!",
              isSelected
                ? "text-primary-foreground"
                : chat.hasUnread
                  ? "text-foreground"
                  : "text-muted-foreground"
            )}>
              {chat.title}
            </span>

            {/* Col 2: agent state indicator — own line when present */}
            {hasState && (
              <span className="col-start-2">
                <AgentStateIndicator state={chat.state} detail={chat.stateDetail} />
              </span>
            )}

            {/* Col 2: client · time */}
            <span className={cn(
              "col-start-2 type-meta truncate",
              isSelected ? "text-primary-foreground/75" : "text-muted-foreground"
            )}>
              {chat.clientId ? clientMap.get(chat.clientId) : 'No client'} · {formatTimeAgoCompact(chat.updatedAt)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
