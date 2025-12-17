"use client";

import { useState, useMemo } from "react";
import {
  Search,
  MoreHorizontal,
  Plus,
  Star,
  Banknote,
  BookOpen,
  Palmtree,
  TrendingUp,
  Users,
  Calculator,
  Sparkles,
  Heart,
  Clock,
  Smile,
  Wrench,
  Bot,
  Presentation,
  Pizza,
  GraduationCap,
  PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Agent } from "@/types/agent";
import { cn } from "@/lib/utils";

interface AgentsViewProps {
  agents: Agent[];
  onAgentClick: (agentId: string) => void;
  onToggleFavorite: (agentId: string) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  banknote: Banknote,
  "book-open": BookOpen,
  "palm-tree": Palmtree,
  "trending-up": TrendingUp,
  users: Users,
  calculator: Calculator,
  sparkles: Sparkles,
  heart: Heart,
  clock: Clock,
  smile: Smile,
  wrench: Wrench,
  bot: Bot,
  presentation: Presentation,
  pizza: Pizza,
  "graduation-cap": GraduationCap,
  "party-popper": PartyPopper,
};

export function AgentsView({ agents, onAgentClick, onToggleFavorite }: AgentsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAgents = useMemo(() => {
    if (!searchQuery.trim()) return agents;
    const query = searchQuery.toLowerCase();
    return agents.filter((agent) =>
      agent.name.toLowerCase().includes(query)
    );
  }, [agents, searchQuery]);

  const favoriteAgents = useMemo(
    () => filteredAgents.filter((agent) => agent.isFavorite),
    [filteredAgents]
  );

  const allAgents = filteredAgents;

  return (
    <div className="flex h-full flex-1 flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h1 className="text-2xl font-semibold">Agents</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name, etc..."
              className="w-64 pl-9"
            />
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 py-6">
        {/* Favorites Section */}
        {favoriteAgents.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold">Favorites</h2>
            <div className="flex flex-wrap gap-4">
              {favoriteAgents.map((agent) => {
                const IconComponent = iconMap[agent.icon] || Bot;
                return (
                  <div
                    key={agent.id}
                    className="group relative flex w-40 flex-col items-center rounded-xl border border-border bg-card p-6 transition-colors hover:bg-accent"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(agent.id);
                      }}
                      className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    </button>
                    <button
                      onClick={() => onAgentClick(agent.id)}
                      className="flex flex-col items-center"
                    >
                      <IconComponent className="mb-3 h-8 w-8" />
                      <span className="text-center text-sm font-medium">
                        {agent.name}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* All Agents Section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">All Agents</h2>
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              New Agent
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allAgents.map((agent) => {
              const IconComponent = iconMap[agent.icon] || Bot;
              return (
                <div
                  key={agent.id}
                  className="group relative flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(agent.id);
                    }}
                    className={cn(
                      "absolute right-3 top-3 transition-opacity",
                      agent.isFavorite
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    )}
                  >
                    <Star
                      className={cn(
                        "h-4 w-4",
                        agent.isFavorite
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-muted-foreground hover:text-yellow-500"
                      )}
                    />
                  </button>
                  <button
                    onClick={() => onAgentClick(agent.id)}
                    className="flex flex-1 items-center gap-4"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="font-medium">{agent.name}</div>
                      <div className="truncate text-sm text-muted-foreground">
                        {agent.description}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
