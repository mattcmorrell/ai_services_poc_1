"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Sidebar } from "@/components/sidebar/sidebar";
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
import { Agent } from "@/types/agent";
import { ClientsView } from "@/components/clients/clients-view";
import { useStreamingChatSession } from "@/hooks/use-streaming-chat-session";

export default function Home() {
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedChatId, setSelectedChatId] = useState<string | null>("chat-1");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>(mockChats);
  // Loading state is now derived from streamingSession.loadingChatId
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

  // --- Streaming session for the active chat ---
  const streamingSession = useStreamingChatSession({
    chatId: selectedChatId || "__none__",
    clientName: selectedClient?.name || "Unknown Client",
    agentId: selectedChat?.agentId,
    onFinishMessage: useCallback(({ message, artifacts: newArtifacts }: { message: Message; artifacts: Artifact[] }) => {
      if (!selectedChatId) return;
      // Sync the parsed assistant message + artifacts back into durable chats state
      setChats((prev) =>
        prev.map((c) => {
          if (c.id !== selectedChatId) return c;

          // If a new action plan arrived, decline any existing pending plans
          let updatedMessages = c.messages;
          if (message.actionPlan) {
            updatedMessages = c.messages.map((msg) => {
              if (msg.actionPlan && msg.actionPlan.status === "pending") {
                return { ...msg, actionPlan: { ...msg.actionPlan, status: "declined" as const } };
              }
              return msg;
            });
          }

          return {
            ...c,
            messages: [...updatedMessages, message],
            artifacts: [...c.artifacts, ...newArtifacts],
            updatedAt: new Date(),
          };
        })
      );
    }, [selectedChatId]),
  });

  // Use streaming messages when available, fall back to durable chats state
  const currentMessages = streamingSession.messages.length > 0
    ? streamingSession.messages
    : selectedChat?.messages || [];
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
  const simulateExecutionRef = useRef<(messageId: string, plan: ActionPlan, chatId: string) => void>(() => {});
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

  // For the active (selected) chat, use the streaming session
  const handleSendMessageForChat = useCallback(
    (content: string, chatId: string, options?: { hidden?: boolean }) => {
      // Only the selected chat uses the streaming session hook
      if (chatId === selectedChatId) {
        streamingSession.sendMessage(content, options);
      }
    },
    [selectedChatId, streamingSession]
  );

  // Wrapper for "recent" mode — uses selectedChatId
  const handleSendMessage = useCallback(
    (content: string, options?: { hidden?: boolean }) => {
      if (!selectedChatId) return;
      streamingSession.sendMessage(content, options);
    },
    [selectedChatId, streamingSession]
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

  const handleApproveGatedStep = useCallback(
    (gateMessageId: string) => {
      if (!selectedChatId) return;
      const chat = chats.find((c) => c.id === selectedChatId);
      if (!chat) return;

      const gateMsg = chat.messages.find((m) => m.id === gateMessageId);
      if (!gateMsg?.gateApproval) return;

      const planMsg = chat.messages.find((m) => m.id === gateMsg.gateApproval!.planMessageId);
      if (!planMsg?.actionPlan) return;

      // Mark the current in_progress step as completed before resuming
      const updatedSteps = planMsg.actionPlan.steps.map((step) =>
        step.status === "in_progress"
          ? { ...step, status: "completed" as const, completedAt: new Date() }
          : step
      );

      const updatedPlan: ActionPlan = {
        ...planMsg.actionPlan,
        status: "executing" as const,
        steps: updatedSteps,
        pausedAt: undefined,
        pausedBy: undefined,
      };

      setChats((prev) =>
        prev.map((c) =>
          c.id === selectedChatId
            ? {
                ...c,
                messages: c.messages.map((msg) =>
                  msg.id === planMsg.id && msg.actionPlan
                    ? { ...msg, actionPlan: updatedPlan }
                    : msg
                ),
              }
            : c
        )
      );

      simulateExecutionForChat(planMsg.id, updatedPlan, selectedChatId);
    },
    [selectedChatId, chats]
  );

  const handleModifyGatedStep = useCallback(
    (gateMessageId: string) => {
      if (!selectedChatId) return;
      const chat = chats.find((c) => c.id === selectedChatId);
      if (!chat) return;

      const gateMsg = chat.messages.find((m) => m.id === gateMessageId);
      if (!gateMsg?.gateApproval) return;

      const planMessageId = gateMsg.gateApproval.planMessageId;

      // Decline the plan so the user can describe changes
      setChats((prev) =>
        prev.map((c) =>
          c.id === selectedChatId
            ? {
                ...c,
                messages: c.messages.map((msg) =>
                  msg.id === planMessageId && msg.actionPlan
                    ? {
                        ...msg,
                        actionPlan: {
                          ...msg.actionPlan,
                          status: "declined" as const,
                        },
                      }
                    : msg
                ),
              }
            : c
        )
      );
    },
    [selectedChatId, chats]
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
      handleSendMessage(responseText, { hidden: true });
    },
    [selectedChatId, chats, handleSendMessage]
  );

  const handleApproveRequest = useCallback(
    (messageId: string) => {
      if (!selectedChatId) return;
      const chat = chats.find((c) => c.id === selectedChatId);
      if (!chat) return;

      // Mark the approval request as approved
      setChats((prev) =>
        prev.map((c) =>
          c.id === selectedChatId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === messageId && m.approvalRequest
                    ? { ...m, approvalRequest: { ...m.approvalRequest, approved: true } }
                    : m
                ),
              }
            : c
        )
      );

      // Advance the active plan: mark current in-progress step as completed and resume
      const planMsg = chat.messages.find(
        (m) => m.actionPlan && (m.actionPlan.status === "executing" || m.actionPlan.status === "paused")
      );
      if (planMsg?.actionPlan) {
        const currentIdx = planMsg.actionPlan.steps.findIndex(
          (s) => s.status === "in_progress"
        );
        if (currentIdx !== -1) {
          // Mark current step completed
          const updatedSteps = planMsg.actionPlan.steps.map((step, idx) => ({
            ...step,
            status: idx <= currentIdx ? ("completed" as const) : step.status,
          }));
          const updatedPlan = { ...planMsg.actionPlan, status: "executing" as const, steps: updatedSteps };
          setChats((prev) =>
            prev.map((c) =>
              c.id === selectedChatId
                ? {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === planMsg.id
                        ? { ...m, actionPlan: updatedPlan }
                        : m
                    ),
                  }
                : c
            )
          );
          // Resume simulation from the next step
          simulateExecutionRef.current(planMsg.id, updatedPlan, selectedChatId);
        }
      }

      // Send approval as hidden message
      handleSendMessage("Yes, approved.", { hidden: true });
    },
    [selectedChatId, chats, handleSendMessage]
  );

  const handleDeclineRequest = useCallback(
    (messageId: string) => {
      if (!selectedChatId) return;
      // Mark the approval request as declined
      setChats((prev) =>
        prev.map((c) =>
          c.id === selectedChatId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === messageId && m.approvalRequest
                    ? { ...m, approvalRequest: { ...m.approvalRequest, approved: false } }
                    : m
                ),
              }
            : c
        )
      );
      // Send decline — visible so user can explain
      handleSendMessage("No, I'd like to make changes.");
    },
    [selectedChatId, handleSendMessage]
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

        // If gated, inject a chat message and stop — the user must approve via chat or plan panel
        if (isGate) {
          const rawDesc = steps[currentStep]?.description || `Step ${currentStep + 1}`;
          // Strip "Step N:" prefix if the LLM already included it
          const stepDesc = rawDesc.replace(/^Step\s*\d+\s*:\s*/i, "");
          const gateMessage: Message = {
            id: `msg-gate-${Date.now()}-${currentStep}`,
            role: "assistant",
            content: `**Step ${currentStep + 1}: ${stepDesc}** requires your approval before proceeding. This action cannot be easily undone.`,
            gateApproval: {
              planMessageId: messageId,
              stepIndex: currentStep,
              stepDescription: stepDesc,
            },
            timestamp: new Date(),
          };
          setChats((prev) =>
            prev.map((chat) =>
              chat.id === chatId
                ? { ...chat, messages: [...chat.messages, gateMessage] }
                : chat
            )
          );
          return;
        }

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
  simulateExecutionRef.current = simulateExecutionForChat;

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

  const handleRenameChat = useCallback((chatId: string) => {
    setChats((prev) => {
      const chat = prev.find((c) => c.id === chatId);
      if (!chat) return prev;
      const next = window.prompt("Rename chat", chat.title);
      if (next === null) return prev;
      const trimmed = next.trim();
      if (!trimmed) return prev;
      return prev.map((c) => (c.id === chatId ? { ...c, title: trimmed } : c));
    });
  }, []);

  const handleDeleteChat = useCallback((chatId: string) => {
    setChats((prev) => {
      const chat = prev.find((c) => c.id === chatId);
      if (!chat) return prev;
      if (!window.confirm(`Delete "${chat.title}"? This can't be undone.`)) return prev;
      return prev.filter((c) => c.id !== chatId);
    });
    setSelectedChatId((current) => (current === chatId ? null : current));
  }, []);

  const handleAgentClick = (agentId: string) => {
    const agentClientMap: Record<string, string> = {
      "agent-1": "4",
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
  };

  // Pending message from dashboard — sent via streaming hook after chat becomes active
  const pendingDashboardMessageRef = useRef<string | null>(null);

  useEffect(() => {
    if (pendingDashboardMessageRef.current && selectedChatId) {
      const msg = pendingDashboardMessageRef.current;
      pendingDashboardMessageRef.current = null;
      streamingSession.sendMessage(msg);
    }
  }, [selectedChatId, streamingSession]);

  const handleDashboardMessage = useCallback(
    (message: string, client: Client | null, chipPosition: number) => {
      const newChatId = `chat-${Date.now()}`;

      const newChat: Chat = {
        id: newChatId,
        clientId: client?.id || null,
        title: "New Chat",
        hasUnread: false,
        updatedAt: new Date(),
        messages: [],
        artifacts: [],
      };

      setChats((prev) => [newChat, ...prev]);
      pendingDashboardMessageRef.current = message;
      setSelectedChatId(newChatId);
      setActiveView("chats");
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
        <div className="flex flex-1 overflow-hidden">
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
                isLoading={streamingSession.loadingChatId === selectedChatId}
                activePlan={activePlan || undefined}
                activePlanMessageId={activePlanMessage?.id}
                planPanelOpen={planPanelOpen}
                onOpenPlanPanel={() => setPlanPanelOpen(true)}
                onClosePlanPanel={() => setPlanPanelOpen(false)}
                onPausePlan={handlePausePlan}
                onStopPlan={handleStopPlan}
                onResumePlan={handleResumePlan}
                onApproveGatedStep={handleApproveGatedStep}
                onModifyGatedStep={handleModifyGatedStep}
                onApproveRequest={handleApproveRequest}
                onDeclineRequest={handleDeclineRequest}
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
      );
    }

    if (activeView === "clients") {
      return (
        <ClientsView
          clients={mockClients}
          chats={chats}
          selectedClientId={selectedClientId}
          onSelectChat={(id) => {
            setSelectedChatId(id);
            setChats((prev) => prev.map((c) => (c.id === id ? { ...c, hasUnread: false } : c)));
            setActiveView("chats");
          }}
        />
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
      <Sidebar
          activeView={activeView}
          clients={mockClients}
          chats={chats}
          selectedChatId={selectedChatId}
          selectedClientId={selectedClientId}
          onViewChange={setActiveView}
          onSelectChat={(id) => {
            setSelectedChatId(id);
            setChats((prev) => prev.map((c) => (c.id === id ? { ...c, hasUnread: false } : c)));
          }}
          onNewChat={handleNewChat}
          onSelectClient={(clientId) => {
            setSelectedClientId(clientId);
            setActiveView("clients");
          }}
          onRenameChat={handleRenameChat}
          onDeleteChat={handleDeleteChat}
        />
      <div className="flex flex-1 min-w-0 overflow-hidden">
        {renderMainContent()}
      </div>
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
