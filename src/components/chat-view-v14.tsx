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
  SendHorizontal,
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

  return (
    <div
      className="v14-chat relative flex h-full flex-1 flex-col overflow-hidden"
      style={{
        background: "#5C94FC",
        fontFamily: "'VT323', monospace",
        color: "#1C1C1C",
        imageRendering: "pixelated",
        ...lightVars,
      } as React.CSSProperties}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');

        @keyframes v14-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes v14-coin-spin {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.2); }
        }
        @keyframes v14-question-bump {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes v14-walk {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(2px); }
          75% { transform: translateX(-2px); }
        }
        @keyframes v14-loading-bar {
          0% { width: 0%; }
          50% { width: 80%; }
          100% { width: 100%; }
        }
        @keyframes v14-star-sparkle {
          0%, 100% { text-shadow: 0 0 4px #FAC000; }
          50% { text-shadow: 0 0 12px #FAC000, 0 0 20px #F8D878; }
        }
        @keyframes v14-cloud-drift-chat {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .v14-chat * {
          border-color: #5C5C5C !important;
          border-radius: 0 !important;
        }
        .v14-chat input, .v14-chat textarea, .v14-chat select {
          color: #FCFCFC !important;
          font-family: 'VT323', monospace !important;
          font-size: 18px !important;
          border-radius: 0 !important;
        }
        .v14-chat input::placeholder, .v14-chat textarea::placeholder {
          color: rgba(252, 252, 252, 0.5) !important;
        }
        .v14-chat button {
          font-family: 'VT323', monospace !important;
          border-radius: 0 !important;
        }
        .v14-chat [class*="rounded"] {
          border-radius: 0 !important;
        }

        .v14-dialog-box {
          background: #1C1C1C;
          border: 4px solid #FCFCFC;
          box-shadow: 4px 4px 0 #0C0C0C, 8px 8px 0 rgba(0,0,0,0.15);
          color: #FCFCFC;
          position: relative;
        }
        .v14-dialog-box::after {
          content: '';
          position: absolute;
          bottom: -8px;
          right: 16px;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid #FCFCFC;
        }

        .v14-npc-box {
          background: #1C1C1C;
          border: 4px solid #FCFCFC;
          box-shadow: 4px 4px 0 #0C0C0C;
          color: #FCFCFC;
          position: relative;
          border-left: 4px solid #30A030;
        }
        .v14-npc-box::before {
          content: '🍄';
          position: absolute;
          top: -10px;
          left: -10px;
          font-size: 16px;
          filter: drop-shadow(2px 2px 0 #0C0C0C);
        }
      `}</style>

      {/* Scrolling clouds background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          style={{
            position: "absolute",
            top: "5%",
            left: 0,
            width: "200%",
            height: "100%",
            animation: "v14-cloud-drift-chat 80s linear infinite",
          }}
        >
          {[0, 20, 45, 70, 100, 125, 150, 175].map((left, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${left}%`,
                top: `${8 + (i % 3) * 20 + (i % 2) * 10}%`,
                width: i % 3 === 0 ? "60px" : "40px",
                height: i % 3 === 0 ? "24px" : "16px",
                background: "#FCFCFC",
                boxShadow: `
                  ${i % 3 === 0 ? "8px" : "6px"} 0 0 #FCFCFC,
                  ${i % 3 === 0 ? "-8px" : "-6px"} 0 0 #FCFCFC,
                  0 ${i % 3 === 0 ? "-8px" : "-6px"} 0 #FCFCFC,
                  ${i % 3 === 0 ? "8px" : "6px"} ${i % 3 === 0 ? "-8px" : "-6px"} 0 #FCFCFC,
                  ${i % 3 === 0 ? "-8px" : "-6px"} ${i % 3 === 0 ? "-8px" : "-6px"} 0 #FCFCFC
                `,
                opacity: 0.3,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header — Level Title Bar */}
      <div
        className="relative z-10 flex items-center justify-between px-6 py-3"
        style={{
          background: "#1C1C1C",
          borderBottom: "4px solid #FCFCFC",
          boxShadow: "0 4px 0 #0C0C0C",
        }}
      >
        <div>
          <div className="flex items-center gap-3">
            <h1
              style={{
                fontFamily: "'Press Start 2P', cursive",
                color: "#FCFCFC",
                fontSize: "10px",
                letterSpacing: "1px",
                textShadow: "2px 2px 0 #0C0C0C",
              }}
            >
              {chatTitle.toUpperCase()}
            </h1>
            <span
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: "7px",
                color: "#FAC000",
                animation: "v14-question-bump 1s steps(2) infinite",
                display: "inline-block",
              }}
            >
              ?
            </span>
          </div>
          {client && (
            <p className="mt-1 flex items-center gap-2">
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  background: "#30A030",
                  display: "inline-block",
                  boxShadow: "2px 2px 0 #005000",
                }}
              />
              <span
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: "6px",
                  color: "#30A030",
                  textShadow: "1px 1px 0 #0C0C0C",
                }}
              >
                {client.name.toUpperCase()}
              </span>
              <span
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: "5px",
                  color: "rgba(252, 252, 252, 0.4)",
                }}
              >
                ● ONLINE
              </span>
            </p>
          )}
        </div>
        <button
          className="flex h-8 w-8 items-center justify-center"
          style={{
            background: "#2C2C2C",
            border: "2px solid #FCFCFC",
            boxShadow: "2px 2px 0 #0C0C0C",
          }}
        >
          <MoreHorizontal className="h-4 w-4" style={{ color: "#FCFCFC" }} />
        </button>
      </div>

      {/* Messages */}
      <ScrollArea className="relative z-10 flex-1 px-6" ref={scrollRef}>
        <div className="mx-auto max-w-3xl py-6">
          {messages.map((message, msgIdx) => (
            <div key={message.id} className="mb-6">
              {/* Thinking toggle */}
              {message.role === "assistant" && message.thinking && (
                <button
                  onClick={() => toggleThinking(message.id)}
                  className="mb-2 flex items-center gap-2"
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: "7px",
                    color: "#FAC000",
                    textShadow: "2px 2px 0 #0C0C0C",
                  }}
                >
                  {expandedThinking[message.id] ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                  <span>LOADING...</span>
                  <div
                    style={{
                      width: "40px",
                      height: "6px",
                      background: "#3C3C3C",
                      border: "1px solid #5C5C5C",
                      overflow: "hidden",
                      display: "inline-block",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        background: "#30A030",
                        width: "100%",
                        animation: expandedThinking[message.id] ? "none" : "v14-loading-bar 2s steps(8) infinite",
                      }}
                    />
                  </div>
                </button>
              )}

              {/* Thinking content */}
              {message.thinking && expandedThinking[message.id] && (
                <div
                  className="mb-4 p-3"
                  style={{
                    background: "#0C0C0C",
                    border: "2px dashed #5C5C5C",
                    color: "rgba(252, 252, 252, 0.5)",
                    fontFamily: "'VT323', monospace",
                    fontSize: "16px",
                    lineHeight: 1.6,
                  }}
                >
                  {message.thinking}
                </div>
              )}

              {/* Message content */}
              <div
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] leading-relaxed",
                    message.role === "user" ? "v14-dialog-box px-4 py-3" : "v14-npc-box px-4 py-3 ml-2"
                  )}
                  style={
                    message.role === "user"
                      ? {
                          fontFamily: "'VT323', monospace",
                          fontSize: "18px",
                          lineHeight: 1.6,
                        }
                      : {
                          fontFamily: "'VT323', monospace",
                          fontSize: "18px",
                          lineHeight: 1.6,
                        }
                  }
                  dangerouslySetInnerHTML={{
                    __html: message.content
                      .replace(
                        /\*\*(.*?)\*\*/g,
                        `<strong style="font-weight: 700; color: #FAC000; text-shadow: 0 0 4px #FAC000">$1</strong>`
                      )
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
                <div className="mt-3 flex flex-wrap gap-2">
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
                  className="mt-4 flex w-full cursor-pointer items-center gap-3 p-3"
                  style={{
                    background: "#1C1C1C",
                    border: "4px solid #FCFCFC",
                    boxShadow: "4px 4px 0 #0C0C0C",
                    color: "#FCFCFC",
                  }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center"
                    style={{
                      background: "#00A800",
                      border: "2px solid #008000",
                    }}
                  >
                    <ArrowUpDown className="h-5 w-5" style={{ color: "#FCFCFC" }} />
                  </div>
                  <div className="flex-1">
                    <div
                      style={{
                        fontFamily: "'Press Start 2P', cursive",
                        color: "#F8D878",
                        fontSize: "7px",
                        letterSpacing: "1px",
                        textShadow: "2px 2px 0 #0C0C0C",
                      }}
                    >
                      {message.workflow.name.toUpperCase()}
                    </div>
                    <div
                      className="mt-1"
                      style={{
                        color: "rgba(252, 252, 252, 0.7)",
                        fontFamily: "'VT323', monospace",
                        fontSize: "16px",
                      }}
                    >
                      {message.workflow.description}
                    </div>
                  </div>
                  <button
                    className="flex h-8 w-8 items-center justify-center"
                    style={{
                      background: "#2C2C2C",
                      border: "2px solid #5C5C5C",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" style={{ color: "#FCFCFC" }} />
                  </button>
                </div>
              )}

              {/* Approval buttons — [A] APPROVE  [B] DECLINE */}
              {message.requiresApproval && (
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => onApprove(message.id)}
                    disabled={message.approved}
                    className="flex items-center gap-2 px-4 py-2"
                    style={
                      message.approved
                        ? {
                            background: "#00A800",
                            border: "4px solid #FCFCFC",
                            boxShadow: "4px 4px 0 #0C0C0C",
                            color: "#FCFCFC",
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: "7px",
                            letterSpacing: "1px",
                            textShadow: "2px 2px 0 #005000",
                          }
                        : {
                            background: "#30A030",
                            border: "4px solid #FCFCFC",
                            boxShadow: "4px 4px 0 #0C0C0C",
                            color: "#FCFCFC",
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: "7px",
                            letterSpacing: "1px",
                            textShadow: "2px 2px 0 #005000",
                          }
                    }
                  >
                    {message.approved ? (
                      <>
                        <Check className="h-3 w-3" />
                        1UP!
                      </>
                    ) : (
                      <>
                        <span style={{ color: "#F8D878", fontWeight: 700 }}>[A]</span>
                        APPROVE
                      </>
                    )}
                  </button>
                  {!message.approved && (
                    <button
                      onClick={() => onDecline(message.id)}
                      className="flex items-center gap-2 px-4 py-2"
                      style={{
                        background: "#E44028",
                        border: "4px solid #FCFCFC",
                        boxShadow: "4px 4px 0 #0C0C0C",
                        color: "#FCFCFC",
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: "7px",
                        letterSpacing: "1px",
                        textShadow: "2px 2px 0 #8C0000",
                      }}
                    >
                      <span style={{ color: "#F8D878", fontWeight: 700 }}>[B]</span>
                      DECLINE
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Loading — Mario running */}
          {isLoading && (
            <div className="mb-6 flex items-center gap-3">
              <div
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: "14px",
                  animation: "v14-walk 0.4s steps(2) infinite",
                  display: "inline-block",
                }}
              >
                🍄
              </div>
              <div className="flex flex-col gap-1">
                <span
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: "7px",
                    color: "#FCFCFC",
                    textShadow: "2px 2px 0 #0C0C0C",
                    animation: "v14-blink 1s steps(1) infinite",
                  }}
                >
                  LOADING...
                </span>
                <div
                  style={{
                    width: "80px",
                    height: "8px",
                    background: "#3C3C3C",
                    border: "2px solid #FCFCFC",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      background: "repeating-linear-gradient(90deg, #30A030 0px, #30A030 6px, #00A800 6px, #00A800 12px)",
                      animation: "v14-loading-bar 1.5s steps(6) infinite",
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input — RPG Command Prompt */}
      <div
        className="relative z-10 px-6 py-4"
        style={{
          background: "#1C1C1C",
          borderTop: "4px solid #FCFCFC",
          boxShadow: "0 -4px 0 #0C0C0C",
        }}
      >
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit}>
            <div
              className="relative overflow-hidden p-3"
              style={{
                background: "#0C0C0C",
                border: "2px solid #5C5C5C",
              }}
            >
              {/* Command prompt indicator */}
              <div className="flex items-start gap-2">
                <span
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: "10px",
                    color: "#FAC000",
                    textShadow: "0 0 4px #FAC000",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  ▶
                </span>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="ENTER COMMAND..."
                  rows={1}
                  className="w-full resize-none bg-transparent outline-none"
                  style={{
                    color: "#FCFCFC",
                    fontFamily: "'VT323', monospace",
                    fontSize: "18px",
                    caretColor: "#FAC000",
                  }}
                />
                {/* Blinking block cursor hint */}
                {!input && (
                  <span
                    style={{
                      position: "absolute",
                      left: "36px",
                      top: "14px",
                      width: "10px",
                      height: "18px",
                      background: "#FAC000",
                      animation: "v14-blink 1s steps(1) infinite",
                    }}
                  />
                )}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <button
                  type="button"
                  className="flex h-7 w-7 items-center justify-center"
                  style={{
                    background: "#2C2C2C",
                    border: "2px solid #5C5C5C",
                  }}
                >
                  <Plus className="h-3.5 w-3.5" style={{ color: "#FCFCFC" }} />
                </button>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex h-7 items-center gap-1 px-2"
                        style={{
                          color: "#F8D878",
                          background: "#2C2C2C",
                          fontFamily: "'Press Start 2P', cursive",
                          fontSize: "5px",
                          letterSpacing: "1px",
                          border: "2px solid #5C5C5C",
                        }}
                      >
                        {selectedModel.toUpperCase()}
                        <ChevronDown className="h-2.5 w-2.5" />
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
                    className="flex h-7 w-7 items-center justify-center"
                    style={{
                      background: "#2C2C2C",
                      border: "2px solid #5C5C5C",
                    }}
                  >
                    <Mic className="h-3.5 w-3.5" style={{ color: "#30A030" }} />
                  </button>
                  {input.trim() && (
                    <button
                      type="submit"
                      className="flex h-7 w-7 items-center justify-center"
                      style={{
                        background: "#E44028",
                        border: "2px solid #FCFCFC",
                        boxShadow: "2px 2px 0 #0C0C0C",
                      }}
                    >
                      <SendHorizontal className="h-3.5 w-3.5" style={{ color: "#FCFCFC" }} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
          {/* Bottom decorative brick */}
          <div
            className="mt-2 flex items-center justify-center gap-2"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "5px",
              color: "rgba(252, 252, 252, 0.3)",
            }}
          >
            <span style={{ color: "#FAC000", animation: "v14-star-sparkle 2s ease-in-out infinite" }}>★</span>
            <span>PRESS ENTER TO SEND</span>
            <span style={{ color: "#FAC000", animation: "v14-star-sparkle 2s ease-in-out infinite 1s" }}>★</span>
          </div>
        </div>
      </div>
    </div>
  );
}
