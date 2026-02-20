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

  const vars = {
    "--background": "#0a0a1a",
    "--foreground": "#e0e0ff",
    "--card": "rgba(10, 10, 30, 0.8)",
    "--card-foreground": "#e0e0ff",
    "--primary": "#00fff0",
    "--primary-foreground": "#0a0a1a",
    "--muted": "rgba(0, 255, 240, 0.08)",
    "--muted-foreground": "#7a8aaa",
    "--accent": "rgba(255, 0, 255, 0.12)",
    "--accent-foreground": "#ff00ff",
    "--border": "rgba(0, 255, 240, 0.15)",
  } as React.CSSProperties;

  return (
    <div
      className="flex h-full flex-1 flex-col relative overflow-hidden"
      style={vars}
    >
      <style>{`
        @keyframes v6-gridScroll {
          0% { background-position: 0 0; }
          100% { background-position: 0 60px; }
        }
        @keyframes v6-scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes v6-pulseGlow {
          0%, 100% { opacity: 0.4; filter: blur(60px); }
          50% { opacity: 0.7; filter: blur(80px); }
        }
        @keyframes v6-flicker {
          0%, 95%, 100% { opacity: 1; }
          96% { opacity: 0.8; }
          97% { opacity: 1; }
          98% { opacity: 0.6; }
        }
        @keyframes v6-textGlitch {
          0%, 90%, 100% { transform: translate(0); text-shadow: 0 0 20px #00fff0, 0 0 40px #00fff080; }
          92% { transform: translate(-2px, 1px); text-shadow: 2px 0 #ff00ff, -2px 0 #00fff0; }
          94% { transform: translate(2px, -1px); text-shadow: -2px 0 #ff00ff, 2px 0 #39ff14; }
          96% { transform: translate(0); text-shadow: 0 0 20px #00fff0, 0 0 40px #00fff080; }
        }
        @keyframes v6-borderPulse {
          0%, 100% { border-color: rgba(0, 255, 240, 0.2); box-shadow: 0 0 15px rgba(0, 255, 240, 0.05); }
          50% { border-color: rgba(0, 255, 240, 0.5); box-shadow: 0 0 25px rgba(0, 255, 240, 0.15); }
        }
        @keyframes v6-orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -20px) scale(1.1); }
          50% { transform: translate(-10px, -40px) scale(0.95); }
          75% { transform: translate(-30px, -10px) scale(1.05); }
        }
        .v6-dashboard-bg {
          background: #0a0a1a;
        }
        .v6-grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0, 255, 240, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 240, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: v6-gridScroll 8s linear infinite;
          pointer-events: none;
        }
        .v6-scanline {
          position: absolute;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 240, 0.06), transparent);
          animation: v6-scanline 4s linear infinite;
          pointer-events: none;
          z-index: 1;
        }
        .v6-orb-1 {
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 255, 240, 0.12), transparent 70%);
          top: -100px;
          right: -100px;
          animation: v6-pulseGlow 6s ease-in-out infinite, v6-orbFloat 20s ease-in-out infinite;
          pointer-events: none;
        }
        .v6-orb-2 {
          position: absolute;
          width: 350px;
          height: 350px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 0, 255, 0.1), transparent 70%);
          bottom: -50px;
          left: -80px;
          animation: v6-pulseGlow 8s ease-in-out infinite 2s, v6-orbFloat 25s ease-in-out infinite reverse;
          pointer-events: none;
        }
        .v6-orb-3 {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(57, 255, 20, 0.08), transparent 70%);
          top: 40%;
          left: 30%;
          animation: v6-pulseGlow 10s ease-in-out infinite 4s, v6-orbFloat 18s ease-in-out infinite;
          pointer-events: none;
        }
        .v6-logo-wrap {
          animation: v6-flicker 5s infinite;
          filter: drop-shadow(0 0 30px rgba(0, 255, 240, 0.3));
        }
        .v6-title-glitch {
          font-family: inherit;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-size: 0.65rem;
          color: #00fff0;
          animation: v6-textGlitch 4s infinite;
        }
        .v6-section-card {
          background: rgba(10, 10, 30, 0.6);
          border: 1px solid rgba(0, 255, 240, 0.12);
          border-radius: 12px;
          backdrop-filter: blur(12px);
          animation: v6-borderPulse 4s ease-in-out infinite;
          transition: all 0.3s ease;
        }
        .v6-section-card:hover {
          border-color: rgba(0, 255, 240, 0.4);
          box-shadow: 0 0 40px rgba(0, 255, 240, 0.1), inset 0 0 40px rgba(0, 255, 240, 0.02);
          transform: translateY(-2px);
        }
        .v6-input-wrap {
          position: relative;
        }
        .v6-input-wrap::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 14px;
          background: linear-gradient(135deg, #00fff0, #ff00ff, #39ff14, #00fff0);
          background-size: 300% 300%;
          animation: v6-gradientBorder 6s ease infinite;
          z-index: -1;
          opacity: 0.4;
        }
        @keyframes v6-gradientBorder {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .v6-corner-accent {
          position: absolute;
          width: 20px;
          height: 20px;
          border-color: #00fff0;
          opacity: 0.4;
        }
        .v6-corner-accent.tl { top: 0; left: 0; border-top: 2px solid; border-left: 2px solid; }
        .v6-corner-accent.tr { top: 0; right: 0; border-top: 2px solid; border-right: 2px solid; }
        .v6-corner-accent.bl { bottom: 0; left: 0; border-bottom: 2px solid; border-left: 2px solid; }
        .v6-corner-accent.br { bottom: 0; right: 0; border-bottom: 2px solid; border-right: 2px solid; }
        .v6-status-bar {
          font-family: monospace;
          font-size: 0.6rem;
          color: rgba(0, 255, 240, 0.3);
          letter-spacing: 0.2em;
        }
      `}</style>

      {/* Background layers */}
      <div className="v6-dashboard-bg absolute inset-0" />
      <div className="v6-grid-overlay" />
      <div className="v6-scanline" />
      <div className="v6-orb-1" />
      <div className="v6-orb-2" />
      <div className="v6-orb-3" />

      {/* Content */}
      <div className="flex flex-1 flex-col items-center overflow-auto px-6 py-8 relative z-10">
        {/* Status bar */}
        <div className="v6-status-bar mb-4 w-full max-w-2xl flex justify-between">
          <span>SYS::ONLINE</span>
          <span>NODE::PRIMARY</span>
          <span>SEC::CLEARANCE_5</span>
        </div>

        {/* Logo */}
        <div className="mb-2 v6-logo-wrap">
          <Image
            src="/Pandopticon-logo.png"
            alt="Pandopticon"
            width={280}
            height={80}
          />
        </div>

        {/* Subtitle */}
        <div className="mb-8">
          <span className="v6-title-glitch">Neural Command Interface</span>
        </div>

        {/* Input */}
        <div className="mb-4 w-full max-w-2xl v6-input-wrap relative z-10">
          <DashboardInput
            clients={clients}
            agents={allAgents}
            onSend={onSendMessage}
            onAgentSelected={onAgentSelected}
          />
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
          <div className="v6-section-card p-4 relative">
            <div className="v6-corner-accent tl" />
            <div className="v6-corner-accent tr" />
            <div className="v6-corner-accent bl" />
            <div className="v6-corner-accent br" />
            <AgentsAttention agents={agents} onAgentClick={onAgentClick} />
          </div>
          <div className="v6-section-card p-4 relative">
            <div className="v6-corner-accent tl" />
            <div className="v6-corner-accent tr" />
            <div className="v6-corner-accent bl" />
            <div className="v6-corner-accent br" />
            <TodoList
              todos={todos}
              onToggle={handleToggleTodo}
              onAdd={handleAddTodo}
            />
          </div>
        </div>

        {/* Bottom status */}
        <div className="v6-status-bar mt-8 w-full max-w-4xl flex justify-center gap-8">
          <span>UPLINK::STABLE</span>
          <span>|</span>
          <span>AGENTS::ACTIVE</span>
          <span>|</span>
          <span>LATENCY::12ms</span>
        </div>
      </div>
    </div>
  );
}
