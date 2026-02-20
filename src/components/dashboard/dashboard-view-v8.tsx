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

const darkVars: Record<string, string> = {
  "--background": "#0E0E11",
  "--foreground": "rgba(255, 255, 255, 0.88)",
  "--card": "#161619",
  "--card-foreground": "rgba(255, 255, 255, 0.88)",
  "--popover": "#1A1A1E",
  "--popover-foreground": "rgba(255, 255, 255, 0.88)",
  "--primary": "#C9A96E",
  "--primary-foreground": "#0E0E11",
  "--secondary": "#1C1C20",
  "--secondary-foreground": "rgba(255, 255, 255, 0.75)",
  "--muted": "#1C1C20",
  "--muted-foreground": "rgba(255, 255, 255, 0.55)",
  "--accent": "#1E1E22",
  "--accent-foreground": "rgba(255, 255, 255, 0.88)",
  "--destructive": "#B35044",
  "--border": "rgba(201, 169, 110, 0.08)",
  "--input": "rgba(201, 169, 110, 0.08)",
  "--ring": "#C9A96E",
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
      className="v8-obsidian relative flex h-full flex-1 flex-col overflow-hidden"
      style={{
        background: "#0E0E11",
        color: "rgba(255, 255, 255, 0.88)",
        ...darkVars,
      } as React.CSSProperties}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap');

        @keyframes v8-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes v8-fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes v8-grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -2%); }
          30% { transform: translate(1%, -1%); }
          50% { transform: translate(-1%, 2%); }
          70% { transform: translate(2%, 1%); }
          90% { transform: translate(-1%, -1%); }
        }
        @keyframes v8-glow-pulse {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.06; }
        }

        .v8-obsidian * {
          border-color: rgba(201, 169, 110, 0.08) !important;
        }
        .v8-obsidian [class*="rounded-xl"],
        .v8-obsidian [class*="rounded-lg"] {
          border-radius: 16px !important;
        }
        .v8-obsidian [class*="rounded-full"] {
          border-radius: 9999px !important;
        }
        .v8-obsidian input, .v8-obsidian textarea, .v8-obsidian select {
          color: rgba(255, 255, 255, 0.88) !important;
          font-family: 'Plus Jakarta Sans', sans-serif !important;
        }
        .v8-obsidian input::placeholder, .v8-obsidian textarea::placeholder {
          color: rgba(255, 255, 255, 0.35) !important;
        }
        .v8-obsidian button {
          font-family: 'Plus Jakarta Sans', sans-serif !important;
        }

        .v8-card {
          background: linear-gradient(165deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.015) 100%);
          border: 1px solid rgba(201, 169, 110, 0.07);
          border-radius: 16px;
          box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.02) inset, 0 16px 48px rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: border-color 0.4s ease, box-shadow 0.4s ease;
        }
        .v8-card:hover {
          border-color: rgba(201, 169, 110, 0.14);
          box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.03) inset, 0 20px 60px rgba(0, 0, 0, 0.5);
        }
      `}</style>

      {/* Film grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
          opacity: 0.025,
          animation: "v8-grain 8s steps(10) infinite",
        }}
      />

      {/* Warm ambient glow — top center */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          style={{
            position: "absolute",
            top: "-15%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            height: "50%",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(201, 169, 110, 0.04) 0%, transparent 70%)",
            animation: "v8-glow-pulse 12s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "10%",
            width: "40%",
            height: "40%",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(201, 169, 110, 0.02) 0%, transparent 70%)",
            animation: "v8-glow-pulse 18s ease-in-out infinite 4s",
          }}
        />
      </div>

      <div
        className="relative z-10 flex flex-1 flex-col items-center overflow-auto px-8 py-14"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* Logo */}
        <div
          className="mb-2 flex flex-col items-center"
          style={{ animation: "v8-fade-in 0.8s ease-out both" }}
        >
          <Image
            src="/Pandopticon-logo.png"
            alt="Pandopticon"
            width={280}
            height={80}
            style={{ opacity: 0.9 }}
          />
        </div>

        {/* Tagline */}
        <p
          className="mb-12 text-center"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "rgba(201, 169, 110, 0.5)",
            letterSpacing: "0.12em",
            fontWeight: 400,
            fontSize: "0.7rem",
            textTransform: "uppercase",
            animation: "v8-fade-in 0.8s ease-out 0.15s both",
          }}
        >
          Executive Command
        </p>

        {/* Input card */}
        <div
          className="v8-card mb-6 w-full max-w-2xl overflow-hidden"
          style={{ animation: "v8-fade-in 0.8s ease-out 0.25s both" }}
        >
          <div className="p-1">
            <DashboardInput clients={clients} agents={allAgents} onSend={onSendMessage} onAgentSelected={onAgentSelected} />
          </div>
        </div>

        {/* Suggested Actions */}
        <div
          className="mb-14"
          style={{ animation: "v8-fade-in 0.8s ease-out 0.35s both" }}
        >
          <SuggestedActions
            actions={suggestedActions}
            onActionClick={(prompt) => onSendMessage(prompt, null, -1)}
          />
        </div>

        {/* Divider — thin gold line with fade */}
        <div
          className="mb-10 w-full max-w-4xl"
          style={{ animation: "v8-fade-in 0.8s ease-out 0.4s both" }}
        >
          <div className="flex items-center gap-6">
            <div
              className="h-px flex-1"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(201, 169, 110, 0.15), rgba(201, 169, 110, 0.06))",
              }}
            />
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "rgba(201, 169, 110, 0.4)",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Overview
            </span>
            <div
              className="h-px flex-1"
              style={{
                background: "linear-gradient(90deg, rgba(201, 169, 110, 0.06), rgba(201, 169, 110, 0.15), transparent)",
              }}
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div
          className="grid w-full max-w-4xl grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]"
          style={{ animation: "v8-fade-in 0.8s ease-out 0.5s both" }}
        >
          {/* Agents card */}
          <div className="v8-card overflow-hidden">
            <div className="p-1">
              <AgentsAttention agents={agents} onAgentClick={onAgentClick} />
            </div>
          </div>

          {/* Todo card */}
          <div className="v8-card overflow-hidden">
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
