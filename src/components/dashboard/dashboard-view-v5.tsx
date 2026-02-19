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

const glassVars: Record<string, string> = {
  "--background": "#060608",
  "--foreground": "rgba(255, 255, 255, 0.85)",
  "--card": "rgba(255, 255, 255, 0.03)",
  "--card-foreground": "rgba(255, 255, 255, 0.85)",
  "--popover": "rgba(255, 255, 255, 0.06)",
  "--popover-foreground": "rgba(255, 255, 255, 0.85)",
  "--primary": "rgba(255, 255, 255, 0.9)",
  "--primary-foreground": "#060608",
  "--secondary": "rgba(255, 255, 255, 0.04)",
  "--secondary-foreground": "rgba(255, 255, 255, 0.7)",
  "--muted": "rgba(255, 255, 255, 0.04)",
  "--muted-foreground": "rgba(255, 255, 255, 0.4)",
  "--accent": "rgba(255, 255, 255, 0.06)",
  "--accent-foreground": "rgba(255, 255, 255, 0.85)",
  "--destructive": "rgba(180, 80, 60, 0.8)",
  "--border": "rgba(255, 255, 255, 0.06)",
  "--input": "rgba(255, 255, 255, 0.06)",
  "--ring": "rgba(255, 255, 255, 0.15)",
};

const glassCard: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  borderRadius: "24px",
  backdropFilter: "blur(40px)",
  WebkitBackdropFilter: "blur(40px)",
};

const glassCardInner: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(255, 255, 255, 0.04)",
  borderRadius: "20px",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
};

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
      className="v5-glass flex h-full flex-1 flex-col"
      style={{
        background: "#060608",
        fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        ...glassVars,
      } as React.CSSProperties}
    >
      <style>{`
        .v5-glass *, .v5-glass *::before, .v5-glass *::after {
          border-color: rgba(255, 255, 255, 0.06) !important;
        }
        .v5-glass [class*="rounded-xl"],
        .v5-glass [class*="rounded-lg"] {
          border-radius: 20px !important;
        }
        .v5-glass [class*="rounded-full"] {
          border-radius: 9999px !important;
        }
      `}</style>

      <div className="flex flex-1 flex-col items-center overflow-auto px-8 py-12">
        {/* Logo */}
        <div className="mb-3 flex flex-col items-center">
          <Image
            src="/Pandopticon-logo.png"
            alt="Pandopticon"
            width={300}
            height={85}
            style={{ opacity: 0.9 }}
          />
        </div>

        {/* Tagline */}
        <p
          className="mb-10 text-[11px] font-light uppercase tracking-[0.3em]"
          style={{ color: "rgba(255, 255, 255, 0.3)" }}
        >
          Command Center
        </p>

        {/* Input — wrapped in glass card */}
        <div className="mb-5 w-full max-w-2xl" style={glassCard}>
          <div className="p-1">
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

        {/* Section divider */}
        <div className="mb-8 flex w-full max-w-4xl items-center gap-4">
          <div
            className="h-px flex-1"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03))" }}
          />
          <span
            className="text-[10px] font-light uppercase tracking-[0.3em]"
            style={{ color: "rgba(255, 255, 255, 0.25)" }}
          >
            Activity
          </span>
          <div
            className="h-px flex-1"
            style={{ background: "linear-gradient(90deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06), transparent)" }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid w-full max-w-4xl grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
          {/* Agents — glass card */}
          <div style={glassCard}>
            <div className="p-1">
              <AgentsAttention agents={agents} onAgentClick={onAgentClick} />
            </div>
          </div>

          {/* Todos — glass card */}
          <div style={glassCard}>
            <div className="p-1">
              <TodoList
                todos={todos}
                onToggle={handleToggleTodo}
                onAdd={handleAddTodo}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
