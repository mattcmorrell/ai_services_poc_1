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

const font = "'Helvetica Neue', Helvetica, Arial, sans-serif";

const lightVars: Record<string, string> = {
  "--background": "#FFFFFF",
  "--foreground": "#000000",
  "--card": "#FFFFFF",
  "--card-foreground": "#000000",
  "--popover": "#FFFFFF",
  "--popover-foreground": "#000000",
  "--primary": "#FF0000",
  "--primary-foreground": "#FFFFFF",
  "--secondary": "#F5F5F5",
  "--secondary-foreground": "#000000",
  "--muted": "#F5F5F5",
  "--muted-foreground": "#666666",
  "--accent": "#F5F5F5",
  "--accent-foreground": "#000000",
  "--destructive": "#FF0000",
  "--border": "#000000",
  "--input": "#E5E5E5",
  "--ring": "#FF0000",
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
      className="flex h-full flex-1 flex-col"
      style={{
        background: "#FFFFFF",
        color: "#000000",
        fontFamily: font,
        ...lightVars,
      } as React.CSSProperties}
    >
      <style>{`
        .v4-swiss * {
          color: inherit;
          border-radius: 0 !important;
        }
        .v4-swiss input, .v4-swiss textarea, .v4-swiss select {
          color: #000000 !important;
        }
        .v4-swiss input::placeholder, .v4-swiss textarea::placeholder {
          color: #666666 !important;
        }
      `}</style>

      <div className="v4-swiss flex flex-1 flex-col items-center overflow-auto px-8 py-16">
        {/* Massive title block */}
        <div className="w-full max-w-4xl mb-2">
          <p
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#666666",
              fontFamily: font,
              fontWeight: 400,
              marginBottom: "8px",
            }}
          >
            CONSULTANT WORKSPACE
          </p>
        </div>

        <div className="w-full max-w-4xl mb-0">
          <Image
            src="/Pandopticon-logo.png"
            alt="Pandopticon"
            width={320}
            height={90}
            style={{ filter: "brightness(0)", display: "block" }}
          />
        </div>

        {/* Thick red rule */}
        <div
          className="w-full max-w-4xl"
          style={{
            height: "4px",
            background: "#FF0000",
            marginTop: "16px",
            marginBottom: "32px",
          }}
        />

        {/* Input area */}
        <div
          className="w-full max-w-4xl mb-2"
          style={{
            border: "2px solid #000000",
            padding: "0",
          }}
        >
          <DashboardInput clients={clients} agents={allAgents} onSend={onSendMessage} onAgentSelected={onAgentSelected} />
        </div>

        {/* Suggested Actions */}
        <div className="w-full max-w-4xl mb-12">
          <SuggestedActions
            actions={suggestedActions}
            onActionClick={(prompt) => onSendMessage(prompt, null, -1)}
          />
        </div>

        {/* Thin black rule */}
        <div
          className="w-full max-w-4xl"
          style={{
            height: "1px",
            background: "#000000",
            marginBottom: "32px",
          }}
        />

        {/* Two-column grid */}
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left column: Agents */}
          <div
            style={{
              borderRight: "2px solid #000000",
              borderTop: "2px solid #000000",
              padding: "24px",
            }}
          >
            <p
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "#666666",
                fontFamily: font,
                fontWeight: 500,
                marginBottom: "20px",
              }}
            >
              AGENTS REQUIRING ATTENTION
            </p>
            <AgentsAttention agents={agents} onAgentClick={onAgentClick} />
          </div>

          {/* Right column: Todos */}
          <div
            style={{
              borderTop: "2px solid #000000",
              padding: "24px",
            }}
          >
            <p
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "#666666",
                fontFamily: font,
                fontWeight: 500,
                marginBottom: "20px",
              }}
            >
              TASK LIST
            </p>
            <TodoList
              todos={todos}
              onToggle={handleToggleTodo}
              onAdd={handleAddTodo}
            />
          </div>
        </div>

        {/* Bottom thick rule */}
        <div
          className="w-full max-w-4xl"
          style={{
            height: "2px",
            background: "#000000",
            marginTop: "0",
          }}
        />

        {/* Footer text */}
        <div className="w-full max-w-4xl mt-8 pb-8">
          <p
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#666666",
              fontFamily: font,
              fontWeight: 400,
            }}
          >
            AI-POWERED HR OPERATIONS
          </p>
        </div>
      </div>
    </div>
  );
}
