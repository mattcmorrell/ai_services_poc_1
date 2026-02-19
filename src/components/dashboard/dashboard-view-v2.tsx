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

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour12: false });
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).toUpperCase();

  return (
    <div
      className="flex h-full flex-1 flex-col overflow-hidden"
      style={{
        background: "#0a0a0a",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      }}
    >
      {/* Scan line overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
        }}
      />

      {/* Top status bar */}
      <div
        className="flex items-center justify-between border-b-2 px-4 py-1.5"
        style={{
          borderColor: "#ff3b00",
          background: "#111",
        }}
      >
        <div className="flex items-center gap-4">
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "#ff3b00" }}
          >
            SYS::ONLINE
          </span>
          <span className="text-xs" style={{ color: "#666" }}>
            |
          </span>
          <span
            className="text-xs uppercase tracking-wider"
            style={{ color: "#888" }}
          >
            {dateStr}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span
            className="text-xs uppercase tracking-wider"
            style={{ color: "#888" }}
          >
            AGENTS: {agents.length} ACTIVE
          </span>
          <span className="text-xs" style={{ color: "#666" }}>
            |
          </span>
          <span
            className="text-xs font-bold tabular-nums tracking-wider"
            style={{ color: "#ff3b00" }}
          >
            {timeStr}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center overflow-auto px-6 py-6">
        {/* Brutalist header */}
        <div className="mb-6 text-center">
          <div
            className="mb-1 text-xs font-bold uppercase tracking-[0.5em]"
            style={{ color: "#555" }}
          >
            // CONTROL INTERFACE
          </div>
          <div className="relative">
            <h1
              className="text-4xl font-black uppercase tracking-tight"
              style={{
                color: "#fff",
                textShadow: "2px 2px 0 #ff3b00",
              }}
            >
              PANDOPTICON
            </h1>
            <div
              className="mx-auto mt-1 h-1 w-full"
              style={{ background: "#ff3b00" }}
            />
          </div>
          <div
            className="mt-1 text-xs font-bold uppercase tracking-[0.3em]"
            style={{ color: "#666" }}
          >
            HR OPERATIONS COMMAND CENTER
          </div>
        </div>

        {/* Command input */}
        <div
          className="mb-4 w-full max-w-2xl border-2 p-1"
          style={{
            borderColor: "#333",
            background: "#111",
          }}
        >
          <div
            className="mb-1 px-2 text-xs font-bold uppercase tracking-wider"
            style={{ color: "#ff3b00" }}
          >
            &gt; COMMAND INPUT
          </div>
          <DashboardInput
            clients={clients}
            agents={allAgents}
            onSend={onSendMessage}
            onAgentSelected={onAgentSelected}
          />
        </div>

        {/* Suggested Actions */}
        <div className="mb-6">
          <SuggestedActions
            actions={suggestedActions}
            onActionClick={(prompt) => onSendMessage(prompt, null, -1)}
          />
        </div>

        {/* Grid section header */}
        <div className="mb-3 flex w-full max-w-4xl items-center gap-2">
          <div className="h-px flex-1" style={{ background: "#333" }} />
          <span
            className="text-xs font-bold uppercase tracking-[0.3em]"
            style={{ color: "#555" }}
          >
            OPERATIONS OVERVIEW
          </span>
          <div className="h-px flex-1" style={{ background: "#333" }} />
        </div>

        {/* Main Content Grid */}
        <div className="grid w-full max-w-4xl grid-cols-1 gap-0 lg:grid-cols-[1fr_280px]">
          {/* Agents panel */}
          <div
            className="border-2 p-0"
            style={{
              borderColor: "#333",
              background: "#0d0d0d",
            }}
          >
            <div
              className="flex items-center justify-between border-b-2 px-3 py-1.5"
              style={{
                borderColor: "#333",
                background: "#111",
              }}
            >
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: "#ff3b00" }}
              >
                AGENT STATUS
              </span>
              <span
                className="text-xs tabular-nums"
                style={{ color: "#555" }}
              >
                [{agents.length}]
              </span>
            </div>
            <div className="p-2">
              <AgentsAttention agents={agents} onAgentClick={onAgentClick} />
            </div>
          </div>

          {/* Todo panel */}
          <div
            className="border-2 border-l-0 p-0 lg:border-l-2"
            style={{
              borderColor: "#333",
              background: "#0d0d0d",
            }}
          >
            <div
              className="flex items-center justify-between border-b-2 px-3 py-1.5"
              style={{
                borderColor: "#333",
                background: "#111",
              }}
            >
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: "#ff3b00" }}
              >
                TASK QUEUE
              </span>
              <span
                className="text-xs tabular-nums"
                style={{ color: "#555" }}
              >
                [{todos.filter((t) => !t.completed).length}/{todos.length}]
              </span>
            </div>
            <div className="p-2">
              <TodoList
                todos={todos}
                onToggle={handleToggleTodo}
                onAdd={handleAddTodo}
              />
            </div>
          </div>
        </div>

        {/* Bottom grid decoration */}
        <div className="mt-6 flex w-full max-w-4xl items-center gap-2">
          <div
            className="h-px flex-1"
            style={{
              background: "repeating-linear-gradient(90deg, #333 0, #333 4px, transparent 4px, transparent 8px)",
            }}
          />
          <span
            className="text-xs tabular-nums"
            style={{ color: "#333" }}
          >
            END::DASHBOARD
          </span>
          <div
            className="h-px flex-1"
            style={{
              background: "repeating-linear-gradient(90deg, #333 0, #333 4px, transparent 4px, transparent 8px)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
