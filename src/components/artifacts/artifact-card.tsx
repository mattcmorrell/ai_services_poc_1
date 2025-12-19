"use client";

import { FileText, Code, Table, List, MoreHorizontal, Pencil, Copy, Download, Trash2 } from "lucide-react";
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
  onDownload?: () => void;
  onDelete?: () => void;
}

const typeIcons = {
  document: FileText,
  code: Code,
  table: Table,
  list: List,
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function ArtifactCard({ artifact, isSelected, onClick, onEdit, onCopy, onDownload, onDelete }: ArtifactCardProps) {
  const Icon = typeIcons[artifact.type];

  return (
    <div
      className={cn(
        "w-full max-w-xs text-left p-3 rounded-lg border transition-colors",
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
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onCopy}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
