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
import { Message, Chat, Client, Artifact, ActionPlan } from "@/types/chat";
import { ArtifactPanel } from "@/components/artifacts/artifact-panel";
import { parseArtifacts } from "@/lib/artifact-parser";
import { parseActionPlan } from "@/lib/action-plan-parser";
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
  const selectedArtifact = currentArtifacts.find((a) => a.id === selectedArtifactId) || null;

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

        // Parse artifacts from LLM response
        const { content: artifactParsedContent, artifacts: newArtifacts } = parseArtifacts(data.content);

        // Parse action plan from LLM response
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
          prev.map((chat) => {
            if (chat.id !== selectedChatId) return chat;

            // If new action plan, auto-decline any pending plans in previous messages
            let updatedMessages = chat.messages;
            if (actionPlan) {
              updatedMessages = chat.messages.map((msg) => {
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
              ...chat,
              messages: [...updatedMessages, assistantMessage],
              artifacts: [...chat.artifacts, ...newArtifacts],
              updatedAt: new Date(),
            };
          })
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
                messages: chat.messages.map((msg) => {
                  if (msg.id !== messageId) return msg;
                  if (msg.actionPlan) {
                    // Start execution simulation
                    const updatedPlan = { ...msg.actionPlan, status: "approved" as const };
                    simulateExecution(messageId, updatedPlan);
                    return { ...msg, actionPlan: updatedPlan, approved: true };
                  }
                  return { ...msg, approved: true };
                }),
              }
            : chat
        )
      );
    },
    [selectedChatId]
  );

  const handleDecline = useCallback(
    (messageId: string) => {
      if (!selectedChatId) return;

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === selectedChatId
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
    [selectedChatId]
  );

  const simulateExecution = useCallback(
    (messageId: string, plan: ActionPlan) => {
      const steps = plan.steps;
      let currentStep = 0;

      const executeStep = () => {
        if (currentStep >= steps.length) {
          // All steps completed
          setChats((prev) =>
            prev.map((chat) =>
              chat.id === selectedChatId
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

        // Update current step to in_progress
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === selectedChatId
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

        // After delay, mark step as completed and move to next
        setTimeout(() => {
          setChats((prev) =>
            prev.map((chat) =>
              chat.id === selectedChatId
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

      // Start execution after a brief delay
      setTimeout(executeStep, 500);
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
        artifacts: [],
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
    async (message: string, client: Client | null, chipPosition: number, agentName?: string) => {
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
        title: agentName || "New Chat",
        hasUnread: false,
        updatedAt: new Date(),
        messages: [userMessage],
        artifacts: [],
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

        // Parse artifacts from LLM response
        const { content: artifactParsedContent, artifacts: newArtifacts } = parseArtifacts(data.content);

        // Parse action plan from LLM response
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
          allAgents={agents}
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
              artifacts={currentArtifacts}
              selectedArtifactId={selectedArtifactId}
              onSendMessage={handleSendMessage}
              onApprove={handleApprove}
              onDecline={handleDecline}
              onWorkflowClick={handleWorkflowClick}
              onArtifactClick={setSelectedArtifactId}
              isLoading={isLoading}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
              Select a chat to start messaging
            </div>
          )}
          {selectedArtifact && (
            <ArtifactPanel
              artifact={selectedArtifact}
              onClose={() => setSelectedArtifactId(null)}
              onUpdate={(updatedArtifact) => {
                setChats((prev) =>
                  prev.map((chat) =>
                    chat.id === selectedChatId
                      ? {
                          ...chat,
                          artifacts: chat.artifacts.map((a) =>
                            a.id === updatedArtifact.id ? updatedArtifact : a
                          ),
                        }
                      : chat
                  )
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
