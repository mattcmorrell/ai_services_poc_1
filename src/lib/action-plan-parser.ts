import { ActionPlan, ActionPlanStep } from "@/types/chat";

interface ParsedActionPlan {
  plan: ActionPlan;
  cleanedContent: string;
}

/**
 * Parses an action plan from LLM response content.
 * Supports two formats:
 * 1. JSON: {"plan":{...}} blocks (fenced or inline)
 * 2. XML: <action_plan>...</action_plan> tags with YAML-like content
 *
 * Tries JSON first, falls back to XML.
 */
export function parseActionPlan(content: string): ParsedActionPlan | null {
  return parseJsonPlan(content) || parseXmlPlan(content);
}

// --- JSON plan parsing ---

interface JsonStep {
  title?: string;
  description?: string;
  status?: string;
  gated?: boolean;
}

interface JsonPlan {
  title?: string;
  description?: string;
  objective?: string;
  estimatedTime?: string;
  affectedCount?: number;
  affectedLabel?: string;
  steps?: JsonStep[];
}

function mapJsonStatus(status?: string): ActionPlanStep["status"] {
  switch (status) {
    case "running":
    case "in_progress":
      return "in_progress";
    case "completed":
    case "done":
      return "completed";
    default:
      return "pending";
  }
}

function parseJsonPlan(content: string): ParsedActionPlan | null {
  // Pattern 1: fenced code block with json
  const fencedRegex = /```json\s*\n?\s*(\{"plan"\s*:\s*\{[\s\S]*?\}\})\s*\n?\s*```/;
  // Pattern 2: raw inline JSON
  const inlineRegex = /(\{"plan"\s*:\s*\{[\s\S]*?\}\})/;

  const fencedMatch = content.match(fencedRegex);
  const inlineMatch = !fencedMatch ? content.match(inlineRegex) : null;
  const match = fencedMatch || inlineMatch;

  if (!match) return null;

  try {
    const parsed = JSON.parse(match[1]);
    const jsonPlan: JsonPlan = parsed.plan;

    if (!jsonPlan || !Array.isArray(jsonPlan.steps) || jsonPlan.steps.length === 0) {
      return null;
    }

    const title = jsonPlan.title || "";
    if (!title) return null;

    const steps: ActionPlanStep[] = jsonPlan.steps.map((step, index) => ({
      id: `step-${index + 1}`,
      description: step.title || step.description || `Step ${index + 1}`,
      status: mapJsonStatus(step.status),
      nonUndoable: step.gated === true,
    }));

    const plan: ActionPlan = {
      id: `plan-${Date.now()}`,
      title,
      description: jsonPlan.description || jsonPlan.objective || "",
      steps,
      status: "pending",
    };

    if (jsonPlan.estimatedTime || jsonPlan.affectedCount || jsonPlan.affectedLabel) {
      plan.metadata = {};
      if (jsonPlan.estimatedTime) plan.metadata.estimatedTime = jsonPlan.estimatedTime;
      if (jsonPlan.affectedCount) plan.metadata.affectedCount = jsonPlan.affectedCount;
      if (jsonPlan.affectedLabel) plan.metadata.affectedLabel = jsonPlan.affectedLabel;
    }

    // Remove the JSON block from displayed content
    const cleanedContent = content.replace(match[0], "").trim();

    return { plan, cleanedContent };
  } catch {
    return null;
  }
}

// --- XML plan parsing (existing format) ---

function parseXmlPlan(content: string): ParsedActionPlan | null {
  const actionPlanRegex = /<action_plan>([\s\S]*?)<\/action_plan>/;
  const match = content.match(actionPlanRegex);

  if (!match) {
    return null;
  }

  const planContent = match[1].trim();
  const lines = planContent.split("\n");

  let title = "";
  let description = "";
  let affectedCount: number | undefined;
  let affectedLabel: string | undefined;
  let estimatedTime: string | undefined;
  const steps: ActionPlanStep[] = [];
  let inSteps = false;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("title:")) {
      title = trimmedLine.substring(6).trim();
    } else if (trimmedLine.startsWith("description:")) {
      description = trimmedLine.substring(12).trim();
    } else if (trimmedLine.startsWith("affected_count:")) {
      const count = parseInt(trimmedLine.substring(15).trim(), 10);
      if (!isNaN(count)) {
        affectedCount = count;
      }
    } else if (trimmedLine.startsWith("affected_label:")) {
      affectedLabel = trimmedLine.substring(15).trim();
    } else if (trimmedLine.startsWith("estimated_time:")) {
      estimatedTime = trimmedLine.substring(15).trim();
    } else if (trimmedLine.startsWith("steps:")) {
      inSteps = true;
    } else if (inSteps && trimmedLine.startsWith("-")) {
      const stepDescription = trimmedLine.substring(1).trim();
      if (stepDescription) {
        steps.push({
          id: `step-${steps.length + 1}`,
          description: stepDescription,
          status: "pending",
        });
      }
    }
  }

  if (!title || steps.length === 0) {
    return null;
  }

  const plan: ActionPlan = {
    id: `plan-${Date.now()}`,
    title,
    description,
    steps,
    status: "pending",
  };

  if (affectedCount || affectedLabel || estimatedTime) {
    plan.metadata = {};
    if (affectedCount) plan.metadata.affectedCount = affectedCount;
    if (affectedLabel) plan.metadata.affectedLabel = affectedLabel;
    if (estimatedTime) plan.metadata.estimatedTime = estimatedTime;
  }

  // Remove the action_plan tag from content
  const cleanedContent = content.replace(actionPlanRegex, "").trim();

  return { plan, cleanedContent };
}
