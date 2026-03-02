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

const v3Theme: MessageListTheme = {
  messageSpacing: "mb-8",
  innerContainerClass: "mx-auto max-w-3xl py-8",
  actionPlanVariant: "full",
  actionPlanWrapperClass: "mt-5",

  contentWrapperClass: (role) =>
    cn(role === "user" && "text-right"),

  userBubbleClass: "inline-block rounded-2xl px-5 py-3",
  userBubbleStyle: {
    background: c.bgUserBubble,
    color: c.textOnAccent,
    fontFamily: c.sans,
    fontSize: "0.9rem",
    lineHeight: 1.6,
    boxShadow: "0 2px 8px rgba(139, 111, 71, 0.15)",
  },

  assistantStyle: {
    fontFamily: c.serif,
    fontSize: "0.95rem",
    lineHeight: 1.8,
    color: c.text,
  },

  contentTransform: (content) =>
    content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br />"),

  thinkingToggleClass: "mb-3 flex items-center gap-1.5 transition-colors",
  thinkingToggleStyle: {
    color: c.textMuted,
    fontFamily: c.sans,
    fontSize: "0.75rem",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
  },
  thinkingLabel: "Reasoning",

  thinkingBoxClass: "mb-4 rounded-xl p-5 text-sm",
  thinkingBoxStyle: {
    background: c.bgCream,
    border: `1px solid ${c.borderLight}`,
    color: c.textSecondary,
    fontFamily: c.sans,
    lineHeight: 1.7,
    fontStyle: "italic",
  },

  artifactWrapperClass: "mt-5 flex flex-wrap gap-3",

  renderLoading: () => (
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
  ),

  renderWorkflowCard: (workflow, onClick) => (
    <div
      onClick={onClick}
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
          {workflow.name}
        </div>
        <div
          style={{
            fontFamily: c.sans,
            fontSize: "0.8rem",
            color: c.textMuted,
            marginTop: "2px",
          }}
        >
          {workflow.description}
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
  ),

  renderApprovalButton: (approved, onApprove) => (
    <div className="mt-5">
      <button
        onClick={onApprove}
        disabled={approved}
        className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all"
        style={{
          background: approved ? "#6B8F71" : c.accent,
          color: c.textOnAccent,
          fontFamily: c.sans,
          opacity: approved ? 0.9 : 1,
          boxShadow: "0 2px 8px rgba(139, 111, 71, 0.2)",
          cursor: approved ? "default" : "pointer",
        }}
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
      className="flex h-full flex-1 flex-col"
      style={{
        background: c.bg,
        color: c.text,
        "--background": "#FAF7F2",
        "--foreground": "#3D3529",
        "--card": "#FFFFFF",
        "--card-foreground": "#3D3529",
        "--popover": "#FFFFFF",
        "--popover-foreground": "#3D3529",
        "--primary": "#8B6F47",
        "--primary-foreground": "#FAF7F2",
        "--secondary": "#F5F0E8",
        "--secondary-foreground": "#3D3529",
        "--muted": "#F0EBE3",
        "--muted-foreground": "#9C9486",
        "--accent": "#F0EBE3",
        "--accent-foreground": "#3D3529",
        "--destructive": "#C45D4A",
        "--border": "#E5DFD5",
        "--input": "#E5DFD5",
        "--ring": "#8B6F47",
      } as React.CSSProperties}
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
        <MessageList
          messages={messages}
          artifacts={artifacts}
          selectedArtifactId={selectedArtifactId}
          theme={v3Theme}
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
