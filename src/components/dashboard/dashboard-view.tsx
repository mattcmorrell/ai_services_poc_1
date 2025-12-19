"use client";

import { useState } from "react";
import Image from "next/image";
import { DashboardInput } from "./dashboard-input";
import { SuggestedActions } from "./suggested-actions";
import { AgentsAttention } from "./agents-attention";
import { TodoList } from "./todo-list";
import { AgentAttention, TodoItem, SuggestedAction } from "@/types/dashboard";
import { Client } from "@/types/chat";

interface DashboardViewProps {
  clients: Client[];
  agents: AgentAttention[];
  initialTodos: TodoItem[];
  suggestedActions: SuggestedAction[];
  onAgentClick: (agentId: string) => void;
  onSendMessage: (message: string, client: Client | null, chipPosition: number) => void;
}

export function DashboardView({
  clients,
  agents,
  initialTodos,
  suggestedActions,
  onAgentClick,
  onSendMessage,
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
    <div className="flex h-full flex-1 flex-col bg-background">
      <div className="flex flex-1 flex-col items-center overflow-auto px-6 py-8">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/Pandopticon-logo.png"
            alt="Pandopticon"
            width={280}
            height={80}
          />
        </div>

        {/* Input */}
        <div className="mb-4 w-full max-w-2xl">
          <DashboardInput clients={clients} onSend={onSendMessage} />
        </div>

        {/* Suggested Actions */}
        <div className="mb-8">
          <SuggestedActions
            actions={suggestedActions}
            onActionClick={(prompt) => onSendMessage(prompt, null, -1)}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid w-full max-w-4xl grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
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
