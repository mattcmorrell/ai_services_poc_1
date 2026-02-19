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

/* --- Color palette --- */
const c = {
  bg: "#FAF7F2",
  bgWhite: "#FFFFFF",
  bgCream: "#F5F0E8",
  bgUserBubble: "#8B6F47",
  text: "#3D3529",
  textMuted: "#9C9486",
  textSecondary: "#7A7062",
  textOnAccent: "#FFFAF4",
  border: "rgba(200, 185, 166, 0.35)",
  borderLight: "rgba(200, 185, 166, 0.2)",
  accent: "#8B6F47",
  accentSoft: "rgba(139, 111, 71, 0.08)",
  warmShadow: "0 2px 16px rgba(160, 140, 110, 0.08)",
  serif: "Georgia, 'Times New Roman', serif",
  sans: "'Inter', system-ui, sans-serif",
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
      style={{ background: c.bg, color: c.text }}
    >
      <style>{`
        .v3-chat-view * { color: inherit; }
        .v3-chat-view textarea {
          color: ${c.text} !important;
        }
        .v3-chat-view textarea::placeholder {
          color: ${c.textMuted} !important;
        }
      `}</style>

      {/* Header */}
      <div
        className="v3-chat-view flex items-center justify-between px-8 py-5"
        style={{ borderBottom: `1px solid ${c.border}` }}
      >
        <div>
          <h1
            style={{
              fontFamily: c.serif,
              fontSize: "1.5rem",
              fontWeight: 600,
              color: c.text,
              letterSpacing: "-0.02em",
              lineHeight: 1.3,
            }}
          >
            {chatTitle}
          </h1>
          {client && (
            <p
              style={{
                fontFamily: c.sans,
                fontSize: "0.8rem",
                color: c.textMuted,
                marginTop: "2px",
                letterSpacing: "0.02em",
              }}
            >
              {client.name}
            </p>
          )}
        </div>
        <button
          className="rounded-xl p-2 transition-colors"
          style={{ color: c.textMuted }}
          onMouseEnter={(e) => (e.currentTarget.style.background = c.bgCream)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <ScrollArea className="v3-chat-view flex-1 px-8" ref={scrollRef}>
        <div className="mx-auto max-w-3xl py-8">
          {messages.map((message) => (
            <div key={message.id} className="mb-8">
              {/* Thinking toggle */}
              {message.role === "assistant" && message.thinking && (
                <button
                  onClick={() => toggleThinking(message.id)}
                  className="mb-3 flex items-center gap-1.5 transition-colors"
                  style={{
                    color: c.textMuted,
                    fontFamily: c.sans,
                    fontSize: "0.75rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = c.text)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = c.textMuted)}
                >
                  {expandedThinking[message.id] ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                  Reasoning
                </button>
              )}

              {/* Thinking content */}
              {message.thinking && expandedThinking[message.id] && (
                <div
                  className="mb-4 rounded-xl p-5 text-sm"
                  style={{
                    background: c.bgCream,
                    border: `1px solid ${c.borderLight}`,
                    color: c.textSecondary,
                    fontFamily: c.sans,
                    lineHeight: 1.7,
                    fontStyle: "italic",
                  }}
                >
                  {message.thinking}
                </div>
              )}

              {/* Message content */}
              <div className={cn(message.role === "user" && "text-right")}>
                <div
                  className={cn(
                    message.role === "user" && "inline-block rounded-2xl px-5 py-3"
                  )}
                  style={{
                    ...(message.role === "user"
                      ? {
                          background: c.bgUserBubble,
                          color: c.textOnAccent,
                          fontFamily: c.sans,
                          fontSize: "0.9rem",
                          lineHeight: 1.6,
                          boxShadow: "0 2px 8px rgba(139, 111, 71, 0.15)",
                        }
                      : {
                          fontFamily: c.serif,
                          fontSize: "0.95rem",
                          lineHeight: 1.8,
                          color: c.text,
                        }),
                  }}
                  dangerouslySetInnerHTML={{
                    __html: message.content
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
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
                  className="mt-5 flex w-full items-center gap-4 rounded-2xl p-4 cursor-pointer transition-all"
                  style={{
                    background: c.bgWhite,
                    border: `1px solid ${c.borderLight}`,
                    boxShadow: c.warmShadow,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 24px rgba(160, 140, 110, 0.12)";
                    e.currentTarget.style.borderColor = "rgba(200, 185, 166, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = c.warmShadow;
                    e.currentTarget.style.borderColor = "rgba(200, 185, 166, 0.2)";
                  }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: c.accentSoft, color: c.accent }}
                  >
                    <ArrowUpDown className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div
                      style={{
                        fontFamily: c.serif,
                        fontWeight: 600,
                        color: c.text,
                        fontSize: "0.9rem",
                      }}
                    >
                      {message.workflow.name}
                    </div>
                    <div
                      style={{
                        fontFamily: c.sans,
                        fontSize: "0.8rem",
                        color: c.textMuted,
                        marginTop: "2px",
                      }}
                    >
                      {message.workflow.description}
                    </div>
                  </div>
                  <button
                    className="rounded-xl p-2 transition-colors"
                    style={{ color: c.textMuted }}
                    onClick={(e) => e.stopPropagation()}
                    onMouseEnter={(e) => (e.currentTarget.style.background = c.bgCream)}
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
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all"
                    style={{
                      background: message.approved ? "#6B8F71" : c.accent,
                      color: c.textOnAccent,
                      fontFamily: c.sans,
                      opacity: message.approved ? 0.9 : 1,
                      boxShadow: "0 2px 8px rgba(139, 111, 71, 0.2)",
                      cursor: message.approved ? "default" : "pointer",
                    }}
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
            <div className="mb-8 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div
                  className="h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{ background: c.accent, opacity: 0.6 }}
                />
                <div
                  className="h-1.5 w-1.5 rounded-full animate-pulse [animation-delay:0.2s]"
                  style={{ background: c.accent, opacity: 0.6 }}
                />
                <div
                  className="h-1.5 w-1.5 rounded-full animate-pulse [animation-delay:0.4s]"
                  style={{ background: c.accent, opacity: 0.6 }}
                />
              </div>
              <span
                style={{
                  fontFamily: c.sans,
                  fontSize: "0.75rem",
                  color: c.textMuted,
                  fontStyle: "italic",
                }}
              >
                Composing...
              </span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input area */}
      <div
        className="v3-chat-view px-6 py-5"
        style={{ borderTop: `1px solid ${c.border}` }}
      >
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit}>
            <div
              className="rounded-2xl p-4"
              style={{
                background: c.bgWhite,
                border: `1px solid ${c.borderLight}`,
                boxShadow: "0 2px 20px rgba(160, 140, 110, 0.06)",
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a message..."
                rows={1}
                className="w-full resize-none bg-transparent text-sm outline-none"
                style={{
                  fontFamily: c.sans,
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  color: c.text,
                }}
              />
              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  className="rounded-lg p-1.5 transition-colors"
                  style={{ color: c.textMuted }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = c.bgCream)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <Plus className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs transition-colors"
                        style={{
                          color: c.textMuted,
                          fontFamily: c.sans,
                          fontSize: "0.75rem",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = c.bgCream)}
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
                    className="rounded-lg p-1.5 transition-colors"
                    style={{ color: c.textMuted }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = c.bgCream)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl p-2 transition-all"
                    style={{
                      background: input.trim() ? c.accent : "transparent",
                      color: input.trim() ? c.textOnAccent : c.textMuted,
                      opacity: input.trim() ? 1 : 0.5,
                    }}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </form>
          {/* Subtle footer note */}
          <p
            className="mt-2 text-center"
            style={{
              fontFamily: c.sans,
              fontSize: "0.65rem",
              color: c.textMuted,
              letterSpacing: "0.03em",
            }}
          >
            Responses are AI-generated and may require review
          </p>
        </div>
      </div>
    </div>
  );
}
