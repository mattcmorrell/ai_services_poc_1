import { ClarifyingQuestion, ClarifyingQuestions } from "@/types/chat";

interface ParsedClarifyingQuestions {
  questions: ClarifyingQuestions;
  cleanedContent: string;
}

interface JsonOption {
  label?: string;
  description?: string;
}

interface JsonQuestion {
  id?: string;
  header?: string;
  question?: string;
  options?: JsonOption[];
  multiSelect?: boolean;
}

/**
 * Parses clarifying questions from LLM response content.
 * Detects {"clarifyingQuestions":[...]} JSON blocks (fenced or inline).
 * Returns parsed questions and cleaned content, or null if none found.
 */
export function parseClarifyingQuestions(
  content: string
): ParsedClarifyingQuestions | null {
  // Pattern 1: fenced code block with json
  const fencedRegex =
    /```json\s*\n?\s*(\{"clarifyingQuestions"\s*:\s*\[[\s\S]*?\]\})\s*\n?\s*```/;
  // Pattern 2: raw inline JSON
  const inlineRegex =
    /(\{"clarifyingQuestions"\s*:\s*\[[\s\S]*?\]\})/;

  const fencedMatch = content.match(fencedRegex);
  const inlineMatch = !fencedMatch ? content.match(inlineRegex) : null;
  const match = fencedMatch || inlineMatch;

  if (!match) return null;

  try {
    const parsed = JSON.parse(match[1]);
    const jsonQuestions: JsonQuestion[] = parsed.clarifyingQuestions;

    if (!Array.isArray(jsonQuestions) || jsonQuestions.length === 0) {
      return null;
    }

    const questions: ClarifyingQuestion[] = jsonQuestions
      .filter(
        (q) =>
          q.id &&
          q.header &&
          q.question &&
          Array.isArray(q.options) &&
          q.options.length > 0
      )
      .map((q) => ({
        id: q.id!,
        header: q.header!,
        question: q.question!,
        options: q.options!
          .filter((o) => o.label)
          .map((o) => ({
            label: o.label!,
            description: o.description,
          })),
        multiSelect: q.multiSelect ?? false,
      }));

    if (questions.length === 0) return null;

    const cleanedContent = content.replace(match[0], "").trim();

    return {
      questions: {
        questions,
        answered: false,
      },
      cleanedContent,
    };
  } catch {
    return null;
  }
}
