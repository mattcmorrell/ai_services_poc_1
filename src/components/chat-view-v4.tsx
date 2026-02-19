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
  Send,
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
import { Client, Message, Artifact } from "@/types/chat";
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

const font = "'Helvetica Neue', Helvetica, Arial, sans-serif";

const lightVars: Record<string, string> = {
  "--background": "#FFFFFF",
  "--foreground": "#000000",
  "--card": "#FFFFFF",
  "--card-foreground": "#000000",
  "--popover": "#FFFFFF",
  "--popover-foreground": "#000000",
  "--primary": "#FF0000",
  "--primary-foreground": "#FFFFFF",
  "--secondary": "#F5F5F5",
  "--secondary-foreground": "#000000",
  "--muted": "#F5F5F5",
  "--muted-foreground": "#666666",
  "--accent": "#F5F5F5",
  "--accent-foreground": "#000000",
  "--destructive": "#FF0000",
  "--border": "#000000",
  "--input": "#E5E5E5",
  "--ring": "#FF0000",
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
      className="flex h-full flex-1 flex-col"
      style={{
        background: "#FFFFFF",
        color: "#000000",
        fontFamily: font,
        ...lightVars,
      } as React.CSSProperties}
    >
      <style>{`
        .v4-chat * {
          color: inherit;
          border-radius: 0 !important;
        }
        .v4-chat textarea {
          color: #000000 !important;
        }
        .v4-chat textarea::placeholder {
          color: #666666 !important;
        }
      `}</style>

      {/* Header */}
      <div
        className="v4-chat flex items-end justify-between px-8 pt-8 pb-4"
      >
        <div>
          <p
            style={{
              fontSize: "0.55rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#666666",
              fontFamily: font,
              fontWeight: 500,
              marginBottom: "4px",
            }}
          >
            {client ? client.name : "CONVERSATION"}
          </p>
          <h1
            style={{
              fontFamily: font,
              fontSize: "2.5rem",
              fontWeight: 900,
              color: "#000000",
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
              textTransform: "uppercase",
            }}
          >
            {chatTitle}
          </h1>
        </div>
        <button
          className="p-2 transition-colors"
          style={{ color: "#000000", borderRadius: 0 }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F5")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Thick red rule under header */}
      <div
        className="mx-8"
        style={{ height: "4px", background: "#FF0000", marginBottom: "0" }}
      />

      {/* Messages */}
      <ScrollArea className="v4-chat flex-1 px-8" ref={scrollRef}>
        <div className="mx-auto max-w-3xl py-8">
          {messages.map((message, index) => (
            <div key={message.id} className="mb-8">
              {/* Thinking toggle */}
              {message.role === "assistant" && message.thinking && (
                <button
                  onClick={() => toggleThinking(message.id)}
                  className="mb-3 flex items-center gap-1.5 transition-colors"
                  style={{
                    color: "#666666",
                    fontFamily: font,
                    fontSize: "0.55rem",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#000000")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#666666")}
                >
                  {expandedThinking[message.id] ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                  REASONING
                </button>
              )}

              {/* Thinking content */}
              {message.thinking && expandedThinking[message.id] && (
                <div
                  className="mb-4 p-5 text-sm"
                  style={{
                    background: "#F5F5F5",
                    border: "1px solid #000000",
                    color: "#666666",
                    fontFamily: font,
                    lineHeight: 1.7,
                    fontSize: "0.8rem",
                    borderRadius: 0,
                  }}
                >
                  {message.thinking}
                </div>
              )}

              {/* Message content */}
              <div className={cn(message.role === "user" && "text-right")}>
                <div
                  className={cn(
                    message.role === "user" && "inline-block px-6 py-4"
                  )}
                  style={{
                    ...(message.role === "user"
                      ? {
                          background: "#FF0000",
                          color: "#FFFFFF",
                          fontFamily: font,
                          fontSize: "0.9rem",
                          lineHeight: 1.6,
                          fontWeight: 500,
                          borderRadius: 0,
                        }
                      : {
                          fontFamily: font,
                          fontSize: "0.95rem",
                          lineHeight: 1.8,
                          color: "#000000",
                          fontWeight: 300,
                        }),
                  }}
                  dangerouslySetInnerHTML={{
                    __html: message.content
                      .replace(/\*\*(.*?)\*\*/g, "<strong style='font-weight:900'>$1</strong>")
                      .replace(/\n/g, "<br />"),
                  }}
                />
              </div>

              {/* Thin separator between messages */}
              {index < messages.length - 1 && message.role === "assistant" && (
                <div
                  style={{
                    height: "1px",
                    background: "#E5E5E5",
                    marginTop: "24px",
                  }}
                />
              )}

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
                <div className="mt-5 flex flex-wrap gap-3">
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
                  className="mt-5 flex w-full items-center gap-4 p-4 cursor-pointer transition-all"
                  style={{
                    background: "#FFFFFF",
                    border: "2px solid #000000",
                    borderRadius: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#F5F5F5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#FFFFFF";
                  }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center"
                    style={{
                      background: "#FF0000",
                      color: "#FFFFFF",
                      borderRadius: 0,
                    }}
                  >
                    <ArrowUpDown className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div
                      style={{
                        fontFamily: font,
                        fontWeight: 900,
                        color: "#000000",
                        fontSize: "0.85rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {message.workflow.name}
                    </div>
                    <div
                      style={{
                        fontFamily: font,
                        fontSize: "0.75rem",
                        color: "#666666",
                        marginTop: "2px",
                        fontWeight: 300,
                      }}
                    >
                      {message.workflow.description}
                    </div>
                  </div>
                  <button
                    className="p-2 transition-colors"
                    style={{ color: "#000000", borderRadius: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F5")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Approval button */}
              {message.requiresApproval && (
                <div className="mt-5">
                  <button
                    onClick={() => onApprove(message.id)}
                    disabled={message.approved}
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all"
                    style={{
                      background: message.approved ? "#000000" : "#FF0000",
                      color: "#FFFFFF",
                      fontFamily: font,
                      fontSize: "0.65rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      borderRadius: 0,
                      cursor: message.approved ? "default" : "pointer",
                      border: "none",
                    }}
                  >
                    {message.approved ? (
                      <>
                        <Check className="h-4 w-4" />
                        APPROVED
                      </>
                    ) : (
                      <>
                        <ThumbsUp className="h-4 w-4" />
                        APPROVE
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator — red blinking square */}
          {isLoading && (
            <div className="mb-8 flex items-center gap-3">
              <div
                className="h-3 w-3 animate-pulse"
                style={{ background: "#FF0000", borderRadius: 0 }}
              />
              <span
                style={{
                  fontFamily: font,
                  fontSize: "0.6rem",
                  color: "#666666",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                PROCESSING
              </span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input area */}
      <div
        className="v4-chat px-6 py-5"
        style={{ borderTop: "2px solid #000000" }}
      >
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit}>
            <div
              className="p-4"
              style={{
                background: "#FFFFFF",
                border: "2px solid #000000",
                borderRadius: 0,
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="TYPE YOUR MESSAGE"
                rows={1}
                className="w-full resize-none bg-transparent text-sm outline-none"
                style={{
                  fontFamily: font,
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                  color: "#000000",
                  letterSpacing: "0.02em",
                  borderRadius: 0,
                }}
              />
              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  className="p-1.5 transition-colors"
                  style={{ color: "#000000", borderRadius: 0 }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F5")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <Plus className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="flex items-center gap-1 px-2.5 py-1 text-xs transition-colors"
                        style={{
                          color: "#666666",
                          fontFamily: font,
                          fontSize: "0.6rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          borderRadius: 0,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F5")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
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
                    className="p-1.5 transition-colors"
                    style={{ color: "#000000", borderRadius: 0 }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F5")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                  <button
                    type="submit"
                    className="p-2.5 transition-all"
                    style={{
                      background: input.trim() ? "#FF0000" : "transparent",
                      color: input.trim() ? "#FFFFFF" : "#666666",
                      borderRadius: 0,
                      border: input.trim() ? "none" : "1px solid #E5E5E5",
                    }}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </form>
          <p
            className="mt-3 text-left"
            style={{
              fontFamily: font,
              fontSize: "0.5rem",
              color: "#666666",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            AI-GENERATED RESPONSES MAY REQUIRE REVIEW
          </p>
        </div>
      </div>
    </div>
  );
}
