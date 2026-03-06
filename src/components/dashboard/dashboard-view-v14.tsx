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
  "--background": "#5C94FC",
  "--foreground": "#1C1C1C",
  "--card": "#1C1C1C",
  "--card-foreground": "#FCFCFC",
  "--popover": "#2C2C2C",
  "--popover-foreground": "#FCFCFC",
  "--primary": "#E44028",
  "--primary-foreground": "#FCFCFC",
  "--secondary": "#2C2C2C",
  "--secondary-foreground": "#FCFCFC",
  "--muted": "#3C3C3C",
  "--muted-foreground": "rgba(252, 252, 252, 0.7)",
  "--accent": "#FAC000",
  "--accent-foreground": "#1C1C1C",
  "--destructive": "#E44028",
  "--border": "#5C5C5C",
  "--input": "#3C3C3C",
  "--ring": "#FAC000",
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
      className="v14-mario relative flex h-full flex-1 flex-col overflow-hidden"
      style={{
        background: "#5C94FC",
        color: "#1C1C1C",
        imageRendering: "pixelated",
        ...lightVars,
      } as React.CSSProperties}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');

        @keyframes v14-cloud-drift {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes v14-coin-spin {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.2); }
        }
        @keyframes v14-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes v14-question-bump {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes v14-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes v14-star-sparkle {
          0%, 100% { text-shadow: 0 0 4px #FAC000; }
          50% { text-shadow: 0 0 12px #FAC000, 0 0 20px #F8D878; }
        }

        .v14-mario * {
          border-color: #5C5C5C !important;
          border-radius: 0 !important;
        }
        .v14-mario input, .v14-mario textarea, .v14-mario select {
          color: #FCFCFC !important;
          font-family: 'VT323', monospace !important;
          font-size: 18px !important;
          border-radius: 0 !important;
        }
        .v14-mario input::placeholder, .v14-mario textarea::placeholder {
          color: rgba(252, 252, 252, 0.5) !important;
        }
        .v14-mario button {
          font-family: 'VT323', monospace !important;
          border-radius: 0 !important;
        }
        .v14-mario [class*="rounded"] {
          border-radius: 0 !important;
        }

        .v14-panel {
          background: #1C1C1C;
          border: 4px solid #FCFCFC;
          box-shadow: 4px 4px 0 #0C0C0C, 8px 8px 0 rgba(0,0,0,0.2);
          color: #FCFCFC;
        }
        .v14-panel-inner {
          border: 2px solid #5C5C5C;
          margin: 2px;
          padding: 2px;
        }
      `}</style>

      {/* Scrolling Clouds */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          style={{
            position: "absolute",
            top: "8%",
            left: 0,
            width: "200%",
            height: "100%",
            animation: "v14-cloud-drift 60s linear infinite",
          }}
        >
          {[0, 15, 35, 55, 75, 95, 115, 135, 155, 175].map((left, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${left}%`,
                top: `${5 + (i % 3) * 15 + (i % 2) * 8}%`,
                width: i % 3 === 0 ? "80px" : "60px",
                height: i % 3 === 0 ? "32px" : "24px",
                background: "#FCFCFC",
                boxShadow: `
                  ${i % 3 === 0 ? "12px" : "8px"} 0 0 #FCFCFC,
                  ${i % 3 === 0 ? "-12px" : "-8px"} 0 0 #FCFCFC,
                  0 ${i % 3 === 0 ? "-12px" : "-8px"} 0 #FCFCFC,
                  ${i % 3 === 0 ? "12px" : "8px"} ${i % 3 === 0 ? "-12px" : "-8px"} 0 #FCFCFC,
                  ${i % 3 === 0 ? "-12px" : "-8px"} ${i % 3 === 0 ? "-12px" : "-8px"} 0 #FCFCFC
                `,
                opacity: 0.85,
              }}
            />
          ))}
        </div>
      </div>

      <div
        className="relative z-10 flex flex-1 flex-col items-center overflow-auto px-8 py-8"
        style={{ fontFamily: "'VT323', monospace" }}
      >
        {/* Title Screen Area */}
        <div
          className="mb-2 flex flex-col items-center"
          style={{ animation: "v14-fade-in 0.4s ease-out both" }}
        >
          {/* World indicator */}
          <div
            className="mb-3 flex items-center gap-3"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "8px",
              color: "#FCFCFC",
              textShadow: "2px 2px 0 #0C0C0C",
            }}
          >
            <span>WORLD 1-1</span>
            <span style={{ color: "#FAC000" }}>★</span>
            <span>PLAYER 1</span>
            <span style={{ color: "#FAC000" }}>★</span>
            <span style={{ animation: "v14-coin-spin 1.5s steps(4) infinite", display: "inline-block", color: "#F8D878" }}>●</span>
            <span>×04</span>
          </div>

          <Image
            src="/Pandopticon-logo.png"
            alt="Pandopticon"
            width={280}
            height={80}
            style={{
              filter: "brightness(1.2) contrast(1.1)",
              imageRendering: "pixelated",
            }}
          />
        </div>

        {/* Subtitle */}
        <p
          className="mb-6"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: "8px",
            color: "#FCFCFC",
            textShadow: "2px 2px 0 #0C0C0C",
            letterSpacing: "2px",
            animation: "v14-fade-in 0.4s ease-out 0.1s both",
          }}
        >
          SUPER HR WORLD
        </p>

        {/* Lives / Score bar */}
        <div
          className="mb-6 flex items-center gap-6"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: "7px",
            color: "#FCFCFC",
            textShadow: "2px 2px 0 #0C0C0C",
            animation: "v14-fade-in 0.4s ease-out 0.15s both",
          }}
        >
          <span>LIVES: <span style={{ color: "#E44028", animation: "v14-star-sparkle 2s ease-in-out infinite" }}>★★★</span></span>
          <span>SCORE: <span style={{ color: "#F8D878" }}>000012</span></span>
          <span>TIME: <span style={{ color: "#30A030" }}>∞</span></span>
        </div>

        {/* Input Panel */}
        <div
          className="v14-panel mb-6 w-full max-w-2xl"
          style={{ animation: "v14-fade-in 0.4s ease-out 0.2s both" }}
        >
          <div className="v14-panel-inner">
            <div className="p-1">
              <DashboardInput clients={clients} agents={allAgents} onSend={onSendMessage} onAgentSelected={onAgentSelected} />
            </div>
          </div>
        </div>

        {/* Suggested Actions */}
        <div className="mb-8" style={{ animation: "v14-fade-in 0.4s ease-out 0.3s both" }}>
          <SuggestedActions
            actions={suggestedActions}
            onActionClick={(prompt) => onSendMessage(prompt, null, -1)}
          />
        </div>

        {/* Pipe Divider */}
        <div
          className="mb-6 flex w-full max-w-4xl items-center gap-3"
          style={{ animation: "v14-fade-in 0.4s ease-out 0.35s both" }}
        >
          {/* Left pipe */}
          <div style={{ width: "24px", height: "20px", background: "#00A800", border: "2px solid #008000", boxShadow: "2px 0 0 #005000" }} />
          <div className="flex-1 flex items-center gap-2">
            <div className="h-1 flex-1" style={{ background: "repeating-linear-gradient(90deg, #C84C0C 0px, #C84C0C 8px, #A03C08 8px, #A03C08 16px)" }} />
            <span
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: "8px",
                color: "#FCFCFC",
                textShadow: "2px 2px 0 #0C0C0C",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ color: "#FAC000", animation: "v14-question-bump 1s steps(2) infinite", display: "inline-block" }}>?</span>
              {" "}STATUS{" "}
              <span style={{ color: "#FAC000", animation: "v14-question-bump 1s steps(2) infinite 0.5s", display: "inline-block" }}>?</span>
            </span>
            <div className="h-1 flex-1" style={{ background: "repeating-linear-gradient(90deg, #C84C0C 0px, #C84C0C 8px, #A03C08 8px, #A03C08 16px)" }} />
          </div>
          {/* Right pipe */}
          <div style={{ width: "24px", height: "20px", background: "#00A800", border: "2px solid #008000", boxShadow: "-2px 0 0 #005000" }} />
        </div>

        {/* Main Content Grid */}
        <div
          className="grid w-full max-w-4xl grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]"
          style={{ animation: "v14-fade-in 0.4s ease-out 0.45s both" }}
        >
          {/* Agents Panel */}
          <div className="v14-panel">
            <div className="v14-panel-inner">
              <div className="p-1">
                <AgentsAttention agents={agents} onAgentClick={onAgentClick} />
              </div>
            </div>
          </div>

          {/* Todo Panel */}
          <div className="v14-panel">
            <div className="v14-panel-inner">
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

        {/* Ground tiles at bottom */}
        <div
          className="mt-8 w-full max-w-4xl"
          style={{
            height: "16px",
            background: "repeating-linear-gradient(90deg, #C84C0C 0px, #C84C0C 16px, #A03C08 16px, #A03C08 32px)",
            boxShadow: "0 4px 0 #8C6800",
          }}
        />
        <div
          className="w-full max-w-4xl"
          style={{
            height: "16px",
            background: "#8C6800",
          }}
        />
        <div
          className="mt-2 text-center"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: "6px",
            color: "#FCFCFC",
            textShadow: "1px 1px 0 #0C0C0C",
            opacity: 0.6,
          }}
        >
          © 2026 PANDOPTICON ENTERTAINMENT
        </div>
      </div>
    </div>
  );
}
