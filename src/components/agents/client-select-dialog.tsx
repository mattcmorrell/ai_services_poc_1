"use client";

import { Building2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Client } from "@/types/chat";
import { Agent } from "@/types/agent";

interface ClientSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: Agent | null;
  clients: Client[];
  onSelectClient: (clientId: string) => void;
}

export function ClientSelectDialog({
  open,
  onOpenChange,
  agent,
  clients,
  onSelectClient,
}: ClientSelectDialogProps) {
  if (!agent) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select a Client</DialogTitle>
          <DialogDescription>
            Choose which client you want to work on with {agent.name}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-80">
          <div className="space-y-2 pr-4">
            {clients.map((client) => (
              <button
                key={client.id}
                onClick={() => onSelectClient(client.id)}
                className="flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:bg-accent"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{client.name}</div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
