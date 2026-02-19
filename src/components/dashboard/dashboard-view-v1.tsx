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
    <div className="relative flex h-full flex-1 flex-col overflow-hidden" style={{ background: "linear-gradient(170deg, oklch(0.13 0.01 280) 0%, oklch(0.08 0 0) 40%, oklch(0.10 0.005 50) 100%)" }}>
      {/* Decorative ambient glow — top */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2"
        style={{
          width: "900px",
          height: "500px",
          background: "radial-gradient(ellipse at center, oklch(0.35 0.12 65 / 0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      {/* Decorative ambient glow — bottom-right */}
      <div
        className="pointer-events-none absolute -bottom-32 -right-32"
        style={{
          width: "600px",
          height: "400px",
          background: "radial-gradient(ellipse at center, oklch(0.25 0.08 280 / 0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Subtle noise overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col items-center overflow-auto px-8 py-12">
        {/* Logo with accent underline */}
        <div className="mb-2 flex flex-col items-center">
          <Image
            src="/Pandopticon-logo.png"
            alt="Pandopticon"
            width={320}
            height={90}
            className="drop-shadow-[0_0_40px_oklch(0.4_0.15_65_/_0.15)]"
          />
          <div
            className="mt-3 h-px w-48"
            style={{
              background: "linear-gradient(90deg, transparent, oklch(0.7 0.15 65 / 0.5), transparent)",
            }}
          />
        </div>

        {/* Greeting tagline */}
        <p
          className="mb-10 text-sm tracking-[0.2em] uppercase"
          style={{ color: "oklch(0.55 0.05 65)" }}
        >
          Command Center
        </p>

        {/* Input — wider, with accent border glow */}
        <div className="relative mb-6 w-full max-w-2xl">
          {/* Glow behind input */}
          <div
            className="pointer-events-none absolute -inset-px rounded-xl"
            style={{
              background: "linear-gradient(135deg, oklch(0.45 0.15 65 / 0.2), oklch(0.35 0.12 280 / 0.15), transparent)",
              filter: "blur(1px)",
            }}
          />
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
          <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, oklch(0.35 0.08 65 / 0.4), oklch(0.3 0.05 65 / 0.2))" }} />
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.3em]"
            style={{ color: "oklch(0.5 0.08 65)" }}
          >
            Activity
          </span>
          <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, oklch(0.3 0.05 65 / 0.2), oklch(0.35 0.08 65 / 0.4), transparent)" }} />
        </div>

        {/* Main Content Grid — reimagined proportions */}
        <div className="grid w-full max-w-4xl grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr]">
          {/* Agents card with accent top border */}
          <div className="relative overflow-hidden rounded-2xl" style={{ background: "oklch(0.14 0.005 280 / 0.6)", border: "1px solid oklch(1 0 0 / 0.06)" }}>
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent 10%, oklch(0.65 0.18 65 / 0.5) 50%, transparent 90%)" }}
            />
            <div className="p-1">
              <AgentsAttention agents={agents} onAgentClick={onAgentClick} />
            </div>
          </div>

          {/* Todo card with accent top border */}
          <div className="relative overflow-hidden rounded-2xl" style={{ background: "oklch(0.14 0.005 280 / 0.6)", border: "1px solid oklch(1 0 0 / 0.06)" }}>
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent 10%, oklch(0.5 0.12 280 / 0.5) 50%, transparent 90%)" }}
            />
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
