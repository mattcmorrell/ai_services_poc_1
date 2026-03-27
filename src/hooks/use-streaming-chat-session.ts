"use client";

import { useMemo, useRef, useCallback, useState } from "react";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import type { Message as AppMessage, Artifact } from "@/types/chat";
import { parseArtifacts } from "@/lib/artifact-parser";
import { parseClarifyingQuestions } from "@/lib/clarifying-questions-parser";
import { parseActionPlan } from "@/lib/action-plan-parser";
import { parseApprovalRequest } from "@/lib/approval-request-parser";
import { getTextFromParts, uiMessageToAppMessage, type ParsedExtras } from "@/lib/ai/message-adapter";
import { parseStatusUpdates, parseLiveStatusUpdates, stripStatusMarkers } from "@/lib/status-parser";

interface UseStreamingChatSessionOptions {
  chatId: string;
  clientName: string;
  agentId?: string | null;
  /** Called when an assistant message finishes streaming and has been parsed. */
  onFinishMessage?: (parsed: {
    message: AppMessage;
    artifacts: Artifact[];
  }) => void;
}

interface UseStreamingChatSessionReturn {
  /** App-format messages derived from the streaming UIMessages. */
  messages: AppMessage[];
  /** Accumulated artifacts from all finished messages. */
  artifacts: Artifact[];
  /** Send a new user message. */
  sendMessage: (content: string, options?: { hidden?: boolean }) => void;
  /** The chatId this session is streaming (for scoped loading). */
  loadingChatId: string | null;
}

export function useStreamingChatSession({
  chatId,
  clientName,
  agentId,
  onFinishMessage,
}: UseStreamingChatSessionOptions): UseStreamingChatSessionReturn {
  // Bumped after onFinish parses a message, to force useMemo recalc
  const [parseVersion, setParseVersion] = useState(0);
  // Parsed extras per message ID — survives re-renders
  const parsedExtrasRef = useRef<Map<string, ParsedExtras>>(new Map());
  // Accumulated artifacts across all messages
  const artifactsRef = useRef<Artifact[]>([]);
  // Hidden message IDs (sent to model but filtered from display)
  const hiddenMessageIdsRef = useRef<Set<string>>(new Set());
  // Stable callback ref for onFinishMessage
  const onFinishMessageRef = useRef(onFinishMessage);
  onFinishMessageRef.current = onFinishMessage;

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { clientName, agentId },
      }),
    [clientName, agentId],
  );

  const { messages: uiMessages, sendMessage: sdkSendMessage, status } = useChat({
    id: chatId,
    transport,
    onFinish: ({ message }) => {
      const rawText = getTextFromParts(message);

      // Run the full parsing pipeline — status markers first
      const { statusUpdates, cleanedContent: statusCleanedContent } =
        parseStatusUpdates(rawText);

      const { content: artifactParsedContent, artifacts: newArtifacts } =
        parseArtifacts(statusCleanedContent);

      const cqResult = parseClarifyingQuestions(artifactParsedContent);
      const afterCqContent = cqResult?.cleanedContent || artifactParsedContent;

      const actionPlanResult = parseActionPlan(afterCqContent);
      const afterActionContent =
        actionPlanResult?.cleanedContent || afterCqContent;
      let actionPlan = actionPlanResult?.plan;

      const approvalResult = parseApprovalRequest(afterActionContent);
      const finalContent = approvalResult?.cleanedContent || afterActionContent;

      // Time Off safety gate
      if (actionPlan && agentId === "agent-timeoff") {
        actionPlan = {
          ...actionPlan,
          steps: actionPlan.steps.map((step) => ({
            ...step,
            nonUndoable: true,
          })),
        };
      }

      const extras: ParsedExtras = {
        cleanedContent: finalContent,
        statusUpdates,
        actionPlan,
        clarifyingQuestions: cqResult?.questions,
        approvalRequest: approvalResult?.approvalRequest,
        artifacts: newArtifacts,
      };

      parsedExtrasRef.current.set(message.id, extras);
      artifactsRef.current = [...artifactsRef.current, ...newArtifacts];
      setParseVersion((v) => v + 1);

      // Notify parent so it can sync into durable chats state
      const appMessage = uiMessageToAppMessage(message, extras);
      onFinishMessageRef.current?.({ message: appMessage, artifacts: newArtifacts });
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Convert UIMessages to app Messages
  const messages: AppMessage[] = useMemo(() => {
    return uiMessages.map((uiMsg, idx) => {
      const extras = parsedExtrasRef.current.get(uiMsg.id);
      const isLastAssistant =
        uiMsg.role === "assistant" && idx === uiMessages.length - 1 && isLoading;

      // During streaming (no parsed extras yet), extract live status updates
      if (!extras && isLastAssistant) {
        const rawText = getTextFromParts(uiMsg);
        const liveUpdates = parseLiveStatusUpdates(rawText);
        const cleanedText = stripStatusMarkers(rawText);
        const appMsg = uiMessageToAppMessage(uiMsg, undefined, {
          content: cleanedText,
          statusUpdates: liveUpdates.length > 0 ? liveUpdates : undefined,
        });
        if (hiddenMessageIdsRef.current.has(uiMsg.id)) {
          appMsg.hidden = true;
        }
        return appMsg;
      }

      const appMsg = uiMessageToAppMessage(uiMsg, extras);
      if (hiddenMessageIdsRef.current.has(uiMsg.id)) {
        appMsg.hidden = true;
      }
      return appMsg;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uiMessages, parseVersion, isLoading]);

  const sendMessage = useCallback(
    (content: string, options?: { hidden?: boolean }) => {
      const msgPromise = sdkSendMessage({ text: content });
      // If hidden, we need to track this message ID after it's created.
      // Since useChat manages message creation, we mark it by content matching
      // in the next render cycle via a ref.
      if (options?.hidden) {
        // Track that the next user message with this content should be hidden
        const pendingHidden = content;
        const checkHidden = () => {
          const lastUserMsg = uiMessages.findLast((m) => m.role === "user");
          if (lastUserMsg && getTextFromParts(lastUserMsg) === pendingHidden) {
            hiddenMessageIdsRef.current.add(lastUserMsg.id);
          }
        };
        // Defer to after React processes the new message
        setTimeout(checkHidden, 50);
      }
      return msgPromise;
    },
    [sdkSendMessage, uiMessages],
  );

  return {
    messages,
    artifacts: artifactsRef.current,
    sendMessage,
    loadingChatId: isLoading ? chatId : null,
  };
}
