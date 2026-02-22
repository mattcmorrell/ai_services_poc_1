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
  "--background": "#050510",
  "--foreground": "#E8E0FF",
  "--card": "rgba(232, 224, 255, 0.03)",
  "--card-foreground": "#E8E0FF",
  "--popover": "#0A0A1A",
  "--popover-foreground": "#E8E0FF",
  "--primary": "#E930FF",
  "--primary-foreground": "#050510",
  "--secondary": "#0A0A1A",
  "--secondary-foreground": "rgba(232, 224, 255, 0.8)",
  "--muted": "#0A0A1A",
  "--muted-foreground": "rgba(232, 224, 255, 0.65)",
  "--accent": "#0F0F2A",
  "--accent-foreground": "#E8E0FF",
  "--destructive": "#FF3060",
  "--border": "rgba(233, 48, 255, 0.12)",
  "--input": "rgba(233, 48, 255, 0.12)",
  "--ring": "#30FFB0",
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
      className="v13-void relative flex h-full flex-1 flex-col overflow-hidden"
      style={{
        background: "#050510",
        color: "#E8E0FF",
        ...darkVars,
      } as React.CSSProperties}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Creepster&display=swap');

        @keyframes v13-bg-shift {
          0% { background-position: 0% 0%; }
          25% { background-position: 50% 100%; }
          50% { background-position: 100% 50%; }
          75% { background-position: 50% 0%; }
          100% { background-position: 0% 0%; }
        }
        @keyframes v13-sigil-rotate {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes v13-sigil-rotate-reverse {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(-360deg); }
        }
        @keyframes v13-morph-border {
          0% { border-color: rgba(233, 48, 255, 0.3); box-shadow: 0 0 15px rgba(233, 48, 255, 0.1), inset 0 0 15px rgba(233, 48, 255, 0.03); }
          25% { border-color: rgba(48, 255, 176, 0.3); box-shadow: 0 0 15px rgba(48, 255, 176, 0.1), inset 0 0 15px rgba(48, 255, 176, 0.03); }
          50% { border-color: rgba(255, 48, 96, 0.3); box-shadow: 0 0 15px rgba(255, 48, 96, 0.1), inset 0 0 15px rgba(255, 48, 96, 0.03); }
          75% { border-color: rgba(48, 176, 255, 0.3); box-shadow: 0 0 15px rgba(48, 176, 255, 0.1), inset 0 0 15px rgba(48, 176, 255, 0.03); }
          100% { border-color: rgba(233, 48, 255, 0.3); box-shadow: 0 0 15px rgba(233, 48, 255, 0.1), inset 0 0 15px rgba(233, 48, 255, 0.03); }
        }
        @keyframes v13-vhs-track {
          0% { transform: translateY(-100%); opacity: 0; }
          5% { opacity: 0.6; }
          10% { opacity: 0; }
          100% { transform: translateY(200vh); opacity: 0; }
        }
        @keyframes v13-typewriter {
          from { width: 0; }
          to { width: 24ch; }
        }
        @keyframes v13-blink-cursor {
          0%, 100% { border-color: #E930FF; }
          50% { border-color: transparent; }
        }
        @keyframes v13-star-drift {
          0% { transform: translateY(0) translateX(0); }
          100% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes v13-portal-pulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.05); }
        }
        @keyframes v13-fade-in {
          from { opacity: 0; transform: translateY(20px) scale(0.97); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes v13-corner-glow {
          0%, 100% { text-shadow: 0 0 5px #E930FF; }
          33% { text-shadow: 0 0 5px #30FFB0; }
          66% { text-shadow: 0 0 5px #FF3060; }
        }

        .v13-void * {
          border-color: rgba(233, 48, 255, 0.1) !important;
        }
        .v13-void input, .v13-void textarea, .v13-void select {
          color: #E8E0FF !important;
          font-family: 'IBM Plex Mono', monospace !important;
        }
        .v13-void input::placeholder, .v13-void textarea::placeholder {
          color: rgba(232, 224, 255, 0.35) !important;
        }
        .v13-void button {
          font-family: 'IBM Plex Mono', monospace !important;
        }

        .v13-card {
          position: relative;
          background: rgba(232, 224, 255, 0.02);
          border: 2px solid rgba(233, 48, 255, 0.2);
          animation: v13-morph-border 8s ease-in-out infinite;
          overflow: visible;
        }
        .v13-card::before {
          content: '◈';
          position: absolute;
          top: -8px;
          left: -8px;
          font-size: 14px;
          animation: v13-corner-glow 4s ease-in-out infinite;
          z-index: 2;
        }
        .v13-card::after {
          content: '◈';
          position: absolute;
          bottom: -8px;
          right: -8px;
          font-size: 14px;
          animation: v13-corner-glow 4s ease-in-out infinite 2s;
          z-index: 2;
        }
        .v13-card:hover {
          transform: translateY(-3px);
          transition: transform 0.4s ease;
        }

        .v13-invert-hover:hover {
          filter: invert(1) hue-rotate(180deg);
          transition: filter 0.2s ease;
        }
      `}</style>

      {/* Animated background gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 30% 20%, rgba(233, 48, 255, 0.04) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(48, 176, 255, 0.03) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(48, 255, 176, 0.02) 0%, transparent 60%)",
          backgroundSize: "200% 200%",
          animation: "v13-bg-shift 30s ease-in-out infinite",
        }}
      />

      {/* Star field */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${(i * 37 + 13) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              width: i % 5 === 0 ? "2px" : "1px",
              height: i % 5 === 0 ? "2px" : "1px",
              background: i % 3 === 0 ? "#E930FF" : i % 3 === 1 ? "#30FFB0" : "#E8E0FF",
              borderRadius: "50%",
              opacity: 0.3 + (i % 4) * 0.15,
              animation: `v13-star-drift ${8 + (i % 5) * 3}s ease-in-out infinite alternate`,
              animationDelay: `${(i * 0.3) % 5}s`,
              boxShadow: i % 5 === 0 ? `0 0 4px ${i % 3 === 0 ? "#E930FF" : "#30FFB0"}` : "none",
            }}
          />
        ))}
      </div>

      {/* VHS tracking bar */}
      <div
        className="pointer-events-none absolute left-0 right-0 z-[3]"
        style={{
          height: "3px",
          background: "linear-gradient(90deg, transparent 10%, rgba(232, 224, 255, 0.15) 30%, rgba(233, 48, 255, 0.1) 50%, rgba(232, 224, 255, 0.15) 70%, transparent 90%)",
          animation: "v13-vhs-track 12s linear infinite",
          animationDelay: "3s",
        }}
      />
      <div
        className="pointer-events-none absolute left-0 right-0 z-[3]"
        style={{
          height: "1px",
          background: "rgba(48, 255, 176, 0.1)",
          animation: "v13-vhs-track 8s linear infinite",
          animationDelay: "7s",
        }}
      />

      {/* Scanlines */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background: "repeating-linear-gradient(0deg, rgba(232, 224, 255, 0.008) 0px, rgba(232, 224, 255, 0.008) 1px, transparent 1px, transparent 3px)",
          mixBlendMode: "overlay",
        }}
      />

      <div
        className="relative z-10 flex flex-1 flex-col items-center overflow-auto px-8 py-10"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        {/* Rotating Sigil behind logo */}
        <div className="relative mb-2 flex flex-col items-center" style={{ animation: "v13-fade-in 0.8s ease-out both" }}>
          {/* Outer sigil ring */}
          <div
            className="pointer-events-none absolute"
            style={{
              width: "320px",
              height: "320px",
              top: "50%",
              left: "50%",
              animation: "v13-sigil-rotate 60s linear infinite",
              opacity: 0.12,
            }}
          >
            <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="160" cy="160" r="155" stroke="#E930FF" strokeWidth="0.5" strokeDasharray="8 4" />
              <circle cx="160" cy="160" r="140" stroke="#30FFB0" strokeWidth="0.3" />
              <circle cx="160" cy="160" r="125" stroke="#FF3060" strokeWidth="0.5" strokeDasharray="3 6" />
              {/* Pentagram */}
              <polygon points="160,10 190,120 290,120 210,180 230,290 160,220 90,290 110,180 30,120 130,120" stroke="#E930FF" strokeWidth="0.5" fill="none" />
              {/* Cross marks at cardinal points */}
              <line x1="160" y1="0" x2="160" y2="20" stroke="#FFEE30" strokeWidth="0.5" />
              <line x1="160" y1="300" x2="160" y2="320" stroke="#FFEE30" strokeWidth="0.5" />
              <line x1="0" y1="160" x2="20" y2="160" stroke="#FFEE30" strokeWidth="0.5" />
              <line x1="300" y1="160" x2="320" y2="160" stroke="#FFEE30" strokeWidth="0.5" />
              {/* Small circles at cardinal points */}
              <circle cx="160" cy="10" r="3" stroke="#30FFB0" strokeWidth="0.5" fill="none" />
              <circle cx="160" cy="310" r="3" stroke="#30FFB0" strokeWidth="0.5" fill="none" />
              <circle cx="10" cy="160" r="3" stroke="#30FFB0" strokeWidth="0.5" fill="none" />
              <circle cx="310" cy="160" r="3" stroke="#30FFB0" strokeWidth="0.5" fill="none" />
            </svg>
          </div>
          {/* Inner sigil ring (counter-rotating) */}
          <div
            className="pointer-events-none absolute"
            style={{
              width: "240px",
              height: "240px",
              top: "50%",
              left: "50%",
              animation: "v13-sigil-rotate-reverse 45s linear infinite",
              opacity: 0.08,
            }}
          >
            <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="120" cy="120" r="115" stroke="#30B0FF" strokeWidth="0.5" strokeDasharray="2 8" />
              <polygon points="120,10 220,80 200,200 40,200 20,80" stroke="#30B0FF" strokeWidth="0.3" fill="none" />
              <circle cx="120" cy="120" r="60" stroke="#FFEE30" strokeWidth="0.3" strokeDasharray="4 4" />
            </svg>
          </div>

          <Image
            src="/Pandopticon-logo.png"
            alt="Pandopticon"
            width={280}
            height={80}
            style={{
              filter: "brightness(1.1) saturate(1.2)",
              position: "relative",
              zIndex: 2,
            }}
          />
        </div>

        {/* Typewriter tagline */}
        <div
          className="mb-8 overflow-hidden"
          style={{ animation: "v13-fade-in 0.8s ease-out 0.1s both" }}
        >
          <p
            style={{
              fontFamily: "'Creepster', cursive",
              color: "#E930FF",
              fontSize: "1rem",
              letterSpacing: "0.15em",
              textShadow: "0 0 10px rgba(233, 48, 255, 0.4), 0 0 30px rgba(233, 48, 255, 0.15)",
              overflow: "hidden",
              whiteSpace: "nowrap",
              borderRight: "2px solid #E930FF",
              width: "24ch",
              animation: "v13-typewriter 2s steps(24) 0.5s both, v13-blink-cursor 0.8s step-end infinite",
            }}
          >
            The Void Awaits Your Query
          </p>
        </div>

        {/* Mystical divider */}
        <div
          className="mb-6 flex items-center gap-3"
          style={{ animation: "v13-fade-in 0.8s ease-out 0.15s both" }}
        >
          <div className="h-px w-16" style={{ background: "linear-gradient(90deg, transparent, #E930FF)" }} />
          <span style={{ color: "#FFEE30", fontSize: "10px", letterSpacing: "6px", fontFamily: "'Silkscreen', cursive", textShadow: "0 0 6px rgba(255, 238, 48, 0.3)" }}>
            ☽ ⛧ ☾
          </span>
          <div className="h-px w-16" style={{ background: "linear-gradient(90deg, #E930FF, transparent)" }} />
        </div>

        {/* Portal vortex behind input */}
        <div className="relative mb-6 w-full max-w-2xl" style={{ animation: "v13-fade-in 0.8s ease-out 0.2s both" }}>
          <div
            className="pointer-events-none absolute inset-0 -m-8"
            style={{
              background: "radial-gradient(ellipse at center, rgba(233, 48, 255, 0.06) 0%, rgba(48, 176, 255, 0.03) 30%, transparent 60%)",
              animation: "v13-portal-pulse 5s ease-in-out infinite",
              borderRadius: "50%",
            }}
          />
          <div className="v13-card relative z-10" style={{ borderRadius: "4px" }}>
            <div className="relative z-10 p-1">
              <DashboardInput clients={clients} agents={allAgents} onSend={onSendMessage} onAgentSelected={onAgentSelected} />
            </div>
          </div>
        </div>

        {/* Suggested Actions */}
        <div className="mb-12" style={{ animation: "v13-fade-in 0.8s ease-out 0.3s both" }}>
          <SuggestedActions
            actions={suggestedActions}
            onActionClick={(prompt) => onSendMessage(prompt, null, -1)}
          />
        </div>

        {/* Section divider with occult flair */}
        <div
          className="mb-8 w-full max-w-4xl"
          style={{ animation: "v13-fade-in 0.8s ease-out 0.35s both" }}
        >
          <div className="flex items-center gap-4">
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(233, 48, 255, 0.3), rgba(48, 255, 176, 0.2))" }} />
            <div className="flex items-center gap-2">
              <span style={{ color: "#FF3060", fontSize: "12px" }}>⛧</span>
              <span
                style={{
                  fontFamily: "'Silkscreen', cursive",
                  fontSize: "10px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "#E8E0FF",
                  textShadow: "0 0 8px rgba(232, 224, 255, 0.3)",
                }}
              >
                TRANSMISSIONS
              </span>
              <span style={{ color: "#FF3060", fontSize: "12px" }}>⛧</span>
            </div>
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(48, 255, 176, 0.2), rgba(233, 48, 255, 0.3), transparent)" }} />
          </div>
        </div>

        {/* Main Content Grid */}
        <div
          className="grid w-full max-w-4xl grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr]"
          style={{ animation: "v13-fade-in 0.8s ease-out 0.45s both" }}
        >
          {/* Agents card with 3D perspective tilt */}
          <div
            className="v13-card"
            style={{
              borderRadius: "4px",
              transform: "perspective(800px) rotateY(-1.5deg) rotateX(0.5deg)",
              animationDelay: "2s",
            }}
          >
            <div className="relative z-10 p-1">
              <AgentsAttention agents={agents} onAgentClick={onAgentClick} />
            </div>
          </div>

          {/* Todo card */}
          <div
            className="v13-card"
            style={{
              borderRadius: "4px",
              transform: "perspective(800px) rotateY(1deg) rotateX(-0.5deg)",
              animationDelay: "4s",
            }}
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

        {/* Bottom occult decoration */}
        <div
          className="mt-12 text-center"
          style={{
            fontFamily: "'Creepster', cursive",
            fontSize: "11px",
            color: "rgba(233, 48, 255, 0.25)",
            letterSpacing: "8px",
            textShadow: "0 0 10px rgba(233, 48, 255, 0.1)",
          }}
        >
          ☠ MEMENTO MORI ☠ PROCESS PAYROLL ☠
        </div>
      </div>
    </div>
  );
}
