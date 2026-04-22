"use client";

import { useEffect, useRef } from "react";
import { Chat, Client } from "@/types/chat";
import { SidebarFilter } from "@/hooks/use-sidebar-state";
import { SidebarExpanded } from "./sidebar-expanded";

interface ChatsPopoverProps {
  chats: Chat[];
  clients: Client[];
  filter: SidebarFilter;
  expandedClientIds: Set<string>;
  selectedChatId: string | null;
  activeClientId: string | null;
  activeView: string;
  onFilterChange: (f: SidebarFilter) => void;
  onSelectChat: (id: string) => void;
  onSelectClient: (id: string) => void;
  onNewChat: (clientId: string) => void;
  onNewChatRecent?: () => void;
  onToggleClient: (id: string) => void;
  onCollapseAll?: () => void;
  onRenameChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onClose: () => void;
  onViewChange: (view: string) => void;
}

export function ChatsPopover({
  chats,
  clients,
  filter,
  expandedClientIds,
  selectedChatId,
  activeClientId,
  activeView,
  onFilterChange,
  onSelectChat,
  onSelectClient,
  onNewChat,
  onNewChatRecent,
  onToggleClient,
  onCollapseAll,
  onRenameChat,
  onDeleteChat,
  onClose,
  onViewChange,
}: ChatsPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    // Use setTimeout to avoid the click that opened the popover from immediately closing it
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClick);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onClose]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSelectChat = (id: string) => {
    onSelectChat(id);
    onViewChange("chats");
    onClose();
  };

  const handleSelectClient = (id: string) => {
    onSelectClient(id);
    onClose();
  };

  const handleNewChat = (clientId: string) => {
    onNewChat(clientId);
    onViewChange("chats");
    onClose();
  };

  return (
    <div
      ref={popoverRef}
      className="absolute left-14 top-2 z-20 flex max-h-[calc(100vh-16px)] w-80 flex-col overflow-hidden rounded-[10px] border border-border bg-sidebar shadow-2xl animate-in slide-in-from-left-2 duration-[180ms]"
    >
      <SidebarExpanded
        popoverMode
        activeView={activeView}
        filter={filter}
        expandedClientIds={expandedClientIds}
        selectedChatId={selectedChatId}
        activeClientId={activeClientId}
        clients={clients}
        chats={chats}
        onViewChange={onViewChange}
        onFilterChange={onFilterChange}
        onSelectChat={handleSelectChat}
        onSelectClient={handleSelectClient}
        onNewChat={handleNewChat}
        onNewChatRecent={onNewChatRecent}
        onToggleClient={onToggleClient}
        onCollapseAll={onCollapseAll}
        onRenameChat={onRenameChat}
        onDeleteChat={onDeleteChat}
      />
    </div>
  );
}
