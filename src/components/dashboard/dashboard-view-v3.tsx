"use client";

import { useState } from "react";
import Image from "next/image";
import { DashboardInput } from "./dashboard-input";
import { SuggestedActions } from "./suggested-actions";
import { AgentsAttention } from "./agents-attention";
import { TodoList } from "./todo-list";
import { AgentAttention, TodoItem, SuggestedAction } from "@/types/dashboard";
import { Client } from "@/types/chat";
import { Agent } from "@/types/agent";

interface DashboardViewProps {
  clients: Client[];
  agents: AgentAttention[];
  allAgents: Agent[];
  initialTodos: TodoItem[];
  suggestedActions: SuggestedAction[];
  onAgentClick: (agentId: string) => void;
  onSendMessage: (message: string, client: Client | null, chipPosition: number) => void;
  onAgentSelected: (agent: Agent) => void;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardView({
  clients,
  agents,
  allAgents,
  initialTodos,
  suggestedActions,
  onAgentClick,
  onSendMessage,
  onAgentSelected,
}: DashboardViewProps) {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);

  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleAddTodo = (text: string) => {
    const newTodo: TodoItem = {
      id: `todo-${Date.now()}`,
      text,
      completed: false,
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  return (
    <div
      className="flex h-full flex-1 flex-col"
      style={{
        background: "linear-gradient(180deg, #FAF7F2 0%, #F5F0E8 50%, #FBF8F4 100%)",
        color: "#3D3529",
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      <style>{`
        .v3-editorial * { color: inherit; }
        .v3-editorial input, .v3-editorial textarea, .v3-editorial select {
          color: #3D3529 !important;
        }
        .v3-editorial input::placeholder, .v3-editorial textarea::placeholder {
          color: #9C9486 !important;
        }
      `}</style>
      <div className="v3-editorial flex flex-1 flex-col items-center overflow-auto px-6 py-12">
        {/* Greeting */}
        <div className="mb-2 text-center">
          <p
            style={{
              fontSize: "0.85rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#A0917D",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {getGreeting()}
          </p>
        </div>

        {/* Logo */}
        <div className="mb-10">
          <Image
            src="/Pandopticon-logo.png"
            alt="Pandopticon"
            width={260}
            height={74}
            style={{ filter: "brightness(0) opacity(0.7)" }}
          />
        </div>

        {/* Decorative divider */}
        <div
          className="mb-8 w-16"
          style={{ height: "1px", background: "linear-gradient(90deg, transparent, #C8B9A6, transparent)" }}
        />

        {/* Input */}
        <div
          className="mb-5 w-full max-w-2xl rounded-2xl p-1"
          style={{
            background: "#FFFFFF",
            boxShadow: "0 2px 20px rgba(160, 140, 110, 0.08), 0 1px 4px rgba(160, 140, 110, 0.06)",
            border: "1px solid rgba(200, 185, 166, 0.3)",
          }}
        >
          <DashboardInput clients={clients} agents={allAgents} onSend={onSendMessage} onAgentSelected={onAgentSelected} />
        </div>

        {/* Suggested Actions */}
        <div className="mb-10">
          <SuggestedActions
            actions={suggestedActions}
            onActionClick={(prompt) => onSendMessage(prompt, null, -1)}
          />
        </div>

        {/* Decorative divider */}
        <div
          className="mb-8 w-24"
          style={{ height: "1px", background: "linear-gradient(90deg, transparent, #D4C5B2, transparent)" }}
        />

        {/* Section label */}
        <p
          className="mb-6 text-center"
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#A0917D",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Your workspace
        </p>

        {/* Main Content Grid */}
        <div className="grid w-full max-w-4xl grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
          <div
            className="rounded-2xl p-6"
            style={{
              background: "#FFFFFF",
              boxShadow: "0 2px 20px rgba(160, 140, 110, 0.07)",
              border: "1px solid rgba(200, 185, 166, 0.25)",
            }}
          >
            <AgentsAttention agents={agents} onAgentClick={onAgentClick} />
          </div>
          <div
            className="rounded-2xl p-5"
            style={{
              background: "#FFFFFF",
              boxShadow: "0 2px 20px rgba(160, 140, 110, 0.07)",
              border: "1px solid rgba(200, 185, 166, 0.25)",
            }}
          >
            <TodoList
              todos={todos}
              onToggle={handleToggleTodo}
              onAdd={handleAddTodo}
            />
          </div>
        </div>

        {/* Bottom spacer */}
        <div className="pb-8" />
      </div>
    </div>
  );
}
