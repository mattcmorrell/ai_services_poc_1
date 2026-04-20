"use client";

import { DotsThreeVertical, PencilSimple, Trash } from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ChatRowMenuProps {
  chatId: string;
  onRename: (chatId: string) => void;
  onDelete: (chatId: string) => void;
  isSelected?: boolean;
}

export function ChatRowMenu({ chatId, onRename, onDelete, isSelected }: ChatRowMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100",
            isSelected
              ? "text-primary-foreground hover:bg-primary-foreground/20"
              : "text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
          )}
          aria-label="Chat options"
        >
          <DotsThreeVertical className="h-4 w-4" weight="bold" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="right" sideOffset={4} className="w-36">
        <DropdownMenuItem onSelect={() => onRename(chatId)}>
          <PencilSimple className="mr-2 h-3.5 w-3.5" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => onDelete(chatId)}
          className="text-destructive focus:text-destructive"
        >
          <Trash className="mr-2 h-3.5 w-3.5" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
