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
  onApproveGatedStep?: (gateMessageId: string) => void;
  onModifyGatedStep?: (gateMessageId: string) => void;
}

const darkVars: Record<string, string> = {
  "--background": "#0E0E11",
  "--foreground": "rgba(255, 255, 255, 0.88)",
  "--card": "#161619",
  "--card-foreground": "rgba(255, 255, 255, 0.88)",
  "--popover": "#1A1A1E",
  "--popover-foreground": "rgba(255, 255, 255, 0.88)",
  "--primary": "#C9A96E",
  "--primary-foreground": "#0E0E11",
  "--secondary": "#1C1C20",
  "--secondary-foreground": "rgba(255, 255, 255, 0.75)",
  "--muted": "#1C1C20",
  "--muted-foreground": "rgba(255, 255, 255, 0.55)",
  "--accent": "#1E1E22",
  "--accent-foreground": "rgba(255, 255, 255, 0.88)",
  "--destructive": "#B35044",
  "--border": "rgba(201, 169, 110, 0.08)",
  "--input": "rgba(201, 169, 110, 0.08)",
  "--ring": "#C9A96E",
};

const models = [
  "GPT-4o",
  "GPT-4 Turbo",
  "Claude 3.5 Sonnet",
  "Claude 3 Opus",
  "Gemini 1.5 Pro",
  "Gemini 2.0 Flash",
];

const v8Theme: MessageListTheme = {
  messageSpacing: "mb-8",
  innerContainerClass: "mx-auto max-w-3xl py-8",
  actionPlanVariant: "full",
  actionPlanWrapperClass: "mt-5",

  contentWrapperClass: (role) =>
    cn("flex", role === "user" ? "justify-end" : "justify-start"),

  userBubbleClass: "max-w-[85%] text-sm leading-relaxed px-5 py-3",
  userBubbleStyle: {
    background:
      "linear-gradient(135deg, rgba(201, 169, 110, 0.1) 0%, rgba(201, 169, 110, 0.04) 100%)",
    border: "1px solid rgba(201, 169, 110, 0.12)",
    borderRadius: "18px",
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: 400,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
  },

  assistantClass: "max-w-[85%] text-sm leading-relaxed",
  assistantStyle: {
    color: "rgba(255, 255, 255, 0.78)",
    fontWeight: 400,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    lineHeight: 1.75,
  },

  contentTransform: (content: string) =>
    content
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong style="color: rgba(201, 169, 110, 0.85); font-weight: 600">$1</strong>'
      )
      .replace(/\n/g, "<br />"),

  thinkingToggleClass:
    "mb-2 flex items-center gap-1.5 text-xs tracking-wide transition-colors duration-200",
  thinkingToggleStyle: {
    color: "rgba(201, 169, 110, 0.5)",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 400,
  },
  thinkingLabel: (
    <span
      style={{
        fontStyle: "italic",
        fontFamily: "'Playfair Display', serif",
        letterSpacing: "0.02em",
      }}
    >
      Reasoning
    </span>
  ),

  thinkingBoxClass: "mb-4 p-4 text-sm",
  thinkingBoxStyle: {
    background: "rgba(201, 169, 110, 0.03)",
    border: "1px solid rgba(201, 169, 110, 0.06)",
    borderRadius: "14px",
    color: "rgba(255, 255, 255, 0.5)",
    fontStyle: "italic",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 300,
    lineHeight: 1.7,
  },

  renderLoading: () => (
    <div className="mb-6 flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        <div
          className="h-1.5 w-1.5 animate-pulse rounded-full"
          style={{ background: "#C9A96E" }}
        />
        <div
          className="h-1.5 w-1.5 animate-pulse rounded-full [animation-delay:0.2s]"
          style={{ background: "rgba(201, 169, 110, 0.6)" }}
        />
        <div
          className="h-1.5 w-1.5 animate-pulse rounded-full [animation-delay:0.4s]"
          style={{ background: "rgba(201, 169, 110, 0.3)" }}
        />
      </div>
    </div>
  ),

  renderWorkflowCard: (workflow, onClick) => (
    <div
      onClick={onClick}
      className="mt-4 flex w-full cursor-pointer items-center gap-3 p-4 transition-all duration-400"
      style={{
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)",
        border: "1px solid rgba(201, 169, 110, 0.06)",
        borderRadius: "14px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center"
        style={{
          background: "rgba(201, 169, 110, 0.06)",
          borderRadius: "10px",
          border: "1px solid rgba(201, 169, 110, 0.08)",
        }}
      >
        <ArrowUpDown
          className="h-5 w-5"
          style={{ color: "rgba(201, 169, 110, 0.6)" }}
        />
      </div>
      <div className="flex-1">
        <div
          className="text-sm"
          style={{ color: "rgba(255, 255, 255, 0.85)", fontWeight: 500 }}
        >
          {workflow.name}
        </div>
        <div
          className="text-xs"
          style={{ color: "rgba(255, 255, 255, 0.4)", fontWeight: 400 }}
        >
          {workflow.description}
        </div>
      </div>
      <button
        className="flex h-8 w-8 items-center justify-center"
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          borderRadius: "9999px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <MoreHorizontal
          className="h-4 w-4"
          style={{ color: "rgba(255, 255, 255, 0.3)" }}
        />
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
                background: "rgba(201, 169, 110, 0.08)",
                border: "1px solid rgba(201, 169, 110, 0.12)",
                borderRadius: "9999px",
                color: "rgba(201, 169, 110, 0.7)",
                fontWeight: 500,
              }
            : {
                background:
                  "linear-gradient(135deg, #C9A96E 0%, #B8964F 100%)",
                border: "1px solid rgba(201, 169, 110, 0.3)",
                borderRadius: "9999px",
                color: "#0E0E11",
                fontWeight: 600,
                boxShadow: "0 2px 12px rgba(201, 169, 110, 0.2)",
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
      className="v8-chat relative flex h-full flex-1 flex-col overflow-hidden"
      style={{
        background: "#0E0E11",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: "rgba(255, 255, 255, 0.88)",
        ...darkVars,
      } as React.CSSProperties}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap');

        @keyframes v8-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes v8-shimmer-line {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .v8-chat * {
          border-color: rgba(201, 169, 110, 0.08) !important;
        }
        .v8-chat [class*="rounded-xl"],
        .v8-chat [class*="rounded-lg"] {
          border-radius: 14px !important;
        }
        .v8-chat [class*="rounded-full"] {
          border-radius: 9999px !important;
        }
        .v8-chat input, .v8-chat textarea, .v8-chat select {
          color: rgba(255, 255, 255, 0.88) !important;
          font-family: 'Plus Jakarta Sans', sans-serif !important;
        }
        .v8-chat input::placeholder, .v8-chat textarea::placeholder {
          color: rgba(255, 255, 255, 0.3) !important;
        }
        .v8-chat button {
          font-family: 'Plus Jakarta Sans', sans-serif !important;
        }
      `}</style>

      {/* Subtle warm glow top-right */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          style={{
            position: "absolute",
            top: "5%",
            right: "15%",
            width: "35%",
            height: "30%",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(201, 169, 110, 0.025) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Header */}
      <div
        className="relative z-10 flex items-center justify-between px-8 py-5"
        style={{
          borderBottom: "1px solid rgba(201, 169, 110, 0.06)",
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, transparent 100%)",
        }}
      >
        <div>
          <h1
            className="text-xl tracking-tight"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "rgba(255, 255, 255, 0.92)",
              fontWeight: 500,
            }}
          >
            {chatTitle}
          </h1>
          {client && (
            <p
              className="mt-0.5 text-xs tracking-wide"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: "rgba(201, 169, 110, 0.5)",
                fontWeight: 400,
                letterSpacing: "0.05em",
              }}
            >
              {client.name}
            </p>
          )}
        </div>
        <button
          className="flex h-9 w-9 items-center justify-center transition-colors duration-200"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            borderRadius: "9999px",
            border: "1px solid rgba(201, 169, 110, 0.06)",
          }}
        >
          <MoreHorizontal
            className="h-4 w-4"
            style={{ color: "rgba(255, 255, 255, 0.4)" }}
          />
        </button>
      </div>

      {/* Messages */}
      <ScrollArea className="relative z-10 flex-1 px-8" ref={scrollRef}>
        <MessageList
          messages={messages}
          artifacts={artifacts}
          selectedArtifactId={selectedArtifactId}
          theme={v8Theme}
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
          borderTop: "1px solid rgba(201, 169, 110, 0.06)",
          background:
            "linear-gradient(0deg, rgba(14, 14, 17, 0.95) 0%, transparent 100%)",
        }}
      >
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit}>
            <div
              className="p-3"
              style={{
                background:
                  "linear-gradient(165deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.015) 100%)",
                border: "1px solid rgba(201, 169, 110, 0.07)",
                borderRadius: "20px",
                boxShadow:
                  "0 1px 0 0 rgba(255, 255, 255, 0.02) inset, 0 8px 32px rgba(0, 0, 0, 0.3)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="How can I help?"
                rows={1}
                className="w-full resize-none bg-transparent text-sm outline-none"
                style={{
                  color: "rgba(255, 255, 255, 0.85)",
                  fontWeight: 400,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  caretColor: "#C9A96E",
                }}
              />
              <div className="mt-2 flex items-center justify-between">
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center transition-colors duration-200"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    borderRadius: "9999px",
                    border: "1px solid rgba(201, 169, 110, 0.05)",
                  }}
                >
                  <Plus
                    className="h-4 w-4"
                    style={{ color: "rgba(255, 255, 255, 0.35)" }}
                  />
                </button>
                <div className="flex items-center gap-1.5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex h-8 items-center gap-1 px-3 text-[10px] tracking-wide transition-colors duration-200"
                        style={{
                          color: "rgba(255, 255, 255, 0.4)",
                          background: "rgba(255, 255, 255, 0.03)",
                          borderRadius: "9999px",
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontWeight: 500,
                          border: "1px solid rgba(201, 169, 110, 0.05)",
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
                      background: "rgba(255, 255, 255, 0.03)",
                      borderRadius: "9999px",
                      border: "1px solid rgba(201, 169, 110, 0.05)",
                    }}
                  >
                    <Mic
                      className="h-4 w-4"
                      style={{ color: "rgba(255, 255, 255, 0.35)" }}
                    />
                  </button>
                  {input.trim() && (
                    <button
                      type="submit"
                      className="flex h-8 w-8 items-center justify-center transition-all duration-300"
                      style={{
                        background:
                          "linear-gradient(135deg, #C9A96E 0%, #B8964F 100%)",
                        borderRadius: "9999px",
                        boxShadow: "0 2px 8px rgba(201, 169, 110, 0.25)",
                      }}
                    >
                      <SendHorizontal
                        className="h-4 w-4"
                        style={{ color: "#0E0E11" }}
                      />
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
