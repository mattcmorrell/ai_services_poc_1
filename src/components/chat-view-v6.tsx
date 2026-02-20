"use client";

import { useState, useRef, useEffect } from "react";
import {
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  ArrowUpDown,
  ThumbsUp,
  Plus,
  Mic,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Client, Message, Artifact, ActionPlan } from "@/types/chat";
import { ArtifactCard } from "@/components/artifacts/artifact-card";
import { ActionCard } from "@/components/chat/action-card";

interface ChatViewProps {
  client: Client | null;
  chatTitle: string;
  messages: Message[];
  artifacts: Artifact[];
  selectedArtifactId: string | null;
  onSendMessage: (content: string) => void;
  onApprove: (messageId: string) => void;
  onDecline: (messageId: string) => void;
  onWorkflowClick: (workflowId: string) => void;
  onArtifactClick: (artifactId: string) => void;
  isLoading: boolean;
}

const models = [
  "GPT-4o",
  "GPT-4 Turbo",
  "Claude 3.5 Sonnet",
  "Claude 3 Opus",
  "Gemini 1.5 Pro",
  "Gemini 2.0 Flash",
];

export function ChatView({
  client,
  chatTitle,
  messages,
  artifacts,
  selectedArtifactId,
  onSendMessage,
  onApprove,
  onDecline,
  onWorkflowClick,
  onArtifactClick,
  isLoading,
}: ChatViewProps) {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("GPT-4o");
  const [expandedThinking, setExpandedThinking] = useState<Record<string, boolean>>({});
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleThinking = (messageId: string) => {
    setExpandedThinking((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  const vars = {
    "--background": "#0a0a1a",
    "--foreground": "#e0e0ff",
    "--card": "rgba(10, 10, 30, 0.8)",
    "--card-foreground": "#e0e0ff",
    "--primary": "#00fff0",
    "--primary-foreground": "#0a0a1a",
    "--muted": "rgba(0, 255, 240, 0.06)",
    "--muted-foreground": "#7a8aaa",
    "--accent": "rgba(255, 0, 255, 0.1)",
    "--accent-foreground": "#ff00ff",
    "--border": "rgba(0, 255, 240, 0.1)",
  } as React.CSSProperties;

  return (
    <div
      className="flex h-full flex-1 flex-col relative overflow-hidden"
      style={vars}
    >
      <style>{`
        @keyframes v6cv-scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes v6cv-headerGlow {
          0%, 100% { border-bottom-color: rgba(0, 255, 240, 0.1); }
          50% { border-bottom-color: rgba(0, 255, 240, 0.3); }
        }
        @keyframes v6cv-msgFadeIn {
          0% { opacity: 0; transform: translateY(10px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes v6cv-typing {
          0%, 100% { opacity: 0.3; box-shadow: 0 0 4px currentColor; }
          50% { opacity: 1; box-shadow: 0 0 12px currentColor; }
        }
        @keyframes v6cv-inputBorder {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes v6cv-glitchTitle {
          0%, 92%, 100% { transform: translate(0); }
          93% { transform: translate(-1px, 1px); }
          95% { transform: translate(1px, -1px); }
          97% { transform: translate(0); }
        }
        @keyframes v6cv-userBubbleShine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes v6cv-neonPulse {
          0%, 100% { box-shadow: 0 0 5px rgba(0, 255, 240, 0.2), 0 0 15px rgba(0, 255, 240, 0.05); }
          50% { box-shadow: 0 0 10px rgba(0, 255, 240, 0.3), 0 0 30px rgba(0, 255, 240, 0.1); }
        }
        @keyframes v6cv-orbDrift {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(40px, -30px); }
          66% { transform: translate(-20px, 20px); }
        }
        .v6cv-bg {
          background: linear-gradient(170deg, #0a0a1a 0%, #0d0820 40%, #0a0a1a 100%);
        }
        .v6cv-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0, 255, 240, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 240, 0.02) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none;
        }
        .v6cv-scanline {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 240, 0.05), transparent);
          animation: v6cv-scanline 5s linear infinite;
          pointer-events: none;
          z-index: 1;
        }
        .v6cv-orb-top {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 0, 255, 0.06), transparent 70%);
          top: -80px;
          right: -60px;
          animation: v6cv-orbDrift 25s ease-in-out infinite;
          pointer-events: none;
        }
        .v6cv-orb-bot {
          position: absolute;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 255, 240, 0.05), transparent 70%);
          bottom: -60px;
          left: -40px;
          animation: v6cv-orbDrift 20s ease-in-out infinite reverse;
          pointer-events: none;
        }
        .v6cv-header {
          background: rgba(10, 10, 30, 0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(0, 255, 240, 0.1);
          animation: v6cv-headerGlow 4s ease-in-out infinite;
        }
        .v6cv-title {
          background: linear-gradient(90deg, #00fff0, #e0e0ff, #ff00ff);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: v6cv-glitchTitle 6s infinite;
          font-weight: 700;
          letter-spacing: 0.02em;
        }
        .v6cv-subtitle {
          color: #5a6a8a;
          font-family: monospace;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
        .v6cv-msg {
          animation: v6cv-msgFadeIn 0.3s ease-out;
        }
        .v6cv-user-bubble {
          background: linear-gradient(135deg, #00fff0, #0088aa);
          color: #0a0a1a;
          font-weight: 500;
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(0, 255, 240, 0.2), 0 4px 15px rgba(0, 0, 0, 0.3);
        }
        .v6cv-user-bubble::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: v6cv-userBubbleShine 3s ease-in-out infinite;
          pointer-events: none;
        }
        .v6cv-assistant-text {
          color: #c8c8e8;
          text-shadow: 0 0 1px rgba(200, 200, 232, 0.3);
        }
        .v6cv-assistant-text strong {
          color: #00fff0;
          text-shadow: 0 0 8px rgba(0, 255, 240, 0.3);
        }
        .v6cv-thinking-btn {
          color: #5a6a8a;
          font-family: monospace;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
        }
        .v6cv-thinking-btn:hover {
          color: #ff00ff;
          text-shadow: 0 0 8px rgba(255, 0, 255, 0.3);
        }
        .v6cv-thinking-block {
          background: rgba(255, 0, 255, 0.04);
          border: 1px solid rgba(255, 0, 255, 0.12);
          border-radius: 8px;
          color: #8a7aaa;
          font-family: monospace;
          font-size: 0.8rem;
          line-height: 1.6;
        }
        .v6cv-typing-dot {
          animation: v6cv-typing 1.2s ease-in-out infinite;
          color: #00fff0;
        }
        .v6cv-input-area {
          background: rgba(10, 10, 30, 0.9);
          backdrop-filter: blur(16px);
          border-top: 1px solid rgba(0, 255, 240, 0.1);
        }
        .v6cv-input-box {
          background: rgba(0, 255, 240, 0.03);
          border: 1px solid rgba(0, 255, 240, 0.12);
          border-radius: 12px;
          transition: all 0.3s ease;
          position: relative;
        }
        .v6cv-input-box:focus-within {
          border-color: rgba(0, 255, 240, 0.4);
          box-shadow: 0 0 20px rgba(0, 255, 240, 0.08), inset 0 0 20px rgba(0, 255, 240, 0.02);
        }
        .v6cv-input-box::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 14px;
          background: linear-gradient(135deg, #00fff0, #ff00ff, #39ff14, #00fff0);
          background-size: 300% 300%;
          animation: v6cv-inputBorder 8s ease infinite;
          opacity: 0;
          z-index: -1;
          transition: opacity 0.3s ease;
        }
        .v6cv-input-box:focus-within::before {
          opacity: 0.3;
        }
        .v6cv-textarea {
          background: transparent;
          color: #e0e0ff;
          caret-color: #00fff0;
        }
        .v6cv-textarea::placeholder {
          color: #4a5a7a;
          font-family: monospace;
          letter-spacing: 0.05em;
        }
        .v6cv-model-btn {
          color: #5a6a8a;
          font-family: monospace;
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          border: 1px solid rgba(0, 255, 240, 0.1);
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        .v6cv-model-btn:hover {
          border-color: rgba(0, 255, 240, 0.3);
          color: #00fff0;
          box-shadow: 0 0 10px rgba(0, 255, 240, 0.1);
        }
        .v6cv-icon-btn {
          color: #4a5a7a;
          transition: all 0.2s ease;
        }
        .v6cv-icon-btn:hover {
          color: #ff00ff;
          filter: drop-shadow(0 0 6px rgba(255, 0, 255, 0.4));
        }
        .v6cv-approve-btn {
          background: linear-gradient(135deg, #39ff14, #00cc44) !important;
          color: #0a0a1a !important;
          font-weight: 600;
          box-shadow: 0 0 15px rgba(57, 255, 20, 0.3);
          border: none !important;
          transition: all 0.2s ease;
        }
        .v6cv-approve-btn:hover {
          box-shadow: 0 0 25px rgba(57, 255, 20, 0.5);
          transform: scale(1.02);
        }
        .v6cv-approved-btn {
          background: rgba(57, 255, 20, 0.15) !important;
          color: #39ff14 !important;
          border: 1px solid rgba(57, 255, 20, 0.3) !important;
          box-shadow: 0 0 10px rgba(57, 255, 20, 0.15);
        }
        .v6cv-workflow-card {
          background: rgba(0, 255, 240, 0.03);
          border: 1px solid rgba(0, 255, 240, 0.12);
          border-radius: 10px;
          transition: all 0.3s ease;
          animation: v6cv-neonPulse 5s ease-in-out infinite;
        }
        .v6cv-workflow-card:hover {
          border-color: rgba(0, 255, 240, 0.35);
          background: rgba(0, 255, 240, 0.06);
          box-shadow: 0 0 30px rgba(0, 255, 240, 0.12);
          transform: translateY(-1px);
        }
        .v6cv-workflow-icon {
          background: rgba(0, 255, 240, 0.08);
          border: 1px solid rgba(0, 255, 240, 0.15);
          color: #00fff0;
        }
        .v6cv-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 240, 0.15), rgba(255, 0, 255, 0.08), transparent);
        }
        .v6cv-mic-btn {
          color: #4a5a7a;
          transition: all 0.2s ease;
        }
        .v6cv-mic-btn:hover {
          color: #ff6b00;
          filter: drop-shadow(0 0 8px rgba(255, 107, 0, 0.5));
        }
      `}</style>

      {/* Background layers */}
      <div className="v6cv-bg absolute inset-0" />
      <div className="v6cv-grid" />
      <div className="v6cv-scanline" />
      <div className="v6cv-orb-top" />
      <div className="v6cv-orb-bot" />

      {/* Header */}
      <div className="v6cv-header flex items-center justify-between px-6 py-4 relative z-10">
        <div>
          <h1 className="v6cv-title text-2xl">{chatTitle}</h1>
          {client && (
            <p className="v6cv-subtitle mt-0.5">{client.name} // ACTIVE SESSION</p>
          )}
        </div>
        <Button variant="ghost" size="icon" className="v6cv-icon-btn">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-6 relative z-10" ref={scrollRef}>
        <div className="mx-auto max-w-3xl py-6">
          {messages.map((message) => (
            <div key={message.id} className="mb-6 v6cv-msg">
              {message.role === "assistant" && message.thinking && (
                <button
                  onClick={() => toggleThinking(message.id)}
                  className="v6cv-thinking-btn mb-2 flex items-center gap-1"
                >
                  {expandedThinking[message.id] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  {">"} show_reasoning()
                </button>
              )}

              {message.thinking && expandedThinking[message.id] && (
                <div className="v6cv-thinking-block mb-4 p-4">
                  {message.thinking}
                </div>
              )}

              <div
                className={cn(
                  "prose prose-sm dark:prose-invert max-w-none",
                  message.role === "user" && "text-right"
                )}
              >
                <div
                  className={cn(
                    message.role === "user"
                      ? "v6cv-user-bubble inline-block rounded-xl px-4 py-2.5"
                      : "v6cv-assistant-text"
                  )}
                  dangerouslySetInnerHTML={{
                    __html: message.content
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\n/g, "<br />"),
                  }}
                />
              </div>

              {/* Action Plan Card */}
              {message.actionPlan && (
                <div className="mt-4">
                  <ActionCard
                    plan={message.actionPlan}
                    workflow={message.workflow}
                    onApprove={() => onApprove(message.id)}
                    onDecline={() => onDecline(message.id)}
                    onWorkflowClick={onWorkflowClick}
                  />
                </div>
              )}

              {/* Artifact cards */}
              {message.artifactIds && message.artifactIds.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {message.artifactIds.map((artifactId) => {
                    const artifact = artifacts.find((a) => a.id === artifactId);
                    if (!artifact) return null;
                    return (
                      <ArtifactCard
                        key={artifact.id}
                        artifact={artifact}
                        isSelected={selectedArtifactId === artifact.id}
                        onClick={() => onArtifactClick(artifact.id)}
                      />
                    );
                  })}
                </div>
              )}

              {/* Standalone workflow card */}
              {message.workflow && !message.actionPlan && (
                <div
                  onClick={() => onWorkflowClick(message.workflow!.id)}
                  className="v6cv-workflow-card mt-4 flex w-full items-center gap-3 p-3 text-left cursor-pointer"
                >
                  <div className="v6cv-workflow-icon flex h-10 w-10 items-center justify-center rounded-lg">
                    <ArrowUpDown className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-[#e0e0ff]">{message.workflow.name}</div>
                    <div className="text-sm text-[#5a6a8a] font-mono text-xs">
                      {message.workflow.description}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="v6cv-icon-btn" onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {message.requiresApproval && (
                <div className="mt-4">
                  <Button
                    onClick={() => onApprove(message.id)}
                    disabled={message.approved}
                    className={cn(
                      "gap-2",
                      message.approved
                        ? "v6cv-approved-btn"
                        : "v6cv-approve-btn"
                    )}
                  >
                    {message.approved ? (
                      <>
                        <Check className="h-4 w-4" />
                        AUTHORIZED
                      </>
                    ) : (
                      <>
                        <ThumbsUp className="h-4 w-4" />
                        AUTHORIZE
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="mb-6">
              <div className="flex items-center gap-2.5">
                <div className="v6cv-typing-dot h-2 w-2 rounded-full bg-current" />
                <div className="v6cv-typing-dot h-2 w-2 rounded-full bg-current" style={{ animationDelay: "0.2s" }} />
                <div className="v6cv-typing-dot h-2 w-2 rounded-full bg-current" style={{ animationDelay: "0.4s" }} />
                <span className="text-[#3a4a6a] font-mono text-xs ml-2 tracking-wider">PROCESSING</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="v6cv-input-area p-4 relative z-10">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit}>
            <div className="v6cv-input-box p-3 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="> enter_command..."
                rows={1}
                className="v6cv-textarea w-full resize-none text-sm outline-none"
              />
              <div className="v6cv-divider my-2" />
              <div className="flex items-center justify-between">
                <Button type="button" variant="ghost" size="icon" className="v6cv-icon-btn h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="v6cv-model-btn h-8 gap-1 px-2">
                        {selectedModel}
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#0d0d24] border-[rgba(0,255,240,0.15)]">
                      {models.map((model) => (
                        <DropdownMenuItem
                          key={model}
                          onClick={() => setSelectedModel(model)}
                          className="text-[#c0c0e0] font-mono text-xs hover:text-[#00fff0] hover:bg-[rgba(0,255,240,0.06)] focus:text-[#00fff0] focus:bg-[rgba(0,255,240,0.06)]"
                        >
                          {model}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button type="button" variant="ghost" size="icon" className="v6cv-mic-btn h-8 w-8">
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </form>
          {/* Bottom status */}
          <div className="flex justify-center mt-2">
            <span className="font-mono text-[0.55rem] text-[rgba(0,255,240,0.2)] tracking-[0.25em]">
              NEURAL LINK ACTIVE // E2E ENCRYPTED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
