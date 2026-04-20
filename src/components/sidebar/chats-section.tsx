"use client";

import { Plus } from "@phosphor-icons/react";
import { Chat, Client } from "@/types/chat";
import { cn } from "@/lib/utils";
import { ChatTree } from "./chat-tree";
import { RecentList } from "./recent-list";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarFilter } from "@/hooks/use-sidebar-state";

interface ChatsSectionProps {
  chats: Chat[];
  clients: Client[];
  filter: SidebarFilter;
  expandedClientIds: Set<string>;
  selectedChatId: string | null;
  activeClientId: string | null;
  onFilterChange: (f: SidebarFilter) => void;
  onSelectChat: (id: string) => void;
  onSelectClient: (id: string) => void;
  onNewChat: (clientId: string) => void;
  onNewChatRecent?: () => void;
  onToggleClient: (id: string) => void;
  onRenameChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

export function ChatsSection({
  chats,
  clients,
  filter,
  expandedClientIds,
  selectedChatId,
  activeClientId,
  onFilterChange,
  onSelectChat,
  onSelectClient,
  onNewChat,
  onNewChatRecent,
  onToggleClient,
  onRenameChat,
  onDeleteChat,
}: ChatsSectionProps) {
  return (
    <div className="flex flex-1 flex-col min-h-0">
      {/* Section header */}
      <div className="flex items-center justify-between px-[22px] pt-5 pb-2 flex-shrink-0">
        <span className="type-label text-muted-foreground">Chats</span>
        <div className="inline-flex items-center rounded-md bg-muted p-0.5">
          <button
            onClick={() => onFilterChange("by-client")}
            className={cn(
              "rounded-[5px] px-2.5 py-0.5 text-[12px] font-medium transition-all",
              filter === "by-client"
                ? "bg-background text-foreground shadow-sm"
                : "text-foreground/55 hover:text-foreground"
            )}
          >
            Grouped
          </button>
          <button
            onClick={() => onFilterChange("recent")}
            className={cn(
              "rounded-[5px] px-2.5 py-0.5 text-[12px] font-medium transition-all",
              filter === "recent"
                ? "bg-background text-foreground shadow-sm"
                : "text-foreground/55 hover:text-foreground"
            )}
          >
            Recent
          </button>
        </div>
      </div>

      {/* + New chat — only in Recent view */}
      {filter === "recent" && (
        <div className="flex-shrink-0 px-[14px] pb-1">
          <button onClick={onNewChatRecent} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-primary transition-colors hover:bg-accent rounded-md">
            <Plus className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="type-meta">New chat</span>
          </button>
        </div>
      )}

      <ScrollArea className="flex-1">
        {filter === "by-client" ? (
          <ChatTree
            chats={chats}
            clients={clients}
            selectedChatId={selectedChatId}
            expandedClientIds={expandedClientIds}
            activeClientId={activeClientId}
            onSelectChat={onSelectChat}
            onSelectClient={onSelectClient}
            onNewChat={onNewChat}
            onToggleClient={onToggleClient}
            onRenameChat={onRenameChat}
            onDeleteChat={onDeleteChat}
          />
        ) : (
          <RecentList
            chats={chats}
            clients={clients}
            selectedChatId={selectedChatId}
            onSelectChat={onSelectChat}
            onRenameChat={onRenameChat}
            onDeleteChat={onDeleteChat}
          />
        )}
      </ScrollArea>
    </div>
  );
}
