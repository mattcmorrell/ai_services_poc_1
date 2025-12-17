"use client";

import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TodoItem } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface TodoListProps {
  todos: TodoItem[];
  onToggle: (id: string) => void;
  onAdd: (text: string) => void;
}

export function TodoList({ todos, onToggle, onAdd }: TodoListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTodoText, setNewTodoText] = useState("");

  const handleAdd = () => {
    if (newTodoText.trim()) {
      onAdd(newTodoText.trim());
      setNewTodoText("");
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    } else if (e.key === "Escape") {
      setIsAdding(false);
      setNewTodoText("");
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">To do list</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        {isAdding && (
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border" />
            <Input
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                if (!newTodoText.trim()) {
                  setIsAdding(false);
                }
              }}
              placeholder="Add a task..."
              className="h-7 text-sm"
              autoFocus
            />
          </div>
        )}
        {todos.map((todo) => (
          <button
            key={todo.id}
            onClick={() => onToggle(todo.id)}
            className="flex w-full items-start gap-2 rounded p-1 text-left transition-colors hover:bg-accent"
          >
            <div
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                todo.completed
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border"
              )}
            >
              {todo.completed && <Check className="h-3 w-3" />}
            </div>
            <span
              className={cn(
                "text-sm",
                todo.completed && "text-muted-foreground line-through"
              )}
            >
              {todo.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
