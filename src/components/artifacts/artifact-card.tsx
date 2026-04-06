"use client";

import { FileText, Code, Table, ListBullets, DotsThree, PencilSimple, Copy, DownloadSimple, Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Artifact } from "@/types/chat";

interface ArtifactCardProps {
  artifact: Artifact;
  isSelected: boolean;
  onClick: () => void;
  onEdit?: () => void;
  onCopy?: () => void;
  onDownloadSimple?: () => void;
  onDelete?: () => void;
}

const typeIcons = {
  document: FileText,
  code: Code,
  table: Table,
  list: ListBullets,
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function ArtifactCard({ artifact, isSelected, onClick, onEdit, onCopy, onDownloadSimple, onDelete }: ArtifactCardProps) {
  const Icon = typeIcons[artifact.type];

  return (
    <div
      className={cn(
        "w-full max-w-xs text-left p-3 rounded-xl border transition-colors",
        "hover:bg-accent/50",
        isSelected
          ? "border-primary bg-accent"
          : "border-border bg-card"
      )}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={onClick}
          className={cn(
            "p-2 rounded-md shrink-0",
            isSelected ? "bg-primary/20" : "bg-muted"
          )}
        >
          <Icon className="w-4 h-4" />
        </button>
        <button onClick={onClick} className="flex-1 min-w-0 text-left">
          <div className="font-medium text-sm truncate">{artifact.title}</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {formatDate(artifact.createdAt)}
          </div>
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <DotsThree className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <PencilSimple className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onCopy}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDownloadSimple}>
              <DownloadSimple className="w-4 h-4 mr-2" />
              DownloadSimple
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
