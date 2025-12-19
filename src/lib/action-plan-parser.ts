import { ActionPlan, ActionPlanStep } from "@/types/chat";

interface ParsedActionPlan {
  plan: ActionPlan;
  cleanedContent: string;
}

export function parseActionPlan(content: string): ParsedActionPlan | null {
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
