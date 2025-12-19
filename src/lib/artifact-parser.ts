import { Artifact } from "@/types/chat";

interface ParsedContent {
  content: string; // Content with artifact tags removed
  artifacts: Artifact[];
}

/**
 * Parse LLM response content to extract artifacts
 * Artifacts are wrapped in <artifact title="..." type="..." language="...">content</artifact>
 */
export function parseArtifacts(rawContent: string): ParsedContent {
  const artifacts: Artifact[] = [];
  
  // Regex to match artifact tags
  const artifactRegex = /<artifact\s+title="([^"]+)"\s+type="(code|table|list|document)"(?:\s+language="([^"]+)")?\s*>([\s\S]*?)<\/artifact>/g;
  
  let match;
  let contentWithPlaceholders = rawContent;
  
  while ((match = artifactRegex.exec(rawContent)) !== null) {
    const [fullMatch, title, type, language, content] = match;
    
    const artifact: Artifact = {
      id: `artifact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      type: type as Artifact["type"],
      content: content.trim(),
      language: language || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    artifacts.push(artifact);
    
    // Replace artifact tag with a placeholder reference
    contentWithPlaceholders = contentWithPlaceholders.replace(
      fullMatch,
      `[ARTIFACT:${artifact.id}]`
    );
  }
  
  return {
    content: contentWithPlaceholders.trim(),
    artifacts,
  };
}

/**
 * Get artifact IDs from content that contains placeholders
 */
export function getArtifactIdsFromContent(content: string): string[] {
  const ids: string[] = [];
  const placeholderRegex = /\[ARTIFACT:(artifact-[^\]]+)\]/g;
  
  let match;
  while ((match = placeholderRegex.exec(content)) !== null) {
    ids.push(match[1]);
  }
  
  return ids;
}
