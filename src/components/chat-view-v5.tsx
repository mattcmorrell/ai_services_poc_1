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
import { ActionCardCompact } from "@/components/chat/action-card-compact";
import { PlanSplitView } from "@/components/plan/plan-split-view";
import { useResizable } from "@/components/ui/resize-handle";

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
  // Plan panel props
  activePlan?: ActionPlan;
  planPanelOpen?: boolean;
  onOpenPlanPanel?: () => void;
  onClosePlanPanel?: () => void;
  onPausePlan?: () => void;
  onStopPlan?: () => void;
  onResumePlan?: () => void;
}

const glassVars: Record<string, string> = {
  "--background": "#060608",
  "--foreground": "rgba(255, 255, 255, 0.85)",
  "--card": "rgba(255, 255, 255, 0.03)",
  "--card-foreground": "rgba(255, 255, 255, 0.85)",
  "--popover": "rgba(255, 255, 255, 0.06)",
  "--popover-foreground": "rgba(255, 255, 255, 0.85)",
  "--primary": "rgba(255, 255, 255, 0.9)",
  "--primary-foreground": "#060608",
  "--secondary": "rgba(255, 255, 255, 0.04)",
  "--secondary-foreground": "rgba(255, 255, 255, 0.7)",
  "--muted": "rgba(255, 255, 255, 0.04)",
  "--muted-foreground": "rgba(255, 255, 255, 0.4)",
  "--accent": "rgba(255, 255, 255, 0.06)",
  "--accent-foreground": "rgba(255, 255, 255, 0.85)",
  "--destructive": "rgba(180, 80, 60, 0.8)",
  "--border": "rgba(255, 255, 255, 0.06)",
  "--input": "rgba(255, 255, 255, 0.06)",
  "--ring": "rgba(255, 255, 255, 0.15)",
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
  activePlan,
  planPanelOpen,
  onOpenPlanPanel,
  onClosePlanPanel,
  onPausePlan,
  onStopPlan,
  onResumePlan,
}: ChatViewProps) {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("GPT-4o");
  const [expandedThinking, setExpandedThinking] = useState<Record<string, boolean>>({});
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Approach C: Split view resize
  const { width: splitWidth, onDragStart: onSplitDragStart } = useResizable({
    defaultWidth: 380,
    minWidth: 300,
    maxWidth: 500,
    storageKey: "plan-split-width",
  });

  const showSplitView = activePlan && planPanelOpen;

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

  // Shared chat column content
  const chatContent = (
    <div className="flex flex-col h-full flex-1 min-w-0">
      {/* Header */}
      <div
        className="relative z-10 flex items-center justify-between px-8 py-5 shrink-0"
        style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}
      >
        <div>
          <h1
            className="text-xl tracking-tight"
            style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 600 }}
          >
            {chatTitle}
          </h1>
          {client && (
            <p
              className="mt-0.5 text-xs font-light tracking-wide"
              style={{ color: "rgba(255, 255, 255, 0.3)" }}
            >
              {client.name}
            </p>
          )}
        </div>
        <button
          className="flex h-9 w-9 items-center justify-center transition-colors duration-200"
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            borderRadius: "9999px",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <MoreHorizontal className="h-4 w-4" style={{ color: "rgba(255, 255, 255, 0.35)" }} />
        </button>
      </div>

      {/* Messages */}
      <ScrollArea className="relative z-10 flex-1 px-8" ref={scrollRef}>
        <div className={cn("mx-auto py-8", showSplitView ? "max-w-none" : "max-w-3xl")}>
          {messages.map((message) => (
            <div key={message.id} className="mb-8">
              {/* Thinking toggle */}
              {message.role === "assistant" && message.thinking && (
                <button
                  onClick={() => toggleThinking(message.id)}
                  className="mb-2 flex items-center gap-1.5 text-xs font-light tracking-wide transition-colors duration-200"
                  style={{ color: "rgba(255, 255, 255, 0.25)" }}
                >
                  {expandedThinking[message.id] ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                  <span>Thinking</span>
                </button>
              )}

              {/* Thinking content */}
              {message.thinking && expandedThinking[message.id] && (
                <div
                  className="mb-4 p-4 text-sm font-light"
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.04)",
                    borderRadius: "20px",
                    backdropFilter: "blur(20px)",
                    color: "rgba(255, 255, 255, 0.35)",
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
                          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)",
                          borderTop: "1px solid rgba(255, 255, 255, 0.15)",
                          borderLeft: "1px solid rgba(255, 255, 255, 0.10)",
                          borderRight: "1px solid rgba(255, 255, 255, 0.05)",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                          borderRadius: "20px",
                          backdropFilter: "blur(60px) saturate(1.2)",
                          WebkitBackdropFilter: "blur(60px) saturate(1.2)",
                          color: "rgba(255, 255, 255, 0.9)",
                          fontWeight: 300,
                          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.10), 0 4px 20px rgba(0, 0, 0, 0.3)",
                        }
                      : {
                          color: "rgba(255, 255, 255, 0.6)",
                          fontWeight: 300,
                        }
                  }
                  dangerouslySetInnerHTML={{
                    __html: message.content
                      .replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong style="color: rgba(255, 255, 255, 0.9); font-weight: 500">$1</strong>'
                      )
                      .replace(/\n/g, "<br />"),
                  }}
                />
              </div>

              {/* Action Plan — always compact inline, detail lives in panel/dock/split */}
              {message.actionPlan && (
                <div className="mt-5">
                  <ActionCardCompact
                    plan={message.actionPlan}
                    onOpenPanel={onOpenPlanPanel || (() => {})}
                    onApprove={() => onApprove(message.id)}
                    onDecline={() => onDecline(message.id)}
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
                  className="mt-4 flex w-full cursor-pointer items-center gap-3 p-4 transition-all duration-300"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: "20px",
                    backdropFilter: "blur(40px)",
                  }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                    }}
                  >
                    <ArrowUpDown className="h-5 w-5" style={{ color: "rgba(255, 255, 255, 0.4)" }} />
                  </div>
                  <div className="flex-1">
                    <div
                      className="text-sm"
                      style={{ color: "rgba(255, 255, 255, 0.75)", fontWeight: 400 }}
                    >
                      {message.workflow.name}
                    </div>
                    <div
                      className="text-xs font-light"
                      style={{ color: "rgba(255, 255, 255, 0.3)" }}
                    >
                      {message.workflow.description}
                    </div>
                  </div>
                  <button
                    className="flex h-8 w-8 items-center justify-center"
                    style={{
                      background: "rgba(255, 255, 255, 0.04)",
                      borderRadius: "9999px",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" style={{ color: "rgba(255, 255, 255, 0.25)" }} />
                  </button>
                </div>
              )}

              {/* Approval button */}
              {message.requiresApproval && (
                <div className="mt-4">
                  <button
                    onClick={() => onApprove(message.id)}
                    disabled={message.approved}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm transition-all duration-300"
                    style={
                      message.approved
                        ? {
                            background: "rgba(105, 134, 124, 0.2)",
                            border: "1px solid rgba(105, 134, 124, 0.15)",
                            borderRadius: "9999px",
                            color: "rgba(105, 134, 124, 0.9)",
                            fontWeight: 400,
                          }
                        : {
                            background: "rgba(255, 255, 255, 0.9)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "9999px",
                            color: "#060608",
                            fontWeight: 500,
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
            <div className="mb-6 flex items-center gap-2.5">
              <div
                className="h-1.5 w-1.5 animate-pulse rounded-full"
                style={{ background: "rgba(255, 255, 255, 0.4)" }}
              />
              <div
                className="h-1.5 w-1.5 animate-pulse rounded-full [animation-delay:0.2s]"
                style={{ background: "rgba(255, 255, 255, 0.3)" }}
              />
              <div
                className="h-1.5 w-1.5 animate-pulse rounded-full [animation-delay:0.4s]"
                style={{ background: "rgba(255, 255, 255, 0.2)" }}
              />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="relative z-10 px-8 py-5 shrink-0" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
        <div className={cn("mx-auto", showSplitView ? "max-w-none" : "max-w-3xl")}>
          <form onSubmit={handleSubmit}>
            <div
              className="p-3"
              style={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.03) 100%)",
                borderTop: "1px solid rgba(255, 255, 255, 0.14)",
                borderLeft: "1px solid rgba(255, 255, 255, 0.09)",
                borderRight: "1px solid rgba(255, 255, 255, 0.04)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                borderRadius: "24px",
                backdropFilter: "blur(60px) saturate(1.2)",
                WebkitBackdropFilter: "blur(60px) saturate(1.2)",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 8px 32px rgba(0, 0, 0, 0.4)",
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                rows={1}
                className="w-full resize-none bg-transparent text-sm outline-none placeholder:font-light"
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: 300,
                  caretColor: "rgba(255, 255, 255, 0.6)",
                }}
              />
              <div className="mt-2 flex items-center justify-between">
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center transition-colors duration-200"
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    borderRadius: "9999px",
                  }}
                >
                  <Plus className="h-4 w-4" style={{ color: "rgba(255, 255, 255, 0.3)" }} />
                </button>
                <div className="flex items-center gap-1.5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex h-8 items-center gap-1 px-3 text-[10px] font-light tracking-wide transition-colors duration-200"
                        style={{
                          color: "rgba(255, 255, 255, 0.3)",
                          background: "rgba(255, 255, 255, 0.04)",
                          borderRadius: "9999px",
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
                      background: "rgba(255, 255, 255, 0.04)",
                      borderRadius: "9999px",
                    }}
                  >
                    <Mic className="h-4 w-4" style={{ color: "rgba(255, 255, 255, 0.3)" }} />
                  </button>
                  {input.trim() && (
                    <button
                      type="submit"
                      className="flex h-8 w-8 items-center justify-center transition-all duration-300"
                      style={{
                        background: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "9999px",
                      }}
                    >
                      <SendHorizontal className="h-4 w-4" style={{ color: "#060608" }} />
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

  return (
    <div
      className="v5-glass flex h-full flex-1 overflow-hidden"
      style={{
        background: "#060608",
        fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        ...glassVars,
      } as React.CSSProperties}
    >
      <style>{`
        .v5-glass *, .v5-glass *::before, .v5-glass *::after {
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        .v5-glass [class*="rounded-xl"],
        .v5-glass [class*="rounded-lg"] {
          border-radius: 20px !important;
        }
        .v5-glass [class*="rounded-full"] {
          border-radius: 9999px !important;
        }
      `}</style>

      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div style={{
          position: "absolute", top: "20%", right: "25%", width: "400px", height: "400px",
          background: "radial-gradient(circle, rgba(100, 130, 200, 0.05) 0%, transparent 70%)",
          filter: "blur(80px)",
        }} />
        <div style={{
          position: "absolute", bottom: "15%", left: "20%", width: "350px", height: "350px",
          background: "radial-gradient(circle, rgba(140, 100, 170, 0.04) 0%, transparent 70%)",
          filter: "blur(80px)",
        }} />
      </div>

      {/* Chat column */}
      {chatContent}

      {/* Approach C: Split view right pane */}
      {showSplitView && activePlan && onPausePlan && onStopPlan && onResumePlan && (
        <>
          <div
            className="w-px shrink-0 cursor-col-resize relative z-10"
            style={{ background: "rgba(255,255,255,0.06)" }}
            onMouseDown={onSplitDragStart}
          >
            <div className="absolute inset-y-0 -left-1 w-3" />
          </div>
          <div
            className="shrink-0 relative z-10"
            style={{
              width: `${splitWidth}px`,
              borderLeft: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <PlanSplitView
              plan={activePlan}
              onClose={onClosePlanPanel || (() => {})}
              onPause={onPausePlan}
              onStop={onStopPlan}
              onResume={onResumePlan}
            />
          </div>
        </>
      )}
    </div>
  );
}
