"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PaperPlaneTilt, FileText, Copy, Check, CircleNotch } from "@phosphor-icons/react";
import { getTextFromParts } from "@/lib/ai/message-adapter";

interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isSummary?: boolean;
}

export function InterviewChat() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [greetingMsg, setGreetingMsg] = useState<DisplayMessage | null>(null);
  const [summaryIds, setSummaryIds] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const greetingFetched = useRef(false);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { clientName: "Customer Interview", agentId: "agent-interviewer" },
      }),
    [],
  );

  const { messages: uiMessages, sendMessage, status } = useChat({
    id: "interview",
    transport,
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Convert UIMessages to display messages
  const streamedMessages: DisplayMessage[] = useMemo(
    () =>
      uiMessages.map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: getTextFromParts(m),
        isSummary: summaryIds.has(m.id),
      })),
    [uiMessages, summaryIds],
  );

  // Combine greeting + streamed messages
  const messages: DisplayMessage[] = useMemo(() => {
    if (greetingMsg) return [greetingMsg, ...streamedMessages];
    return streamedMessages;
  }, [greetingMsg, streamedMessages]);

  const scrollToBottom = useCallback(() => {
    const viewport = scrollRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement | null;
    if (viewport) {
      setTimeout(() => {
        viewport.scrollTop = viewport.scrollHeight;
      }, 50);
    }
  }, []);

  // Fetch greeting on mount
  useEffect(() => {
    if (greetingFetched.current) return;
    greetingFetched.current = true;

    async function fetchGreeting() {
      try {
        const res = await fetch("/api/agent-greeting?agentId=agent-interviewer");
        const data = await res.json();
        if (data.greeting) {
          setGreetingMsg({
            id: "greeting",
            role: "assistant",
            content: data.greeting.trim(),
          });
        }
      } catch {
        setGreetingMsg({
          id: "greeting",
          role: "assistant",
          content:
            "Hi! I'm here to help gather your time off policy details. What types of time off do your employees get?",
        });
      }
    }
    fetchGreeting();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Track the next assistant message as a summary
  const pendingSummaryRef = useRef(false);
  useEffect(() => {
    if (pendingSummaryRef.current && !isLoading && uiMessages.length > 0) {
      const lastMsg = uiMessages[uiMessages.length - 1];
      if (lastMsg.role === "assistant") {
        setSummaryIds((prev) => new Set(prev).add(lastMsg.id));
        pendingSummaryRef.current = false;
      }
    }
  }, [isLoading, uiMessages]);

  function handlePaperPlaneTilt(content: string) {
    sendMessage({ text: content });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    handlePaperPlaneTilt(trimmed);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  function generateSummary() {
    if (isLoading) return;
    pendingSummaryRef.current = true;
    handlePaperPlaneTilt("Please generate a summary of everything we've discussed.");
  }

  async function copySummary(content: string) {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text
    }
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">
              Customer Interview
            </h1>
            <p className="text-xs text-muted-foreground">
              Time Off Policies
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={generateSummary}
          disabled={isLoading || messages.length < 4}
          className="gap-2"
        >
          <FileText className="h-3.5 w-3.5" />
          Generate Summary
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-6">
          <div className="space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] ${
                    msg.role === "user"
                      ? "rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-primary-foreground"
                      : msg.isSummary
                        ? "w-full max-w-none rounded-lg border border-primary/20 bg-primary/5 p-4"
                        : ""
                  }`}
                >
                  {msg.isSummary && (
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-medium uppercase tracking-[0.06em] text-primary">
                        Policy Summary
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copySummary(msg.content)}
                        className="h-7 gap-1.5 text-xs"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3 w-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                  <div
                    className={`text-sm leading-relaxed ${
                      msg.role === "user"
                        ? ""
                        : "text-foreground whitespace-pre-wrap"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CircleNotch weight="regular" className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border p-4">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-2xl items-end gap-3"
        >
          <div className="flex-1 rounded-xl border border-border bg-card p-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your answer..."
              rows={1}
              className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              style={{ minHeight: "20px", maxHeight: "120px" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
              }}
            />
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="h-10 w-10 shrink-0 rounded-xl"
          >
            <PaperPlaneTilt className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
