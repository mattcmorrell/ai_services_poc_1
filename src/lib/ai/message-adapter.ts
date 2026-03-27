import type { UIMessage } from "ai";
import type { Message, Artifact, ActionPlan, ClarifyingQuestions, StatusUpdate } from "@/types/chat";
import type { ApprovalRequest } from "@/lib/approval-request-parser";

export interface ParsedExtras {
  cleanedContent: string;
  statusUpdates?: StatusUpdate[];
  actionPlan?: ActionPlan;
  clarifyingQuestions?: ClarifyingQuestions;
  approvalRequest?: ApprovalRequest;
  artifacts: Artifact[];
}

/**
 * Extract the concatenated text from a UIMessage's parts array.
 */
export function getTextFromParts(message: UIMessage): string {
  return message.parts
    .filter((p): p is Extract<typeof p, { type: "text" }> => p.type === "text")
    .map((p) => p.text)
    .join("");
}

/**
 * Convert a UIMessage into the app's Message type.
 * If parsedExtras is provided (after onFinish), the cleaned content and
 * structured data are applied. Otherwise the raw streaming text is used.
 */
export function uiMessageToAppMessage(
  uiMsg: UIMessage,
  parsedExtras?: ParsedExtras,
  overrides?: Partial<Message>,
): Message {
  const rawText = getTextFromParts(uiMsg);

  return {
    id: uiMsg.id,
    role: uiMsg.role as "user" | "assistant",
    content: parsedExtras ? parsedExtras.cleanedContent : rawText,
    statusUpdates: parsedExtras?.statusUpdates,
    actionPlan: parsedExtras?.actionPlan,
    clarifyingQuestions: parsedExtras?.clarifyingQuestions,
    approvalRequest: parsedExtras?.approvalRequest,
    artifactIds: parsedExtras?.artifacts.map((a) => a.id),
    timestamp: new Date(),
    ...overrides,
  };
}
