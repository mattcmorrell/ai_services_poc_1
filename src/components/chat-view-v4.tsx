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
}

const font = "'Helvetica Neue', Helvetica, Arial, sans-serif";

const lightVars: Record<string, string> = {
  "--background": "#FFFFFF",
  "--foreground": "#000000",
  "--card": "#FFFFFF",
  "--card-foreground": "#000000",
  "--popover": "#FFFFFF",
  "--popover-foreground": "#000000",
  "--primary": "#FF0000",
  "--primary-foreground": "#FFFFFF",
  "--secondary": "#F5F5F5",
  "--secondary-foreground": "#000000",
  "--muted": "#F5F5F5",
  "--muted-foreground": "#666666",
  "--accent": "#F5F5F5",
  "--accent-foreground": "#000000",
  "--destructive": "#FF0000",
  "--border": "#000000",
  "--input": "#E5E5E5",
  "--ring": "#FF0000",
};

const models = [
  "GPT-4o",
  "GPT-4 Turbo",
  "Claude 3.5 Sonnet",
  "Claude 3 Opus",
  "Gemini 1.5 Pro",
  "Gemini 2.0 Flash",
];

const v4Theme: MessageListTheme = {
  messageSpacing: "mb-8",
  innerContainerClass: "mx-auto max-w-3xl py-8",
  actionPlanVariant: "full",
  actionPlanWrapperClass: "mt-5",

  contentWrapperClass: (role) =>
    cn(role === "user" && "text-right"),

  userBubbleClass: "inline-block px-6 py-4",
  userBubbleStyle: {
    background: "#FF0000",
    color: "#FFFFFF",
    fontFamily: font,
    fontSize: "0.9rem",
    lineHeight: 1.6,
    fontWeight: 500,
    borderRadius: 0,
  },

  assistantStyle: {
    fontFamily: font,
    fontSize: "0.95rem",
    lineHeight: 1.8,
    color: "#000000",
    fontWeight: 300,
  },

  contentTransform: (content) =>
    content
      .replace(/\*\*(.*?)\*\*/g, "<strong style='font-weight:900'>$1</strong>")
      .replace(/\n/g, "<br />"),

  thinkingToggleClass: "mb-3 flex items-center gap-1.5 transition-colors",
  thinkingToggleStyle: {
    color: "#666666",
    fontFamily: font,
    fontSize: "0.55rem",
    letterSpacing: "0.3em",
    textTransform: "uppercase" as const,
    fontWeight: 700,
  },
  thinkingLabel: "REASONING",

  thinkingBoxClass: "mb-4 p-5 text-sm",
  thinkingBoxStyle: {
    background: "#F5F5F5",
    border: "1px solid #000000",
    color: "#666666",
    fontFamily: font,
    lineHeight: 1.7,
    fontSize: "0.8rem",
    borderRadius: 0,
  },

  artifactWrapperClass: "mt-5 flex flex-wrap gap-3",

  renderMessageSuffix: (message, index, total) => {
    if (index < total - 1 && message.role === "assistant") {
      return (
        <div
          style={{
            height: "1px",
            background: "#E5E5E5",
            marginTop: "24px",
          }}
        />
      );
    }
    return null;
  },

  renderLoading: () => (
    <div className="mb-8 flex items-center gap-3">
      <div
        className="h-3 w-3 animate-pulse"
        style={{ background: "#FF0000", borderRadius: 0 }}
      />
      <span
        style={{
          fontFamily: font,
          fontSize: "0.6rem",
          color: "#666666",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          fontWeight: 500,
        }}
      >
        PROCESSING
      </span>
    </div>
  ),

  renderWorkflowCard: (workflow, onClick) => (
    <div
      onClick={onClick}
      className="mt-5 flex w-full items-center gap-4 p-4 cursor-pointer transition-all"
      style={{
        background: "#FFFFFF",
        border: "2px solid #000000",
        borderRadius: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#F5F5F5";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#FFFFFF";
      }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center"
        style={{
          background: "#FF0000",
          color: "#FFFFFF",
          borderRadius: 0,
        }}
      >
        <ArrowUpDown className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div
          style={{
            fontFamily: font,
            fontWeight: 900,
            color: "#000000",
            fontSize: "0.85rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {workflow.name}
        </div>
        <div
          style={{
            fontFamily: font,
            fontSize: "0.75rem",
            color: "#666666",
            marginTop: "2px",
            fontWeight: 300,
          }}
        >
          {workflow.description}
        </div>
      </div>
      <button
        className="p-2 transition-colors"
        style={{ color: "#000000", borderRadius: 0 }}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F5")}
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
        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all"
        style={{
          background: approved ? "#000000" : "#FF0000",
          color: "#FFFFFF",
          fontFamily: font,
          fontSize: "0.65rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          borderRadius: 0,
          cursor: approved ? "default" : "pointer",
          border: "none",
        }}
      >
        {approved ? (
          <>
            <Check className="h-4 w-4" />
            APPROVED
          </>
        ) : (
          <>
            <ThumbsUp className="h-4 w-4" />
            APPROVE
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
      className="flex h-full flex-1 flex-col"
      style={{
        background: "#FFFFFF",
        color: "#000000",
        fontFamily: font,
        ...lightVars,
      } as React.CSSProperties}
    >
      <style>{`
        .v4-chat * {
          color: inherit;
          border-radius: 0 !important;
        }
        .v4-chat textarea {
          color: #000000 !important;
        }
        .v4-chat textarea::placeholder {
          color: #666666 !important;
        }
      `}</style>

      {/* Header */}
      <div
        className="v4-chat flex items-end justify-between px-8 pt-8 pb-4"
      >
        <div>
          <p
            style={{
              fontSize: "0.55rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#666666",
              fontFamily: font,
              fontWeight: 500,
              marginBottom: "4px",
            }}
          >
            {client ? client.name : "CONVERSATION"}
          </p>
          <h1
            style={{
              fontFamily: font,
              fontSize: "2.5rem",
              fontWeight: 900,
              color: "#000000",
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
              textTransform: "uppercase",
            }}
          >
            {chatTitle}
          </h1>
        </div>
        <button
          className="p-2 transition-colors"
          style={{ color: "#000000", borderRadius: 0 }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F5")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Thick red rule under header */}
      <div
        className="mx-8"
        style={{ height: "4px", background: "#FF0000", marginBottom: "0" }}
      />

      {/* Messages */}
      <ScrollArea className="v4-chat flex-1 px-8" ref={scrollRef}>
        <MessageList
          messages={messages}
          artifacts={artifacts}
          selectedArtifactId={selectedArtifactId}
          theme={v4Theme}
          onApprove={onApprove}
          onDecline={onDecline}
          onWorkflowClick={onWorkflowClick}
          onArtifactClick={onArtifactClick}
          onSubmitClarifyingAnswers={onSubmitClarifyingAnswers}
          isLoading={isLoading}
        />
      </ScrollArea>

      {/* Input area */}
      <div
        className="v4-chat px-6 py-5"
        style={{ borderTop: "2px solid #000000" }}
      >
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit}>
            <div
              className="p-4"
              style={{
                background: "#FFFFFF",
                border: "2px solid #000000",
                borderRadius: 0,
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="TYPE YOUR MESSAGE"
                rows={1}
                className="w-full resize-none bg-transparent text-sm outline-none"
                style={{
                  fontFamily: font,
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                  color: "#000000",
                  letterSpacing: "0.02em",
                  borderRadius: 0,
                }}
              />
              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  className="p-1.5 transition-colors"
                  style={{ color: "#000000", borderRadius: 0 }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F5")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <Plus className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="flex items-center gap-1 px-2.5 py-1 text-xs transition-colors"
                        style={{
                          color: "#666666",
                          fontFamily: font,
                          fontSize: "0.6rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          borderRadius: 0,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F5")}
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
                    className="p-1.5 transition-colors"
                    style={{ color: "#000000", borderRadius: 0 }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F5")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                  <button
                    type="submit"
                    className="p-2.5 transition-all"
                    style={{
                      background: input.trim() ? "#FF0000" : "transparent",
                      color: input.trim() ? "#FFFFFF" : "#666666",
                      borderRadius: 0,
                      border: input.trim() ? "none" : "1px solid #E5E5E5",
                    }}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </form>
          <p
            className="mt-3 text-left"
            style={{
              fontFamily: font,
              fontSize: "0.5rem",
              color: "#666666",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            AI-GENERATED RESPONSES MAY REQUIRE REVIEW
          </p>
        </div>
      </div>
    </div>
  );
}
