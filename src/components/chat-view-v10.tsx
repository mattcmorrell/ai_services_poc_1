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
  "--background": "#FAF8F5",
  "--foreground": "#2D2D2D",
  "--card": "#FFFFFF",
  "--card-foreground": "#2D2D2D",
  "--popover": "#FFFFFF",
  "--popover-foreground": "#2D2D2D",
  "--primary": "#E07A5F",
  "--primary-foreground": "#FFFFFF",
  "--secondary": "#F3EFEB",
  "--secondary-foreground": "#444444",
  "--muted": "#F3EFEB",
  "--muted-foreground": "#777777",
  "--accent": "#FDF0EB",
  "--accent-foreground": "#2D2D2D",
  "--destructive": "#C1392B",
  "--border": "#E8E4DF",
  "--input": "#E8E4DF",
  "--ring": "#E07A5F",
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
      className="v10-paper relative flex h-full flex-1 flex-col overflow-hidden"
      style={{
        background: "#FAF8F5",
        fontFamily: "'Karla', sans-serif",
        color: "#2D2D2D",
        ...lightVars,
      } as React.CSSProperties}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Karla:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap');

        @keyframes v10-fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes v10-dot-pulse {
          0%, 80%, 100% { opacity: 0.25; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }

        .v10-paper * {
          border-color: #E8E4DF !important;
        }
        .v10-paper [class*="rounded-xl"],
        .v10-paper [class*="rounded-lg"] {
          border-radius: 6px !important;
        }
        .v10-paper [class*="rounded-full"] {
          border-radius: 9999px !important;
        }
        .v10-paper input, .v10-paper textarea, .v10-paper select {
          color: #2D2D2D !important;
          font-family: 'Karla', sans-serif !important;
        }
        .v10-paper input::placeholder, .v10-paper textarea::placeholder {
          color: #999999 !important;
        }
        .v10-paper button {
          font-family: 'Karla', sans-serif !important;
        }
        .v10-paper [class*="bg-muted"] {
          background-color: #F3EFEB !important;
        }
        .v10-paper [class*="text-muted-foreground"] {
          color: #777777 !important;
        }

        .v10-paper .prose strong {
          color: #C45A40 !important;
          font-weight: 600;
        }
      `}</style>

      {/* Subtle ruled lines background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, rgba(224, 122, 95, 0.03) 31px, rgba(224, 122, 95, 0.03) 32px)",
          backgroundSize: "100% 32px",
          backgroundPosition: "0 16px",
        }}
      />

      {/* Header */}
      <div
        className="relative z-10 flex items-center justify-between px-8 py-5"
        style={{
          borderBottom: "1px solid #E8E4DF",
          background: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)",
        }}
      >
        <div>
          <h1
            className="text-xl"
            style={{
              fontFamily: "'Spectral', serif",
              color: "#2D2D2D",
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            {chatTitle}
          </h1>
          {client && (
            <p
              className="mt-0.5 text-xs tracking-wide"
              style={{
                fontFamily: "'Karla', sans-serif",
                color: "#E07A5F",
                fontWeight: 500,
                letterSpacing: "0.04em",
              }}
            >
              {client.name}
            </p>
          )}
        </div>
        <button
          className="flex h-9 w-9 items-center justify-center transition-colors duration-200"
          style={{
            background: "#F3EFEB",
            borderRadius: "6px",
            border: "1px solid #E8E4DF",
          }}
        >
          <MoreHorizontal className="h-4 w-4" style={{ color: "#999999" }} />
        </button>
      </div>

      {/* Messages */}
      <ScrollArea className="relative z-10 flex-1 px-8" ref={scrollRef}>
        <div className="mx-auto max-w-3xl py-8">
          {messages.map((message) => (
            <div key={message.id} className="mb-7">
              {/* Thinking toggle */}
              {message.role === "assistant" && message.thinking && (
                <button
                  onClick={() => toggleThinking(message.id)}
                  className="mb-2 flex items-center gap-1.5 text-xs transition-colors duration-200"
                  style={{
                    color: "#B0A99E",
                    fontFamily: "'Karla', sans-serif",
                    fontWeight: 400,
                  }}
                >
                  {expandedThinking[message.id] ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                  <span
                    style={{
                      fontStyle: "italic",
                      fontFamily: "'Spectral', serif",
                      letterSpacing: "0.02em",
                    }}
                  >
                    Thinking...
                  </span>
                </button>
              )}

              {/* Thinking content */}
              {message.thinking && expandedThinking[message.id] && (
                <div
                  className="mb-4 p-4 text-sm"
                  style={{
                    background: "#F3EFEB",
                    border: "1px solid #E8E4DF",
                    borderRadius: "6px",
                    color: "#777777",
                    fontStyle: "italic",
                    fontFamily: "'Spectral', serif",
                    fontWeight: 400,
                    lineHeight: 1.7,
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
                    "max-w-[85%] text-sm leading-relaxed",
                    message.role === "user" ? "px-5 py-3" : ""
                  )}
                  style={
                    message.role === "user"
                      ? {
                          background: "#E07A5F",
                          borderRadius: "18px 18px 4px 18px",
                          color: "#FFFFFF",
                          fontWeight: 400,
                          fontFamily: "'Karla', sans-serif",
                          boxShadow: "0 2px 8px rgba(224, 122, 95, 0.2)",
                        }
                      : {
                          color: "#444444",
                          fontWeight: 400,
                          fontFamily: "'Karla', sans-serif",
                          lineHeight: 1.75,
                        }
                  }
                  dangerouslySetInnerHTML={{
                    __html: message.content
                      .replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong style="color: #C45A40; font-weight: 600">$1</strong>'
                      )
                      .replace(/\n/g, "<br />"),
                  }}
                />
              </div>

              {/* Action Plan Card */}
              {message.actionPlan && (
                <div className="mt-5">
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
                  className="mt-4 flex w-full cursor-pointer items-center gap-3 p-4 transition-all duration-200"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E8E4DF",
                    borderRadius: "6px",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center"
                    style={{
                      background: "#FDF0EB",
                      borderRadius: "6px",
                      border: "1px solid #E8E4DF",
                    }}
                  >
                    <ArrowUpDown className="h-5 w-5" style={{ color: "#E07A5F" }} />
                  </div>
                  <div className="flex-1">
                    <div
                      className="text-sm"
                      style={{
                        color: "#2D2D2D",
                        fontWeight: 600,
                        fontFamily: "'Karla', sans-serif",
                      }}
                    >
                      {message.workflow.name}
                    </div>
                    <div
                      className="text-xs"
                      style={{
                        color: "#999999",
                        fontWeight: 400,
                        fontFamily: "'Karla', sans-serif",
                      }}
                    >
                      {message.workflow.description}
                    </div>
                  </div>
                  <button
                    className="flex h-8 w-8 items-center justify-center"
                    style={{
                      background: "#F3EFEB",
                      borderRadius: "6px",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" style={{ color: "#999999" }} />
                  </button>
                </div>
              )}

              {/* Approval button */}
              {message.requiresApproval && (
                <div className="mt-4">
                  <button
                    onClick={() => onApprove(message.id)}
                    disabled={message.approved}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm transition-all duration-200"
                    style={
                      message.approved
                        ? {
                            background: "#F3EFEB",
                            border: "1px solid #E8E4DF",
                            borderRadius: "6px",
                            color: "#777777",
                            fontWeight: 500,
                            fontFamily: "'Karla', sans-serif",
                          }
                        : {
                            background: "#E07A5F",
                            border: "1px solid #D06B50",
                            borderRadius: "6px",
                            color: "#FFFFFF",
                            fontWeight: 600,
                            fontFamily: "'Karla', sans-serif",
                            boxShadow: "0 2px 8px rgba(224, 122, 95, 0.25)",
                          }
                    }
                  >
                    {message.approved ? (
                      <>
                        <Check className="h-4 w-4" />
                        Approved
                      </>
                    ) : (
                      <>
                        <ThumbsUp className="h-4 w-4" />
                        Approve
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="mb-6 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: "#E07A5F",
                    animation: "v10-dot-pulse 1.4s infinite ease-in-out",
                  }}
                />
                <div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: "#E07A5F",
                    animation: "v10-dot-pulse 1.4s infinite ease-in-out 0.2s",
                  }}
                />
                <div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: "#E07A5F",
                    animation: "v10-dot-pulse 1.4s infinite ease-in-out 0.4s",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div
        className="relative z-10 px-8 py-5"
        style={{
          borderTop: "1px solid #E8E4DF",
          background: "linear-gradient(0deg, #FAF8F5 60%, rgba(250, 248, 245, 0.95) 100%)",
        }}
      >
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit}>
            <div
              className="p-3"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8E4DF",
                borderRadius: "12px",
                boxShadow: "0 1px 4px rgba(0, 0, 0, 0.04)",
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write something..."
                rows={1}
                className="w-full resize-none bg-transparent text-sm outline-none"
                style={{
                  color: "#2D2D2D",
                  fontWeight: 400,
                  fontFamily: "'Karla', sans-serif",
                  caretColor: "#E07A5F",
                }}
              />
              <div className="mt-2 flex items-center justify-between">
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center transition-colors duration-200"
                  style={{
                    background: "#F3EFEB",
                    borderRadius: "6px",
                    border: "1px solid #E8E4DF",
                  }}
                >
                  <Plus className="h-4 w-4" style={{ color: "#999999" }} />
                </button>
                <div className="flex items-center gap-1.5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex h-8 items-center gap-1 px-3 text-[11px] transition-colors duration-200"
                        style={{
                          color: "#777777",
                          background: "#F3EFEB",
                          borderRadius: "6px",
                          fontFamily: "'Karla', sans-serif",
                          fontWeight: 500,
                          border: "1px solid #E8E4DF",
                        }}
                      >
                        {selectedModel}
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
                      background: "#F3EFEB",
                      borderRadius: "6px",
                      border: "1px solid #E8E4DF",
                    }}
                  >
                    <Mic className="h-4 w-4" style={{ color: "#999999" }} />
                  </button>
                  {input.trim() && (
                    <button
                      type="submit"
                      className="flex h-8 w-8 items-center justify-center transition-all duration-200"
                      style={{
                        background: "#E07A5F",
                        borderRadius: "6px",
                        boxShadow: "0 2px 6px rgba(224, 122, 95, 0.3)",
                      }}
                    >
                      <SendHorizontal className="h-4 w-4" style={{ color: "#FFFFFF" }} />
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
