import type { CSSProperties } from "react";

/**
 * 10 themed avatar colors defined as CSS variables in globals.css.
 * Each theme (Inkwell, Mercury, Orbital) defines its own harmonious palette.
 */
const AVATAR_VARS = [
  "var(--avatar-1)",
  "var(--avatar-2)",
  "var(--avatar-3)",
  "var(--avatar-4)",
  "var(--avatar-5)",
  "var(--avatar-6)",
  "var(--avatar-7)",
  "var(--avatar-8)",
  "var(--avatar-9)",
  "var(--avatar-10)",
] as const;

/** Deterministic hash-based color assignment — same ID always gets same color */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

/** Get the CSS variable reference for an avatar color by ID */
export function getAvatarColor(id: string): string {
  return AVATAR_VARS[hashString(id) % AVATAR_VARS.length];
}

/** Get inline style object for an avatar background */
export function getAvatarStyle(id: string): CSSProperties {
  return { backgroundColor: getAvatarColor(id) };
}

/** Get the avatar initial(s) from a name */
export function getAvatarInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
