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
  "--background": "#0F1724",
  "--foreground": "#F0E8D8",
  "--card": "#151E2E",
  "--card-foreground": "#F0E8D8",
  "--popover": "#1A2436",
  "--popover-foreground": "#F0E8D8",
  "--primary": "#D4764E",
  "--primary-foreground": "#0F1724",
  "--secondary": "#1A2436",
  "--secondary-foreground": "rgba(240, 232, 216, 0.8)",
  "--muted": "#1A2436",
  "--muted-foreground": "rgba(240, 232, 216, 0.55)",
  "--accent": "#1E2940",
  "--accent-foreground": "#F0E8D8",
  "--destructive": "#C25044",
  "--border": "rgba(212, 118, 78, 0.08)",
  "--input": "rgba(212, 118, 78, 0.08)",
  "--ring": "#D4764E",
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
      className="v11-editorial relative flex h-full flex-1 flex-col overflow-hidden"
      style={{
        background: "#0F1724",
        color: "#F0E8D8",
        ...darkVars,
      } as React.CSSProperties}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,300;1,6..72,400;1,6..72,500&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap');

        @keyframes v11-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes v11-warm-glow {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.06; }
        }
        @keyframes v11-grain-drift {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-1%, 1%); }
          50% { transform: translate(1%, -1%); }
          75% { transform: translate(-1%, -1%); }
        }

        .v11-editorial * {
          border-color: rgba(212, 118, 78, 0.08) !important;
        }
        .v11-editorial [class*="rounded-xl"],
        .v11-editorial [class*="rounded-lg"] {
          border-radius: 12px !important;
        }
        .v11-editorial [class*="rounded-full"] {
          border-radius: 9999px !important;
        }
        .v11-editorial input, .v11-editorial textarea, .v11-editorial select {
          color: #F0E8D8 !important;
          font-family: 'Satoshi', 'Outfit', sans-serif !important;
        }
        .v11-editorial input::placeholder, .v11-editorial textarea::placeholder {
          color: rgba(240, 232, 216, 0.3) !important;
        }
        .v11-editorial button {
          font-family: 'Satoshi', 'Outfit', sans-serif !important;
        }

        .v11-card {
          background: linear-gradient(170deg, rgba(240, 232, 216, 0.04) 0%, rgba(240, 232, 216, 0.01) 100%);
          border: 1px solid rgba(212, 118, 78, 0.06);
          border-top: 1px solid rgba(240, 232, 216, 0.06);
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15), 0 12px 40px rgba(0, 0, 0, 0.2);
          position: relative;
          overflow: hidden;
          transition: border-color 0.5s ease, box-shadow 0.5s ease, transform 0.5s ease;
        }
        .v11-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 128px 128px;
          opacity: 0.015;
          pointer-events: none;
          border-radius: inherit;
        }
        .v11-card:hover {
          border-color: rgba(212, 118, 78, 0.12);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15), 0 16px 56px rgba(0, 0, 0, 0.25);
          transform: translateY(-1px);
        }
      `}</style>

      {/* Paper grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
          opacity: 0.02,
          animation: "v11-grain-drift 12s ease-in-out infinite",
        }}
      />

      {/* Warm ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "40%",
            width: "60%",
            height: "45%",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(212, 118, 78, 0.04) 0%, transparent 65%)",
            animation: "v11-warm-glow 15s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-5%",
            left: "10%",
            width: "40%",
            height: "35%",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(212, 118, 78, 0.025) 0%, transparent 65%)",
            animation: "v11-warm-glow 20s ease-in-out infinite 5s",
          }}
        />
      </div>

      <div
        className="relative z-10 flex flex-1 flex-col items-center overflow-auto px-8 py-14"
        style={{ fontFamily: "'Satoshi', 'Outfit', sans-serif" }}
      >
        {/* Logo */}
        <div
          className="mb-3 flex flex-col items-center"
          style={{ animation: "v11-fade-up 0.8s ease-out both" }}
        >
          <Image
            src="/Pandopticon-logo.png"
            alt="Pandopticon"
            width={280}
            height={80}
            style={{ opacity: 0.85 }}
          />
        </div>

        {/* Tagline */}
        <p
          className="mb-12 text-center"
          style={{
            fontFamily: "'Newsreader', serif",
            color: "rgba(212, 118, 78, 0.6)",
            fontSize: "0.85rem",
            fontWeight: 400,
            fontStyle: "italic",
            letterSpacing: "0.04em",
            animation: "v11-fade-up 0.8s ease-out 0.1s both",
          }}
        >
          The Evening Brief
        </p>

        {/* Input card */}
        <div
          className="v11-card mb-6 w-full max-w-2xl"
          style={{ animation: "v11-fade-up 0.8s ease-out 0.2s both" }}
        >
          <div className="relative z-10 p-1">
            <DashboardInput clients={clients} agents={allAgents} onSend={onSendMessage} onAgentSelected={onAgentSelected} />
          </div>
        </div>

        {/* Suggested Actions */}
        <div
          className="mb-14"
          style={{ animation: "v11-fade-up 0.8s ease-out 0.3s both" }}
        >
          <SuggestedActions
            actions={suggestedActions}
            onActionClick={(prompt) => onSendMessage(prompt, null, -1)}
          />
        </div>

        {/* Divider — editorial rule with burnt orange accent */}
        <div
          className="mb-10 w-full max-w-4xl"
          style={{ animation: "v11-fade-up 0.8s ease-out 0.35s both" }}
        >
          <div className="flex items-center gap-5">
            <div
              className="h-px flex-1"
              style={{ background: "linear-gradient(90deg, transparent, rgba(212, 118, 78, 0.2))" }}
            />
            <div className="flex items-center gap-3">
              <div className="h-1 w-1 rounded-full" style={{ background: "#D4764E", opacity: 0.5 }} />
              <span
                style={{
                  fontFamily: "'Newsreader', serif",
                  color: "rgba(240, 232, 216, 0.35)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                Today&apos;s Briefing
              </span>
              <div className="h-1 w-1 rounded-full" style={{ background: "#D4764E", opacity: 0.5 }} />
            </div>
            <div
              className="h-px flex-1"
              style={{ background: "linear-gradient(90deg, rgba(212, 118, 78, 0.2), transparent)" }}
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div
          className="grid w-full max-w-4xl grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]"
          style={{ animation: "v11-fade-up 0.8s ease-out 0.45s both" }}
        >
          <div className="v11-card">
            <div className="relative z-10 p-1">
              <AgentsAttention agents={agents} onAgentClick={onAgentClick} />
            </div>
          </div>

          <div className="v11-card">
            <div className="relative z-10 p-1">
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
