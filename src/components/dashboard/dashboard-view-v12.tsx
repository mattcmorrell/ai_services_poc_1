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
  "--background": "#0A0A0A",
  "--foreground": "#FFFFFF",
  "--card": "rgba(255, 255, 255, 0.03)",
  "--card-foreground": "#FFFFFF",
  "--popover": "#111111",
  "--popover-foreground": "#FFFFFF",
  "--primary": "#FF2D6B",
  "--primary-foreground": "#0A0A0A",
  "--secondary": "#111111",
  "--secondary-foreground": "rgba(255, 255, 255, 0.8)",
  "--muted": "#111111",
  "--muted-foreground": "rgba(255, 255, 255, 0.6)",
  "--accent": "#1A1A1A",
  "--accent-foreground": "#FFFFFF",
  "--destructive": "#FF2D6B",
  "--border": "rgba(255, 45, 107, 0.15)",
  "--input": "rgba(255, 45, 107, 0.15)",
  "--ring": "#00FF88",
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
      className="v12-arcade relative flex h-full flex-1 flex-col overflow-hidden"
      style={{
        background: "#0A0A0A",
        color: "#FFFFFF",
        ...darkVars,
      } as React.CSSProperties}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Comic+Neue:wght@400;700&display=swap');

        @keyframes v12-rainbow-border {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes v12-glitch {
          0%, 100% { text-shadow: 2px 0 #FF2D6B, -2px 0 #00DDFF; }
          25% { text-shadow: -2px 0 #FF2D6B, 2px 0 #00FF88; }
          50% { text-shadow: 2px -1px #FFD700, -2px 1px #00DDFF; }
          75% { text-shadow: -1px 2px #00FF88, 1px -2px #FF2D6B; }
        }
        @keyframes v12-neon-pulse {
          0%, 100% { opacity: 1; filter: brightness(1); }
          50% { opacity: 0.85; filter: brightness(1.3); }
        }
        @keyframes v12-scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
        @keyframes v12-float {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        @keyframes v12-marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes v12-spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes v12-fade-chaos {
          from { opacity: 0; transform: translateY(20px) rotate(-3deg) scale(0.95); }
          to { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
        }
        @keyframes v12-color-cycle {
          0% { color: #FF2D6B; }
          25% { color: #00FF88; }
          50% { color: #FFD700; }
          75% { color: #00DDFF; }
          100% { color: #FF2D6B; }
        }
        @keyframes v12-border-dance {
          0% { border-color: #FF2D6B; }
          25% { border-color: #00FF88; }
          50% { border-color: #FFD700; }
          75% { border-color: #00DDFF; }
          100% { border-color: #FF2D6B; }
        }

        .v12-arcade * {
          border-color: rgba(255, 45, 107, 0.15) !important;
        }
        .v12-arcade input, .v12-arcade textarea, .v12-arcade select {
          color: #FFFFFF !important;
          font-family: 'Space Mono', monospace !important;
        }
        .v12-arcade input::placeholder, .v12-arcade textarea::placeholder {
          color: rgba(255, 255, 255, 0.4) !important;
        }
        .v12-arcade button {
          font-family: 'Space Mono', monospace !important;
        }

        .v12-card {
          position: relative;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .v12-card::before {
          content: '';
          position: absolute;
          inset: 0;
          padding: 2px;
          border-radius: 4px;
          background: linear-gradient(90deg, #FF2D6B, #00FF88, #FFD700, #00DDFF, #FF2D6B);
          background-size: 300% 100%;
          animation: v12-rainbow-border 4s linear infinite;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .v12-card:hover {
          transform: translateY(-2px) rotate(0.5deg);
          box-shadow: 0 0 30px rgba(255, 45, 107, 0.2), 0 0 60px rgba(0, 255, 136, 0.1);
        }

        .v12-glitch-hover:hover {
          animation: v12-glitch 0.3s ease infinite;
        }
      `}</style>

      {/* CRT Scanline Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 3px)",
          mixBlendMode: "overlay",
        }}
      />

      {/* Neon Grid Background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating Neon Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          style={{
            position: "absolute",
            top: "5%",
            right: "15%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255, 45, 107, 0.08) 0%, transparent 60%)",
            animation: "v12-float 8s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "10%",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0, 221, 255, 0.06) 0%, transparent 60%)",
            animation: "v12-float 12s ease-in-out infinite 3s",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0, 255, 136, 0.05) 0%, transparent 60%)",
            animation: "v12-float 10s ease-in-out infinite 6s",
          }}
        />
      </div>

      {/* Spinning decorative element */}
      <div
        className="pointer-events-none absolute z-[1]"
        style={{
          top: "80px",
          right: "60px",
          width: "60px",
          height: "60px",
          border: "2px dashed rgba(255, 215, 0, 0.2)",
          animation: "v12-spin-slow 20s linear infinite",
        }}
      />

      {/* Marquee Banner */}
      <div
        className="relative z-10 overflow-hidden py-1"
        style={{
          background: "linear-gradient(90deg, #FF2D6B, #FFD700, #00FF88, #00DDFF, #FF2D6B)",
          backgroundSize: "200% 100%",
          animation: "v12-rainbow-border 3s linear infinite",
        }}
      >
        <div
          className="whitespace-nowrap"
          style={{
            animation: "v12-marquee 15s linear infinite",
            fontFamily: "'Press Start 2P', cursive",
            fontSize: "8px",
            color: "#0A0A0A",
            fontWeight: 700,
            letterSpacing: "2px",
          }}
        >
          ★ PANDOPTICON COMMAND CENTER ★ WELCOME BACK OPERATOR ★ ALL SYSTEMS NOMINAL ★ AGENTS STANDING BY ★ INSERT COIN TO CONTINUE ★
        </div>
      </div>

      <div
        className="relative z-10 flex flex-1 flex-col items-center overflow-auto px-8 py-10"
        style={{ fontFamily: "'Space Mono', monospace" }}
      >
        {/* Logo with glitch effect */}
        <div
          className="mb-2 flex flex-col items-center"
          style={{ animation: "v12-fade-chaos 0.6s ease-out both" }}
        >
          <div style={{ transform: "rotate(-2deg)" }}>
            <Image
              src="/Pandopticon-logo.png"
              alt="Pandopticon"
              width={280}
              height={80}
              style={{
                filter: "brightness(1.2) contrast(1.1)",
              }}
            />
          </div>
        </div>

        {/* Tagline — pixel font with chromatic aberration */}
        <p
          className="v12-glitch-hover mb-8 text-center"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            color: "#00FF88",
            fontSize: "0.55rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            textShadow: "2px 0 #FF2D6B, -2px 0 #00DDFF, 0 0 10px rgba(0, 255, 136, 0.5)",
            animation: "v12-fade-chaos 0.6s ease-out 0.1s both, v12-neon-pulse 3s ease-in-out infinite",
          }}
        >
          {"//"} COMMAND CENTER {"//"}
        </p>

        {/* Decorative ASCII divider */}
        <div
          className="mb-6 text-center"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: "6px",
            color: "rgba(255, 215, 0, 0.3)",
            letterSpacing: "4px",
            animation: "v12-fade-chaos 0.6s ease-out 0.15s both",
          }}
        >
          ▓▒░ ═══════════════ ░▒▓
        </div>

        {/* Input card */}
        <div
          className="v12-card mb-6 w-full max-w-2xl"
          style={{
            animation: "v12-fade-chaos 0.6s ease-out 0.2s both",
          }}
        >
          <div className="relative z-10 p-1">
            <DashboardInput clients={clients} agents={allAgents} onSend={onSendMessage} onAgentSelected={onAgentSelected} />
          </div>
        </div>

        {/* Suggested Actions */}
        <div
          className="mb-10"
          style={{ animation: "v12-fade-chaos 0.6s ease-out 0.3s both" }}
        >
          <SuggestedActions
            actions={suggestedActions}
            onActionClick={(prompt) => onSendMessage(prompt, null, -1)}
          />
        </div>

        {/* Divider — wild neon rule */}
        <div
          className="mb-8 w-full max-w-4xl"
          style={{ animation: "v12-fade-chaos 0.6s ease-out 0.35s both" }}
        >
          <div className="flex items-center gap-4">
            <div
              className="h-px flex-1"
              style={{
                background: "linear-gradient(90deg, transparent, #FF2D6B, #FFD700, transparent)",
              }}
            />
            <div className="flex items-center gap-3">
              <span
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: "7px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  animation: "v12-color-cycle 4s linear infinite",
                }}
              >
                ◆ ACTIVE MISSIONS ◆
              </span>
            </div>
            <div
              className="h-px flex-1"
              style={{
                background: "linear-gradient(90deg, transparent, #00DDFF, #00FF88, transparent)",
              }}
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div
          className="grid w-full max-w-4xl grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]"
          style={{ animation: "v12-fade-chaos 0.6s ease-out 0.45s both" }}
        >
          <div
            className="v12-card"
            style={{ transform: "rotate(-0.5deg)" }}
          >
            <div className="relative z-10 p-1">
              <AgentsAttention agents={agents} onAgentClick={onAgentClick} />
            </div>
          </div>

          <div
            className="v12-card"
            style={{ transform: "rotate(0.7deg)" }}
          >
            <div className="relative z-10 p-1">
              <TodoList
                todos={todos}
                onToggle={handleToggleTodo}
                onAdd={handleAddTodo}
              />
            </div>
          </div>
        </div>

        {/* Bottom decorative element */}
        <div
          className="mt-10"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: "6px",
            color: "rgba(0, 255, 136, 0.2)",
            letterSpacing: "6px",
            animation: "v12-neon-pulse 4s ease-in-out infinite",
          }}
        >
          ● ● ● GAME OVER? NEVER ● ● ●
        </div>
      </div>
    </div>
  );
}
