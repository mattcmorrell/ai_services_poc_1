"use client";

import { useState, useRef, useEffect } from "react";
import {
  DotsThree,
  CaretDown,
  Plus,
  Microphone,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Client, Message, Artifact, ActionPlan } from "@/types/chat";
import { PlanSplitView } from "@/components/plan/plan-split-view";
import { PlanPanelPill } from "@/components/plan/plan-panel";
import { useResizable } from "@/components/ui/resize-handle";
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
  // Plan panel props
  activePlan?: ActionPlan;
  activePlanMessageId?: string;
  planPanelOpen?: boolean;
  onOpenPlanPanel?: () => void;
  onClosePlanPanel?: () => void;
  onPausePlan?: () => void;
  onStopPlan?: () => void;
  onResumePlan?: () => void;
  onApproveGatedStep?: (gateMessageId: string) => void;
  onModifyGatedStep?: (gateMessageId: string) => void;
  onApproveRequest?: (messageId: string) => void;
  onDeclineRequest?: (messageId: string) => void;
}

const models = [
  "GPT-4o",
  "GPT-4 Turbo",
  "Claude 3.5 Sonnet",
  "Claude 3 Opus",
  "Gemini 1.5 Pro",
  "Gemini 2.0 Flash",
];

const ogTheme: MessageListTheme = {
  messageSpacing: "mb-6",
  innerContainerClass: "mx-auto py-6 max-w-3xl",
  actionPlanVariant: "compact",
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
  activePlan,
  activePlanMessageId,
  planPanelOpen,
  onOpenPlanPanel,
  onClosePlanPanel,
  onPausePlan,
  onStopPlan,
  onResumePlan,
  onApproveGatedStep,
  onModifyGatedStep,
  onApproveRequest,
  onDeclineRequest,
}: ChatViewProps) {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("GPT-4o");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { width: splitWidth, onDragStart: onSplitDragStart } = useResizable({
    defaultWidth: 380,
    minWidth: 300,
    maxWidth: 500,
    storageKey: "plan-split-width",
    side: "right",
  });

  const showSplitView = activePlan && planPanelOpen;

  useEffect(() => {
    const viewport = scrollRef.current?.querySelector("[data-radix-scroll-area-viewport]") as HTMLElement | null;
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
        inputRef.current.style.overflowY = "hidden";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const chatContent = (
    <div className="flex h-full flex-1 flex-col bg-background min-w-0">
      {/* Messages */}
      <ScrollArea className="flex-1 px-6" ref={scrollRef}>
        <MessageList
          messages={messages}
          artifacts={artifacts}
          selectedArtifactId={selectedArtifactId}
          theme={ogTheme}
          onApprove={onApprove}
          onDecline={onDecline}
          onWorkflowClick={onWorkflowClick}
          onArtifactClick={onArtifactClick}
          onSubmitClarifyingAnswers={onSubmitClarifyingAnswers}
          onOpenPlanPanel={onOpenPlanPanel}
          onApproveGatedStep={onApproveGatedStep}
          onModifyGatedStep={onModifyGatedStep}
          onApproveRequest={onApproveRequest}
          onDeclineRequest={onDeclineRequest}
          isLoading={isLoading}
        />
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border p-4 shrink-0">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit}>
            <div className="rounded-xl border border-border bg-card" style={{ padding: "14px 16px" }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  const el = e.target;
                  el.style.height = "auto";
                  const lineHeight = 20;
                  const maxHeight = lineHeight * 5.5;
                  el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
                  el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                rows={1}
                className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                style={{ lineHeight: "20px", overflowY: "hidden" }}
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
                        <CaretDown className="h-3 w-3" />
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
                    <Microphone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-background">
      {/* Header — full width, above split */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4 shrink-0 bg-muted">
        <div>
          <h1 className="text-[24px] font-semibold">{chatTitle}</h1>
          {client && (
            <p className="text-sm text-muted-foreground">{client.name}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activePlan && !planPanelOpen && onOpenPlanPanel && (
            <PlanPanelPill plan={activePlan} onClick={onOpenPlanPanel} />
          )}
          <Button variant="ghost" size="icon">
            <DotsThree className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content area — chat + optional split pane */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {chatContent}

        {/* Split view right pane */}
        {showSplitView && activePlan && onPausePlan && onStopPlan && onResumePlan && (
          <>
            <div
              className="w-px shrink-0 cursor-col-resize bg-border hover:bg-primary/50 active:bg-primary relative"
              onMouseDown={onSplitDragStart}
            >
              <div className="absolute inset-y-0 -left-1 w-3" />
            </div>
            <div className="shrink-0 border-l border-border" style={{ width: `${splitWidth}px` }}>
              <PlanSplitView
                plan={activePlan}
                onClose={onClosePlanPanel || (() => {})}
                onPause={onPausePlan}
                onStop={onStopPlan}
                onResume={onResumePlan}
                onApprove={activePlanMessageId ? () => onApprove(activePlanMessageId) : undefined}
                onDecline={activePlanMessageId ? () => onDecline(activePlanMessageId) : undefined}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
