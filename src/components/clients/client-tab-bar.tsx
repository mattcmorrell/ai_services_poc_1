"use client";

import { useRef } from "react";
import { Home, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Chat } from "@/types/chat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ClientTab =
  | { id: "home"; type: "home" }
  | { id: string; type: "chat"; chatId: string; title: string; hasUnread: boolean };

interface ClientTabBarProps {
  tabs: ClientTab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  unopenedChats: Chat[];
  onOpenChat: (chat: Chat) => void;
}

export function ClientTabBar({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  unopenedChats,
  onOpenChat,
}: ClientTabBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-9 shrink-0 items-stretch border-b border-border bg-card">
      {/* Scrollable tab list */}
      <div
        ref={scrollRef}
        className="flex min-w-0 flex-1 items-stretch overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;

          if (tab.type === "home") {
            return (
              <button
                key="home"
                onClick={() => onSelectTab("home")}
                className={cn(
                  "flex h-full w-10 shrink-0 items-center justify-center border-r border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                  isActive && "bg-background text-foreground shadow-[inset_0_-2px_0_0] shadow-primary"
                )}
              >
                <Home className="h-3.5 w-3.5" />
              </button>
            );
          }

          return (
            <div
              key={tab.id}
              className={cn(
                "group relative flex h-full max-w-[180px] min-w-0 shrink-0 cursor-pointer items-center border-r border-border pl-3 pr-1 transition-colors",
                isActive
                  ? "bg-background text-foreground shadow-[inset_0_-2px_0_0] shadow-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
              onClick={() => onSelectTab(tab.id)}
            >
              {tab.hasUnread && !isActive && (
                <span className="mr-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              )}
              <span className="flex-1 truncate text-xs">{tab.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className={cn(
                  "ml-1 flex h-4 w-4 shrink-0 items-center justify-center rounded transition-colors hover:bg-muted-foreground/20",
                  isActive
                    ? "opacity-60 hover:opacity-100"
                    : "opacity-0 group-hover:opacity-60 group-hover:hover:opacity-100"
                )}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* New tab button */}
      <div className="flex shrink-0 items-center px-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => {}} className="text-primary">
              <Plus className="mr-2 h-3.5 w-3.5" />
              New Chat
            </DropdownMenuItem>
            {unopenedChats.length > 0 && (
              <>
                <div className="mx-2 my-1 border-t border-border" />
                {unopenedChats.map((chat) => (
                  <DropdownMenuItem key={chat.id} onClick={() => onOpenChat(chat)}>
                    <span className="truncate">{chat.title}</span>
                    {chat.hasUnread && (
                      <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
