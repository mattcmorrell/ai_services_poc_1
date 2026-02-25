"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { ClientTabBar, ClientTab } from "./client-tab-bar";
import { ClientHomeTab } from "./client-home-tab";
import { SidebarList } from "./approaches/sidebar-list";
import { ChatView } from "@/components/chat-view";
import { Chat, Client } from "@/types/chat";
import { FlaskConical, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

// Prototype mode imports (lazy-ish — tree-shaken if never toggled)
import { PrototypeSwitcher, ApproachConfig } from "./prototype-switcher";
import { CardGrid } from "./approaches/card-grid";
import { DropdownSwitcher } from "./approaches/dropdown-switcher";
import { SidebarListProto } from "./approaches/sidebar-list-proto";
import { BreadcrumbNav } from "./approaches/breadcrumb-nav";
import { ClientTabsRow } from "./approaches/client-tabs-row";
import { TabGroups } from "./approaches/tab-groups";
import { mockChats, mockClients } from "@/data/mock-data";

const APPROACHES: ApproachConfig[] = [
  { id: "A", label: "Card Grid", description: "Home screen of client cards", maxVersion: 3, status: "parked" },
  { id: "B", label: "Dropdown", description: "Compact switcher in tab bar", maxVersion: 3, status: "active" },
  { id: "C", label: "Sidebar", description: "Persistent client list", maxVersion: 4, status: "active" },
  { id: "D", label: "Breadcrumb", description: "Hierarchical navigation", maxVersion: 3, status: "killed" },
  { id: "E", label: "Tab Groups", description: "Multi-client grouped tabs", maxVersion: 1, status: "active" },
  { id: "F", label: "Client Tabs", description: "Horizontal client avatar row", maxVersion: 1, status: "killed" },
];

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
  chatPanelMode: "recent" | "clients";
  onChatPanelModeChange: (mode: "recent" | "clients") => void;
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
  chatPanelMode,
  onChatPanelModeChange,
}: ClientsViewProps) {
  // ── Prototype mode state ──────────────────────────────────────────
  const [prototypeMode, setPrototypeMode] = useState(false);
  const [currentApproach, setCurrentApproach] = useState("C");
  const [currentVersion, setCurrentVersion] = useState(4);

  // ── Shared client selection state ─────────────────────────────────
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Tab workspace state
  const [tabs, setTabs] = useState<ClientTab[]>([{ id: "home", type: "home" }]);
  const [activeTabId, setActiveTabId] = useState<string>("home");

  // Per-workspace artifact selection (production mode only)
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);

  // Tab state persistence per client
  const tabStateCache = useRef<Map<string, { tabs: ClientTab[]; activeTabId: string }>>(new Map());

  // ── Production mode derived data ──────────────────────────────────
  const clientChats = useMemo(
    () => (selectedClientId ? chats.filter((c) => c.clientId === selectedClientId) : []),
    [selectedClientId, chats]
  );

  const client = useMemo(
    () => clients.find((c) => c.id === selectedClientId),
    [clients, selectedClientId]
  );

  // ── Prototype mode derived data ───────────────────────────────────
  const protoClientChats = useMemo(
    () => (selectedClientId ? mockChats.filter((c) => c.clientId === selectedClientId) : []),
    [selectedClientId]
  );

  const protoClient = useMemo(
    () => mockClients.find((c) => c.id === selectedClientId),
    [selectedClientId]
  );

  // ── Tab management callbacks ──────────────────────────────────────
  const saveTabState = useCallback((clientId: string) => {
    tabStateCache.current.set(clientId, { tabs, activeTabId });
  }, [tabs, activeTabId]);

  const handleSelectClient = useCallback((clientId: string | null) => {
    if (selectedClientId) {
      saveTabState(selectedClientId);
    }

    setSelectedClientId(clientId);
    if (clientId) {
      const cached = tabStateCache.current.get(clientId);
      if (cached) {
        setTabs(cached.tabs);
        setActiveTabId(cached.activeTabId);
      } else {
        // First visit: open Home + first 2 chats
        const sourceChats = prototypeMode ? mockChats : chats;
        const chatsForClient = sourceChats.filter((c) => c.clientId === clientId);
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
  }, [selectedClientId, saveTabState, chats, prototypeMode]);

  const openChat = useCallback((chat: Chat) => {
    setTabs((prev) => {
      if (prev.find((t) => t.id === chat.id)) return prev;
      return [
        ...prev,
        {
          id: chat.id,
          type: "chat" as const,
          chatId: chat.id,
          title: chat.title,
          hasUnread: chat.hasUnread,
        },
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
          const newActive = next[Math.max(0, idx - 1)];
          setActiveTabId(newActive?.id ?? "home");
        }
        return next;
      });
    },
    [activeTabId]
  );

  const newChat = useCallback(() => {
    if (prototypeMode) {
      // Prototype mode: stub chat
      const id = `new-${Date.now()}`;
      setTabs((prev) => [
        ...prev,
        { id, type: "chat" as const, chatId: id, title: "New Chat", hasUnread: false },
      ]);
      setActiveTabId(id);
    } else {
      // Production mode: real chat
      if (!selectedClientId) return;
      const chatId = onNewChat(selectedClientId);
      setTabs((prev) => [
        ...prev,
        { id: chatId, type: "chat" as const, chatId, title: "New Chat", hasUnread: false },
      ]);
      setActiveTabId(chatId);
    }
  }, [prototypeMode, selectedClientId, onNewChat]);

  // ── Tab bar ───────────────────────────────────────────────────────
  const currentClient = prototypeMode ? protoClient : client;
  const tabBar = selectedClientId && currentClient ? (
    <ClientTabBar
      tabs={tabs}
      activeTabId={activeTabId}
      onSelectTab={setActiveTabId}
      onCloseTab={closeTab}
      onNewChat={newChat}
    />
  ) : null;

  // ── All client tabs (for TabGroups approach E) ────────────────────
  const allClientTabs = useMemo(() => {
    const map = new Map<string, { tabs: ClientTab[]; activeTabId: string }>();
    for (const c of mockClients) {
      const chatsForClient = mockChats.filter((ch) => ch.clientId === c.id);
      if (chatsForClient.length === 0) continue;
      map.set(c.id, {
        tabs: [
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
        ],
        activeTabId: "home",
      });
    }
    tabStateCache.current.forEach((state, cid) => map.set(cid, state));
    if (selectedClientId) {
      map.set(selectedClientId, { tabs, activeTabId });
    }
    return map;
  }, [selectedClientId, tabs, activeTabId]);

  // ── Prototype stub tab content ────────────────────────────────────
  const protoTabContent = selectedClientId && protoClient ? (
    <div className="flex flex-1 overflow-hidden">
      <div className={activeTabId === "home" ? "flex flex-1 overflow-hidden" : "hidden"}>
        <ClientHomeTab client={protoClient} chats={protoClientChats} onOpenChat={openChat} />
      </div>
      {tabs
        .filter((t): t is Extract<ClientTab, { type: "chat" }> => t.type === "chat")
        .map((tab) => (
          <div
            key={tab.id}
            className={
              activeTabId === tab.id
                ? "flex flex-1 flex-col items-center justify-center gap-3 overflow-hidden"
                : "hidden"
            }
          >
            <MessageSquare className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium">{tab.title}</p>
            <p className="text-xs text-muted-foreground">Chat view coming soon</p>
          </div>
        ))}
    </div>
  ) : null;

  // ── Production tab content (real chats) ───────────────────────────
  const productionTabContent = selectedClientId && client ? (
    <div className="flex flex-1 overflow-hidden">
      <div className={activeTabId === "home" ? "flex flex-1 overflow-hidden" : "hidden"}>
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

  // ── Render prototype approach ─────────────────────────────────────
  const renderPrototypeApproach = () => {
    const props = {
      clients: mockClients,
      chats: mockChats,
      selectedClientId,
      onSelectClient: handleSelectClient,
      version: currentVersion,
    };

    switch (currentApproach) {
      case "A":
        return <CardGrid {...props} tabBar={tabBar}>{protoTabContent}</CardGrid>;
      case "B":
        return <DropdownSwitcher {...props} tabBar={tabBar}>{protoTabContent}</DropdownSwitcher>;
      case "C":
        return <SidebarListProto {...props} tabBar={tabBar}>{protoTabContent}</SidebarListProto>;
      case "D":
        return <BreadcrumbNav {...props} tabBar={tabBar}>{protoTabContent}</BreadcrumbNav>;
      case "E":
        return (
          <TabGroups
            {...props}
            allClientTabs={allClientTabs}
            activeTabId={activeTabId}
            onSelectTab={setActiveTabId}
            onCloseTab={closeTab}
            onNewChat={newChat}
            onOpenChat={openChat}
          >
            {protoTabContent}
          </TabGroups>
        );
      case "F":
        return <ClientTabsRow {...props} tabBar={tabBar}>{protoTabContent}</ClientTabsRow>;
      default:
        return null;
    }
  };

  // ── Flask toggle button ───────────────────────────────────────────
  const flaskToggle = (
    <button
      onClick={() => setPrototypeMode((prev) => !prev)}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        prototypeMode
          ? "bg-primary/15 text-primary hover:bg-primary/25"
          : "text-muted-foreground/50 hover:bg-muted hover:text-muted-foreground"
      )}
      title={prototypeMode ? "Exit prototype mode" : "Enter prototype mode"}
    >
      <FlaskConical className="h-3.5 w-3.5" />
    </button>
  );

  // ── Prototype mode render ─────────────────────────────────────────
  if (prototypeMode) {
    return (
      <div className="flex h-full flex-col">
        {/* Proto mode header bar */}
        <div className="flex flex-shrink-0 items-center gap-2 border-b border-border bg-card/50 px-3 py-1">
          {flaskToggle}
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
            Prototype Mode
          </span>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="min-w-0 flex-1 overflow-hidden">
            {renderPrototypeApproach()}
          </div>
          <PrototypeSwitcher
            approaches={APPROACHES}
            currentApproach={currentApproach}
            currentVersion={currentVersion}
            onApproachChange={setCurrentApproach}
            onVersionChange={setCurrentVersion}
          />
        </div>
      </div>
    );
  }

  // ── Production mode render (default) ──────────────────────────────
  return (
    <div className="flex h-full flex-col">
      {/* Minimal header with flask toggle */}
      <div className="flex flex-shrink-0 items-center border-b border-border bg-card/50 px-3 py-1">
        {flaskToggle}
      </div>
      <div className="flex flex-1 overflow-hidden">
        <SidebarList
          clients={clients}
          chats={chats}
          selectedClientId={selectedClientId}
          onSelectClient={handleSelectClient}
          tabBar={tabBar}
          chatPanelMode={chatPanelMode}
          onChatPanelModeChange={onChatPanelModeChange}
        >
          {productionTabContent}
        </SidebarList>
      </div>
    </div>
  );
}
