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
  onSubmitClarifyingAnswers?: (
    messageId: string,
    answers: Record<string, string | string[]>
  ) => void;
  isLoading: boolean;
}

const lightVars: Record<string, string> = {
  "--background": "#F2F6F3",
  "--foreground": "#2C3E2D",
  "--card": "#FFFFFF",
  "--card-foreground": "#2C3E2D",
  "--popover": "#FFFFFF",
  "--popover-foreground": "#2C3E2D",
  "--primary": "#6B8F72",
  "--primary-foreground": "#FAFCFA",
  "--secondary": "#EDF2EE",
  "--secondary-foreground": "#2C3E2D",
  "--muted": "#E8EFE9",
  "--muted-foreground": "#4A6150",
  "--accent": "#E8EFE9",
  "--accent-foreground": "#2C3E2D",
  "--destructive": "#C4725A",
  "--border": "#D4E0D6",
  "--input": "#D4E0D6",
  "--ring": "#6B8F72",
};

const models = [
  "GPT-4o",
  "GPT-4 Turbo",
  "Claude 3.5 Sonnet",
  "Claude 3 Opus",
  "Gemini 1.5 Pro",
  "Gemini 2.0 Flash",
];

const v7Theme: MessageListTheme = {
  messageSpacing: "mb-8",
  innerContainerClass: "mx-auto max-w-3xl py-8",
  actionPlanVariant: "full",
  actionPlanWrapperClass: "mt-5",

  contentWrapperClass: (role) =>
    cn("flex", role === "user" ? "justify-end" : "justify-start"),

  userBubbleClass: "max-w-[85%] text-sm leading-relaxed px-5 py-3",
  userBubbleStyle: {
    background: "rgba(107, 143, 114, 0.1)",
    border: "1px solid rgba(107, 143, 114, 0.15)",
    borderRadius: "20px",
    color: "#2C3E2D",
    fontWeight: 400,
    fontFamily: "'DM Sans', sans-serif",
  },

  assistantClass: "max-w-[85%] text-sm leading-relaxed",
  assistantStyle: {
    color: "#1E2E1F",
    fontWeight: 400,
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.7,
  },

  contentTransform: (content: string) =>
    content
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong style="color: #1A2A1B; font-weight: 600">$1</strong>'
      )
      .replace(/\n/g, "<br />"),

  thinkingToggleClass:
    "mb-2 flex items-center gap-1.5 text-xs tracking-wide transition-colors duration-200",
  thinkingToggleStyle: {
    color: "#5A7360",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 400,
  },
  thinkingLabel: (
    <span style={{ fontStyle: "italic", fontFamily: "'Crimson Pro', serif" }}>
      Thinking...
    </span>
  ),

  thinkingBoxClass: "mb-4 p-4 text-sm",
  thinkingBoxStyle: {
    background: "rgba(107, 143, 114, 0.04)",
    border: "1px solid rgba(107, 143, 114, 0.1)",
    borderRadius: "18px",
    color: "#3D5340",
    fontStyle: "italic",
    fontFamily: "'Crimson Pro', serif",
    fontWeight: 400,
    lineHeight: 1.7,
  },

  renderLoading: () => (
    <div className="mb-6 flex items-center gap-2.5">
      <div
        className="h-1.5 w-1.5 animate-pulse rounded-full"
        style={{ background: "#6B8F72" }}
      />
      <div
        className="h-1.5 w-1.5 animate-pulse rounded-full [animation-delay:0.2s]"
        style={{ background: "#8BAF92" }}
      />
      <div
        className="h-1.5 w-1.5 animate-pulse rounded-full [animation-delay:0.4s]"
        style={{ background: "#6B8068" }}
      />
    </div>
  ),

  renderWorkflowCard: (workflow, onClick) => (
    <div
      onClick={onClick}
      className="mt-4 flex w-full cursor-pointer items-center gap-3 p-4 transition-all duration-300"
      style={{
        background: "rgba(255, 255, 255, 0.7)",
        border: "1px solid rgba(107, 143, 114, 0.12)",
        borderRadius: "20px",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center"
        style={{
          background: "rgba(107, 143, 114, 0.08)",
          borderRadius: "12px",
          border: "1px solid rgba(107, 143, 114, 0.1)",
        }}
      >
        <ArrowUpDown className="h-5 w-5" style={{ color: "#6B8F72" }} />
      </div>
      <div className="flex-1">
        <div className="text-sm" style={{ color: "#2C3E2D", fontWeight: 500 }}>
          {workflow.name}
        </div>
        <div className="text-xs" style={{ color: "#5A7360", fontWeight: 400 }}>
          {workflow.description}
        </div>
      </div>
      <button
        className="flex h-8 w-8 items-center justify-center"
        style={{
          background: "rgba(107, 143, 114, 0.06)",
          borderRadius: "9999px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <MoreHorizontal
          className="h-4 w-4"
          style={{ color: "#6B8068" }}
        />
      </button>
    </div>
  ),

  renderApprovalButton: (approved, onApprove) => (
    <div className="mt-4">
      <button
        onClick={onApprove}
        disabled={approved}
        className="flex items-center gap-2 px-5 py-2.5 text-sm transition-all duration-300"
        style={
          approved
            ? {
                background: "rgba(107, 143, 114, 0.1)",
                border: "1px solid rgba(107, 143, 114, 0.15)",
                borderRadius: "9999px",
                color: "#6B8F72",
                fontWeight: 500,
              }
            : {
                background: "#6B8F72",
                border: "1px solid #5A7D61",
                borderRadius: "9999px",
                color: "#FAFCFA",
                fontWeight: 500,
                boxShadow: "0 2px 8px rgba(107, 143, 114, 0.25)",
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
      className="v7-chat relative flex h-full flex-1 flex-col overflow-hidden"
      style={{
        background: "#F2F6F3",
        fontFamily: "'DM Sans', sans-serif",
        color: "#2C3E2D",
        ...lightVars,
      } as React.CSSProperties}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

        @keyframes v7-leaf-drift {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.04; }
          50% { transform: translateY(-8px) rotate(3deg); opacity: 0.06; }
        }

        .v7-chat * {
          border-color: #D4E0D6 !important;
        }
        .v7-chat [class*="rounded-xl"],
        .v7-chat [class*="rounded-lg"] {
          border-radius: 22px !important;
        }
        .v7-chat [class*="rounded-full"] {
          border-radius: 9999px !important;
        }
        .v7-chat input, .v7-chat textarea, .v7-chat select {
          color: #2C3E2D !important;
          font-family: 'DM Sans', sans-serif !important;
        }
        .v7-chat input::placeholder, .v7-chat textarea::placeholder {
          color: #6B8068 !important;
        }
        .v7-chat button {
          font-family: 'DM Sans', sans-serif !important;
        }
      `}</style>

      {/* Soft organic background shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          style={{
            position: "absolute", top: "10%", right: "-5%",
            width: "40%", height: "35%",
            borderRadius: "45% 55% 50% 50% / 50% 45% 55% 50%",
            background: "radial-gradient(ellipse, rgba(107, 143, 114, 0.06) 0%, transparent 70%)",
            animation: "v7-leaf-drift 20s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: "5%", left: "10%",
            width: "35%", height: "30%",
            borderRadius: "50% 50% 45% 55% / 55% 50% 50% 45%",
            background: "radial-gradient(ellipse, rgba(196, 178, 140, 0.05) 0%, transparent 70%)",
            animation: "v7-leaf-drift 28s ease-in-out infinite 5s",
          }}
        />
      </div>

      {/* Header */}
      <div
        className="relative z-10 flex items-center justify-between px-8 py-5"
        style={{ borderBottom: "1px solid rgba(107, 143, 114, 0.12)" }}
      >
        <div>
          <h1
            className="text-xl tracking-tight"
            style={{
              fontFamily: "'Crimson Pro', serif",
              color: "#2C3E2D",
              fontWeight: 500,
            }}
          >
            {chatTitle}
          </h1>
          {client && (
            <p
              className="mt-0.5 text-xs tracking-wide"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "#5A7360",
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
            background: "rgba(107, 143, 114, 0.06)",
            borderRadius: "9999px",
            border: "1px solid rgba(107, 143, 114, 0.1)",
          }}
        >
          <MoreHorizontal className="h-4 w-4" style={{ color: "#5A7360" }} />
        </button>
      </div>

      {/* Messages */}
      <ScrollArea className="relative z-10 flex-1 px-8" ref={scrollRef}>
        <MessageList
          messages={messages}
          artifacts={artifacts}
          selectedArtifactId={selectedArtifactId}
          theme={v7Theme}
          onApprove={onApprove}
          onDecline={onDecline}
          onWorkflowClick={onWorkflowClick}
          onArtifactClick={onArtifactClick}
          onSubmitClarifyingAnswers={onSubmitClarifyingAnswers}
          isLoading={isLoading}
        />
      </ScrollArea>

      {/* Input */}
      <div className="relative z-10 px-8 py-5" style={{ borderTop: "1px solid rgba(107, 143, 114, 0.12)" }}>
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit}>
            <div
              className="p-3"
              style={{
                background: "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderRadius: "24px",
                border: "1px solid rgba(180, 200, 185, 0.3)",
                boxShadow: "0 4px 20px rgba(107, 143, 114, 0.06)",
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What would you like to explore?"
                rows={1}
                className="w-full resize-none bg-transparent text-sm outline-none"
                style={{
                  color: "#2C3E2D",
                  fontWeight: 400,
                  fontFamily: "'DM Sans', sans-serif",
                  caretColor: "#6B8F72",
                }}
              />
              <div className="mt-2 flex items-center justify-between">
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center transition-colors duration-200"
                  style={{
                    background: "rgba(107, 143, 114, 0.06)",
                    borderRadius: "9999px",
                  }}
                >
                  <Plus className="h-4 w-4" style={{ color: "#5A7360" }} />
                </button>
                <div className="flex items-center gap-1.5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex h-8 items-center gap-1 px-3 text-[10px] tracking-wide transition-colors duration-200"
                        style={{
                          color: "#5A7360",
                          background: "rgba(107, 143, 114, 0.06)",
                          borderRadius: "9999px",
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 500,
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
                      background: "rgba(107, 143, 114, 0.06)",
                      borderRadius: "9999px",
                    }}
                  >
                    <Mic className="h-4 w-4" style={{ color: "#5A7360" }} />
                  </button>
                  {input.trim() && (
                    <button
                      type="submit"
                      className="flex h-8 w-8 items-center justify-center transition-all duration-300"
                      style={{
                        background: "#6B8F72",
                        borderRadius: "9999px",
                        boxShadow: "0 2px 8px rgba(107, 143, 114, 0.3)",
                      }}
                    >
                      <SendHorizontal className="h-4 w-4" style={{ color: "#FAFCFA" }} />
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
