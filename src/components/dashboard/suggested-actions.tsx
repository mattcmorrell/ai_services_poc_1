"use client";

import { Button } from "@/components/ui/button";
import { SuggestedAction } from "@/types/dashboard";

interface SuggestedActionsProps {
  actions: SuggestedAction[];
  onActionClick: (prompt: string) => void;
}

export function SuggestedActions({ actions, onActionClick }: SuggestedActionsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {actions.map((action) => (
        <Button
          key={action.id}
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => onActionClick(action.prompt)}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
