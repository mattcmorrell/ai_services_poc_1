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

  const monoFont = "'JetBrains Mono', 'Fira Code', 'Courier New', monospace";

  return (
    <div
      className="flex h-full flex-1 flex-col"
      style={{
        background: "#0a0a0a",
        fontFamily: monoFont,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between border-b-2 px-6 py-3"
        style={{ borderColor: "#333", background: "#111" }}
      >
        <div>
          <div className="flex items-center gap-3">
            <span
              className="inline-block h-2 w-2"
              style={{ background: "#ff3b00" }}
            />
            <h1
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: "#fff" }}
            >
              {chatTitle}
            </h1>
          </div>
          {client && (
            <p
              className="ml-5 text-xs uppercase tracking-wider"
              style={{ color: "#666" }}
            >
              CLIENT: {client.name}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs uppercase tracking-wider"
            style={{ color: "#444" }}
          >
            MSG:{messages.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            style={{ color: "#666" }}
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-6" ref={scrollRef}>
        <div className="mx-auto max-w-3xl py-6">
          {messages.map((message, idx) => (
            <div key={message.id} className="mb-6">
              {/* Message index label */}
              <div
                className="mb-1 text-xs uppercase tracking-wider"
                style={{ color: "#333", fontSize: "10px" }}
              >
                {message.role === "user" ? "USR" : "SYS"}::
                {String(idx).padStart(3, "0")}
              </div>

              {/* Thinking toggle */}
              {message.role === "assistant" && message.thinking && (
                <button
                  onClick={() => toggleThinking(message.id)}
                  className="mb-2 flex items-center gap-1 text-xs uppercase tracking-wider"
                  style={{ color: "#666" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#ff3b00")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#666")
                  }
                >
                  {expandedThinking[message.id] ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                  [SHOW REASONING]
                </button>
              )}

              {/* Thinking content */}
              {message.thinking && expandedThinking[message.id] && (
                <div
                  className="mb-4 border-l-2 p-4 text-xs leading-relaxed"
                  style={{
                    borderColor: "#333",
                    background: "#0d0d0d",
                    color: "#666",
                  }}
                >
                  {message.thinking}
                </div>
              )}

              {/* Message content */}
              <div
                className={cn(
                  message.role === "user" && "text-right"
                )}
              >
                <div
                  className={cn(
                    "text-sm leading-relaxed",
                    message.role === "user" && "inline-block border-2 px-4 py-2"
                  )}
                  style={
                    message.role === "user"
                      ? {
                          borderColor: "#ff3b00",
                          background: "#1a0500",
                          color: "#ff8866",
                        }
                      : {
                          color: "#ccc",
                        }
                  }
                  dangerouslySetInnerHTML={{
                    __html: message.content
                      .replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong style="color:#fff;font-weight:700">$1</strong>'
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
                  className="mt-4 flex w-full cursor-pointer items-center gap-3 border-2 p-3 transition-none"
                  style={{
                    borderColor: "#333",
                    background: "#111",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "#ff3b00")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "#333")
                  }
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center"
                    style={{ background: "#1a1a1a", border: "1px solid #333" }}
                  >
                    <ArrowUpDown className="h-5 w-5" style={{ color: "#ff3b00" }} />
                  </div>
                  <div className="flex-1">
                    <div
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: "#fff" }}
                    >
                      {message.workflow.name}
                    </div>
                    <div
                      className="text-xs uppercase tracking-wide"
                      style={{ color: "#666" }}
                    >
                      {message.workflow.description}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => e.stopPropagation()}
                    style={{ color: "#666" }}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Approval button */}
              {message.requiresApproval && (
                <div className="mt-4">
                  <button
                    onClick={() => onApprove(message.id)}
                    disabled={message.approved}
                    className="flex items-center gap-2 border-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-none"
                    style={
                      message.approved
                        ? {
                            borderColor: "#00ff41",
                            background: "#001a0a",
                            color: "#00ff41",
                            cursor: "default",
                          }
                        : {
                            borderColor: "#ff3b00",
                            background: "transparent",
                            color: "#ff3b00",
                            cursor: "pointer",
                          }
                    }
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
                  </button>
                </div>
              )}

              {/* Separator line */}
              <div
                className="mt-4 h-px"
                style={{
                  background:
                    "repeating-linear-gradient(90deg, #1a1a1a 0, #1a1a1a 4px, transparent 4px, transparent 8px)",
                }}
              />
            </div>
          ))}

          {/* Loading indicator - blinking cursor style */}
          {isLoading && (
            <div className="mb-6">
              <div
                className="mb-1 text-xs uppercase tracking-wider"
                style={{ color: "#333", fontSize: "10px" }}
              >
                SYS::PROCESSING
              </div>
              <div className="flex items-center gap-1">
                <span
                  className="inline-block h-4 w-2 animate-pulse"
                  style={{ background: "#ff3b00" }}
                />
                <span
                  className="text-xs uppercase tracking-wider"
                  style={{ color: "#555" }}
                >
                  GENERATING RESPONSE...
                </span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input area */}
      <div
        className="border-t-2 p-4"
        style={{ borderColor: "#333", background: "#0d0d0d" }}
      >
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit}>
            <div
              className="border-2 p-3"
              style={{ borderColor: "#333", background: "#111" }}
            >
              {/* Command line prefix */}
              <div className="flex items-start gap-2">
                <span
                  className="mt-0.5 flex-shrink-0 text-sm font-bold"
                  style={{ color: "#ff3b00" }}
                >
                  &gt;
                </span>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="ENTER COMMAND..."
                  rows={1}
                  className="w-full resize-none bg-transparent text-sm outline-none"
                  style={{
                    color: "#ccc",
                    fontFamily: monoFont,
                    caretColor: "#ff3b00",
                  }}
                />
              </div>
              <div
                className="mt-2 flex items-center justify-between border-t pt-2"
                style={{ borderColor: "#222" }}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  style={{ color: "#555" }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="flex h-7 items-center gap-1 border px-2 text-xs font-bold uppercase tracking-wider"
                        style={{
                          borderColor: "#333",
                          background: "#0a0a0a",
                          color: "#666",
                        }}
                      >
                        {selectedModel}
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      style={{
                        background: "#111",
                        borderColor: "#333",
                        fontFamily: monoFont,
                      }}
                    >
                      {models.map((model) => (
                        <DropdownMenuItem
                          key={model}
                          onClick={() => setSelectedModel(model)}
                          className="text-xs uppercase tracking-wider"
                          style={{ color: "#aaa" }}
                        >
                          {model}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    style={{ color: "#555" }}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="h-7 border-2 px-3 text-xs font-bold uppercase tracking-wider transition-none disabled:opacity-30"
                    style={{
                      borderColor: "#ff3b00",
                      background: input.trim() ? "#ff3b00" : "transparent",
                      color: input.trim() ? "#000" : "#ff3b00",
                    }}
                  >
                    SEND
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
