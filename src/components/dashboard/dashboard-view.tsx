"use client";

import { useState } from "react";
import { DashboardInput } from "./dashboard-input";
import { SuggestedActions } from "./suggested-actions";
import { AgentsAttention } from "./agents-attention";
import { TodoList } from "./todo-list";
import { AgentAttention, TodoItem, SuggestedAction } from "@/types/dashboard";
import { Client } from "@/types/chat";
import { Agent } from "@/types/agent";
import { BrandLogo } from "@/components/brand-logo";
import { useTheme } from "@/components/theme-provider";

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
  const { colorway } = useTheme();
  const isHSHQ = colorway === "human-services-hq";
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
    <div className="flex h-full min-w-0 flex-1 flex-col bg-background">
      <div className="flex flex-1 flex-col items-center overflow-auto px-6 py-8">
        {/* Logo */}
        <div className="mb-8 text-center flex flex-col items-center">
          {isHSHQ ? (
            <BrandLogo height={100} />
          ) : (
            <>
              <div className="text-[48px] font-extrabold tracking-[-0.04em] text-foreground leading-none">
                PandaCommand
              </div>
              <div className="font-mono text-[18px] font-semibold tracking-[0.1em] uppercase text-primary mt-1">
                Agent mission control
              </div>
            </>
          )}
        </div>

        {/* Input */}
        <div className="mb-4 w-full max-w-2xl">
          <DashboardInput clients={clients} agents={allAgents} onSend={onSendMessage} onAgentSelected={onAgentSelected} />
        </div>

        {/* Suggested Actions */}
        <div className="mb-8">
          <SuggestedActions
            actions={suggestedActions}
            onActionClick={(prompt) => onSendMessage(prompt, null, -1)}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid w-full max-w-4xl grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <AgentsAttention agents={agents} onAgentClick={onAgentClick} />
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
