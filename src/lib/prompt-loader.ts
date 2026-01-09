import fs from "fs";
import path from "path";
import { agentPromptMap } from "@/data/prompts";

export interface AgentPrompt {
  greeting: string;
  systemPrompt: string;
}

/**
 * Parses a markdown file with YAML frontmatter
 * Format:
 * ---
 * greeting: |
 *   Multi-line greeting text
 * ---
 * System prompt content here
 */
function parsePromptFile(content: string): AgentPrompt {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!frontmatterMatch) {
    // No frontmatter, treat entire content as system prompt
    return {
      greeting: "",
      systemPrompt: content.trim(),
    };
  }

  const frontmatter = frontmatterMatch[1];
  const systemPrompt = frontmatterMatch[2].trim();

  // Parse greeting from frontmatter (simple YAML parsing)
  const greetingMatch = frontmatter.match(/greeting:\s*\|?\n?([\s\S]*?)(?=\n\w|$)/);
  let greeting = "";

  if (greetingMatch) {
    greeting = greetingMatch[1]
      .split("\n")
      .map(line => line.replace(/^\s{2}/, "")) // Remove 2-space indent
      .join("\n")
      .trim();
  }

  return {
    greeting,
    systemPrompt,
  };
}

/**
 * Loads an agent's prompt by agent ID
 * Returns null if no prompt file exists for the agent
 */
export function loadAgentPrompt(agentId: string): AgentPrompt | null {
  const promptFileName = agentPromptMap[agentId];

  if (!promptFileName) {
    return null;
  }

  const promptPath = path.join(process.cwd(), "src", "data", "prompts", `${promptFileName}.md`);

  try {
    const content = fs.readFileSync(promptPath, "utf-8");
    return parsePromptFile(content);
  } catch (error) {
    console.error(`Failed to load prompt for agent ${agentId}:`, error);
    return null;
  }
}

/**
 * Gets just the greeting for an agent (for client-side use via API)
 */
export function getAgentGreeting(agentId: string): string | null {
  const prompt = loadAgentPrompt(agentId);
  return prompt?.greeting || null;
}
