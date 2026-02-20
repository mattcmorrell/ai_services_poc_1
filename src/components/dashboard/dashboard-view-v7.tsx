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
  "--background": "#F2F6F3",
  "--foreground": "#2C3E2D",
  "--card": "#FFFFFF",
  "--card-foreground": "#2C3E2D",
  "--popover": "#FFFFFF",
  "--popover-foreground": "#2C3E2D",
  "--primary": "#6B8F72",
  "--primary-foreground": "#FAFCFA",
  "--secondary": "#EDF2EE",
  "--secondary-foreground": "#2C3E2D",
  "--muted": "#E8EFE9",
  "--muted-foreground": "#7A8F7E",
  "--accent": "#E8EFE9",
  "--accent-foreground": "#2C3E2D",
  "--destructive": "#C4725A",
  "--border": "#D4E0D6",
  "--input": "#D4E0D6",
  "--ring": "#6B8F72",
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
      className="v7-zen relative flex h-full flex-1 flex-col overflow-hidden"
      style={{
        background: "#F2F6F3",
        color: "#2C3E2D",
        ...lightVars,
      } as React.CSSProperties}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

        @keyframes v7-drift-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          33% { transform: translate(30px, -20px) scale(1.05); opacity: 0.5; }
          66% { transform: translate(-20px, 15px) scale(0.95); opacity: 0.35; }
        }
        @keyframes v7-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          50% { transform: translate(-40px, 25px) scale(1.08); opacity: 0.45; }
        }
        @keyframes v7-drift-3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.25; }
          40% { transform: translate(25px, 30px) scale(1.03); opacity: 0.4; }
          80% { transform: translate(-15px, -20px) scale(0.97); opacity: 0.3; }
        }
        @keyframes v7-breathe {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.05; }
        }

        .v7-zen * {
          border-color: #D4E0D6 !important;
        }
        .v7-zen [class*="rounded-xl"],
        .v7-zen [class*="rounded-lg"] {
          border-radius: 22px !important;
        }
        .v7-zen [class*="rounded-full"] {
          border-radius: 9999px !important;
        }
        .v7-zen input, .v7-zen textarea, .v7-zen select {
          color: #2C3E2D !important;
          font-family: 'DM Sans', sans-serif !important;
        }
        .v7-zen input::placeholder, .v7-zen textarea::placeholder {
          color: #9AAF9E !important;
        }
        .v7-zen button {
          font-family: 'DM Sans', sans-serif !important;
        }
      `}</style>

      {/* Animated organic background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Sage blob top-left */}
        <div
          style={{
            position: "absolute", top: "-5%", left: "-8%",
            width: "55%", height: "50%",
            borderRadius: "40% 60% 55% 45% / 50% 40% 60% 50%",
            background: "radial-gradient(ellipse, rgba(107, 143, 114, 0.12) 0%, rgba(107, 143, 114, 0.03) 60%, transparent 80%)",
            animation: "v7-drift-1 25s ease-in-out infinite",
          }}
        />
        {/* Clay blob center-right */}
        <div
          style={{
            position: "absolute", top: "30%", right: "-10%",
            width: "45%", height: "45%",
            borderRadius: "55% 45% 50% 50% / 45% 55% 45% 55%",
            background: "radial-gradient(ellipse, rgba(196, 149, 106, 0.08) 0%, rgba(196, 149, 106, 0.02) 60%, transparent 80%)",
            animation: "v7-drift-2 30s ease-in-out infinite",
          }}
        />
        {/* Stone blob bottom-left */}
        <div
          style={{
            position: "absolute", bottom: "-10%", left: "20%",
            width: "50%", height: "40%",
            borderRadius: "50% 50% 40% 60% / 55% 45% 55% 45%",
            background: "radial-gradient(ellipse, rgba(140, 160, 150, 0.09) 0%, rgba(140, 160, 150, 0.02) 60%, transparent 80%)",
            animation: "v7-drift-3 35s ease-in-out infinite",
          }}
        />
        {/* Paper grain texture */}
        <div
          style={{
            position: "absolute", inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
            animation: "v7-breathe 8s ease-in-out infinite",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center overflow-auto px-8 py-14">
        {/* Logo */}
        <div className="mb-3 flex flex-col items-center">
          <Image
            src="/Pandopticon-logo.png"
            alt="Pandopticon"
            width={280}
            height={80}
            style={{ filter: "brightness(0.15) sepia(0.3) saturate(0.5)", opacity: 0.7 }}
          />
        </div>

        {/* Greeting */}
        <p
          className="mb-12 text-center text-sm italic"
          style={{
            fontFamily: "'Crimson Pro', serif",
            color: "#7A8F7E",
            letterSpacing: "0.04em",
            fontWeight: 300,
            fontSize: "1rem",
          }}
        >
          A quiet space for focused work
        </p>

        {/* Input — organic card */}
        <div
          className="mb-6 w-full max-w-2xl overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: "24px",
            border: "1px solid rgba(180, 200, 185, 0.3)",
            boxShadow: "0 8px 40px rgba(107, 143, 114, 0.06), 0 2px 8px rgba(107, 143, 114, 0.04)",
          }}
        >
          <div className="p-1">
            <DashboardInput clients={clients} agents={allAgents} onSend={onSendMessage} onAgentSelected={onAgentSelected} />
          </div>
        </div>

        {/* Suggested Actions */}
        <div className="mb-14">
          <SuggestedActions
            actions={suggestedActions}
            onActionClick={(prompt) => onSendMessage(prompt, null, -1)}
          />
        </div>

        {/* Organic divider — a gentle wave-like line */}
        <div className="mb-10 w-full max-w-4xl">
          <svg viewBox="0 0 800 12" className="w-full" style={{ opacity: 0.2 }}>
            <path
              d="M0 6 C100 2, 200 10, 300 6 S500 2, 600 6 S700 10, 800 6"
              fill="none"
              stroke="#6B8F72"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* Main Content Grid */}
        <div className="grid w-full max-w-4xl grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr]">
          {/* Agents card */}
          <div
            className="overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(16px)",
              borderRadius: "24px",
              border: "1px solid rgba(180, 200, 185, 0.25)",
              boxShadow: "0 8px 40px rgba(107, 143, 114, 0.05), 0 1px 4px rgba(107, 143, 114, 0.03)",
            }}
          >
            <div className="p-1">
              <AgentsAttention agents={agents} onAgentClick={onAgentClick} />
            </div>
          </div>

          {/* Todo card */}
          <div
            className="overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(16px)",
              borderRadius: "24px",
              border: "1px solid rgba(180, 200, 185, 0.25)",
              boxShadow: "0 8px 40px rgba(107, 143, 114, 0.05), 0 1px 4px rgba(107, 143, 114, 0.03)",
            }}
          >
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
