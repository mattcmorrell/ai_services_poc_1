"use client";

import { useState } from "react";
import {
  CaretDown,
  CaretRight,
  ArrowsDownUp,
  ThumbsUp,
  Check,
  DotsThree,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Message, Artifact } from "@/types/chat";
import { ArtifactCard } from "@/components/artifacts/artifact-card";
import { ActionCard } from "@/components/chat/action-card";
import { ActionCardCompact } from "@/components/chat/action-card-compact";
import { ClarifyingQuestionsCard } from "@/components/chat/clarifying-questions-card";
import { GateApprovalCard } from "@/components/chat/gate-approval-card";
import { ApprovalRequestCard } from "@/components/chat/approval-request-card";
import { ActivityFeed } from "@/components/chat/activity-feed";

export interface MessageListTheme {
  /** Message container spacing, e.g. "mb-6" or "mb-8" */
  messageSpacing: string;

  /** Inner container class, defaults to "mx-auto max-w-3xl py-6" */
  innerContainerClass?: string;

  /** "compact" uses ActionCardCompact (needs onOpenPlanPanel), "full" uses ActionCard */
  actionPlanVariant: "compact" | "full";
  actionPlanWrapperClass?: string;

  /** Content wrapper around the message text div */
  contentWrapperClass?: (role: "user" | "assistant") => string;

  /** User message bubble */
  userBubbleClass?: string;
  userBubbleStyle?: React.CSSProperties;

  /** Assistant message */
  assistantClass?: string;
  assistantStyle?: React.CSSProperties;

  /** HTML content transform — default does basic markdown bold + newline */
  contentTransform?: (content: string, msgIndex: number) => string;

  /** Thinking toggle */
  thinkingToggleClass?: string;
  thinkingToggleStyle?: React.CSSProperties;
  thinkingLabel?: React.ReactNode;

  /** Thinking content box */
  thinkingBoxClass?: string;
  thinkingBoxStyle?: React.CSSProperties;

  /** Artifact card wrapper */
  artifactWrapperClass?: string;

  /** Render overrides for complex variant-specific elements */
  renderLoading?: () => React.ReactNode;
  renderWorkflowCard?: (
    workflow: NonNullable<Message["workflow"]>,
    onClick: () => void
  ) => React.ReactNode;
  renderApprovalButton?: (
    approved: boolean,
    onApprove: () => void
  ) => React.ReactNode;

  /** Optional per-message prefix/suffix elements */
  renderMessagePrefix?: (
    message: Message,
    index: number
  ) => React.ReactNode;
  renderMessageSuffix?: (
    message: Message,
    index: number,
    total: number
  ) => React.ReactNode;
}

interface MessageListProps {
  messages: Message[];
  artifacts: Artifact[];
  selectedArtifactId: string | null;
  theme: MessageListTheme;

  onApprove: (messageId: string) => void;
  onDecline: (messageId: string) => void;
  onWorkflowClick: (workflowId: string) => void;
  onArtifactClick: (artifactId: string) => void;
  onSubmitClarifyingAnswers?: (
    messageId: string,
    answers: Record<string, string | string[]>
  ) => void;
  onOpenPlanPanel?: () => void;
  onApproveGatedStep?: (gateMessageId: string) => void;
  onModifyGatedStep?: (gateMessageId: string) => void;
  onApproveRequest?: (messageId: string) => void;
  onDeclineRequest?: (messageId: string) => void;

  isLoading: boolean;
}

const defaultTransform = (content: string) => {
  // Process line by line for block-level elements
  const lines = content.split("\n");
  const result: string[] = [];
  let inTable = false;
  let tableRows: string[] = [];

  const flushTable = () => {
    if (tableRows.length > 0) {
      const headerRow = tableRows[0];
      const dataRows = tableRows.slice(2); // skip separator row
      const headerCells = headerRow.split("|").filter(c => c.trim()).map(c => `<th style="padding:4px 8px;text-align:left;font-weight:600;border-bottom:1px solid var(--border)">${inlineMd(c.trim())}</th>`);
      let html = `<table style="border-collapse:collapse;width:100%;margin:8px 0;font-size:12px"><thead><tr>${headerCells.join("")}</tr></thead><tbody>`;
      for (const row of dataRows) {
        const cells = row.split("|").filter(c => c.trim()).map(c => `<td style="padding:4px 8px;border-bottom:1px solid var(--border)">${inlineMd(c.trim())}</td>`);
        html += `<tr>${cells.join("")}</tr>`;
      }
      html += "</tbody></table>";
      result.push(html);
      tableRows = [];
      inTable = false;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // Table detection
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      // Skip separator rows for detection but include in tableRows
      inTable = true;
      tableRows.push(trimmed);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Headings
    if (trimmed.startsWith("### ")) {
      result.push(`<div style="font-size:14px;font-weight:600;margin:16px 0 6px">${inlineMd(trimmed.slice(4))}</div>`);
    } else if (trimmed.startsWith("## ")) {
      result.push(`<div style="font-size:18px;font-weight:500;margin:20px 0 8px">${inlineMd(trimmed.slice(3))}</div>`);
    } else if (trimmed === "---" || trimmed === "***") {
      result.push('<hr style="border:none;border-top:1px solid var(--border);margin:12px 0" />');
    } else if (trimmed.startsWith("- ")) {
      result.push(`<div style="padding-left:16px;text-indent:-12px;margin:2px 0">• ${inlineMd(trimmed.slice(2))}</div>`);
    } else if (trimmed === "") {
      result.push("<br />");
    } else {
      result.push(inlineMd(trimmed));
      result.push("<br />");
    }
  }
  flushTable();
  return result.join("");
};

/** Inline markdown: bold, italic */
const inlineMd = (text: string) =>
  text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>");

export function MessageList({
  messages,
  artifacts,
  selectedArtifactId,
  theme,
  onApprove,
  onDecline,
  onWorkflowClick,
  onArtifactClick,
  onSubmitClarifyingAnswers,
  onOpenPlanPanel,
  onApproveGatedStep,
  onModifyGatedStep,
  onApproveRequest,
  onDeclineRequest,
  isLoading,
}: MessageListProps) {
  const [expandedThinking, setExpandedThinking] = useState<
    Record<string, boolean>
  >({});
  const [expandedContent, setExpandedContent] = useState<
    Record<string, boolean>
  >({});

  const toggleThinking = (messageId: string) => {
    setExpandedThinking((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  const transform = theme.contentTransform || defaultTransform;

  return (
    <div className={theme.innerContainerClass || "mx-auto max-w-3xl py-6"}>
      {messages.filter((m) => !m.hidden).map((message, msgIdx) => (
        <div key={message.id} className={theme.messageSpacing}>
          {/* Optional message prefix */}
          {theme.renderMessagePrefix?.(message, msgIdx)}

          {/* Thinking toggle */}
          {message.role === "assistant" && message.thinking && (
            <button
              onClick={() => toggleThinking(message.id)}
              className={
                theme.thinkingToggleClass ||
                "mb-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              }
              style={theme.thinkingToggleStyle}
            >
              {expandedThinking[message.id] ? (
                <CaretDown className="h-3.5 w-3.5" />
              ) : (
                <CaretRight className="h-3.5 w-3.5" />
              )}
              {theme.thinkingLabel || "Show thinking"}
            </button>
          )}

          {/* Thinking content */}
          {message.thinking && expandedThinking[message.id] && (
            <div
              className={
                theme.thinkingBoxClass ||
                "mb-4 rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground"
              }
              style={theme.thinkingBoxStyle}
            >
              {message.thinking}
            </div>
          )}

          {/* Activity feed for messages with status updates */}
          {message.role === "assistant" && message.statusUpdates && message.statusUpdates.length > 0 && (
            <div className="mb-2">
              <ActivityFeed updates={message.statusUpdates} />
            </div>
          )}

          {/* Message content — collapsible when status updates exist */}
          {(() => {
            const hasActivity = message.role === "assistant" && message.statusUpdates && message.statusUpdates.length > 0;
            const isExpanded = !hasActivity || expandedContent[message.id];
            const hasContent = message.content.trim().length > 0;

            return (
              <>
                {hasActivity && hasContent && (
                  <button
                    onClick={() =>
                      setExpandedContent((prev) => ({
                        ...prev,
                        [message.id]: !prev[message.id],
                      }))
                    }
                    className="mb-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isExpanded ? (
                      <CaretDown className="h-3 w-3" />
                    ) : (
                      <CaretRight className="h-3 w-3" />
                    )}
                    {isExpanded ? "Hide response" : "Show full response"}
                  </button>
                )}

                {(!hasActivity || isExpanded) && hasContent && (
                  <div
                    className={
                      theme.contentWrapperClass?.(message.role) ||
                      cn(
                        "prose prose-sm dark:prose-invert max-w-none",
                        message.role === "user" && "text-right"
                      )
                    }
                  >
                    <div
                      className={cn(
                        message.role === "user"
                          ? theme.userBubbleClass ||
                              "inline-block rounded-lg bg-muted px-4 py-2 text-foreground"
                          : theme.assistantClass
                      )}
                      style={
                        message.role === "user"
                          ? theme.userBubbleStyle
                          : theme.assistantStyle
                      }
                      dangerouslySetInnerHTML={{
                        __html: transform(message.content, msgIdx),
                      }}
                    />
                  </div>
                )}
              </>
            );
          })()}

          {/* Action Plan Card */}
          {message.actionPlan && (
            <div className={theme.actionPlanWrapperClass || "mt-4"}>
              {theme.actionPlanVariant === "compact" ? (
                <ActionCardCompact
                  plan={message.actionPlan}
                  onOpenPanel={onOpenPlanPanel || (() => {})}
                  onApprove={() => onApprove(message.id)}
                  onDecline={() => onDecline(message.id)}
                />
              ) : (
                <ActionCard
                  plan={message.actionPlan}
                  workflow={message.workflow}
                  onApprove={() => onApprove(message.id)}
                  onDecline={() => onDecline(message.id)}
                  onWorkflowClick={onWorkflowClick}
                />
              )}
            </div>
          )}

          {/* Clarifying Questions Card — always rendered for all variants */}
          {message.clarifyingQuestions && (
            <div className="mt-5">
              <ClarifyingQuestionsCard
                data={message.clarifyingQuestions}
                onSubmitAnswers={(answers) =>
                  onSubmitClarifyingAnswers?.(message.id, answers)
                }
              />
            </div>
          )}

          {/* Gate Approval Card */}
          {message.gateApproval && (() => {
            const planMsg = messages.find(
              (m) => m.id === message.gateApproval!.planMessageId
            );
            return (
              <GateApprovalCard
                gateApproval={message.gateApproval}
                planStatus={planMsg?.actionPlan?.status}
                stepStatus={planMsg?.actionPlan?.steps[message.gateApproval.stepIndex]?.status}
                onApprove={() => onApproveGatedStep?.(message.id)}
                onModify={() => onModifyGatedStep?.(message.id)}
              />
            );
          })()}

          {/* Approval Request Card */}
          {message.approvalRequest && (
            <ApprovalRequestCard
              question={message.approvalRequest.question}
              title={message.approvalRequest.title}
              approved={message.approvalRequest.approved}
              onApprove={() => onApproveRequest?.(message.id)}
              onDecline={() => onDeclineRequest?.(message.id)}
            />
          )}

          {/* Artifact cards */}
          {message.artifactIds && message.artifactIds.length > 0 && (
            <div
              className={
                theme.artifactWrapperClass || "mt-4 flex flex-wrap gap-2"
              }
            >
              {message.artifactIds.map((artifactId) => {
                const artifact = artifacts.find((a) => a.id === artifactId);
                if (!artifact) return null;
                return (
                  <ArtifactCard
                    key={artifact.id}
                    artifact={artifact}
                    isSelected={selectedArtifactId === artifact.id}
                    onClick={() => onArtifactClick(artifact.id)}
                  />
                );
              })}
            </div>
          )}

          {/* Standalone workflow card */}
          {message.workflow &&
            !message.actionPlan &&
            (theme.renderWorkflowCard ? (
              theme.renderWorkflowCard(message.workflow, () =>
                onWorkflowClick(message.workflow!.id)
              )
            ) : (
              <div
                onClick={() => onWorkflowClick(message.workflow!.id)}
                className="mt-4 flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-accent cursor-pointer"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <ArrowsDownUp className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">
                    {message.workflow.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {message.workflow.description}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DotsThree className="h-4 w-4" />
                </Button>
              </div>
            ))}

          {/* Approval button */}
          {message.requiresApproval &&
            (theme.renderApprovalButton ? (
              theme.renderApprovalButton(
                !!message.approved,
                () => onApprove(message.id)
              )
            ) : (
              <div className="mt-4">
                <Button
                  onClick={() => onApprove(message.id)}
                  disabled={message.approved}
                  className={cn(
                    "gap-2",
                    message.approved &&
                      "bg-green-600 hover:bg-green-600 text-white"
                  )}
                >
                  {message.approved ? (
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
            ))}

          {/* Optional message suffix */}
          {theme.renderMessageSuffix?.(message, msgIdx, messages.length)}
        </div>
      ))}

      {/* Loading indicator */}
      {isLoading &&
        (theme.renderLoading ? (
          theme.renderLoading()
        ) : (
          <div className="mb-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-2 w-2 animate-pulse rounded-full bg-current" />
              <div className="h-2 w-2 animate-pulse rounded-full bg-current [animation-delay:0.2s]" />
              <div className="h-2 w-2 animate-pulse rounded-full bg-current [animation-delay:0.4s]" />
            </div>
          </div>
        ))}
    </div>
  );
}
