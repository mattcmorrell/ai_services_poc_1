"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
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
import { ChatListPanel as ChatListPanelV6 } from "@/components/chat-list-panel-v6";
import { ChatView as ChatViewV6 } from "@/components/chat-view-v6";
import { DashboardView as DashboardViewV6 } from "@/components/dashboard/dashboard-view-v6";
import { ChatListPanel as ChatListPanelV7 } from "@/components/chat-list-panel-v7";
import { ChatView as ChatViewV7 } from "@/components/chat-view-v7";
import { DashboardView as DashboardViewV7 } from "@/components/dashboard/dashboard-view-v7";
import { ChatListPanel as ChatListPanelV8 } from "@/components/chat-list-panel-v8";
import { ChatView as ChatViewV8 } from "@/components/chat-view-v8";
import { DashboardView as DashboardViewV8 } from "@/components/dashboard/dashboard-view-v8";
import { ChatListPanel as ChatListPanelV9 } from "@/components/chat-list-panel-v9";
import { ChatView as ChatViewV9 } from "@/components/chat-view-v9";
import { DashboardView as DashboardViewV9 } from "@/components/dashboard/dashboard-view-v9";
import { ChatListPanel as ChatListPanelV10 } from "@/components/chat-list-panel-v10";
import { ChatView as ChatViewV10 } from "@/components/chat-view-v10";
import { DashboardView as DashboardViewV10 } from "@/components/dashboard/dashboard-view-v10";
import { ChatListPanel as ChatListPanelV11 } from "@/components/chat-list-panel-v11";
import { ChatView as ChatViewV11 } from "@/components/chat-view-v11";
import { DashboardView as DashboardViewV11 } from "@/components/dashboard/dashboard-view-v11";
import { ChatListPanel as ChatListPanelV12 } from "@/components/chat-list-panel-v12";
import { ChatView as ChatViewV12 } from "@/components/chat-view-v12";
import { DashboardView as DashboardViewV12 } from "@/components/dashboard/dashboard-view-v12";
import { ChatListPanel as ChatListPanelV13 } from "@/components/chat-list-panel-v13";
import { ChatView as ChatViewV13 } from "@/components/chat-view-v13";
import { DashboardView as DashboardViewV13 } from "@/components/dashboard/dashboard-view-v13";
import { ChatListPanel as ChatListPanelV14 } from "@/components/chat-list-panel-v13";
import { ChatView as ChatViewV14 } from "@/components/chat-view-v13";
import { DashboardView as DashboardViewV14 } from "@/components/dashboard/dashboard-view-v13";
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
import { parseClarifyingQuestions } from "@/lib/clarifying-questions-parser";
import { Agent } from "@/types/agent";
import { ClientsView } from "@/components/clients/clients-view";

const VARIANTS = ["original", "v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10", "v11", "v12", "v13", "v14"] as const;
type Variant = (typeof VARIANTS)[number];

const variantMap = {
  original: { DashboardView: DashboardViewOriginal, ChatListPanel: ChatListPanelOriginal, ChatView: ChatViewOriginal },
  v1: { DashboardView: DashboardViewV1, ChatListPanel: ChatListPanelV1, ChatView: ChatViewV1 },
  v2: { DashboardView: DashboardViewV2, ChatListPanel: ChatListPanelV2, ChatView: ChatViewV2 },
  v3: { DashboardView: DashboardViewV3, ChatListPanel: ChatListPanelV3, ChatView: ChatViewV3 },
  v4: { DashboardView: DashboardViewV4, ChatListPanel: ChatListPanelV4, ChatView: ChatViewV4 },
  v5: { DashboardView: DashboardViewV5, ChatListPanel: ChatListPanelV5, ChatView: ChatViewV5 },
  v6: { DashboardView: DashboardViewV6, ChatListPanel: ChatListPanelV6, ChatView: ChatViewV6 },
  v7: { DashboardView: DashboardViewV7, ChatListPanel: ChatListPanelV7, ChatView: ChatViewV7 },
  v8: { DashboardView: DashboardViewV8, ChatListPanel: ChatListPanelV8, ChatView: ChatViewV8 },
  v9: { DashboardView: DashboardViewV9, ChatListPanel: ChatListPanelV9, ChatView: ChatViewV9 },
  v10: { DashboardView: DashboardViewV10, ChatListPanel: ChatListPanelV10, ChatView: ChatViewV10 },
  v11: { DashboardView: DashboardViewV11, ChatListPanel: ChatListPanelV11, ChatView: ChatViewV11 },
  v12: { DashboardView: DashboardViewV12, ChatListPanel: ChatListPanelV12, ChatView: ChatViewV12 },
  v13: { DashboardView: DashboardViewV13, ChatListPanel: ChatListPanelV13, ChatView: ChatViewV13 },
  v14: { DashboardView: DashboardViewV14, ChatListPanel: ChatListPanelV14, ChatView: ChatViewV14 },
};

export default function Home() {
  const [designVariant, setDesignVariant] = useState<Variant>("original");
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
  const [planPanelOpen, setPlanPanelOpen] = useState(false);

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

  // Find the most recent plan in the current chat (any status except declined/stopped)
  const activePlanMessage = useMemo(() => {
    if (!selectedChat) return null;
    const candidates = selectedChat.messages.filter(
      (m) => m.actionPlan && !["declined", "stopped"].includes(m.actionPlan.status)
    );
    return candidates.length > 0 ? candidates[candidates.length - 1] : null;
  }, [selectedChat]);

  const activePlan = activePlanMessage?.actionPlan || null;

  // Auto-open plan panel when a plan starts executing
  // Auto-open plan panel whenever a plan exists
  const lastPlanId = useRef<string | null>(null);
  useEffect(() => {
    if (activePlan && activePlan.id !== lastPlanId.current) {
      setPlanPanelOpen(true);
      lastPlanId.current = activePlan.id;
    }
    if (!activePlan) {
      lastPlanId.current = null;
    }
  }, [activePlan]);

  const handlePausePlan = useCallback(() => {
    if (!activePlanMessage || !selectedChatId) return;
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChatId
          ? {
              ...chat,
              messages: chat.messages.map((msg) =>
                msg.id === activePlanMessage.id && msg.actionPlan
                  ? { ...msg, actionPlan: { ...msg.actionPlan, status: "paused" as const, pausedAt: new Date(), pausedBy: "HRC" } }
                  : msg
              ),
            }
          : chat
      )
    );
  }, [activePlanMessage, selectedChatId]);

  const handleStopPlan = useCallback(() => {
    if (!activePlanMessage || !selectedChatId) return;
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChatId
          ? {
              ...chat,
              messages: chat.messages.map((msg) =>
                msg.id === activePlanMessage.id && msg.actionPlan
                  ? { ...msg, actionPlan: { ...msg.actionPlan, status: "stopped" as const } }
                  : msg
              ),
            }
          : chat
      )
    );
    setPlanPanelOpen(false);
  }, [activePlanMessage, selectedChatId]);

  const handleResumePlan = useCallback(() => {
    if (!activePlanMessage || !selectedChatId || !activePlanMessage.actionPlan) return;

    // Mark the current in_progress step as completed before resuming
    const updatedSteps = activePlanMessage.actionPlan.steps.map(step =>
      step.status === "in_progress" ? { ...step, status: "completed" as const, completedAt: new Date() } : step
    );

    const updatedPlan: ActionPlan = {
      ...activePlanMessage.actionPlan,
      status: "executing" as const,
      steps: updatedSteps,
      pausedAt: undefined,
      pausedBy: undefined,
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChatId
          ? {
              ...chat,
              messages: chat.messages.map((msg) =>
                msg.id === activePlanMessage.id && msg.actionPlan
                  ? { ...msg, actionPlan: updatedPlan }
                  : msg
              ),
            }
          : chat
      )
    );

    // Re-trigger execution simulation from next incomplete step
    simulateExecutionForChat(activePlanMessage.id, updatedPlan, selectedChatId);
  }, [activePlanMessage, selectedChatId]);

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

        // Parse clarifying questions first, then action plans
        const cqResult = parseClarifyingQuestions(artifactParsedContent);
        const afterCqContent = cqResult?.cleanedContent || artifactParsedContent;

        const actionPlanResult = parseActionPlan(afterCqContent);
        const finalContent = actionPlanResult?.cleanedContent || afterCqContent;
        let actionPlan = actionPlanResult?.plan;

        // Safety net: for Time Off agent, ensure all steps are gated
        if (actionPlan && chat.agentId === "agent-timeoff") {
          actionPlan = {
            ...actionPlan,
            steps: actionPlan.steps.map(step => ({
              ...step,
              nonUndoable: true,
            })),
          };
        }

        const assistantMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: finalContent,
          artifactIds: newArtifacts.map((a) => a.id),
          actionPlan,
          clarifyingQuestions: cqResult?.questions,
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

  const handleSubmitClarifyingAnswers = useCallback(
    (messageId: string, answers: Record<string, string | string[]>) => {
      if (!selectedChatId) return;

      // Find the message to get question headers for formatting
      const chat = chats.find((c) => c.id === selectedChatId);
      const msg = chat?.messages.find((m) => m.id === messageId);

      // Mark the clarifying questions as answered in state
      setChats((prev) =>
        prev.map((c) =>
          c.id === selectedChatId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === messageId && m.clarifyingQuestions
                    ? {
                        ...m,
                        clarifyingQuestions: {
                          ...m.clarifyingQuestions,
                          answered: true,
                          answers,
                        },
                      }
                    : m
                ),
              }
            : c
        )
      );

      // Format answers into a readable user message
      const formattedAnswers = msg?.clarifyingQuestions?.questions
        .map((q) => {
          const answer = answers[q.id];
          const answerText = Array.isArray(answer)
            ? answer.join(", ")
            : answer || "No answer";
          return `**${q.header}**: ${answerText}`;
        })
        .join("\n") || "";

      const responseText = `Here are my answers:\n\n${formattedAnswers}`;
      handleSendMessage(responseText);
    },
    [selectedChatId, chats, handleSendMessage]
  );

  const simulateExecutionForChat = useCallback(
    (messageId: string, plan: ActionPlan, chatId: string) => {
      const steps = plan.steps;
      // Start from first non-completed step (supports resume after gate)
      let currentStep = steps.findIndex(s => s.status !== "completed");
      if (currentStep === -1) currentStep = steps.length;

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

        // Check if this step is a non-undoable gate — auto-pause for confirmation
        const isGate = steps[currentStep]?.nonUndoable;

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
                        status: isGate ? ("paused" as const) : ("executing" as const),
                        ...(isGate && { pausedAt: new Date(), pausedBy: "gate" }),
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

        // If gated, don't continue — the user must resume manually
        if (isGate) return;

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

        const cqResult = parseClarifyingQuestions(artifactParsedContent);
        const afterCqContent = cqResult?.cleanedContent || artifactParsedContent;

        const actionPlanResult = parseActionPlan(afterCqContent);
        const finalContent = actionPlanResult?.cleanedContent || afterCqContent;
        const actionPlan = actionPlanResult?.plan;

        const assistantMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: finalContent,
          artifactIds: newArtifacts.map((a) => a.id),
          actionPlan,
          clarifyingQuestions: cqResult?.questions,
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
                onSubmitClarifyingAnswers={handleSubmitClarifyingAnswers}
                isLoading={loadingChatId === selectedChatId}
                activePlan={activePlan || undefined}
                activePlanMessageId={activePlanMessage?.id}
                planPanelOpen={planPanelOpen}
                onOpenPlanPanel={() => setPlanPanelOpen(true)}
                onClosePlanPanel={() => setPlanPanelOpen(false)}
                onPausePlan={handlePausePlan}
                onStopPlan={handleStopPlan}
                onResumePlan={handleResumePlan}
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
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-2">
        <div className="flex items-center gap-1 rounded-full border border-[oklch(1_0_0_/_0.1)] bg-[oklch(0.15_0_0_/_0.9)] px-1.5 py-1 shadow-2xl backdrop-blur-md">
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
    </div>
  );
}
