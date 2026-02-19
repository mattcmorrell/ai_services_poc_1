"use client";

import { useState, useCallback, useMemo } from "react";
import { Sidebar } from "@/components/sidebar";
import { ChatListPanel as ChatListPanelOriginal } from "@/components/chat-list-panel";
import { ChatView as ChatViewOriginal } from "@/components/chat-view";
import { DashboardView as DashboardViewOriginal } from "@/components/dashboard/dashboard-view";
import { ChatListPanel as ChatListPanelV1 } from "@/components/chat-list-panel-v1";
import { ChatView as ChatViewV1 } from "@/components/chat-view-v1";
import { DashboardView as DashboardViewV1 } from "@/components/dashboard/dashboard-view-v1";
import { ChatListPanel as ChatListPanelV2 } from "@/components/chat-list-panel-v2";
import { ChatView as ChatViewV2 } from "@/components/chat-view-v2";
import { DashboardView as DashboardViewV2 } from "@/components/dashboard/dashboard-view-v2";
import { ChatListPanel as ChatListPanelV3 } from "@/components/chat-list-panel-v3";
import { ChatView as ChatViewV3 } from "@/components/chat-view-v3";
import { DashboardView as DashboardViewV3 } from "@/components/dashboard/dashboard-view-v3";
import { ChatListPanel as ChatListPanelV4 } from "@/components/chat-list-panel-v4";
import { ChatView as ChatViewV4 } from "@/components/chat-view-v4";
import { DashboardView as DashboardViewV4 } from "@/components/dashboard/dashboard-view-v4";
import { ChatListPanel as ChatListPanelV5 } from "@/components/chat-list-panel-v5";
import { ChatView as ChatViewV5 } from "@/components/chat-view-v5";
import { DashboardView as DashboardViewV5 } from "@/components/dashboard/dashboard-view-v5";
import { AgentsView } from "@/components/agents/agents-view";
import { ClientSelectDialog } from "@/components/agents/client-select-dialog";
import { WorkflowPanel } from "@/components/workflow/workflow-panel";
import { mockClients, mockChats } from "@/data/mock-data";
import { mockAgentAttention, mockTodos, suggestedActions } from "@/data/dashboard-data";
import { mockAgents } from "@/data/agents-data";
import { defaultPayrollWorkflow } from "@/data/workflow-data";
import { Message, Chat, Client, Artifact, ActionPlan } from "@/types/chat";
import { ArtifactPanel } from "@/components/artifacts/artifact-panel";
import { parseArtifacts } from "@/lib/artifact-parser";
import { parseActionPlan } from "@/lib/action-plan-parser";
import { Agent } from "@/types/agent";
import { ClientsView } from "@/components/clients/clients-view";

const VARIANTS = ["original", "v1", "v2", "v3", "v4", "v5"] as const;
type Variant = (typeof VARIANTS)[number];

const variantMap = {
  original: { DashboardView: DashboardViewOriginal, ChatListPanel: ChatListPanelOriginal, ChatView: ChatViewOriginal },
  v1: { DashboardView: DashboardViewV1, ChatListPanel: ChatListPanelV1, ChatView: ChatViewV1 },
  v2: { DashboardView: DashboardViewV2, ChatListPanel: ChatListPanelV2, ChatView: ChatViewV2 },
  v3: { DashboardView: DashboardViewV3, ChatListPanel: ChatListPanelV3, ChatView: ChatViewV3 },
  v4: { DashboardView: DashboardViewV4, ChatListPanel: ChatListPanelV4, ChatView: ChatViewV4 },
  v5: { DashboardView: DashboardViewV5, ChatListPanel: ChatListPanelV5, ChatView: ChatViewV5 },
};

export default function Home() {
  const [designVariant, setDesignVariant] = useState<Variant>("v5");
  const { DashboardView, ChatListPanel, ChatView } = variantMap[designVariant];

  const [activeView, setActiveView] = useState("dashboard");
  const [chatPanelMode, setChatPanelMode] = useState<"recent" | "clients">("recent");
  const [selectedChatId, setSelectedChatId] = useState<string | null>("chat-1");
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [loadingChatId, setLoadingChatId] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [clientSelectOpen, setClientSelectOpen] = useState(false);
  const [selectedAgentForClient, setSelectedAgentForClient] = useState<Agent | null>(null);
  const [workflowPanelOpen, setWorkflowPanelOpen] = useState(false);
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);

  const selectedChat = useMemo(
    () => chats.find((c) => c.id === selectedChatId),
    [chats, selectedChatId]
  );
  const selectedClient = useMemo(
    () => mockClients.find((c) => c.id === selectedChat?.clientId),
    [selectedChat]
  );
  const currentMessages = selectedChat?.messages || [];
  const currentArtifacts = selectedChat?.artifacts || [];
  // Search all chats for the selected artifact (not just selectedChat)
  const selectedArtifact = useMemo(() => {
    if (!selectedArtifactId) return null;
    for (const chat of chats) {
      const found = chat.artifacts.find((a) => a.id === selectedArtifactId);
      if (found) return found;
    }
    return null;
  }, [chats, selectedArtifactId]);

  // --- Chat-ID-explicit handlers ---

  const handleSendMessageForChat = useCallback(
    async (content: string, chatId: string) => {
      const chat = chats.find((c) => c.id === chatId);
      if (!chat) return;

      const chatClient = mockClients.find((c) => c.id === chat.clientId);

      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      };

      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? { ...c, messages: [...c.messages, userMessage], updatedAt: new Date() }
            : c
        )
      );

      setLoadingChatId(chatId);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...(chat.messages || []), userMessage].map(
              (m) => ({ role: m.role, content: m.content })
            ),
            clientName: chatClient?.name || "Unknown Client",
            agentId: chat.agentId,
          }),
        });

        const data = await response.json();

        const { content: artifactParsedContent, artifacts: newArtifacts } = parseArtifacts(data.content);

        const actionPlanResult = parseActionPlan(artifactParsedContent);
        const finalContent = actionPlanResult?.cleanedContent || artifactParsedContent;
        const actionPlan = actionPlanResult?.plan;

        const assistantMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: finalContent,
          artifactIds: newArtifacts.map((a) => a.id),
          actionPlan,
          timestamp: new Date(),
        };

        setChats((prev) =>
          prev.map((c) => {
            if (c.id !== chatId) return c;

            let updatedMessages = c.messages;
            if (actionPlan) {
              updatedMessages = c.messages.map((msg) => {
                if (msg.actionPlan && msg.actionPlan.status === "pending") {
                  return {
                    ...msg,
                    actionPlan: { ...msg.actionPlan, status: "declined" as const },
                  };
                }
                return msg;
              });
            }

            return {
              ...c,
              messages: [...updatedMessages, assistantMessage],
              artifacts: [...c.artifacts, ...newArtifacts],
              updatedAt: new Date(),
            };
          })
        );
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setLoadingChatId(null);
      }
    },
    [chats]
  );

  // Wrapper for "recent" mode — uses selectedChatId
  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!selectedChatId) return;
      await handleSendMessageForChat(content, selectedChatId);
    },
    [selectedChatId, handleSendMessageForChat]
  );

  const handleApproveForChat = useCallback(
    (messageId: string, chatId: string) => {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: chat.messages.map((msg) => {
                  if (msg.id !== messageId) return msg;
                  if (msg.actionPlan) {
                    const updatedPlan = { ...msg.actionPlan, status: "approved" as const };
                    simulateExecutionForChat(messageId, updatedPlan, chatId);
                    return { ...msg, actionPlan: updatedPlan, approved: true };
                  }
                  return { ...msg, approved: true };
                }),
              }
            : chat
        )
      );
    },
    []
  );

  const handleApprove = useCallback(
    (messageId: string) => {
      if (!selectedChatId) return;
      handleApproveForChat(messageId, selectedChatId);
    },
    [selectedChatId, handleApproveForChat]
  );

  const handleDeclineForChat = useCallback(
    (messageId: string, chatId: string) => {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: chat.messages.map((msg) => {
                  if (msg.id !== messageId) return msg;
                  if (msg.actionPlan) {
                    return {
                      ...msg,
                      actionPlan: { ...msg.actionPlan, status: "declined" as const },
                    };
                  }
                  return msg;
                }),
              }
            : chat
        )
      );
    },
    []
  );

  const handleDecline = useCallback(
    (messageId: string) => {
      if (!selectedChatId) return;
      handleDeclineForChat(messageId, selectedChatId);
    },
    [selectedChatId, handleDeclineForChat]
  );

  const simulateExecutionForChat = useCallback(
    (messageId: string, plan: ActionPlan, chatId: string) => {
      const steps = plan.steps;
      let currentStep = 0;

      const executeStep = () => {
        if (currentStep >= steps.length) {
          setChats((prev) =>
            prev.map((chat) =>
              chat.id === chatId
                ? {
                    ...chat,
                    messages: chat.messages.map((msg) => {
                      if (msg.id !== messageId || !msg.actionPlan) return msg;
                      return {
                        ...msg,
                        actionPlan: {
                          ...msg.actionPlan,
                          status: "completed" as const,
                          completionSummary: `${plan.metadata?.affectedCount || 0} ${plan.metadata?.affectedLabel || "items"} processed successfully.`,
                        },
                      };
                    }),
                  }
                : chat
            )
          );
          return;
        }

        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) => {
                    if (msg.id !== messageId || !msg.actionPlan) return msg;
                    return {
                      ...msg,
                      actionPlan: {
                        ...msg.actionPlan,
                        status: "executing" as const,
                        steps: msg.actionPlan.steps.map((step, idx) => ({
                          ...step,
                          status:
                            idx < currentStep
                              ? "completed"
                              : idx === currentStep
                              ? "in_progress"
                              : "pending",
                        })),
                      },
                    };
                  }),
                }
              : chat
          )
        );

        setTimeout(() => {
          setChats((prev) =>
            prev.map((chat) =>
              chat.id === chatId
                ? {
                    ...chat,
                    messages: chat.messages.map((msg) => {
                      if (msg.id !== messageId || !msg.actionPlan) return msg;
                      return {
                        ...msg,
                        actionPlan: {
                          ...msg.actionPlan,
                          steps: msg.actionPlan.steps.map((step, idx) => ({
                            ...step,
                            status: idx <= currentStep ? "completed" : step.status,
                          })),
                        },
                      };
                    }),
                  }
                : chat
            )
          );
          currentStep++;
          executeStep();
        }, 1000);
      };

      setTimeout(executeStep, 500);
    },
    []
  );

  const handleNewChat = useCallback(
    (clientId: string): string => {
      const client = mockClients.find((c) => c.id === clientId);
      const newChat: Chat = {
        id: `chat-${Date.now()}`,
        clientId,
        title: `New Chat with ${client?.name || "Client"}`,
        hasUnread: false,
        updatedAt: new Date(),
        messages: [],
        artifacts: [],
      };
      setChats((prev) => [newChat, ...prev]);
      setSelectedChatId(newChat.id);
      return newChat.id;
    },
    []
  );

  const handleAgentClick = (agentId: string) => {
    const agentClientMap: Record<string, string> = {
      "agent-1": "1",
      "agent-2": "2",
      "agent-3": "5",
      "agent-4": "3",
    };
    const clientId = agentClientMap[agentId] || "1";
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
    setChatPanelMode("recent");
  };

  const handleDashboardMessage = useCallback(
    async (message: string, client: Client | null, chipPosition: number) => {
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
        artifacts: [],
      };

      setChats((prev) => [newChat, ...prev]);
      setSelectedChatId(newChatId);
      setActiveView("chats");
      setChatPanelMode("recent");
      setLoadingChatId(newChatId);

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

        const { content: artifactParsedContent, artifacts: newArtifacts } = parseArtifacts(data.content);

        const actionPlanResult = parseActionPlan(artifactParsedContent);
        const finalContent = actionPlanResult?.cleanedContent || artifactParsedContent;
        const actionPlan = actionPlanResult?.plan;

        const assistantMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: finalContent,
          artifactIds: newArtifacts.map((a) => a.id),
          actionPlan,
          timestamp: new Date(),
        };

        setChats((prev) =>
          prev.map((chat) =>
            chat.id === newChatId
              ? {
                  ...chat,
                  messages: [...chat.messages, assistantMessage],
                  artifacts: [...chat.artifacts, ...newArtifacts],
                  updatedAt: new Date(),
                }
              : chat
          )
        );
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setLoadingChatId(null);
      }
    },
    []
  );

  const handleAgentFromAgentsView = (agentId: string) => {
    const agent = agents.find((a) => a.id === agentId);
    if (agent) {
      setSelectedAgentForClient(agent);
      setClientSelectOpen(true);
    }
  };

  const handleAgentSelectedFromDashboard = (agent: Agent) => {
    setSelectedAgentForClient(agent);
    setClientSelectOpen(true);
  };

  const handleClientSelectedForAgent = async (clientId: string) => {
    const client = mockClients.find((c) => c.id === clientId);
    const agent = selectedAgentForClient;

    if (agent && client) {
      const newChatId = `chat-${Date.now()}`;

      let greeting = `Hi! I'm here to help with ${agent.name}.`;
      try {
        const response = await fetch(`/api/agent-greeting?agentId=${agent.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.greeting) {
            greeting = data.greeting;
          }
        }
      } catch (error) {
        console.error("Failed to fetch agent greeting:", error);
      }

      const greetingMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: greeting,
        timestamp: new Date(),
      };

      const newChat: Chat = {
        id: newChatId,
        clientId: client.id,
        agentId: agent.id,
        title: `${agent.name} - ${client.name}`,
        hasUnread: false,
        updatedAt: new Date(),
        messages: [greetingMessage],
        artifacts: [],
      };

      setChats((prev) => [newChat, ...prev]);
      setSelectedChatId(newChatId);
    }

    setClientSelectOpen(false);
    setSelectedAgentForClient(null);
    setActiveView("chats");
    setChatPanelMode("recent");
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
          allAgents={agents}
          initialTodos={mockTodos}
          suggestedActions={suggestedActions}
          onAgentClick={handleAgentClick}
          onSendMessage={handleDashboardMessage}
          onAgentSelected={handleAgentSelectedFromDashboard}
        />
      );
    }

    if (activeView === "chats") {
      return (
        <>
          {/* Recent Chats mode */}
          <div className={chatPanelMode === "recent" ? "flex flex-1 overflow-hidden" : "hidden"}>
            <ChatListPanel
              clients={mockClients}
              chats={chats}
              selectedChatId={selectedChatId}
              onSelectChat={setSelectedChatId}
              onNewChat={handleNewChat}
              viewMode={chatPanelMode}
              onViewModeChange={setChatPanelMode}
            />
            {selectedChat ? (
              <ChatView
                client={selectedClient || null}
                chatTitle={selectedChat.title}
                messages={currentMessages}
                artifacts={currentArtifacts}
                selectedArtifactId={selectedArtifactId}
                onSendMessage={handleSendMessage}
                onApprove={handleApprove}
                onDecline={handleDecline}
                onWorkflowClick={handleWorkflowClick}
                onArtifactClick={setSelectedArtifactId}
                isLoading={loadingChatId === selectedChatId}
              />
            ) : (
              <div className="flex flex-1 items-center justify-center text-muted-foreground">
                Select a chat to start messaging
              </div>
            )}
            {selectedArtifact && chatPanelMode === "recent" && (
              <ArtifactPanel
                artifact={selectedArtifact}
                onClose={() => setSelectedArtifactId(null)}
                onUpdate={(updatedArtifact) => {
                  setChats((prev) =>
                    prev.map((chat) => ({
                      ...chat,
                      artifacts: chat.artifacts.map((a) =>
                        a.id === updatedArtifact.id ? updatedArtifact : a
                      ),
                    }))
                  );
                }}
              />
            )}
            {workflowPanelOpen && !selectedArtifact && (
              <WorkflowPanel
                workflow={defaultPayrollWorkflow}
                onClose={() => setWorkflowPanelOpen(false)}
              />
            )}
          </div>

          {/* Clients mode */}
          <div className={chatPanelMode === "clients" ? "flex flex-1 overflow-hidden" : "hidden"}>
            <ClientsView
              clients={mockClients}
              chats={chats}
              onSendMessage={handleSendMessageForChat}
              onApprove={handleApproveForChat}
              onDecline={handleDeclineForChat}
              onNewChat={handleNewChat}
              onWorkflowClick={handleWorkflowClick}
              onArtifactClick={setSelectedArtifactId}
              loadingChatId={loadingChatId}
              chatPanelMode={chatPanelMode}
              onChatPanelModeChange={setChatPanelMode}
            />
          </div>
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

      {/* Design variant toggle */}
      <div className="fixed bottom-4 right-4 z-[100] flex items-center gap-1 rounded-full border border-[oklch(1_0_0_/_0.1)] bg-[oklch(0.15_0_0_/_0.9)] px-1.5 py-1 shadow-2xl backdrop-blur-md">
        {VARIANTS.map((v) => (
          <button
            key={v}
            onClick={() => setDesignVariant(v)}
            className={`rounded-full px-3 py-1 text-[11px] font-medium tracking-wide transition-all ${
              designVariant === v
                ? "bg-[oklch(0.7_0.15_65)] text-[oklch(0.1_0_0)] shadow-sm"
                : "text-[oklch(0.55_0_0)] hover:text-[oklch(0.8_0_0)]"
            }`}
          >
            {v === "original" ? "OG" : v.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
