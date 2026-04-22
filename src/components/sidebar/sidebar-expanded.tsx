"use client";

import { ArrowLineLeft, House } from "@phosphor-icons/react";
import { Chat, Client } from "@/types/chat";
import { cn } from "@/lib/utils";
import { ChatsSection } from "./chats-section";
import { SidebarFooter } from "./sidebar-footer";
import { SidebarFilter } from "@/hooks/use-sidebar-state";
import { BrandLogo } from "@/components/brand-logo";
import { useTheme } from "@/components/theme-provider";

interface SidebarExpandedProps {
  popoverMode?: boolean;
  activeView: string;
  filter: SidebarFilter;
  expandedClientIds: Set<string>;
  selectedChatId: string | null;
  activeClientId: string | null;
  clients: Client[];
  chats: Chat[];
  onCollapse?: () => void;
  onViewChange: (view: string) => void;
  onFilterChange: (f: SidebarFilter) => void;
  onSelectChat: (id: string) => void;
  onSelectClient: (id: string) => void;
  onNewChat: (clientId: string) => void;
  onNewChatRecent?: () => void;
  onToggleClient: (id: string) => void;
  onCollapseAll?: () => void;
  onRenameChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

export function SidebarExpanded({
  popoverMode = false,
  activeView,
  filter,
  expandedClientIds,
  selectedChatId,
  activeClientId,
  clients,
  chats,
  onCollapse,
  onViewChange,
  onFilterChange,
  onSelectChat,
  onSelectClient,
  onNewChat,
  onNewChatRecent,
  onToggleClient,
  onCollapseAll,
  onRenameChat,
  onDeleteChat,
}: SidebarExpandedProps) {
  const { colorway } = useTheme();
  const isHSHQ = colorway === "human-services-hq";

  return (
    <div className="flex h-full w-80 flex-col bg-sidebar text-sidebar-foreground overflow-hidden border-r border-sidebar-border">
      {/* Header */}
      {!popoverMode && (
        <div className="flex flex-shrink-0 items-center justify-between pt-5 pb-3 px-[22px]">
          {isHSHQ ? <BrandLogo height={36} /> : <span className="type-logotype text-primary">PandaCommand</span>}
          {onCollapse && (
            <button
              onClick={onCollapse}
              className="flex h-7 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              title="Collapse sidebar (⌘B)"
            >
              <ArrowLineLeft className="h-[18px] w-[18px]" />
            </button>
          )}
        </div>
      )}

      {/* Dashboard nav row */}
      {!popoverMode && (
        <div className="flex-shrink-0 px-[14px] pt-2">
          <button
            onClick={() => onViewChange("dashboard")}
            className={cn(
              "flex w-full items-center gap-1.5 px-2 py-2 text-left rounded-md transition-colors",
              activeView === "dashboard"
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-accent"
            )}
          >
            <House
              className="h-[18px] w-[18px] flex-shrink-0"
              weight={activeView === "dashboard" ? "fill" : "light"}
            />
            <span className="type-chat-name">Dashboard</span>
          </button>
        </div>
      )}

      {/* Chats section */}
      <div className={cn(
        "flex flex-1 flex-col min-h-0",
        !popoverMode && "mt-1"
      )}>
        <ChatsSection
          chats={chats}
          clients={clients}
          filter={filter}
          expandedClientIds={expandedClientIds}
          selectedChatId={selectedChatId}
          activeClientId={activeClientId}
          onFilterChange={onFilterChange}
          onSelectChat={onSelectChat}
          onSelectClient={onSelectClient}
          onNewChat={onNewChat}
          onNewChatRecent={onNewChatRecent}
          onToggleClient={onToggleClient}
          onCollapseAll={onCollapseAll}
          onRenameChat={onRenameChat}
          onDeleteChat={onDeleteChat}
        />
      </div>

      {/* Footer */}
      {!popoverMode && <SidebarFooter />}
    </div>
  );
}
