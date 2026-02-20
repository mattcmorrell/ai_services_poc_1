"use client";

import { MessageSquare, Users, FileText, AlertCircle, Building2, MapPin, Phone } from "lucide-react";
import { Client, Chat } from "@/types/chat";

interface ClientHomeTabProps {
  client: Client;
  chats: Chat[];
  onOpenChat: (chat: Chat) => void;
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// Mock enrichment data per client — in production this comes from the API
const clientMeta: Record<string, { industry: string; employees: number; location: string; contact: string }> = {
  "1": { industry: "Research & Development", employees: 312, location: "Cleveland, OH", contact: "Cave Johnson" },
  "2": { industry: "Pharmaceuticals", employees: 1420, location: "Raccoon City, CO", contact: "Albert Wesker" },
  "3": { industry: "Space Exploration", employees: 890, location: "Gateway Station", contact: "Carter Burke" },
  "4": { industry: "Theoretical Physics", employees: 47, location: "Black Mesa, NM", contact: "Dr. Eli Vance" },
  "5": { industry: "Defense Technology", employees: 156, location: "Sunnyvale, CA", contact: "Miles Dyson" },
  "6": { industry: "Bioengineering", employees: 620, location: "Los Angeles, CA", contact: "Eldon Tyrell" },
};

export function ClientHomeTab({ client, chats, onOpenChat }: ClientHomeTabProps) {
  const unreadChats = chats.filter((c) => c.hasUnread);
  const meta = clientMeta[client.id];

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-background p-8">
      {/* Client header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg font-semibold text-primary">
            {client.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-semibold">{client.name}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {meta && (
                <>
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {meta.industry}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {meta.location}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        {meta && (
          <div className="ml-[52px] flex items-center gap-1 text-xs text-muted-foreground">
            <Phone className="h-3 w-3" />
            Primary contact: <span className="text-foreground">{meta.contact}</span>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-1 flex items-center gap-2 text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Active Chats</span>
          </div>
          <p className="text-2xl font-semibold">{chats.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-1 flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Unread</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-semibold">{client.unreadCount}</p>
            {client.unreadCount >= 4 && (
              <span className="text-xs font-medium text-red-400">Urgent</span>
            )}
            {client.unreadCount >= 1 && client.unreadCount < 4 && (
              <span className="text-xs font-medium text-amber-400">Needs attention</span>
            )}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-1 flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Employees</span>
          </div>
          <p className="text-2xl font-semibold">{meta?.employees ?? "—"}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent chats */}
        <div>
          <h2 className="mb-3 text-sm font-semibold">Recent Chats</h2>
          <div className="flex flex-col gap-1">
            {chats
              .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
              .map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onOpenChat(chat)}
                  className="group flex items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-accent"
                >
                  {chat.hasUnread ? (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  ) : (
                    <span className="h-1.5 w-1.5 shrink-0" />
                  )}
                  <span className="flex-1 truncate text-sm">{chat.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground" suppressHydrationWarning>
                    {timeAgo(chat.updatedAt)}
                  </span>
                </button>
              ))}
          </div>
        </div>

        {/* Documents stub */}
        <div>
          <h2 className="mb-3 text-sm font-semibold">Documents</h2>
          <div className="flex flex-col gap-1">
            {["Employee Handbook", "Benefits Summary 2024", "Org Chart"].map((doc) => (
              <div
                key={doc}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground"
              >
                <FileText className="h-4 w-4 shrink-0" />
                <span className="truncate text-sm">{doc}</span>
              </div>
            ))}
            <p className="mt-2 px-3 text-xs text-muted-foreground">
              Document management coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
