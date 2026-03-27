import type { StatusUpdate } from "@/types/chat";

interface ParsedStatusUpdates {
  statusUpdates: StatusUpdate[];
  cleanedContent: string;
}

const STATUS_REGEX = /\[STATUS:\s*([^\]]+)\]/g;

/**
 * Extract [STATUS: ...] markers from content.
 * Returns parsed StatusUpdate objects (all marked "done") and cleaned content.
 * Used in the onFinish pipeline after streaming completes.
 */
export function parseStatusUpdates(content: string): ParsedStatusUpdates {
  const statusUpdates: StatusUpdate[] = [];
  let index = 0;

  let match;
  // Reset regex state
  STATUS_REGEX.lastIndex = 0;
  while ((match = STATUS_REGEX.exec(content)) !== null) {
    statusUpdates.push({
      id: `status-${Date.now()}-${index}`,
      label: match[1].trim(),
      status: "done",
      timestamp: new Date(),
    });
    index++;
  }

  const cleanedContent = content.replace(STATUS_REGEX, "").replace(/\n{3,}/g, "\n\n").trim();

  return { statusUpdates, cleanedContent };
}

/**
 * Extract live status updates from raw streaming text.
 * The last marker is "running", all others are "done".
 * Used during streaming to show activity before onFinish.
 */
export function parseLiveStatusUpdates(content: string): StatusUpdate[] {
  const updates: StatusUpdate[] = [];
  let index = 0;

  STATUS_REGEX.lastIndex = 0;
  let match;
  while ((match = STATUS_REGEX.exec(content)) !== null) {
    updates.push({
      id: `live-status-${index}`,
      label: match[1].trim(),
      status: "done",
      timestamp: new Date(),
    });
    index++;
  }

  // Mark the last one as running (it's still in progress)
  if (updates.length > 0) {
    updates[updates.length - 1].status = "running";
  }

  return updates;
}

/**
 * Strip [STATUS: ...] markers from content for display purposes.
 * Used to clean raw streaming text before rendering.
 */
export function stripStatusMarkers(content: string): string {
  return content.replace(STATUS_REGEX, "").replace(/\n{3,}/g, "\n\n").trim();
}
