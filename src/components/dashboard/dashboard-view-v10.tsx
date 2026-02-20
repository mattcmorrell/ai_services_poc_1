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

const lightVars: Record<string, string> = {
  "--background": "#FAF8F5",
  "--foreground": "#2D2D2D",
  "--card": "#FFFFFF",
  "--card-foreground": "#2D2D2D",
  "--popover": "#FFFFFF",
  "--popover-foreground": "#2D2D2D",
  "--primary": "#E07A5F",
  "--primary-foreground": "#FFFFFF",
  "--secondary": "#F3EFEB",
  "--secondary-foreground": "#444444",
  "--muted": "#F3EFEB",
  "--muted-foreground": "#777777",
  "--accent": "#FDF0EB",
  "--accent-foreground": "#2D2D2D",
  "--destructive": "#C1392B",
  "--border": "#E8E4DF",
  "--input": "#E8E4DF",
  "--ring": "#E07A5F",
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
      className="v10-paper relative flex h-full flex-1 flex-col overflow-hidden"
      style={{
        background: "#FAF8F5",
        color: "#2D2D2D",
        ...lightVars,
      } as React.CSSProperties}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Karla:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap');

        @keyframes v10-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes v10-rule-draw {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        .v10-paper * {
          border-color: #E8E4DF !important;
        }
        .v10-paper [class*="rounded-xl"],
        .v10-paper [class*="rounded-lg"] {
          border-radius: 6px !important;
        }
        .v10-paper [class*="rounded-full"] {
          border-radius: 9999px !important;
        }
        .v10-paper input, .v10-paper textarea, .v10-paper select {
          color: #2D2D2D !important;
          font-family: 'Karla', sans-serif !important;
        }
        .v10-paper input::placeholder, .v10-paper textarea::placeholder {
          color: #999999 !important;
        }
        .v10-paper button {
          font-family: 'Karla', sans-serif !important;
        }
        .v10-paper [class*="bg-muted"] {
          background-color: #F3EFEB !important;
        }
        .v10-paper [class*="text-muted-foreground"] {
          color: #777777 !important;
        }
        .v10-paper [class*="bg-primary"] {
          background-color: #E07A5F !important;
        }
        .v10-paper [class*="text-primary"] {
          color: #E07A5F !important;
        }

        .v10-card {
          background: #FFFFFF;
          border: 1px solid #E8E4DF;
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          transition: box-shadow 0.3s ease;
        }
        .v10-card:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
        }
      `}</style>

      {/* Subtle ruled-notebook lines background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, rgba(224, 122, 95, 0.04) 31px, rgba(224, 122, 95, 0.04) 32px)",
          backgroundSize: "100% 32px",
          backgroundPosition: "0 16px",
        }}
      />

      {/* Left margin line -- like a notebook */}
      <div
        className="pointer-events-none absolute top-0 bottom-0 z-[1]"
        style={{
          left: "64px",
          width: "1px",
          background: "rgba(224, 122, 95, 0.08)",
        }}
      />

      <div
        className="relative z-10 flex flex-1 flex-col items-center overflow-auto px-8 py-12"
        style={{ fontFamily: "'Karla', sans-serif" }}
      >
        {/* Logo */}
        <div
          className="mb-3 flex flex-col items-center"
          style={{ animation: "v10-fade-up 0.7s ease-out both" }}
        >
          <Image
            src="/Pandopticon-logo.png"
            alt="Pandopticon"
            width={260}
            height={74}
            style={{ opacity: 0.85 }}
          />
        </div>

        {/* Tagline */}
        <p
          className="mb-10 text-center"
          style={{
            fontFamily: "'Spectral', serif",
            color: "#E07A5F",
            letterSpacing: "0.18em",
            fontWeight: 400,
            fontSize: "0.68rem",
            textTransform: "uppercase",
            fontStyle: "italic",
            animation: "v10-fade-up 0.7s ease-out 0.1s both",
          }}
        >
          Your Notebook
        </p>

        {/* Input card */}
        <div
          className="v10-card mb-5 w-full max-w-2xl overflow-hidden"
          style={{ animation: "v10-fade-up 0.7s ease-out 0.2s both" }}
        >
          <div className="p-1">
            <DashboardInput clients={clients} agents={allAgents} onSend={onSendMessage} onAgentSelected={onAgentSelected} />
          </div>
        </div>

        {/* Suggested Actions */}
        <div
          className="mb-12"
          style={{ animation: "v10-fade-up 0.7s ease-out 0.3s both" }}
        >
          <SuggestedActions
            actions={suggestedActions}
            onActionClick={(prompt) => onSendMessage(prompt, null, -1)}
          />
        </div>

        {/* Divider -- thin rule with serif label */}
        <div
          className="mb-8 w-full max-w-4xl"
          style={{ animation: "v10-fade-up 0.7s ease-out 0.35s both" }}
        >
          <div className="flex items-center gap-5">
            <div
              className="h-px flex-1"
              style={{
                background: "linear-gradient(90deg, transparent, #E8E4DF, #DDD8D2)",
                transformOrigin: "left",
                animation: "v10-rule-draw 0.8s ease-out 0.4s both",
              }}
            />
            <span
              style={{
                fontFamily: "'Spectral', serif",
                color: "#B0A99E",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 500,
                fontStyle: "italic",
              }}
            >
              At a Glance
            </span>
            <div
              className="h-px flex-1"
              style={{
                background: "linear-gradient(90deg, #DDD8D2, #E8E4DF, transparent)",
                transformOrigin: "right",
                animation: "v10-rule-draw 0.8s ease-out 0.4s both",
              }}
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div
          className="grid w-full max-w-4xl grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr]"
          style={{ animation: "v10-fade-up 0.7s ease-out 0.45s both" }}
        >
          {/* Agents card */}
          <div className="v10-card overflow-hidden">
            <div className="p-1">
              <AgentsAttention agents={agents} onAgentClick={onAgentClick} />
            </div>
          </div>

          {/* Todo card */}
          <div className="v10-card overflow-hidden">
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
