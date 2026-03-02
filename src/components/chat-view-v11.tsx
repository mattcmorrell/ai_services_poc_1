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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Client, Message, Artifact } from "@/types/chat";
import {
  MessageList,
  MessageListTheme,
} from "@/components/chat/message-list";

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
  onSubmitClarifyingAnswers?: (
    messageId: string,
    answers: Record<string, string | string[]>
  ) => void;
  isLoading: boolean;
  onApproveGatedStep?: (gateMessageId: string) => void;
  onModifyGatedStep?: (gateMessageId: string) => void;
}

const darkVars: Record<string, string> = {
  "--background": "#0F1724",
  "--foreground": "#F0E8D8",
  "--card": "#151E2E",
  "--card-foreground": "#F0E8D8",
  "--popover": "#1A2436",
  "--popover-foreground": "#F0E8D8",
  "--primary": "#D4764E",
  "--primary-foreground": "#0F1724",
  "--secondary": "#1A2436",
  "--secondary-foreground": "rgba(240, 232, 216, 0.8)",
  "--muted": "#1A2436",
  "--muted-foreground": "rgba(240, 232, 216, 0.55)",
  "--accent": "#1E2940",
  "--accent-foreground": "#F0E8D8",
  "--destructive": "#C25044",
  "--border": "rgba(212, 118, 78, 0.08)",
  "--input": "rgba(212, 118, 78, 0.08)",
  "--ring": "#D4764E",
};

const models = [
  "GPT-4o",
  "GPT-4 Turbo",
  "Claude 3.5 Sonnet",
  "Claude 3 Opus",
  "Gemini 1.5 Pro",
  "Gemini 2.0 Flash",
];

const v11Theme: MessageListTheme = {
  messageSpacing: "mb-8",
  innerContainerClass: "mx-auto max-w-3xl py-8",
  actionPlanVariant: "full",
  actionPlanWrapperClass: "mt-5",

  contentWrapperClass: (role) =>
    role === "user" ? "flex justify-end" : "flex justify-start",

  userBubbleClass: "max-w-[85%] text-sm leading-relaxed px-5 py-3",
  userBubbleStyle: {
    background: "rgba(212, 118, 78, 0.1)",
    border: "1px solid rgba(212, 118, 78, 0.15)",
    borderRadius: "16px",
    color: "#F0E8D8",
    fontWeight: 400,
    fontFamily: "'Satoshi', 'Outfit', sans-serif",
  },

  assistantClass: "max-w-[85%] text-sm leading-relaxed",
  assistantStyle: {
    color: "rgba(240, 232, 216, 0.78)",
    fontWeight: 400,
    fontFamily: "'Satoshi', 'Outfit', sans-serif",
    lineHeight: 1.8,
  },

  contentTransform: (content: string) =>
    content
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong style="color: #D4764E; font-weight: 600">$1</strong>'
      )
      .replace(/\n/g, "<br />"),

  thinkingToggleClass:
    "mb-2 flex items-center gap-1.5 text-xs tracking-wide transition-colors duration-200",
  thinkingToggleStyle: {
    color: "rgba(212, 118, 78, 0.55)",
    fontFamily: "'Satoshi', 'Outfit', sans-serif",
    fontWeight: 400,
  },
  thinkingLabel: (
    <span
      style={{
        fontStyle: "italic",
        fontFamily: "'Newsreader', serif",
      }}
    >
      Reasoning
    </span>
  ),

  thinkingBoxClass: "mb-4 p-4 text-sm",
  thinkingBoxStyle: {
    background: "rgba(212, 118, 78, 0.03)",
    border: "1px solid rgba(212, 118, 78, 0.06)",
    borderRadius: "10px",
    color: "rgba(240, 232, 216, 0.5)",
    fontStyle: "italic",
    fontFamily: "'Newsreader', serif",
    fontWeight: 300,
    lineHeight: 1.75,
  },

  renderLoading: () => (
    <div className="mb-6 flex items-center gap-2.5">
      <div
        className="h-1.5 w-1.5 animate-pulse rounded-full"
        style={{ background: "#D4764E" }}
      />
      <div
        className="h-1.5 w-1.5 animate-pulse rounded-full [animation-delay:0.2s]"
        style={{ background: "rgba(212, 118, 78, 0.6)" }}
      />
      <div
        className="h-1.5 w-1.5 animate-pulse rounded-full [animation-delay:0.4s]"
        style={{ background: "rgba(212, 118, 78, 0.3)" }}
      />
    </div>
  ),

  renderWorkflowCard: (workflow, onClick) => (
    <div
      onClick={onClick}
      className="mt-4 flex w-full cursor-pointer items-center gap-3 p-4 transition-all duration-400"
      style={{
        background: "linear-gradient(165deg, rgba(240, 232, 216, 0.04) 0%, rgba(240, 232, 216, 0.01) 100%)",
        border: "1px solid rgba(212, 118, 78, 0.06)",
        borderTop: "1px solid rgba(240, 232, 216, 0.05)",
        borderRadius: "12px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
      }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center"
        style={{
          background: "rgba(212, 118, 78, 0.08)",
          borderRadius: "8px",
          border: "1px solid rgba(212, 118, 78, 0.08)",
        }}
      >
        <ArrowUpDown className="h-5 w-5" style={{ color: "rgba(212, 118, 78, 0.7)" }} />
      </div>
      <div className="flex-1">
        <div
          className="text-sm"
          style={{ color: "#F0E8D8", fontWeight: 500 }}
        >
          {workflow.name}
        </div>
        <div
          className="text-xs"
          style={{ color: "rgba(240, 232, 216, 0.45)", fontWeight: 400 }}
        >
          {workflow.description}
        </div>
      </div>
      <button
        className="flex h-8 w-8 items-center justify-center"
        style={{
          background: "rgba(240, 232, 216, 0.03)",
          borderRadius: "9999px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <MoreHorizontal className="h-4 w-4" style={{ color: "rgba(240, 232, 216, 0.3)" }} />
      </button>
    </div>
  ),

  renderApprovalButton: (approved, onApprove) => (
    <div className="mt-4">
      <button
        onClick={onApprove}
        disabled={approved}
        className="flex items-center gap-2 px-5 py-2.5 text-sm transition-all duration-400"
        style={
          approved
            ? {
                background: "rgba(212, 118, 78, 0.08)",
                border: "1px solid rgba(212, 118, 78, 0.12)",
                borderRadius: "9999px",
                color: "rgba(212, 118, 78, 0.7)",
                fontWeight: 500,
              }
            : {
                background: "linear-gradient(135deg, #D4764E 0%, #C06842 100%)",
                border: "1px solid rgba(212, 118, 78, 0.3)",
                borderRadius: "9999px",
                color: "#0F1724",
                fontWeight: 600,
                boxShadow: "0 2px 12px rgba(212, 118, 78, 0.25)",
              }
        }
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
      className="v11-chat relative flex h-full flex-1 flex-col overflow-hidden"
      style={{
        background: "#0F1724",
        fontFamily: "'Satoshi', 'Outfit', sans-serif",
        color: "#F0E8D8",
        ...darkVars,
      } as React.CSSProperties}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,300;1,6..72,400;1,6..72,500&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap');

        .v11-chat * {
          border-color: rgba(212, 118, 78, 0.08) !important;
        }
        .v11-chat [class*="rounded-xl"],
        .v11-chat [class*="rounded-lg"] {
          border-radius: 12px !important;
        }
        .v11-chat [class*="rounded-full"] {
          border-radius: 9999px !important;
        }
        .v11-chat input, .v11-chat textarea, .v11-chat select {
          color: #F0E8D8 !important;
          font-family: 'Satoshi', 'Outfit', sans-serif !important;
        }
        .v11-chat input::placeholder, .v11-chat textarea::placeholder {
          color: rgba(240, 232, 216, 0.3) !important;
        }
        .v11-chat button {
          font-family: 'Satoshi', 'Outfit', sans-serif !important;
        }
      `}</style>

      {/* Warm ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "20%",
            width: "30%",
            height: "25%",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(212, 118, 78, 0.025) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Header */}
      <div
        className="relative z-10 flex items-center justify-between px-8 py-5"
        style={{
          borderBottom: "1px solid rgba(212, 118, 78, 0.06)",
          background: "linear-gradient(180deg, rgba(240, 232, 216, 0.02) 0%, transparent 100%)",
        }}
      >
        <div>
          <h1
            className="text-xl"
            style={{
              fontFamily: "'Newsreader', serif",
              color: "#F0E8D8",
              fontWeight: 500,
              letterSpacing: "-0.01em",
            }}
          >
            {chatTitle}
          </h1>
          {client && (
            <p
              className="mt-0.5 text-xs tracking-wide"
              style={{
                fontFamily: "'Satoshi', 'Outfit', sans-serif",
                color: "rgba(212, 118, 78, 0.6)",
                fontWeight: 400,
              }}
            >
              {client.name}
            </p>
          )}
        </div>
        <button
          className="flex h-9 w-9 items-center justify-center transition-colors duration-200"
          style={{
            background: "rgba(240, 232, 216, 0.03)",
            borderRadius: "9999px",
            border: "1px solid rgba(212, 118, 78, 0.06)",
          }}
        >
          <MoreHorizontal className="h-4 w-4" style={{ color: "rgba(240, 232, 216, 0.4)" }} />
        </button>
      </div>

      {/* Messages */}
      <ScrollArea className="relative z-10 flex-1 px-8" ref={scrollRef}>
        <MessageList
          messages={messages}
          artifacts={artifacts}
          selectedArtifactId={selectedArtifactId}
          theme={v11Theme}
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
      <div
        className="relative z-10 px-8 py-5"
        style={{
          borderTop: "1px solid rgba(212, 118, 78, 0.06)",
          background: "linear-gradient(0deg, rgba(15, 23, 36, 0.95) 0%, transparent 100%)",
        }}
      >
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit}>
            <div
              className="p-3"
              style={{
                background: "linear-gradient(165deg, rgba(240, 232, 216, 0.04) 0%, rgba(240, 232, 216, 0.015) 100%)",
                border: "1px solid rgba(212, 118, 78, 0.07)",
                borderTop: "1px solid rgba(240, 232, 216, 0.06)",
                borderRadius: "16px",
                boxShadow: "0 1px 0 0 rgba(240, 232, 216, 0.02) inset, 0 8px 32px rgba(0, 0, 0, 0.2)",
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What would you like to discuss?"
                rows={1}
                className="w-full resize-none bg-transparent text-sm outline-none"
                style={{
                  color: "#F0E8D8",
                  fontWeight: 400,
                  fontFamily: "'Satoshi', 'Outfit', sans-serif",
                  caretColor: "#D4764E",
                }}
              />
              <div className="mt-2 flex items-center justify-between">
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center transition-colors duration-200"
                  style={{
                    background: "rgba(240, 232, 216, 0.03)",
                    borderRadius: "9999px",
                    border: "1px solid rgba(212, 118, 78, 0.05)",
                  }}
                >
                  <Plus className="h-4 w-4" style={{ color: "rgba(240, 232, 216, 0.35)" }} />
                </button>
                <div className="flex items-center gap-1.5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex h-8 items-center gap-1 px-3 text-[10px] tracking-wide transition-colors duration-200"
                        style={{
                          color: "rgba(240, 232, 216, 0.4)",
                          background: "rgba(240, 232, 216, 0.03)",
                          borderRadius: "9999px",
                          fontFamily: "'Satoshi', 'Outfit', sans-serif",
                          fontWeight: 500,
                          border: "1px solid rgba(212, 118, 78, 0.05)",
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
                      background: "rgba(240, 232, 216, 0.03)",
                      borderRadius: "9999px",
                      border: "1px solid rgba(212, 118, 78, 0.05)",
                    }}
                  >
                    <Mic className="h-4 w-4" style={{ color: "rgba(240, 232, 216, 0.35)" }} />
                  </button>
                  {input.trim() && (
                    <button
                      type="submit"
                      className="flex h-8 w-8 items-center justify-center transition-all duration-300"
                      style={{
                        background: "linear-gradient(135deg, #D4764E 0%, #C06842 100%)",
                        borderRadius: "9999px",
                        boxShadow: "0 2px 8px rgba(212, 118, 78, 0.3)",
                      }}
                    >
                      <SendHorizontal className="h-4 w-4" style={{ color: "#0F1724" }} />
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
