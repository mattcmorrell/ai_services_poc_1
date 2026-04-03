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

// Mercury Dark Palette
const mercury = {
  bg: "#101214",
  card: "#222428",
  innerSurface: "#222428",
  accent: "#6878B8",
  accentBright: "#8E9AD0",
  alert: "#E08850",
  textBright: "#E8E9ED",
  textPrimary: "#E8E9ED",
  textSecondary: "#9DA0A8",
  success: "#7BAA82",
  danger: "#C07070",
  border: "rgba(180,185,200,0.07)",
};

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
    <div className="relative flex h-full flex-1 flex-col overflow-hidden" style={{ background: mercury.bg }}>
      <div className="relative z-10 flex flex-1 flex-col items-center overflow-auto px-8 py-12">
        {/* Logo with accent underline */}
        <div className="mb-2 flex flex-col items-center">
          <Image
            src="/Pandopticon-logo.png"
            alt="Pandopticon"
            width={320}
            height={90}
          />
          <div
            className="mt-3 h-px w-48"
            style={{
              background: `linear-gradient(90deg, transparent, ${mercury.accent}, transparent)`,
            }}
          />
        </div>

        {/* Greeting tagline */}
        <p
          className="mb-10 text-sm tracking-[0.2em] uppercase"
          style={{ color: mercury.textSecondary }}
        >
          Command Center
        </p>

        {/* Input */}
        <div className="relative mb-6 w-full max-w-2xl">
          <div className="relative">
            <DashboardInput clients={clients} agents={allAgents} onSend={onSendMessage} onAgentSelected={onAgentSelected} />
          </div>
        </div>

        {/* Suggested Actions */}
        <div className="mb-12">
          <SuggestedActions
            actions={suggestedActions}
            onActionClick={(prompt) => onSendMessage(prompt, null, -1)}
          />
        </div>

        {/* Accent divider */}
        <div className="mb-10 flex w-full max-w-4xl items-center gap-4">
          <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, rgba(104, 120, 184, 0.3), rgba(104, 120, 184, 0.15))` }} />
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.3em]"
            style={{ color: mercury.accent }}
          >
            Activity
          </span>
          <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, rgba(104, 120, 184, 0.15), rgba(104, 120, 184, 0.3), transparent)` }} />
        </div>

        {/* Main Content Grid */}
        <div className="grid w-full max-w-4xl grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr]">
          {/* Agents card */}
          <AgentsAttention agents={agents} onAgentClick={onAgentClick} />

          {/* Todo card */}
          <TodoList
            todos={todos}
            onToggle={handleToggleTodo}
            onAdd={handleAddTodo}
          />
        </div>
      </div>
    </div>
  );
}
