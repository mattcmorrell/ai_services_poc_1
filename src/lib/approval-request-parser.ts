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
 *   ### If you approve Step N, I will:
 *   Do you approve ... ? (possibly spanning multiple lines)
 *
 * Returns parsed approval request and cleaned content, or null if none found.
 */
export function parseApprovalRequest(
  content: string
): ParsedApprovalRequest | null {
  // Pattern 1: "### Gate:" header (with or without preceding ---)
  const gateRegex = /\n(?:---\s*\n+)?###\s*Gate[:\s][^\n]*\n([\s\S]*?)$/i;
  const gateMatch = content.match(gateRegex);

  if (gateMatch) {
    const gateSection = gateMatch[0];
    const gateBody = gateMatch[1].trim();

    const question = extractTrailingQuestion(gateBody) || gateBody;
    const titleMatch = gateSection.match(/###\s*Gate[:\s]+(.+)/i);
    const title = titleMatch
      ? titleMatch[1].trim().replace(/\?$/, "")
      : undefined;

    return {
      approvalRequest: { question, title },
      cleanedContent: content.slice(0, content.indexOf(gateSection)).trimEnd(),
    };
  }

  // Pattern 2: "### If you approve Step N" header section
  const ifApproveRegex =
    /\n###\s*If you approve[^\n]*\n([\s\S]*?)$/i;
  const ifApproveMatch = content.match(ifApproveRegex);

  if (ifApproveMatch) {
    const section = ifApproveMatch[0];
    const body = ifApproveMatch[1].trim();

    const question = extractTrailingQuestion(body) || body;

    return {
      approvalRequest: { question },
      cleanedContent: content
        .slice(0, content.indexOf(section))
        .trimEnd(),
    };
  }

  // Pattern 3: Text ending with a "Do you approve/confirm/authorize..." question
  // May span multiple lines, so check the last few lines combined
  const question = extractTrailingQuestion(content);
  if (question) {
    const idx = content.lastIndexOf(question);
    return {
      approvalRequest: { question },
      cleanedContent: content.slice(0, idx).trimEnd(),
    };
  }

  return null;
}

/**
 * Looks at the tail of a text block for a question starting with
 * "Do you approve/confirm/authorize..." that may wrap across lines.
 * Strips markdown bold (**) from the extracted question.
 */
function extractTrailingQuestion(text: string): string | null {
  const trimmed = text.trimEnd();

  // Strip trailing markdown bold/italic then check for ?
  const stripped = trimmed.replace(/[\s*_]+$/, "");
  if (!stripped.endsWith("?")) return null;

  const lines = trimmed.split("\n");

  // Try last 1, 2, or 3 lines combined (to handle wrapping)
  for (let n = 1; n <= Math.min(3, lines.length); n++) {
    const candidate = lines
      .slice(-n)
      .map((l) => l.trim())
      .join(" ");

    // Strip markdown bold/italic for matching
    const plain = candidate.replace(/\*\*/g, "").replace(/__/g, "");

    if (
      /^do you (?:approve|confirm|authorize)\b/i.test(plain)
    ) {
      return candidate;
    }
  }

  return null;
}
