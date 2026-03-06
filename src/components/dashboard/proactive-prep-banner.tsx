"use client";

import { useState } from "react";
import { Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProactivePrepEvent } from "@/data/calendar-data";
import { mockClients } from "@/data/mock-data";

interface ProactivePrepBannerProps {
  onPrepClick?: (clientId: string) => void;
}

export function ProactivePrepBanner({ onPrepClick }: ProactivePrepBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const result = getProactivePrepEvent(3);

  if (!result || dismissed) return null;

  const { event, prep } = result;
  const clientName = event.clientId ? mockClients.find((c) => c.id === event.clientId)?.name : null;

  const now = new Date();
  const diffMs = event.startTime.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / (1000 * 60));
  const timeLabel = diffMins < 60 ? `${diffMins} minutes` : `${Math.round(diffMins / 60)} hours`;

  // Generate a contextual suggestion based on event type/title
  const suggestion = prep
    ? `Want me to prep a briefing with ${prep.openItems} open items?`
    : `Want me to pull together a quick summary?`;

  return (
    <div className="flex items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 px-5 py-3.5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15">
        <Zap className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">
          You have a meeting with {clientName || event.title} in {timeLabel}
        </p>
        <p className="text-sm text-primary">{suggestion}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button
          size="sm"
          onClick={() => {
            if (onPrepClick && event.clientId) {
              onPrepClick(event.clientId);
            }
          }}
        >
          Prep Report
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDismissed(true)}
        >
          <X className="mr-1 h-3 w-3" />
          Dismiss
        </Button>
      </div>
    </div>
  );
}
