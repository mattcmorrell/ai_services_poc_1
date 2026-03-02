"use client";

import { useState, useRef, useEffect } from "react";
import {
  MoreHorizontal,
  ChevronDown,
  ArrowUpDown,
  ThumbsUp,
  Plus,
  Mic,
  Check,
  SendHorizontal,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Client, Message, Artifact } from "@/types/chat";
import {
  MessageList,
  MessageListTheme,
} from "@/components/chat/message-list";

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
  onSubmitClarifyingAnswers?: (
    messageId: string,
    answers: Record<string, string | string[]>
  ) => void;
  isLoading: boolean;
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

const models = [
  "GPT-4o",
  "GPT-4 Turbo",
  "Claude 3.5 Sonnet",
  "Claude 3 Opus",
  "Gemini 1.5 Pro",
  "Gemini 2.0 Flash",
];

const NEON_COLORS = ["#FF2D6B", "#00FF88", "#FFD700", "#00DDFF"];

const v12Theme: MessageListTheme = {
  messageSpacing: "mb-8",
  innerContainerClass: "mx-auto max-w-3xl py-8",
  actionPlanVariant: "full",
  actionPlanWrapperClass: "mt-5",

  contentWrapperClass: (role) =>
    role === "user" ? "flex justify-end" : "flex justify-start",

  userBubbleClass: "max-w-[85%] text-sm leading-relaxed v12-user-msg px-5 py-3",
  userBubbleStyle: {
    borderRadius: "2px 16px 16px 16px",
    color: "#FFFFFF",
    fontWeight: 400,
    fontFamily: "'Space Mono', monospace",
    fontSize: "13px",
  },

  assistantClass: "max-w-[85%] text-sm leading-relaxed",
  assistantStyle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: 400,
    fontFamily: "'Space Mono', monospace",
    lineHeight: 1.9,
    fontSize: "13px",
  },

  contentTransform: (content: string, msgIndex: number) =>
    content
      .replace(
        /\*\*(.*?)\*\*/g,
        `<strong style="color: ${NEON_COLORS[msgIndex % NEON_COLORS.length]}; font-weight: 700; text-shadow: 0 0 8px ${NEON_COLORS[msgIndex % NEON_COLORS.length]}40">$1</strong>`
      )
      .replace(/\n/g, "<br />"),

  thinkingToggleClass:
    "mb-2 flex items-center gap-1.5 text-xs tracking-widest transition-colors duration-200",
  thinkingToggleStyle: {
    color: "#FFD700",
    fontFamily: "'Press Start 2P', cursive",
    fontSize: "7px",
    textShadow: "0 0 6px rgba(255, 215, 0, 0.3)",
  },
  thinkingLabel: <span>BRAIN.EXE</span>,

  thinkingBoxClass: "mb-4 p-4 text-sm",
  thinkingBoxStyle: {
    background: "rgba(255, 215, 0, 0.03)",
    border: "1px dashed rgba(255, 215, 0, 0.15)",
    color: "rgba(255, 255, 255, 0.6)",
    fontStyle: "italic",
    fontFamily: "'Comic Neue', cursive",
    lineHeight: 1.8,
    fontSize: "13px",
  },

  renderLoading: () => (
    <div className="mb-6 flex items-center gap-1.5">
      <span
        style={{
          fontFamily: "'Press Start 2P', cursive",
          fontSize: "8px",
          animation: "v12-loading-chase 2s linear infinite",
        }}
      >
        LOADING
      </span>
      <span
        style={{
          animation: "v12-blink 0.5s step-end infinite",
          color: "#00FF88",
          fontFamily: "'Press Start 2P', cursive",
          fontSize: "8px",
        }}
      >
        ▌
      </span>
    </div>
  ),

  renderWorkflowCard: (workflow, onClick) => (
    <div
      onClick={onClick}
      className="mt-4 flex w-full cursor-pointer items-center gap-3 p-4 transition-all duration-200"
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px dashed rgba(0, 221, 255, 0.2)",
        boxShadow: "0 0 20px rgba(0, 221, 255, 0.05)",
      }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center"
        style={{
          background: "rgba(0, 221, 255, 0.08)",
          border: "1px solid rgba(0, 221, 255, 0.15)",
        }}
      >
        <ArrowUpDown className="h-5 w-5" style={{ color: "#00DDFF" }} />
      </div>
      <div className="flex-1">
        <div
          className="text-sm"
          style={{
            color: "#FFFFFF",
            fontWeight: 700,
            fontFamily: "'Press Start 2P', cursive",
            fontSize: "9px",
            letterSpacing: "1px",
          }}
        >
          {workflow.name.toUpperCase()}
        </div>
        <div
          className="text-xs mt-1"
          style={{
            color: "rgba(255, 255, 255, 0.5)",
            fontFamily: "'Comic Neue', cursive",
            fontSize: "12px",
          }}
        >
          {workflow.description}
        </div>
      </div>
      <button
        className="flex h-8 w-8 items-center justify-center"
        style={{
          background: "rgba(255, 255, 255, 0.03)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <MoreHorizontal className="h-4 w-4" style={{ color: "rgba(255, 255, 255, 0.3)" }} />
      </button>
    </div>
  ),

  renderApprovalButton: (approved, onApprove) => (
    <div className="mt-4">
      <button
        onClick={onApprove}
        disabled={approved}
        className="flex items-center gap-2 px-5 py-2.5 text-sm transition-all duration-300"
        style={
          approved
            ? {
                background: "rgba(0, 255, 136, 0.08)",
                border: "2px solid rgba(0, 255, 136, 0.2)",
                color: "#00FF88",
                fontWeight: 700,
                fontFamily: "'Press Start 2P', cursive",
                fontSize: "8px",
                letterSpacing: "2px",
                textShadow: "0 0 8px rgba(0, 255, 136, 0.3)",
              }
            : {
                background: "linear-gradient(135deg, #FF2D6B 0%, #FFD700 50%, #00FF88 100%)",
                backgroundSize: "200% 200%",
                animation: "v12-rainbow-border 3s linear infinite",
                border: "none",
                color: "#0A0A0A",
                fontWeight: 700,
                fontFamily: "'Press Start 2P', cursive",
                fontSize: "8px",
                letterSpacing: "2px",
                boxShadow: "0 0 20px rgba(255, 45, 107, 0.3), 0 0 40px rgba(0, 255, 136, 0.15)",
              }
        }
      >
        {approved ? (
          <>
            <Check className="h-4 w-4" />
            GG!
          </>
        ) : (
          <>
            <ThumbsUp className="h-4 w-4" />
            APPROVE
          </>
        )}
      </button>
    </div>
  ),
};

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
  onSubmitClarifyingAnswers,
  isLoading,
}: ChatViewProps) {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("GPT-4o");
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

  return (
    <div
      className="v12-chat relative flex h-full flex-1 flex-col overflow-hidden"
      style={{
        background: "#0A0A0A",
        fontFamily: "'Space Mono', monospace",
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
          50% { opacity: 0.85; filter: brightness(1.4); }
        }
        @keyframes v12-loading-chase {
          0% { color: #FF2D6B; }
          25% { color: #00FF88; }
          50% { color: #FFD700; }
          75% { color: #00DDFF; }
          100% { color: #FF2D6B; }
        }
        @keyframes v12-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes v12-color-cycle {
          0% { color: #FF2D6B; }
          25% { color: #00FF88; }
          50% { color: #FFD700; }
          75% { color: #00DDFF; }
          100% { color: #FF2D6B; }
        }

        .v12-chat * {
          border-color: rgba(255, 45, 107, 0.1) !important;
        }
        .v12-chat input, .v12-chat textarea, .v12-chat select {
          color: #FFFFFF !important;
          font-family: 'Space Mono', monospace !important;
        }
        .v12-chat input::placeholder, .v12-chat textarea::placeholder {
          color: rgba(255, 255, 255, 0.3) !important;
        }
        .v12-chat button {
          font-family: 'Space Mono', monospace !important;
        }

        .v12-user-msg {
          position: relative;
          background: rgba(255, 255, 255, 0.03);
          overflow: hidden;
        }
        .v12-user-msg::before {
          content: '';
          position: absolute;
          inset: 0;
          padding: 2px;
          background: linear-gradient(135deg, #FF2D6B, #FFD700, #00FF88, #00DDFF);
          background-size: 300% 300%;
          animation: v12-rainbow-border 3s linear infinite;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          border-radius: inherit;
        }

        .v12-glitch-hover:hover {
          animation: v12-glitch 0.3s ease infinite;
        }
      `}</style>

      {/* CRT Scanlines */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 3px)",
          mixBlendMode: "overlay",
        }}
      />

      {/* Neon Grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 221, 255, 0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 221, 255, 0.015) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Header */}
      <div
        className="relative z-10 flex items-center justify-between px-8 py-4"
        style={{
          borderBottom: "2px solid rgba(255, 45, 107, 0.1)",
          background: "rgba(255, 255, 255, 0.01)",
        }}
      >
        <div>
          <h1
            className="v12-glitch-hover text-lg"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              color: "#FFFFFF",
              fontSize: "12px",
              letterSpacing: "2px",
              textShadow: "2px 0 #FF2D6B, -2px 0 #00DDFF",
            }}
          >
            {chatTitle.toUpperCase()}
          </h1>
          {client && (
            <p
              className="mt-1.5 text-xs"
              style={{
                fontFamily: "'Comic Neue', cursive",
                color: "#00FF88",
                fontWeight: 700,
                fontSize: "11px",
                textShadow: "0 0 8px rgba(0, 255, 136, 0.3)",
              }}
            >
              ⚡ {client.name}
            </p>
          )}
        </div>
        <button
          className="flex h-9 w-9 items-center justify-center transition-colors duration-200"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px dashed rgba(255, 45, 107, 0.2)",
          }}
        >
          <MoreHorizontal className="h-4 w-4" style={{ color: "rgba(255, 255, 255, 0.5)" }} />
        </button>
      </div>

      {/* Messages */}
      <ScrollArea className="relative z-10 flex-1 px-8" ref={scrollRef}>
        <MessageList
          messages={messages}
          artifacts={artifacts}
          selectedArtifactId={selectedArtifactId}
          theme={v12Theme}
          onApprove={onApprove}
          onDecline={onDecline}
          onWorkflowClick={onWorkflowClick}
          onArtifactClick={onArtifactClick}
          onSubmitClarifyingAnswers={onSubmitClarifyingAnswers}
          isLoading={isLoading}
        />
      </ScrollArea>

      {/* Input */}
      <div
        className="relative z-10 px-8 py-5"
        style={{
          borderTop: "2px solid rgba(255, 45, 107, 0.1)",
          background: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit}>
            <div
              className="relative p-3 overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "2px solid rgba(0, 255, 136, 0.1)",
              }}
            >
              {/* Rainbow top border accent */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "2px",
                  background: "linear-gradient(90deg, #FF2D6B, #FFD700, #00FF88, #00DDFF, #FF2D6B)",
                  backgroundSize: "200% 100%",
                  animation: "v12-rainbow-border 3s linear infinite",
                }}
              />
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="// TYPE YOUR COMMAND..."
                rows={1}
                className="w-full resize-none bg-transparent text-sm outline-none"
                style={{
                  color: "#FFFFFF",
                  fontWeight: 400,
                  fontFamily: "'Space Mono', monospace",
                  caretColor: "#00FF88",
                  fontSize: "13px",
                }}
              />
              <div className="mt-2 flex items-center justify-between">
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center transition-colors duration-200"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px dashed rgba(255, 45, 107, 0.15)",
                  }}
                >
                  <Plus className="h-4 w-4" style={{ color: "rgba(255, 255, 255, 0.4)" }} />
                </button>
                <div className="flex items-center gap-1.5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex h-8 items-center gap-1 px-3 text-[9px] tracking-widest transition-colors duration-200"
                        style={{
                          color: "#FFD700",
                          background: "rgba(255, 215, 0, 0.05)",
                          fontFamily: "'Press Start 2P', cursive",
                          fontSize: "6px",
                          border: "1px solid rgba(255, 215, 0, 0.12)",
                          letterSpacing: "1px",
                          textShadow: "0 0 6px rgba(255, 215, 0, 0.2)",
                        }}
                      >
                        {selectedModel.toUpperCase()}
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {models.map((model) => (
                        <DropdownMenuItem
                          key={model}
                          onClick={() => setSelectedModel(model)}
                        >
                          {model}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center transition-colors duration-200"
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px dashed rgba(0, 221, 255, 0.15)",
                    }}
                  >
                    <Mic className="h-4 w-4" style={{ color: "#00DDFF" }} />
                  </button>
                  {input.trim() && (
                    <button
                      type="submit"
                      className="flex h-8 w-8 items-center justify-center transition-all duration-200"
                      style={{
                        background: "linear-gradient(135deg, #FF2D6B 0%, #FFD700 100%)",
                        boxShadow: "0 0 15px rgba(255, 45, 107, 0.4), 0 0 30px rgba(255, 215, 0, 0.2)",
                        clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                      }}
                    >
                      <SendHorizontal className="h-4 w-4" style={{ color: "#0A0A0A" }} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
