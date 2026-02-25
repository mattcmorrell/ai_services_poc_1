"use client";

import { cn } from "@/lib/utils";

type ViewMode = "recent" | "clients";

interface ChatClientToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ChatClientToggle({ mode, onChange }: ChatClientToggleProps) {
  return (
    <div className="flex bg-muted rounded-lg p-1 w-full">
      <button
        onClick={() => onChange("recent")}
        className={cn(
          "flex-1 py-1.5 px-3 text-sm whitespace-nowrap rounded-md transition-colors",
          mode === "recent"
            ? "bg-background font-medium shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Recent Chats
      </button>
      <button
        onClick={() => onChange("clients")}
        className={cn(
          "flex-1 py-1.5 px-3 text-sm whitespace-nowrap rounded-md transition-colors",
          mode === "clients"
            ? "bg-background font-medium shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Clients
      </button>
    </div>
  );
}
