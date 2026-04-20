"use client";

import { useMemo } from "react";
import { CaretRight, Plus } from "@phosphor-icons/react";
import { Chat, Client } from "@/types/chat";
import { cn } from "@/lib/utils";
import { formatTimeAgoCompact } from "@/lib/format-time";
import { AgentStateIndicator } from "@/components/ui/agent-state-indicator";
import { ChatRowMenu } from "./chat-row-menu";

interface ChatTreeProps {
  chats: Chat[];
  clients: Client[];
  selectedChatId: string | null;
  expandedClientIds: Set<string>;
  activeClientId: string | null;
  onSelectChat: (chatId: string) => void;
  onSelectClient: (clientId: string) => void;
  onNewChat: (clientId: string) => void;
  onToggleClient: (clientId: string) => void;
  onRenameChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

export function ChatTree({
  chats,
  clients,
  selectedChatId,
  expandedClientIds,
  activeClientId,
  onSelectChat,
  onSelectClient,
  onNewChat,
  onToggleClient,
  onRenameChat,
  onDeleteChat,
}: ChatTreeProps) {
  const chatsByClient = useMemo(() => {
    const map = new Map<string, Chat[]>();
    clients.forEach((c) => map.set(c.id, []));
    chats.forEach((chat) => {
      if (chat.clientId && map.has(chat.clientId)) {
        map.get(chat.clientId)!.push(chat);
      }
    });
    map.forEach((clientChats) => {
      clientChats.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    });
    return map;
  }, [chats, clients]);

  if (clients.length === 0) {
    return (
      <div className="px-4 py-6 text-center type-meta text-muted-foreground">
        No clients
      </div>
    );
  }

  return (
    <div className="flex flex-col py-1 px-[14px]">
      {clients.map((client) => {
        const clientChats = chatsByClient.get(client.id) || [];
        const expanded = expandedClientIds.has(client.id);
        const isActiveClient = client.id === activeClientId;
        const unreadCount = clientChats.filter((c) => c.hasUnread).length;

        return (
          <div key={client.id} className="mb-4">
            {/* Client row */}
            <div className={cn(
              "group relative flex items-center gap-1.5 py-1 pl-2 pr-1.5 rounded-md",
              isActiveClient
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            )}>
              <button
                onClick={() => onToggleClient(client.id)}
                className={cn(
                  "flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded",
                  isActiveClient
                    ? "text-primary-foreground hover:bg-primary-foreground/20"
                    : "text-foreground hover:bg-foreground/15"
                )}
                aria-label={expanded ? "Collapse" : "Expand"}
              >
                <CaretRight
                  className={cn("h-4 w-4", expanded && "rotate-90")}
                />
              </button>

              <button
                onClick={() => onSelectClient(client.id)}
                className={cn(
                  "flex-1 truncate text-left",
                  isActiveClient ? "text-primary-foreground" : "text-foreground"
                )}
              >
                <span className="type-client-name">{client.name}</span>
              </button>

              <button
                onClick={() => onNewChat(client.id)}
                title={`New chat — ${client.name}`}
                className={cn(
                  "group/nc ml-0.5 flex-shrink-0 flex items-center justify-center transition-opacity",
                  unreadCount === 0 && "opacity-0 group-hover:opacity-100"
                )}
              >
                {/* Count pill — hidden on row hover */}
                {unreadCount > 0 && (
                  <span className={cn(
                    "group-hover:hidden flex h-5 min-w-5 items-center justify-center rounded-full px-1.5",
                    isActiveClient ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"
                  )}>
                    <span className="type-status">{unreadCount}</span>
                  </span>
                )}
                {/* Plus circle — shown on row hover */}
                <span className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full transition-colors",
                  unreadCount > 0 ? "hidden group-hover:flex" : "flex",
                  isActiveClient
                    ? "bg-primary-foreground text-primary group-hover/nc:bg-primary-foreground/85"
                    : "bg-primary text-primary-foreground group-hover/nc:bg-primary/85"
                )}>
                  <Plus weight="bold" className="h-3.5 w-3.5" />
                </span>
              </button>
            </div>

            {/* Chat rows */}
            {expanded && clientChats.map((chat) => {
              const isSelected = chat.id === selectedChatId;
              const showState = chat.state === 'running' || chat.state === 'needs-approval';
              return (
                <div key={chat.id} className="group relative">
                <button
                  onClick={() => onSelectChat(chat.id)}
                  className={cn(
                    "relative flex w-full flex-col gap-y-[3px] py-1.5 pl-8 pr-9 text-left rounded-md",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent/60"
                  )}
                >
                  {/* Unread dot, positioned in the gutter */}
                  {chat.hasUnread && !isSelected && (
                    <span className="absolute left-[14px] top-[11px] h-[7px] w-[7px] rounded-full bg-primary" />
                  )}

                  {/* Title · timestamp inline, wraps if long */}
                  <span className={cn(
                    "type-chat-name leading-snug",
                    (isSelected || chat.hasUnread) && "font-semibold!",
                    isSelected ? "text-primary-foreground" : chat.hasUnread ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {chat.title}
                    <span className={cn(
                      "font-normal type-meta",
                      isSelected ? "text-primary-foreground/50" : "text-muted-foreground/60"
                    )}>
                      {"\u00A0\u00A0·\u00A0"}{formatTimeAgoCompact(chat.updatedAt)}
                    </span>
                  </span>

                  {/* State indicator (only when active) */}
                  {showState && (
                    <span className={cn(
                      "inline-flex items-center gap-1.5",
                      isSelected && "[&_*]:!text-primary-foreground"
                    )}>
                      <AgentStateIndicator state={chat.state} detail={chat.stateDetail} />
                    </span>
                  )}
                </button>
                <div className="absolute right-1.5 top-1">
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

            {expanded && clientChats.length === 0 && (
              <div className="py-1.5 pl-[46px] type-meta text-muted-foreground">
                No chats yet
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
