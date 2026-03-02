export interface ApprovalRequest {
  /** The question being asked, e.g. "Do you approve Step 4 totals review?" */
  question: string;
  /** Optional context/title extracted from gate header */
  title?: string;
}

interface ParsedApprovalRequest {
  approvalRequest: ApprovalRequest;
  cleanedContent: string;
}

/**
 * Parses approval requests from LLM response content.
 * Detects patterns like:
 *   ### Gate: approve Step N
 *   Do you approve ... ?
 *
 * Returns parsed approval request and cleaned content, or null if none found.
 */
export function parseApprovalRequest(
  content: string
): ParsedApprovalRequest | null {
  // Pattern 1: "### Gate:" header followed by approval question
  // Captures the gate section header and everything after it
  const gateRegex =
    /\n---\s*\n+###\s*Gate[:\s][^\n]*\n([\s\S]*?)$/i;
  const gateMatch = content.match(gateRegex);

  if (gateMatch) {
    const gateSection = gateMatch[0];
    const gateBody = gateMatch[1].trim();

    // Extract the question (last sentence ending with ?)
    const questionMatch = gateBody.match(/([^\n]*\?)\s*$/);
    const question = questionMatch
      ? questionMatch[1].trim()
      : gateBody;

    // Extract title from ### Gate: header
    const titleMatch = gateSection.match(/###\s*Gate[:\s]+(.+)/i);
    const title = titleMatch ? titleMatch[1].trim().replace(/\?$/, "") : undefined;

    return {
      approvalRequest: { question, title },
      cleanedContent: content.slice(0, content.indexOf(gateSection)).trimEnd(),
    };
  }

  // Pattern 2: standalone "### Gate:" without preceding ---
  const gateRegex2 =
    /\n###\s*Gate[:\s][^\n]*\n([\s\S]*?)$/i;
  const gateMatch2 = content.match(gateRegex2);

  if (gateMatch2) {
    const gateSection = gateMatch2[0];
    const gateBody = gateMatch2[1].trim();

    const questionMatch = gateBody.match(/([^\n]*\?)\s*$/);
    const question = questionMatch
      ? questionMatch[1].trim()
      : gateBody;

    const titleMatch = gateSection.match(/###\s*Gate[:\s]+(.+)/i);
    const title = titleMatch ? titleMatch[1].trim().replace(/\?$/, "") : undefined;

    return {
      approvalRequest: { question, title },
      cleanedContent: content.slice(0, content.indexOf(gateSection)).trimEnd(),
    };
  }

  // Pattern 3: Text ending with "Do you approve..." question (last 2 lines)
  const lines = content.trimEnd().split("\n");
  if (lines.length >= 2) {
    const lastLine = lines[lines.length - 1].trim();
    const approveMatch = lastLine.match(
      /^(do you (?:approve|confirm|authorize)[^?]*\?)\s*$/i
    );
    if (approveMatch) {
      const question = approveMatch[1];
      return {
        approvalRequest: { question },
        cleanedContent: lines.slice(0, -1).join("\n").trimEnd(),
      };
    }
  }

  return null;
}
