"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { Plus, MagnifyingGlass, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Client, Chat } from "@/types/chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useResizable, ResizeHandle } from "@/components/ui/resize-handle";

interface ChatListPanelProps {
  clients: Client[];
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: (clientId: string) => void;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

interface ChatItemProps {
  chat: Chat;
  clientName?: string;
  isSelected: boolean;
  onSelect: () => void;
}

function ChatItem({ chat, clientName, isSelected, onSelect }: ChatItemProps) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "p-3 cursor-pointer border-l-2",
        isSelected
          ? "bg-accent border-primary"
          : "border-transparent hover:bg-accent/50"
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={cn(
            "w-2 h-2 flex-shrink-0 rounded-full",
            chat.hasUnread ? "bg-primary" : ""
          )}
        />
        <span className={cn("truncate", isSelected && "font-medium")}>
          {chat.title}
        </span>
      </div>
      <div className="text-xs text-muted-foreground mt-1 ml-4 truncate">
        {clientName ? `${clientName} · ` : ""}
        {formatTimeAgo(chat.updatedAt)}
      </div>
    </div>
  );
}

export function ChatListPanel({
  clients,
  chats,
  selectedChatId,
  onSelectChat,
  onNewChat,
}: ChatListPanelProps) {
  const { width, onDragStart } = useResizable({
    defaultWidth: 288,
    minWidth: 200,
    maxWidth: 480,
    storageKey: "sidebar-width",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const sortedChats = useMemo(() => {
    return [...chats].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }, [chats]);

  const clientsMap = useMemo(() => {
    const map = new Map<string, Client>();
    clients.forEach((client) => map.set(client.id, client));
    return map;
  }, [clients]);

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return sortedChats;
    const query = searchQuery.toLowerCase();
    return sortedChats.filter((chat) => {
      const clientName = chat.clientId ? clientsMap.get(chat.clientId)?.name : "";
      return (
        chat.title.toLowerCase().includes(query) ||
        (clientName && clientName.toLowerCase().includes(query))
      );
    });
  }, [sortedChats, searchQuery, clientsMap]);

  const handleSearchToggle = () => {
    if (searchOpen) {
      setSearchOpen(false);
      setSearchQuery("");
    } else {
      setSearchOpen(true);
    }
  };

  return (
    <div className="flex flex-shrink-0" style={{ width }}>
    <div className="flex min-w-0 flex-1 flex-col bg-card">
      {/* Header: title + new chat + search */}
      <div className="flex flex-col justify-center border-b border-border px-3 py-4">
        <h2 className="text-base font-semibold">Recent Chats</h2>
        <div className="mt-1 flex items-center justify-between">
          <button
            onClick={() => {
              const firstClient = clients[0];
              if (firstClient) {
                onNewChat(firstClient.id);
              }
            }}
            className="flex items-center gap-2 text-primary hover:text-primary/80 text-sm"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
          <button
            onClick={handleSearchToggle}
            className={cn(
              "inline-flex h-7 w-7 items-center justify-center rounded-md",
              "text-muted-foreground transition-colors",
              "hover:bg-muted hover:text-foreground",
              searchOpen && "bg-muted text-foreground"
            )}
            aria-label={searchOpen ? "Close search" : "Search chats"}
          >
            {searchOpen ? <X className="h-3.5 w-3.5" /> : <MagnifyingGlass className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Search input */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          searchOpen ? "max-h-12 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <MagnifyingGlass className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="h-6 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Recent chats list */}
      <ScrollArea className="flex-1">
        {filteredChats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            clientName={chat.clientId ? clientsMap.get(chat.clientId)?.name : undefined}
            isSelected={selectedChatId === chat.id}
            onSelect={() => onSelectChat(chat.id)}
          />
        ))}
        {filteredChats.length === 0 && searchQuery && (
          <div className="px-4 py-8 text-center">
            <p className="text-xs text-muted-foreground">No matching chats</p>
          </div>
        )}
      </ScrollArea>
    </div>
    <ResizeHandle onMouseDown={onDragStart} />
    </div>
  );
}
