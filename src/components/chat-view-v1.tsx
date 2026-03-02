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
import { MessageList, MessageListTheme } from "@/components/chat/message-list";

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
  onSubmitClarifyingAnswers?: (messageId: string, answers: Record<string, string | string[]>) => void;
  isLoading: boolean;
  onApproveGatedStep?: (gateMessageId: string) => void;
  onModifyGatedStep?: (gateMessageId: string) => void;
}

const models = [
  "GPT-4o",
  "GPT-4 Turbo",
  "Claude 3.5 Sonnet",
  "Claude 3 Opus",
  "Gemini 1.5 Pro",
  "Gemini 2.0 Flash",
];

const v1Theme: MessageListTheme = {
  messageSpacing: "mb-8",
  innerContainerClass: "mx-auto max-w-3xl py-8",
  actionPlanVariant: "full",
  actionPlanWrapperClass: "mt-5",

  contentWrapperClass: (role) =>
    cn("flex", role === "user" ? "justify-end" : "justify-start"),

  userBubbleClass: "max-w-[85%] text-sm leading-relaxed rounded-2xl rounded-br-md px-5 py-3",
  userBubbleStyle: {
    background: "linear-gradient(135deg, oklch(0.22 0.04 65), oklch(0.18 0.02 280))",
    border: "1px solid oklch(0.5 0.1 65 / 0.15)",
    color: "oklch(0.9 0.03 65)",
  },

  assistantClass: "max-w-[85%] text-sm leading-relaxed text-[oklch(0.8_0_0)]",
  assistantStyle: undefined,

  contentTransform: (content) =>
    content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br />"),

  thinkingToggleClass: "mb-2 flex items-center gap-1.5 text-xs transition-colors",
  thinkingToggleStyle: { color: "oklch(0.45 0.06 65)" },
  thinkingLabel: <span className="tracking-wide">Thinking</span>,

  thinkingBoxClass: "mb-4 rounded-xl p-4 text-sm",
  thinkingBoxStyle: {
    background: "oklch(0.12 0.005 280 / 0.5)",
    border: "1px solid oklch(1 0 0 / 0.04)",
    color: "oklch(0.55 0 0)",
  },

  artifactWrapperClass: "mt-4 flex flex-wrap gap-2",

  renderLoading: () => (
    <div className="mb-6 flex items-center gap-2">
      <div className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "oklch(0.6 0.15 65)" }} />
      <div className="h-1.5 w-1.5 animate-pulse rounded-full [animation-delay:0.2s]" style={{ background: "oklch(0.6 0.15 65)" }} />
      <div className="h-1.5 w-1.5 animate-pulse rounded-full [animation-delay:0.4s]" style={{ background: "oklch(0.6 0.15 65)" }} />
    </div>
  ),

  renderWorkflowCard: (workflow, onClick) => (
    <div
      onClick={onClick}
      className="mt-4 flex w-full cursor-pointer items-center gap-3 rounded-xl p-4 transition-all duration-200"
      style={{
        background: "oklch(0.12 0.005 280 / 0.5)",
        border: "1px solid oklch(1 0 0 / 0.06)",
      }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg"
        style={{ background: "oklch(0.18 0.03 65 / 0.5)", border: "1px solid oklch(0.5 0.1 65 / 0.1)" }}
      >
        <ArrowUpDown className="h-5 w-5" style={{ color: "oklch(0.6 0.12 65)" }} />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-[oklch(0.85_0_0)]">{workflow.name}</div>
        <div className="text-xs text-[oklch(0.5_0_0)]">{workflow.description}</div>
      </div>
      <Button variant="ghost" size="icon" className="text-[oklch(0.4_0_0)]" onClick={(e) => e.stopPropagation()}>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
  ),

  renderApprovalButton: (approved, onApprove) => (
    <div className="mt-4">
      <Button
        onClick={onApprove}
        disabled={approved}
        className={cn(
          "gap-2",
          approved && "bg-green-600 hover:bg-green-600 text-white"
        )}
      >
        {approved ? (
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
  onApproveGatedStep,
  onModifyGatedStep,
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
      className="relative flex h-full flex-1 flex-col overflow-hidden"
      style={{ background: "linear-gradient(180deg, oklch(0.10 0.005 280) 0%, oklch(0.07 0 0) 100%)" }}
    >
      {/* Subtle top glow */}
      <div
        className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2"
        style={{
          width: "600px",
          height: "200px",
          background: "radial-gradient(ellipse at center, oklch(0.3 0.1 65 / 0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Header */}
      <div
        className="relative z-10 flex items-center justify-between px-8 py-5"
        style={{ borderBottom: "1px solid oklch(1 0 0 / 0.06)" }}
      >
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[oklch(0.92_0_0)]">{chatTitle}</h1>
          {client && (
            <div className="mt-0.5 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full" style={{ background: "oklch(0.6 0.15 65)" }} />
              <p className="text-xs tracking-wide" style={{ color: "oklch(0.5 0.06 65)" }}>{client.name}</p>
            </div>
          )}
        </div>
        <Button variant="ghost" size="icon" className="text-[oklch(0.5_0_0)] hover:text-[oklch(0.7_0_0)] hover:bg-[oklch(1_0_0_/_0.04)]">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="relative z-10 flex-1 px-8" ref={scrollRef}>
        <MessageList
          messages={messages}
          artifacts={artifacts}
          selectedArtifactId={selectedArtifactId}
          theme={v1Theme}
          onApprove={onApprove}
          onDecline={onDecline}
          onWorkflowClick={onWorkflowClick}
          onArtifactClick={onArtifactClick}
          onSubmitClarifyingAnswers={onSubmitClarifyingAnswers}
          onApproveGatedStep={onApproveGatedStep}
          onModifyGatedStep={onModifyGatedStep}
          isLoading={isLoading}
        />
      </ScrollArea>

      {/* Input */}
      <div className="relative z-10 px-8 py-5" style={{ borderTop: "1px solid oklch(1 0 0 / 0.06)" }}>
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit}>
            <div
              className="relative overflow-hidden rounded-xl p-3"
              style={{
                background: "oklch(0.10 0.005 280 / 0.8)",
                border: "1px solid oklch(1 0 0 / 0.08)",
              }}
            >
              {/* Top accent line on input */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent 20%, oklch(0.5 0.12 65 / 0.3) 50%, transparent 80%)" }}
              />

              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                rows={1}
                className="w-full resize-none bg-transparent text-sm outline-none"
                style={{ color: "oklch(0.8 0 0)" }}
              />
              <div className="mt-2 flex items-center justify-between">
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-[oklch(0.45_0_0)] hover:text-[oklch(0.65_0.08_65)] hover:bg-[oklch(1_0_0_/_0.04)]">
                  <Plus className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1.5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-[10px] tracking-wide text-[oklch(0.45_0_0)] hover:text-[oklch(0.65_0.08_65)] hover:bg-[oklch(1_0_0_/_0.04)]"
                      >
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
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-[oklch(0.45_0_0)] hover:text-[oklch(0.65_0.08_65)] hover:bg-[oklch(1_0_0_/_0.04)]">
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
