"use client";

import { useState } from "react";
import { X, FileText, Code, Table, List, MoreHorizontal, Copy, Download, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Artifact } from "@/types/chat";

interface ArtifactPanelProps {
  artifact: Artifact;
  onClose: () => void;
  onUpdate: (artifact: Artifact) => void;
}

const typeIcons = {
  document: FileText,
  code: Code,
  table: Table,
  list: List,
};

export function ArtifactPanel({ artifact, onClose, onUpdate }: ArtifactPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(artifact.content);
  const Icon = typeIcons[artifact.type];

  const handleSave = () => {
    onUpdate({
      ...artifact,
      content: editContent,
      updatedAt: new Date(),
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(artifact.content);
    setIsEditing(false);
  };

  const renderContent = () => {
    if (isEditing) {
      return (
        <div className="flex flex-col h-full">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="flex-1 w-full p-4 bg-background border border-border rounded-lg resize-none font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      );
    }

    switch (artifact.type) {
      case "code":
        return (
          <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
            <code className="text-sm font-mono whitespace-pre-wrap">{artifact.content}</code>
          </pre>
        );
      case "table":
        return (
          <div className="overflow-x-auto">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <pre className="p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap">{artifact.content}</pre>
            </div>
          </div>
        );
      case "list":
      case "document":
      default:
        return (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{artifact.content}</div>
          </div>
        );
    }
  };

  return (
    <div className="w-[480px] border-l border-border flex flex-col bg-background h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-md bg-muted">
            <Icon className="w-4 h-4" />
          </div>
          <h2 className="font-semibold truncate">{artifact.title}</h2>
        </div>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-4">
        {renderContent()}
      </ScrollArea>

      {/* Footer with metadata */}
      <div className="px-4 py-2 border-t border-border text-xs text-muted-foreground">
        {artifact.language && <span className="mr-3">Language: {artifact.language}</span>}
        <span>Last updated: {artifact.updatedAt.toLocaleString()}</span>
      </div>
    </div>
  );
}
