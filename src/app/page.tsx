"use client";

import { useState, useCallback } from "react";
import { Sidebar } from "@/components/sidebar";
import { ChatList } from "@/components/chat-list";
import { ChatView } from "@/components/chat-view";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { mockClients, mockMessages } from "@/data/mock-data";
import { mockAgentAttention, mockTodos, suggestedActions } from "@/data/dashboard-data";
import { Message } from "@/types/chat";

export default function Home() {
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedClientId, setSelectedClientId] = useState<string | null>("4");
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [isLoading, setIsLoading] = useState(false);

  const selectedClient = mockClients.find((c) => c.id === selectedClientId);
  const currentMessages = selectedClientId ? messages[selectedClientId] || [] : [];

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!selectedClientId || !selectedClient) return;

      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => ({
        ...prev,
        [selectedClientId]: [...(prev[selectedClientId] || []), userMessage],
      }));

      setIsLoading(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...(messages[selectedClientId] || []), userMessage].map(
              (m) => ({ role: m.role, content: m.content })
            ),
            clientName: selectedClient.name,
          }),
        });

        const data = await response.json();

        const assistantMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: data.content,
          timestamp: new Date(),
        };

        setMessages((prev) => ({
          ...prev,
          [selectedClientId]: [...(prev[selectedClientId] || []), assistantMessage],
        }));
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedClientId, selectedClient, messages]
  );

  const handleApprove = useCallback(
    (messageId: string) => {
      if (!selectedClientId) return;

      setMessages((prev) => ({
        ...prev,
        [selectedClientId]: prev[selectedClientId].map((msg) =>
          msg.id === messageId ? { ...msg, approved: true } : msg
        ),
      }));
    },
    [selectedClientId]
  );

  const handleAgentClick = (agentId: string) => {
    // Map agent to client and switch to chats view
    const agentClientMap: Record<string, string> = {
      "agent-1": "1", // Payroll Runner -> Silly Circuits (placeholder)
      "agent-2": "2", // Powerpoint Builder -> Geeky Grotto
      "agent-3": "5", // Party Planner -> Clever Components
      "agent-4": "3", // CX Oracle -> Widget Wizards
    };
    const clientId = agentClientMap[agentId] || "1";
    setSelectedClientId(clientId);
    setActiveView("chats");
  };

  const handleDashboardMessage = (message: string) => {
    // For now, just log it - we'll implement this later
    console.log("Dashboard message:", message);
  };

  const renderMainContent = () => {
    if (activeView === "dashboard") {
      return (
        <DashboardView
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
          <ChatList
            clients={mockClients}
            selectedClientId={selectedClientId}
            onSelectClient={setSelectedClientId}
          />
          {selectedClient ? (
            <ChatView
              client={selectedClient}
              messages={currentMessages}
              onSendMessage={handleSendMessage}
              onApprove={handleApprove}
              isLoading={isLoading}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
              Select a client to start chatting
            </div>
          )}
        </>
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
    </div>
  );
}
