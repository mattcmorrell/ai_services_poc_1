"use client";

import { useMemo } from "react";
import { Briefcase, CaretRight, CircleNotch } from "@phosphor-icons/react";
import { Chat, Client } from "@/types/chat";
import { cn } from "@/lib/utils";
import { formatTimeAgoCompact } from "@/lib/format-time";
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
              "group relative flex items-center gap-1.5 py-2 pl-2 pr-2 rounded-md",
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
                    : "text-muted-foreground hover:bg-foreground/15"
                )}
                aria-label={expanded ? "Collapse" : "Expand"}
              >
                <Briefcase className="h-4 w-4 group-hover:hidden" />
                <CaretRight
                  className={cn("h-4 w-4 hidden group-hover:block", expanded && "rotate-90")}
                />
              </button>

              <button
                onClick={() => onSelectClient(client.id)}
                className={cn(
                  "flex-1 min-w-0 text-left flex items-center gap-1.5",
                  isActiveClient ? "text-primary-foreground" : "text-foreground"
                )}
              >
                <span className="type-client-name font-semibold truncate">{client.name}</span>
              </button>

              {unreadCount > 0 && !isActiveClient && (
                <span className="group-hover:hidden ml-auto flex-shrink-0 text-[11px] font-bold leading-none px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground">
                  {unreadCount}
                </span>
              )}

              <button
                onClick={() => onNewChat(client.id)}
                className={cn(
                  "absolute right-2 flex-shrink-0 text-[11px] font-semibold leading-none px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity",
                  isActiveClient
                    ? "bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
                    : "bg-primary text-primary-foreground hover:bg-primary/85"
                )}
              >
                New Chat
              </button>
            </div>

            {/* Chat rows */}
            {expanded && <div className="flex flex-col gap-y-1">{clientChats.map((chat) => {
              const isSelected = chat.id === selectedChatId;
              const showState = chat.state === 'running' || chat.state === 'needs-approval';
              return (
                <div key={chat.id} className="group relative">
                <button
                  onClick={() => onSelectChat(chat.id)}
                  className={cn(
                    "relative flex w-full flex-col gap-y-[2px] py-2 pl-8 pr-9 text-left rounded-md",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  )}
                >
                  {/* Unread dot, positioned in the gutter */}
                  {chat.hasUnread && !isSelected && (
                    <span className="absolute left-[14px] top-[13px] h-[7px] w-[7px] rounded-full bg-primary" />
                  )}

                  {/* Title */}
                  <span className={cn(
                    "truncate type-chat-name",
                    (isSelected || chat.hasUnread) && "font-semibold!",
                    isSelected ? "text-primary-foreground" : chat.hasUnread ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {chat.title}
                  </span>
                  {/* State + timestamp inline row */}
                  <span className={cn(
                    "flex items-center gap-1.5 type-meta",
                    isSelected ? "text-primary-foreground/75" : "text-muted-foreground"
                  )}>
                    {showState && (
                      <>
                        <span className={cn(
                          "inline-flex items-center gap-1 font-semibold",
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
                            : (chat.stateDetail ? chat.stateDetail.charAt(0).toUpperCase() + chat.stateDetail.slice(1) : 'Needs approval')
                          }
                        </span>
                        <span>·</span>
                      </>
                    )}
                    <span className="font-normal">{formatTimeAgoCompact(chat.updatedAt)}</span>
                  </span>
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
            })}</div>}

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
