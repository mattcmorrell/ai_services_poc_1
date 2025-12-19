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

  return (
    <div className="flex h-full flex-1 flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold">{chatTitle}</h1>
          {client && (
            <p className="text-sm text-muted-foreground">{client.name}</p>
          )}
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-6" ref={scrollRef}>
        <div className="mx-auto max-w-3xl py-6">
          {messages.map((message) => (
            <div key={message.id} className="mb-6">
              {message.role === "assistant" && message.thinking && (
                <button
                  onClick={() => toggleThinking(message.id)}
                  className="mb-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  {expandedThinking[message.id] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  Show thinking
                </button>
              )}

              {message.thinking && expandedThinking[message.id] && (
                <div className="mb-4 rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
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
                    message.role === "user" &&
                      "inline-block rounded-lg bg-primary px-4 py-2 text-primary-foreground"
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

              {/* Standalone workflow card (only if no actionPlan) */}
              {message.workflow && !message.actionPlan && (
                <div
                  onClick={() => onWorkflowClick(message.workflow!.id)}
                  className="mt-4 flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-accent cursor-pointer"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <ArrowUpDown className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{message.workflow.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {message.workflow.description}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
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
                      message.approved &&
                        "bg-green-600 hover:bg-green-600 text-white"
                    )}
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
                  </Button>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="mb-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-2 w-2 animate-pulse rounded-full bg-current" />
                <div className="h-2 w-2 animate-pulse rounded-full bg-current [animation-delay:0.2s]" />
                <div className="h-2 w-2 animate-pulse rounded-full bg-current [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit}>
            <div className="rounded-xl border border-border bg-card p-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                rows={1}
                className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <div className="mt-2 flex items-center justify-between">
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                        {selectedModel}
                        <ChevronDown className="h-3 w-3" />
                      </Button>
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
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
