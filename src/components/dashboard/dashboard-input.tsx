"use client";

import { useState } from "react";
import { Plus, Mic, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardInputProps {
  onSend: (message: string) => void;
}

const models = [
  "GPT-4o",
  "GPT-4 Turbo",
  "Claude 3.5 Sonnet",
  "Claude 3 Opus",
  "Gemini 1.5 Pro",
  "Gemini 2.0 Flash",
];

export function DashboardInput({ onSend }: DashboardInputProps) {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("GPT-4o");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="rounded-xl border border-border bg-card p-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          rows={1}
          className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <div className="mt-2 flex items-center justify-between">
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                  {selectedModel}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {models.map((model) => (
                  <DropdownMenuItem
                    key={model}
                    onClick={() => setSelectedModel(model)}
                  >
                    {model}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
              <Mic className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
