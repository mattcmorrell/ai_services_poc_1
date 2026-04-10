"use client";

import { useState, useCallback, useRef } from "react";
import { ClientTabBar, ClientTab } from "./client-tab-bar";
import { ClientHomeTab } from "./client-home-tab";
import { SidebarList } from "./approaches/sidebar-list";
import { ChatView } from "@/components/chat-view";
import { Chat, Client } from "@/types/chat";

interface ClientsViewProps {
  clients: Client[];
  chats: Chat[];
  onSendMessage: (content: string, chatId: string) => void;
  onApprove: (messageId: string, chatId: string) => void;
  onDecline: (messageId: string, chatId: string) => void;
  onNewChat: (clientId: string) => string;
  onWorkflowClick: (workflowId: string) => void;
  onArtifactClick: (artifactId: string) => void;
  loadingChatId: string | null;
}

export function ClientsView({
  clients,
  chats,
  onSendMessage,
  onApprove,
  onDecline,
  onNewChat,
  onWorkflowClick,
  onArtifactClick,
  loadingChatId,
}: ClientsViewProps) {
  // ── Client selection state ────────────────────────────────────────
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const [tabs, setTabs] = useState<ClientTab[]>([{ id: "home", type: "home" }]);
  const [activeTabId, setActiveTabId] = useState<string>("home");

  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);

  const tabStateCache = useRef<Map<string, { tabs: ClientTab[]; activeTabId: string }>>(new Map());

  // ── Derived data ──────────────────────────────────────────────────
  const clientChats = selectedClientId
    ? chats.filter((c) => c.clientId === selectedClientId)
    : [];

  const client = clients.find((c) => c.id === selectedClientId);

  // ── Tab management ────────────────────────────────────────────────
  const saveTabState = useCallback(
    (clientId: string) => {
      tabStateCache.current.set(clientId, { tabs, activeTabId });
    },
    [tabs, activeTabId]
  );

  const handleSelectClient = useCallback(
    (clientId: string | null) => {
      if (selectedClientId) saveTabState(selectedClientId);
      setSelectedClientId(clientId);
      if (clientId) {
        const cached = tabStateCache.current.get(clientId);
        if (cached) {
          setTabs(cached.tabs);
          setActiveTabId(cached.activeTabId);
        } else {
          const chatsForClient = chats.filter((c) => c.clientId === clientId);
          const initialTabs: ClientTab[] = [
            { id: "home", type: "home" },
            ...chatsForClient.slice(0, 2).map(
              (chat): ClientTab => ({
                id: chat.id,
                type: "chat",
                chatId: chat.id,
                title: chat.title,
                hasUnread: chat.hasUnread,
              })
            ),
          ];
          setTabs(initialTabs);
          setActiveTabId("home");
        }
      } else {
        setTabs([{ id: "home", type: "home" }]);
        setActiveTabId("home");
      }
    },
    [selectedClientId, saveTabState, chats]
  );

  const openChat = useCallback((chat: Chat) => {
    setTabs((prev) => {
      if (prev.find((t) => t.id === chat.id)) return prev;
      return [
        ...prev,
        { id: chat.id, type: "chat" as const, chatId: chat.id, title: chat.title, hasUnread: chat.hasUnread },
      ];
    });
    setActiveTabId(chat.id);
  }, []);

  const closeTab = useCallback(
    (tabId: string) => {
      setTabs((prev) => {
        const idx = prev.findIndex((t) => t.id === tabId);
        const next = prev.filter((t) => t.id !== tabId);
        if (activeTabId === tabId) {
          setActiveTabId(next[Math.max(0, idx - 1)]?.id ?? "home");
        }
        return next;
      });
    },
    [activeTabId]
  );

  const newChat = useCallback(() => {
    if (!selectedClientId) return;
    const chatId = onNewChat(selectedClientId);
    setTabs((prev) => [
      ...prev,
      { id: chatId, type: "chat" as const, chatId, title: "New Chat", hasUnread: false },
    ]);
    setActiveTabId(chatId);
  }, [selectedClientId, onNewChat]);

  // ── Tab bar ───────────────────────────────────────────────────────
  const tabBar =
    selectedClientId && client ? (
      <ClientTabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={setActiveTabId}
        onCloseTab={closeTab}
        onNewChat={newChat}
      />
    ) : null;

  // ── Tab content ───────────────────────────────────────────────────
  const tabContent =
    selectedClientId && client ? (
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className={activeTabId === "home" ? "flex min-h-0 flex-1 overflow-hidden" : "hidden"}>
          <ClientHomeTab client={client} chats={clientChats} onOpenChat={openChat} />
        </div>
        {tabs
          .filter((t): t is Extract<ClientTab, { type: "chat" }> => t.type === "chat")
          .map((tab) => {
            const chat = chats.find((c) => c.id === tab.chatId);
            const tabClient = chat?.clientId
              ? clients.find((c) => c.id === chat.clientId) ?? null
              : null;

            return (
              <div
                key={tab.id}
                className={activeTabId === tab.id ? "flex flex-1 overflow-hidden" : "hidden"}
              >
                {chat ? (
                  <ChatView
                    client={tabClient}
                    chatTitle={chat.title}
                    messages={chat.messages}
                    artifacts={chat.artifacts}
                    selectedArtifactId={selectedArtifactId}
                    onSendMessage={(content) => onSendMessage(content, chat.id)}
                    onApprove={(messageId) => onApprove(messageId, chat.id)}
                    onDecline={(messageId) => onDecline(messageId, chat.id)}
                    onWorkflowClick={onWorkflowClick}
                    onArtifactClick={setSelectedArtifactId}
                    isLoading={loadingChatId === chat.id}
                  />
                ) : (
                  <div className="flex flex-1 items-center justify-center text-muted-foreground">
                    Chat not found
                  </div>
                )}
              </div>
            );
          })}
      </div>
    ) : null;

  // ── Render ────────────────────────────────────────────────────────
  return (
    <SidebarList
      clients={clients}
      chats={chats}
      selectedClientId={selectedClientId}
      onSelectClient={handleSelectClient}
      tabBar={tabBar}
    >
      {tabContent}
    </SidebarList>
  );
}
