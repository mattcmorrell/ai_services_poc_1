"use client";

import { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Pencil, ChevronDown, ChevronUp, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WorkflowStep } from "@/types/workflow";

export interface StepNodeData extends Record<string, unknown> {
  step: WorkflowStep;
  stepNumber: number;
  onEdit: (stepId: string) => void;
  onOpenExternal: (stepId: string, stepTitle: string) => void;
  isEditing: boolean;
}

interface WorkflowStepNodeProps {
  data: StepNodeData;
}

function WorkflowStepNode({ data }: WorkflowStepNodeProps) {
  const { step, stepNumber, onEdit, onOpenExternal, isEditing } = data;
  const [isExpanded, setIsExpanded] = useState(false);
  const [editInput, setEditInput] = useState("");

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editInput.trim()) {
      console.log("Edit submitted for step:", step.id, "Content:", editInput);
      setEditInput("");
    }
  };

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-stone-400 dark:!bg-stone-500 !w-2 !h-2 !border-0"
      />
      
      <div
        className={cn(
          "bg-stone-200 dark:bg-stone-800 rounded-lg px-4 py-3 min-w-[280px] max-w-[320px] cursor-pointer transition-all",
          "border-2 border-transparent hover:border-stone-300 dark:hover:border-stone-600",
          isExpanded && "border-stone-400 dark:border-stone-500"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-stone-800 dark:text-stone-100 text-sm">
            {stepNumber}. {step.title}
          </h3>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-stone-500 dark:text-stone-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-stone-500 dark:text-stone-400" />
          )}
        </div>

        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(step.id);
            }}
            className="flex items-center gap-1 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 underline"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenExternal(step.id, step.title);
            }}
            className="flex items-center gap-1 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100"
          >
            <span className="w-3 h-3 rounded-full bg-green-600 flex items-center justify-center text-white text-[8px] font-bold">B</span>
            <span className="underline">Open in BambooHR</span>
          </button>
        </div>

        {isExpanded && step.metadata && (
          <div className="mt-3 pt-3 border-t border-stone-300 dark:border-stone-600 text-xs text-stone-600 dark:text-stone-400 space-y-1">
            {step.description && (
              <p className="text-stone-700 dark:text-stone-300 mb-2">{step.description}</p>
            )}
            {step.metadata.duration && (
              <div><span className="font-medium">Duration:</span> {step.metadata.duration}</div>
            )}
            {step.metadata.assignee && (
              <div><span className="font-medium">Assignee:</span> {step.metadata.assignee}</div>
            )}
            {step.metadata.status && (
              <div><span className="font-medium">Status:</span> {step.metadata.status}</div>
            )}
            {step.metadata.lastModified && (
              <div><span className="font-medium">Last Modified:</span> {step.metadata.lastModified}</div>
            )}
          </div>
        )}
      </div>

      {isEditing && (
        <form onSubmit={handleEditSubmit} className="mt-2">
          <div className="flex items-center gap-2 bg-white dark:bg-stone-700 rounded-full border border-stone-300 dark:border-stone-600 px-4 py-2 shadow-sm">
            <input
              type="text"
              value={editInput}
              onChange={(e) => setEditInput(e.target.value)}
              placeholder="Ask for changes"
              className="flex-1 text-sm outline-none bg-transparent text-stone-900 dark:text-stone-100 placeholder:text-stone-500 dark:placeholder:text-stone-400"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              type="submit"
              size="icon"
              className="h-7 w-7 rounded-full bg-stone-100 hover:bg-white dark:bg-stone-500 dark:hover:bg-stone-400 text-stone-800 dark:text-stone-100"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </form>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-stone-400 dark:!bg-stone-500 !w-2 !h-2 !border-0"
      />
    </div>
  );
}

export default memo(WorkflowStepNode);
