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

const lightVars: Record<string, string> = {
  "--background": "#F6F4FB",
  "--foreground": "#2A2438",
  "--card": "#FFFFFF",
  "--card-foreground": "#2A2438",
  "--popover": "#FFFFFF",
  "--popover-foreground": "#2A2438",
  "--primary": "#7B6FA6",
  "--primary-foreground": "#FDFCFE",
  "--secondary": "#F0EDF7",
  "--secondary-foreground": "#2A2438",
  "--muted": "#EBE8F3",
  "--muted-foreground": "#6B6080",
  "--accent": "#EBE8F3",
  "--accent-foreground": "#2A2438",
  "--destructive": "#C25B4D",
  "--border": "#E4DFF0",
  "--input": "#E4DFF0",
  "--ring": "#7B6FA6",
};

const models = [
  "GPT-4o",
  "GPT-4 Turbo",
  "Claude 3.5 Sonnet",
  "Claude 3 Opus",
  "Gemini 1.5 Pro",
  "Gemini 2.0 Flash",
];

const v9Theme: MessageListTheme = {
  messageSpacing: "mb-8",
  innerContainerClass: "mx-auto max-w-3xl py-8",
  actionPlanVariant: "full",
  actionPlanWrapperClass: "mt-5",

  contentWrapperClass: (role) =>
    cn("flex", role === "user" ? "justify-end" : "justify-start"),

  userBubbleClass: "max-w-[85%] text-sm leading-relaxed px-5 py-3",
  userBubbleStyle: {
    background: "#FFFFFF",
    border: "1px solid rgba(123, 111, 166, 0.1)",
    borderRadius: "20px",
    color: "#2A2438",
    fontWeight: 400,
    fontFamily: "'Outfit', sans-serif",
    boxShadow:
      "0 1px 2px rgba(123, 111, 166, 0.04), 0 4px 12px rgba(123, 111, 166, 0.06)",
  },

  assistantClass: "max-w-[85%] text-sm leading-relaxed",
  assistantStyle: {
    color: "#3D3552",
    fontWeight: 400,
    fontFamily: "'Outfit', sans-serif",
    lineHeight: 1.75,
  },

  contentTransform: (content: string) =>
    content
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong style="color: #2A2438; font-weight: 600">$1</strong>'
      )
      .replace(/\n/g, "<br />"),

  thinkingToggleClass:
    "mb-2 flex items-center gap-1.5 text-xs tracking-wide transition-colors duration-200",
  thinkingToggleStyle: {
    color: "#7B6FA6",
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 400,
  },
  thinkingLabel: (
    <span style={{ fontStyle: "italic", fontFamily: "'Fraunces', serif" }}>
      Thinking...
    </span>
  ),

  thinkingBoxClass: "mb-4 p-4 text-sm",
  thinkingBoxStyle: {
    background: "rgba(123, 111, 166, 0.04)",
    border: "1px solid rgba(123, 111, 166, 0.08)",
    borderRadius: "16px",
    color: "#5A5070",
    fontStyle: "italic",
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 300,
    lineHeight: 1.7,
  },

  renderLoading: () => (
    <div className="mb-6 flex items-center gap-2.5">
      <div
        className="h-1.5 w-1.5 animate-pulse rounded-full"
        style={{ background: "#7B6FA6" }}
      />
      <div
        className="h-1.5 w-1.5 animate-pulse rounded-full [animation-delay:0.2s]"
        style={{ background: "#9B8FC6" }}
      />
      <div
        className="h-1.5 w-1.5 animate-pulse rounded-full [animation-delay:0.4s]"
        style={{ background: "#B8AFDA" }}
      />
    </div>
  ),

  renderWorkflowCard: (workflow, onClick) => (
    <div
      onClick={onClick}
      className="mt-4 flex w-full cursor-pointer items-center gap-3 p-4 transition-all duration-400"
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(123, 111, 166, 0.08)",
        borderRadius: "16px",
        boxShadow:
          "0 1px 2px rgba(123, 111, 166, 0.04), 0 4px 12px rgba(123, 111, 166, 0.06)",
      }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center"
        style={{
          background: "rgba(123, 111, 166, 0.07)",
          borderRadius: "12px",
          border: "1px solid rgba(123, 111, 166, 0.08)",
        }}
      >
        <ArrowUpDown className="h-5 w-5" style={{ color: "#7B6FA6" }} />
      </div>
      <div className="flex-1">
        <div
          className="text-sm"
          style={{ color: "#2A2438", fontWeight: 500 }}
        >
          {workflow.name}
        </div>
        <div
          className="text-xs"
          style={{ color: "#6B6080", fontWeight: 400 }}
        >
          {workflow.description}
        </div>
      </div>
      <button
        className="flex h-8 w-8 items-center justify-center"
        style={{
          background: "rgba(123, 111, 166, 0.05)",
          borderRadius: "9999px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <MoreHorizontal
          className="h-4 w-4"
          style={{ color: "#8A80A0" }}
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
                background: "rgba(123, 111, 166, 0.08)",
                border: "1px solid rgba(123, 111, 166, 0.12)",
                borderRadius: "9999px",
                color: "#7B6FA6",
                fontWeight: 500,
              }
            : {
                background: "#7B6FA6",
                border: "1px solid #6B5F96",
                borderRadius: "9999px",
                color: "#FDFCFE",
                fontWeight: 500,
                boxShadow:
                  "0 2px 8px rgba(123, 111, 166, 0.25), 0 4px 16px rgba(123, 111, 166, 0.15)",
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
      className="v9-chat relative flex h-full flex-1 flex-col overflow-hidden"
      style={{
        background: "#F6F4FB",
        fontFamily: "'Outfit', sans-serif",
        color: "#2A2438",
        ...lightVars,
      } as React.CSSProperties}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400&family=Outfit:wght@300;400;500;600&display=swap');

        .v9-chat * {
          border-color: #E4DFF0 !important;
        }
        .v9-chat [class*="rounded-xl"],
        .v9-chat [class*="rounded-lg"] {
          border-radius: 20px !important;
        }
        .v9-chat [class*="rounded-full"] {
          border-radius: 9999px !important;
        }
        .v9-chat input, .v9-chat textarea, .v9-chat select {
          color: #2A2438 !important;
          font-family: 'Outfit', sans-serif !important;
        }
        .v9-chat input::placeholder, .v9-chat textarea::placeholder {
          color: #9B91B0 !important;
        }
        .v9-chat button {
          font-family: 'Outfit', sans-serif !important;
        }
      `}</style>

      {/* Soft ambient blurs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          style={{
            position: "absolute",
            top: "15%",
            right: "10%",
            width: "30%",
            height: "25%",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(123, 111, 166, 0.05) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "15%",
            width: "25%",
            height: "20%",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(167, 139, 200, 0.04) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* Header */}
      <div
        className="relative z-10 flex items-center justify-between px-8 py-5"
        style={{ borderBottom: "1px solid rgba(123, 111, 166, 0.08)" }}
      >
        <div>
          <h1
            className="text-xl tracking-tight"
            style={{
              fontFamily: "'Fraunces', serif",
              color: "#2A2438",
              fontWeight: 500,
            }}
          >
            {chatTitle}
          </h1>
          {client && (
            <p
              className="mt-0.5 text-xs tracking-wide"
              style={{
                fontFamily: "'Outfit', sans-serif",
                color: "#7B6FA6",
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
            background: "rgba(123, 111, 166, 0.06)",
            borderRadius: "9999px",
            border: "1px solid rgba(123, 111, 166, 0.08)",
          }}
        >
          <MoreHorizontal
            className="h-4 w-4"
            style={{ color: "#8A80A0" }}
          />
        </button>
      </div>

      {/* Messages */}
      <ScrollArea className="relative z-10 flex-1 px-8" ref={scrollRef}>
        <MessageList
          messages={messages}
          artifacts={artifacts}
          selectedArtifactId={selectedArtifactId}
          theme={v9Theme}
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
        style={{ borderTop: "1px solid rgba(123, 111, 166, 0.08)" }}
      >
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit}>
            <div
              className="p-3"
              style={{
                background: "#FFFFFF",
                borderRadius: "22px",
                border: "1px solid rgba(123, 111, 166, 0.1)",
                boxShadow:
                  "0 1px 2px rgba(123, 111, 166, 0.04), 0 4px 16px rgba(123, 111, 166, 0.07), 0 12px 40px rgba(123, 111, 166, 0.05)",
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What's on your mind?"
                rows={1}
                className="w-full resize-none bg-transparent text-sm outline-none"
                style={{
                  color: "#2A2438",
                  fontWeight: 400,
                  fontFamily: "'Outfit', sans-serif",
                  caretColor: "#7B6FA6",
                }}
              />
              <div className="mt-2 flex items-center justify-between">
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center transition-colors duration-200"
                  style={{
                    background: "rgba(123, 111, 166, 0.05)",
                    borderRadius: "9999px",
                  }}
                >
                  <Plus className="h-4 w-4" style={{ color: "#8A80A0" }} />
                </button>
                <div className="flex items-center gap-1.5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex h-8 items-center gap-1 px-3 text-[10px] tracking-wide transition-colors duration-200"
                        style={{
                          color: "#8A80A0",
                          background: "rgba(123, 111, 166, 0.05)",
                          borderRadius: "9999px",
                          fontFamily: "'Outfit', sans-serif",
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
                      background: "rgba(123, 111, 166, 0.05)",
                      borderRadius: "9999px",
                    }}
                  >
                    <Mic className="h-4 w-4" style={{ color: "#8A80A0" }} />
                  </button>
                  {input.trim() && (
                    <button
                      type="submit"
                      className="flex h-8 w-8 items-center justify-center transition-all duration-300"
                      style={{
                        background: "#7B6FA6",
                        borderRadius: "9999px",
                        boxShadow: "0 2px 8px rgba(123, 111, 166, 0.3)",
                      }}
                    >
                      <SendHorizontal
                        className="h-4 w-4"
                        style={{ color: "#FDFCFE" }}
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
