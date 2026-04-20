"use client";

import { useEffect } from "react";
import { Chat, Client } from "@/types/chat";
import { useSidebarState } from "@/hooks/use-sidebar-state";
import { SidebarRail } from "./sidebar-rail";
import { SidebarExpanded } from "./sidebar-expanded";
import { ChatsPopover } from "./chats-popover";

export interface SidebarProps {
  activeView: string;
  clients: Client[];
  chats: Chat[];
  selectedChatId: string | null;
  selectedClientId: string | null;
  onViewChange: (view: string) => void;
  onSelectChat: (chatId: string) => void;
  onNewChat: (clientId: string) => void;
  onSelectClient: (clientId: string) => void;
}

export function Sidebar({
  activeView,
  clients,
  chats,
  selectedChatId,
  selectedClientId,
  onViewChange,
  onSelectChat,
  onNewChat,
  onSelectClient,
}: SidebarProps) {
  const {
    collapsed,
    filter,
    expandedClientIds,
    popoverOpen,
    setFilter,
    toggleCollapsed,
    toggleClientExpanded,
    setPopoverOpen,
  } = useSidebarState();

  // Cmd/Ctrl+B toggles sidebar
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        toggleCollapsed();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [toggleCollapsed]);

  const activeClientId = activeView === "clients" ? selectedClientId : null;
  const activeChatId = activeView === "chats" ? selectedChatId : null;

  const handleSelectChat = (chatId: string) => {
    onSelectChat(chatId);
    onViewChange("chats");
  };

  const handleSelectClient = (clientId: string) => {
    onSelectClient(clientId);
    onViewChange("clients");
  };

  const handleViewChange = (view: string) => {
    onViewChange(view);
    setPopoverOpen(false);
  };

  const handleTogglePopover = () => {
    setPopoverOpen((open) => !open);
  };

  if (collapsed) {
    return (
      <div className="relative flex-shrink-0">
        <SidebarRail
          activeView={activeView}
          popoverOpen={popoverOpen}
          onExpand={toggleCollapsed}
          onViewChange={handleViewChange}
          onTogglePopover={handleTogglePopover}
        />
        {popoverOpen && (
          <ChatsPopover
            chats={chats}
            clients={clients}
            filter={filter}
            expandedClientIds={expandedClientIds}
            selectedChatId={activeChatId}
            activeClientId={activeClientId}
            activeView={activeView}
            onFilterChange={setFilter}
            onSelectChat={handleSelectChat}
            onSelectClient={(id) => {
              handleSelectClient(id);
              setPopoverOpen(false);
            }}
            onNewChat={(clientId) => {
              onNewChat(clientId);
              onViewChange("chats");
            }}
            onToggleClient={toggleClientExpanded}
            onClose={() => setPopoverOpen(false)}
            onViewChange={handleViewChange}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex-shrink-0">
      <SidebarExpanded
        activeView={activeView}
        filter={filter}
        expandedClientIds={expandedClientIds}
        selectedChatId={activeChatId}
        activeClientId={activeClientId}
        clients={clients}
        chats={chats}
        onCollapse={toggleCollapsed}
        onViewChange={handleViewChange}
        onFilterChange={setFilter}
        onSelectChat={handleSelectChat}
        onSelectClient={handleSelectClient}
        onNewChat={onNewChat}
        onToggleClient={toggleClientExpanded}
      />
    </div>
  );
}
