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
  "--background": "#F6F4FB",
  "--foreground": "#2A2438",
  "--card": "#FFFFFF",
  "--card-foreground": "#2A2438",
  "--popover": "#FFFFFF",
  "--popover-foreground": "#2A2438",
  "--primary": "#7B6FA6",
  "--primary-foreground": "#FDFCFE",
  "--secondary": "#F0EDF7",
  "--secondary-foreground": "#2A2438",
  "--muted": "#EBE8F3",
  "--muted-foreground": "#6B6080",
  "--accent": "#EBE8F3",
  "--accent-foreground": "#2A2438",
  "--destructive": "#C25B4D",
  "--border": "#E4DFF0",
  "--input": "#E4DFF0",
  "--ring": "#7B6FA6",
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
      className="v9-studio relative flex h-full flex-1 flex-col overflow-hidden"
      style={{
        background: "#F6F4FB",
        color: "#2A2438",
        ...lightVars,
      } as React.CSSProperties}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,400;1,9..144,500&family=Outfit:wght@300;400;500;600;700&display=swap');

        @keyframes v9-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes v9-fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes v9-soft-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }

        .v9-studio * {
          border-color: #E4DFF0 !important;
        }
        .v9-studio [class*="rounded-xl"],
        .v9-studio [class*="rounded-lg"] {
          border-radius: 20px !important;
        }
        .v9-studio [class*="rounded-full"] {
          border-radius: 9999px !important;
        }
        .v9-studio input, .v9-studio textarea, .v9-studio select {
          color: #2A2438 !important;
          font-family: 'Outfit', sans-serif !important;
        }
        .v9-studio input::placeholder, .v9-studio textarea::placeholder {
          color: #9B91B0 !important;
        }
        .v9-studio button {
          font-family: 'Outfit', sans-serif !important;
        }

        .v9-cloud-card {
          background: #FFFFFF;
          border: 1px solid rgba(123, 111, 166, 0.08);
          border-radius: 20px;
          box-shadow:
            0 1px 2px rgba(123, 111, 166, 0.04),
            0 4px 12px rgba(123, 111, 166, 0.06),
            0 16px 48px rgba(123, 111, 166, 0.08);
          transition: box-shadow 0.5s ease, transform 0.5s ease;
        }
        .v9-cloud-card:hover {
          box-shadow:
            0 1px 2px rgba(123, 111, 166, 0.05),
            0 6px 16px rgba(123, 111, 166, 0.08),
            0 24px 64px rgba(123, 111, 166, 0.1);
          transform: translateY(-2px);
        }
      `}</style>

      {/* Soft gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          style={{
            position: "absolute",
            top: "-8%",
            left: "20%",
            width: "50%",
            height: "40%",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(123, 111, 166, 0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "5%",
            right: "15%",
            width: "35%",
            height: "30%",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(167, 139, 200, 0.06) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "-5%",
            width: "25%",
            height: "25%",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(139, 160, 200, 0.05) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      <div
        className="relative z-10 flex flex-1 flex-col items-center overflow-auto px-8 py-14"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        {/* Logo */}
        <div
          className="mb-3 flex flex-col items-center"
          style={{ animation: "v9-fade-up 0.7s ease-out both" }}
        >
          <Image
            src="/Pandopticon-logo.png"
            alt="Pandopticon"
            width={270}
            height={78}
            style={{
              filter: "brightness(0.2) sepia(0.15) saturate(0.6) hue-rotate(220deg)",
              opacity: 0.75,
            }}
          />
        </div>

        {/* Greeting */}
        <p
          className="mb-12 text-center"
          style={{
            fontFamily: "'Fraunces', serif",
            color: "#7B6FA6",
            fontSize: "1.05rem",
            fontWeight: 400,
            fontStyle: "italic",
            letterSpacing: "0.01em",
            animation: "v9-fade-up 0.7s ease-out 0.1s both",
          }}
        >
          What shall we work on today?
        </p>

        {/* Input card */}
        <div
          className="v9-cloud-card mb-6 w-full max-w-2xl overflow-hidden"
          style={{ animation: "v9-fade-up 0.7s ease-out 0.2s both" }}
        >
          <div className="p-1">
            <DashboardInput clients={clients} agents={allAgents} onSend={onSendMessage} onAgentSelected={onAgentSelected} />
          </div>
        </div>

        {/* Suggested Actions */}
        <div
          className="mb-14"
          style={{ animation: "v9-fade-up 0.7s ease-out 0.3s both" }}
        >
          <SuggestedActions
            actions={suggestedActions}
            onActionClick={(prompt) => onSendMessage(prompt, null, -1)}
          />
        </div>

        {/* Divider — soft dots */}
        <div
          className="mb-10 flex w-full max-w-4xl items-center justify-center gap-2"
          style={{ animation: "v9-fade-up 0.7s ease-out 0.35s both" }}
        >
          <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, #E4DFF0)" }} />
          <div className="flex gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full" style={{ background: "rgba(123, 111, 166, 0.2)" }} />
            <div className="h-1.5 w-1.5 rounded-full" style={{ background: "rgba(123, 111, 166, 0.35)", animation: "v9-soft-pulse 3s ease-in-out infinite" }} />
            <div className="h-1.5 w-1.5 rounded-full" style={{ background: "rgba(123, 111, 166, 0.2)" }} />
          </div>
          <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, #E4DFF0, transparent)" }} />
        </div>

        {/* Main Content Grid */}
        <div
          className="grid w-full max-w-4xl grid-cols-1 gap-7 lg:grid-cols-[1.2fr_1fr]"
          style={{ animation: "v9-fade-up 0.7s ease-out 0.45s both" }}
        >
          {/* Agents card */}
          <div className="v9-cloud-card overflow-hidden">
            <div className="p-1">
              <AgentsAttention agents={agents} onAgentClick={onAgentClick} />
            </div>
          </div>

          {/* Todo card */}
          <div className="v9-cloud-card overflow-hidden">
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
