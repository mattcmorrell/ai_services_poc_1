"use client";

import { useState, useCallback, useMemo } from "react";
import { Sidebar } from "@/components/sidebar";
import { ChatListPanel } from "@/components/chat-list-panel";
import { ChatView } from "@/components/chat-view";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { AgentsView } from "@/components/agents/agents-view";
import { ClientSelectDialog } from "@/components/agents/client-select-dialog";
import { WorkflowPanel } from "@/components/workflow/workflow-panel";
import { mockClients, mockChats } from "@/data/mock-data";
import { mockAgentAttention, mockTodos, suggestedActions } from "@/data/dashboard-data";
import { mockAgents } from "@/data/agents-data";
import { defaultPayrollWorkflow } from "@/data/workflow-data";
import { Message, Chat, Client } from "@/types/chat";
import { Agent } from "@/types/agent";

export default function Home() {
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedChatId, setSelectedChatId] = useState<string | null>("chat-1");
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [isLoading, setIsLoading] = useState(false);
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [clientSelectOpen, setClientSelectOpen] = useState(false);
  const [selectedAgentForClient, setSelectedAgentForClient] = useState<Agent | null>(null);
  const [workflowPanelOpen, setWorkflowPanelOpen] = useState(false);

  const selectedChat = useMemo(
    () => chats.find((c) => c.id === selectedChatId),
    [chats, selectedChatId]
  );
  const selectedClient = useMemo(
    () => mockClients.find((c) => c.id === selectedChat?.clientId),
    [selectedChat]
  );
  const currentMessages = selectedChat?.messages || [];

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!selectedChatId || !selectedChat) return;

      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === selectedChatId
            ? { ...chat, messages: [...chat.messages, userMessage], updatedAt: new Date() }
            : chat
        )
      );

      setIsLoading(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...(selectedChat.messages || []), userMessage].map(
              (m) => ({ role: m.role, content: m.content })
            ),
            clientName: selectedClient?.name || "Unknown Client",
          }),
        });

        const data = await response.json();

        const assistantMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: data.content,
          timestamp: new Date(),
        };

        setChats((prev) =>
          prev.map((chat) =>
            chat.id === selectedChatId
              ? { ...chat, messages: [...chat.messages, assistantMessage], updatedAt: new Date() }
              : chat
          )
        );
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedChatId, selectedChat, selectedClient]
  );

  const handleApprove = useCallback(
    (messageId: string) => {
      if (!selectedChatId) return;

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === selectedChatId
            ? {
                ...chat,
                messages: chat.messages.map((msg) =>
                  msg.id === messageId ? { ...msg, approved: true } : msg
                ),
              }
            : chat
        )
      );
    },
    [selectedChatId]
  );

  const handleNewChat = useCallback(
    (clientId: string) => {
      const client = mockClients.find((c) => c.id === clientId);
      const newChat: Chat = {
        id: `chat-${Date.now()}`,
        clientId,
        title: `New Chat with ${client?.name || "Client"}`,
        hasUnread: false,
        updatedAt: new Date(),
        messages: [],
      };
      setChats((prev) => [newChat, ...prev]);
      setSelectedChatId(newChat.id);
    },
    []
  );

  const handleAgentClick = (agentId: string) => {
    // Map agent to client and switch to chats view
    const agentClientMap: Record<string, string> = {
      "agent-1": "1", // Payroll Runner -> Aperture Science
      "agent-2": "2", // Powerpoint Builder -> Umbrella Corporation
      "agent-3": "5", // Party Planner -> Cyberdyne Systems
      "agent-4": "3", // CX Oracle -> Weyland-Yutani
    };
    const clientId = agentClientMap[agentId] || "1";
    // Find most recent chat for this client or create new one
    const clientChats = chats.filter((c) => c.clientId === clientId);
    if (clientChats.length > 0) {
      const mostRecent = clientChats.sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
      )[0];
      setSelectedChatId(mostRecent.id);
    } else {
      handleNewChat(clientId);
    }
    setActiveView("chats");
  };

  const handleDashboardMessage = useCallback(
    async (message: string, client: Client | null, chipPosition: number) => {
      // Create a new chat
      const newChatId = `chat-${Date.now()}`;
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: message,
        timestamp: new Date(),
      };

      const newChat: Chat = {
        id: newChatId,
        clientId: client?.id || null,
        title: "New Chat",
        hasUnread: false,
        updatedAt: new Date(),
        messages: [userMessage],
      };

      setChats((prev) => [newChat, ...prev]);
      setSelectedChatId(newChatId);
      setActiveView("chats");
      setIsLoading(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: message }],
            clientName: client?.name || "Unknown Client",
          }),
        });

        const data = await response.json();

        const assistantMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: data.content,
          timestamp: new Date(),
        };

        setChats((prev) =>
          prev.map((chat) =>
            chat.id === newChatId
              ? { ...chat, messages: [...chat.messages, assistantMessage], updatedAt: new Date() }
              : chat
          )
        );
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleAgentFromAgentsView = (agentId: string) => {
    // Open client selection dialog
    const agent = agents.find((a) => a.id === agentId);
    if (agent) {
      setSelectedAgentForClient(agent);
      setClientSelectOpen(true);
    }
  };

  const handleClientSelectedForAgent = (clientId: string) => {
    // Find most recent chat for this client or create new one
    const clientChats = chats.filter((c) => c.clientId === clientId);
    if (clientChats.length > 0) {
      const mostRecent = clientChats.sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
      )[0];
      setSelectedChatId(mostRecent.id);
    } else {
      handleNewChat(clientId);
    }
    setClientSelectOpen(false);
    setSelectedAgentForClient(null);
    setActiveView("chats");
  };

  const handleToggleFavorite = (agentId: string) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === agentId ? { ...agent, isFavorite: !agent.isFavorite } : agent
      )
    );
  };

  const handleWorkflowClick = useCallback((workflowId: string) => {
    setWorkflowPanelOpen(true);
  }, []);

  const renderMainContent = () => {
    if (activeView === "dashboard") {
      return (
        <DashboardView
          clients={mockClients}
          agents={mockAgentAttention}
          initialTodos={mockTodos}
          suggestedActions={suggestedActions}
          onAgentClick={handleAgentClick}
          onSendMessage={handleDashboardMessage}
        />
      );
    }

    if (activeView === "chats") {
      return (
        <>
          <ChatListPanel
            clients={mockClients}
            chats={chats}
            selectedChatId={selectedChatId}
            onSelectChat={setSelectedChatId}
            onNewChat={handleNewChat}
          />
          {selectedChat ? (
            <ChatView
              client={selectedClient || null}
              chatTitle={selectedChat.title}
              messages={currentMessages}
              onSendMessage={handleSendMessage}
              onApprove={handleApprove}
              onWorkflowClick={handleWorkflowClick}
              isLoading={isLoading}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
              Select a chat to start messaging
            </div>
          )}
          {workflowPanelOpen && (
            <WorkflowPanel
              workflow={defaultPayrollWorkflow}
              onClose={() => setWorkflowPanelOpen(false)}
            />
          )}
        </>
      );
    }

    if (activeView === "agents") {
      return (
        <AgentsView
          agents={agents}
          onAgentClick={handleAgentFromAgentsView}
          onToggleFavorite={handleToggleFavorite}
        />
      );
    }

    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        {activeView.charAt(0).toUpperCase() + activeView.slice(1)} view coming soon
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      {renderMainContent()}
      <ClientSelectDialog
        open={clientSelectOpen}
        onOpenChange={setClientSelectOpen}
        agent={selectedAgentForClient}
        clients={mockClients}
        onSelectClient={handleClientSelectedForAgent}
      />
    </div>
  );
}
