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

// Mercury Dark Palette
const mercury = {
  bg: "#101214",
  card: "#222428",
  innerSurface: "#222428",
  accent: "#6878B8",
  accentBright: "#8E9AD0",
  alert: "#E08850",
  textBright: "#E8E9ED",
  textPrimary: "#E8E9ED",
  textSecondary: "#9DA0A8",
  success: "#7BAA82",
  danger: "#C07070",
  border: "rgba(180,185,200,0.07)",
};

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

const v15Theme: MessageListTheme = {
  messageSpacing: "mb-8",
  innerContainerClass: "mx-auto max-w-3xl py-8",
  actionPlanVariant: "full",
  actionPlanWrapperClass: "mt-5",

  contentWrapperClass: (role) =>
    cn("flex", role === "user" ? "justify-end" : "justify-start"),

  userBubbleClass: "max-w-[85%] text-sm leading-relaxed rounded-2xl rounded-br-md px-5 py-3",
  userBubbleStyle: {
    background: "rgba(104, 120, 184, 0.12)",
    border: `1px solid rgba(104, 120, 184, 0.15)`,
    color: mercury.textBright,
  },

  assistantClass: "max-w-[85%] text-sm leading-relaxed",
  assistantStyle: { color: mercury.textPrimary },

  contentTransform: (content) =>
    content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br />"),

  thinkingToggleClass: "mb-2 flex items-center gap-1.5 text-xs transition-colors",
  thinkingToggleStyle: { color: mercury.accent },
  thinkingLabel: <span className="tracking-wide">Thinking</span>,

  thinkingBoxClass: "mb-4 rounded-xl p-4 text-sm",
  thinkingBoxStyle: {
    background: mercury.innerSurface,
    border: `1px solid ${mercury.border}`,
    fontFamily: "'Geist Mono', monospace",
    color: mercury.textPrimary,
  },

  artifactWrapperClass: "mt-4 flex flex-wrap gap-2",

  renderLoading: () => (
    <div className="mb-6 flex items-center gap-2">
      <div className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: mercury.accent }} />
      <div className="h-1.5 w-1.5 animate-pulse rounded-full [animation-delay:0.2s]" style={{ background: mercury.accent }} />
      <div className="h-1.5 w-1.5 animate-pulse rounded-full [animation-delay:0.4s]" style={{ background: mercury.accent }} />
    </div>
  ),

  renderWorkflowCard: (workflow, onClick) => (
    <div
      onClick={onClick}
      className="mt-4 flex w-full cursor-pointer items-center gap-3 rounded-xl p-4 transition-all duration-200"
      style={{
        background: mercury.innerSurface,
        border: `1px solid ${mercury.border}`,
      }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg"
        style={{ background: "rgba(104, 120, 184, 0.1)", border: "1px solid rgba(104, 120, 184, 0.12)" }}
      >
        <ArrowUpDown className="h-5 w-5" style={{ color: mercury.accent }} />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium" style={{ color: mercury.textBright }}>{workflow.name}</div>
        <div className="text-xs" style={{ color: mercury.textSecondary }}>{workflow.description}</div>
      </div>
      <Button variant="ghost" size="icon" style={{ color: mercury.textSecondary }} onClick={(e) => e.stopPropagation()}>
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
          approved && "text-white"
        )}
        style={approved ? { background: mercury.success } : undefined}
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
      style={{ background: mercury.bg }}
    >
      {/* Header */}
      <div
        className="relative z-10 flex items-center justify-between px-8 py-5"
        style={{ borderBottom: `1px solid ${mercury.border}` }}
      >
        <div>
          <h1
            className="text-xl font-semibold tracking-tight"
            style={{ color: mercury.textBright, fontFamily: "'Geist Sans', sans-serif" }}
          >
            {chatTitle}
          </h1>
          {client && (
            <div className="mt-0.5 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full" style={{ background: mercury.accent }} />
              <p className="text-xs tracking-wide" style={{ color: mercury.textSecondary }}>{client.name}</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-transparent"
          style={{ color: mercury.textSecondary }}
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="relative z-10 flex-1 px-8" ref={scrollRef}>
        <MessageList
          messages={messages}
          artifacts={artifacts}
          selectedArtifactId={selectedArtifactId}
          theme={v15Theme}
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
      <div className="relative z-10 px-8 py-5" style={{ borderTop: `1px solid ${mercury.border}` }}>
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit}>
            <div
              className="relative overflow-hidden rounded-xl p-3"
              style={{
                background: mercury.card,
                border: `1px solid ${mercury.border}`,
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                rows={1}
                className="w-full resize-none bg-transparent text-sm outline-none"
                style={{ color: mercury.textPrimary }}
              />
              <div className="mt-2 flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-transparent"
                  style={{ color: mercury.textSecondary }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1.5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-[11px] tracking-wide hover:bg-transparent"
                        style={{ color: mercury.textSecondary }}
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-transparent"
                    style={{ color: mercury.textSecondary }}
                  >
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
