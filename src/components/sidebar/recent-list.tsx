"use client";

import { useMemo } from "react";
import { CircleNotch } from "@phosphor-icons/react";
import { Chat, Client } from "@/types/chat";
import { cn } from "@/lib/utils";
import { formatTimeAgoCompact } from "@/lib/format-time";
import { ChatRowMenu } from "./chat-row-menu";

interface RecentListProps {
  chats: Chat[];
  clients: Client[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onRenameChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

export function RecentList({ chats, clients, selectedChatId, onSelectChat, onRenameChat, onDeleteChat }: RecentListProps) {
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
    <div className="flex flex-col gap-y-1 py-1 px-[14px]">
      {sorted.map((chat) => {
        const isSelected = chat.id === selectedChatId;
        const hasState = chat.state && chat.state !== 'idle';
        return (
          <div key={chat.id} className="group relative">
          <button
            onClick={() => onSelectChat(chat.id)}
            className={cn(
              "relative flex w-full flex-col gap-y-[2px] py-2 pl-8 pr-9 text-left rounded-md",
              isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent"
            )}
          >
            {/* Unread dot, positioned in the gutter — matches Grouped */}
            {chat.hasUnread && !isSelected && (
              <span className="absolute left-[14px] top-[13px] h-[7px] w-[7px] rounded-full bg-primary" />
            )}

            {/* Title */}
            <span className={cn(
              "truncate type-chat-name",
              (chat.hasUnread || isSelected) && "font-semibold!",
              isSelected
                ? "text-primary-foreground"
                : chat.hasUnread
                  ? "text-foreground"
                  : "text-muted-foreground"
            )}>
              {chat.title}
            </span>

            {/* Client · time */}
            <span className={cn(
              "type-meta truncate",
              isSelected ? "text-primary-foreground/75" : "text-muted-foreground"
            )}>
              {chat.clientId ? clientMap.get(chat.clientId) : 'No client'} · {formatTimeAgoCompact(chat.updatedAt)}
            </span>

            {/* Agent state — inline text, not pill */}
            {hasState && (
              <span className={cn(
                "inline-flex items-center gap-1 type-meta font-semibold",
                isSelected
                  ? "text-primary-foreground"
                  : chat.state === 'running'
                    ? "text-[var(--color-info)]"
                    : "text-[var(--color-warning)]"
              )}>
                {chat.state === 'running' && (
                  <CircleNotch weight="bold" className="h-[11px] w-[11px] flex-shrink-0 animate-spin" />
                )}
                {chat.state === 'running'
                  ? (chat.stateDetail ? `Running · ${chat.stateDetail.charAt(0).toUpperCase() + chat.stateDetail.slice(1)}` : 'Running')
                  : chat.state === 'needs-approval'
                    ? (chat.stateDetail ? chat.stateDetail.charAt(0).toUpperCase() + chat.stateDetail.slice(1) : 'Needs approval')
                    : chat.state === 'done'
                      ? 'Done'
                      : null
                }
              </span>
            )}
          </button>
          <div className="absolute right-1.5 top-1.5">
            <ChatRowMenu
              chatId={chat.id}
              onRename={onRenameChat}
              onDelete={onDeleteChat}
              isSelected={isSelected}
            />
          </div>
          </div>
        );
      })}
    </div>
  );
}
