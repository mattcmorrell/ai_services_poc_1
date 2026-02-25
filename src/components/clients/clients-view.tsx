"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { ClientTabBar, ClientTab } from "./client-tab-bar";
import { ClientHomeTab } from "./client-home-tab";
import { PrototypeSwitcher, ApproachConfig } from "./prototype-switcher";
import { CardGrid } from "./approaches/card-grid";
import { DropdownSwitcher } from "./approaches/dropdown-switcher";
import { SidebarList } from "./approaches/sidebar-list";
import { BreadcrumbNav } from "./approaches/breadcrumb-nav";
import { ClientTabsRow } from "./approaches/client-tabs-row";
import { TabGroups } from "./approaches/tab-groups";
import { Chat } from "@/types/chat";
import { mockChats, mockClients } from "@/data/mock-data";
import { MessageSquare } from "lucide-react";

const APPROACHES: ApproachConfig[] = [
  { id: "A", label: "Card Grid", description: "Home screen of client cards", maxVersion: 3, status: "parked" },
  { id: "B", label: "Dropdown", description: "Compact switcher in tab bar", maxVersion: 3, status: "active" },
  { id: "C", label: "Sidebar", description: "Persistent client list", maxVersion: 3, status: "active" },
  { id: "D", label: "Breadcrumb", description: "Hierarchical navigation", maxVersion: 3, status: "killed" },
  { id: "E", label: "Tab Groups", description: "Multi-client grouped tabs", maxVersion: 1, status: "active" },
  { id: "F", label: "Client Tabs", description: "Horizontal client avatar row", maxVersion: 1, status: "killed" },
];

export function ClientsView() {
  // Prototype switching state
  const [currentApproach, setCurrentApproach] = useState("B");
  const [currentVersion, setCurrentVersion] = useState(1);

  // Client selection state
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Tab workspace state (derived from selected client)
  const clientChats = useMemo(
    () => (selectedClientId ? mockChats.filter((c) => c.clientId === selectedClientId) : []),
    [selectedClientId]
  );
  const client = useMemo(
    () => mockClients.find((c) => c.id === selectedClientId),
    [selectedClientId]
  );

  const [tabs, setTabs] = useState<ClientTab[]>([{ id: "home", type: "home" }]);
  const [activeTabId, setActiveTabId] = useState<string>("home");

  // Tab state persistence: store tabs + activeTab per client
  const tabStateCache = useRef<Map<string, { tabs: ClientTab[]; activeTabId: string }>>(new Map());

  // Save current tab state before switching away
  const saveTabState = useCallback((clientId: string) => {
    tabStateCache.current.set(clientId, { tabs, activeTabId });
  }, [tabs, activeTabId]);

  // Restore or initialize tabs when client changes
  const handleSelectClient = useCallback((clientId: string | null) => {
    // Save current client's tab state before switching
    if (selectedClientId) {
      saveTabState(selectedClientId);
    }

    setSelectedClientId(clientId);
    if (clientId) {
      // Check cache for previously opened tabs
      const cached = tabStateCache.current.get(clientId);
      if (cached) {
        setTabs(cached.tabs);
        setActiveTabId(cached.activeTabId);
      } else {
        // First visit: open Home + first 2 chats
        const chatsForClient = mockChats.filter((c) => c.clientId === clientId);
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
  }, [selectedClientId, saveTabState]);

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
    const id = `new-${Date.now()}`;
    setTabs((prev) => [
      ...prev,
      { id, type: "chat" as const, chatId: id, title: "New Chat", hasUnread: false },
    ]);
    setActiveTabId(id);
  }, []);

  // Tab bar (rendered separately so approaches can place it full-width)
  const tabBar = selectedClientId && client ? (
    <ClientTabBar
      tabs={tabs}
      activeTabId={activeTabId}
      onSelectTab={setActiveTabId}
      onCloseTab={closeTab}
      onNewChat={newChat}
    />
  ) : null;

  // All client tab states (for TabGroups approach E)
  // Seeds every client that has chats so all groups appear on first load
  const allClientTabs = useMemo(() => {
    const map = new Map<string, { tabs: ClientTab[]; activeTabId: string }>();
    // Seed all clients that have chats (home + first 2 chats)
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
    // Layer cached state on top (preserves user's opened/closed tabs)
    tabStateCache.current.forEach((state, cid) => map.set(cid, state));
    // Overwrite current client with live state
    if (selectedClientId) {
      map.set(selectedClientId, { tabs, activeTabId });
    }
    return map;
  }, [selectedClientId, tabs, activeTabId]);

  // Tab content (rendered as children inside each approach's content area)
  const tabContent = selectedClientId && client ? (
    <div className="flex flex-1 overflow-hidden">
      {/* Home tab */}
      <div className={activeTabId === "home" ? "flex flex-1 overflow-hidden" : "hidden"}>
        <ClientHomeTab client={client} chats={clientChats} onOpenChat={openChat} />
      </div>
      {/* Chat tabs — stub content */}
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

  // Render current approach
  const renderApproach = () => {
    const props = {
      clients: mockClients,
      chats: mockChats,
      selectedClientId,
      onSelectClient: handleSelectClient,
      version: currentVersion,
    };

    switch (currentApproach) {
      case "A":
        return <CardGrid {...props} tabBar={tabBar}>{tabContent}</CardGrid>;
      case "B":
        return <DropdownSwitcher {...props} tabBar={tabBar}>{tabContent}</DropdownSwitcher>;
      case "C":
        return <SidebarList {...props} tabBar={tabBar}>{tabContent}</SidebarList>;
      case "D":
        return <BreadcrumbNav {...props} tabBar={tabBar}>{tabContent}</BreadcrumbNav>;
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
            {tabContent}
          </TabGroups>
        );
      case "F":
        return <ClientTabsRow {...props} tabBar={tabBar}>{tabContent}</ClientTabsRow>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="min-w-0 flex-1 overflow-hidden">
        {renderApproach()}
      </div>
      <PrototypeSwitcher
        approaches={APPROACHES}
        currentApproach={currentApproach}
        currentVersion={currentVersion}
        onApproachChange={setCurrentApproach}
        onVersionChange={setCurrentVersion}
      />
    </div>
  );
}
