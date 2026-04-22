"use client";

import { useState, useEffect } from "react";

export type SidebarFilter = "by-client" | "recent";

function readStorage(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

export function useSidebarState() {
  const [collapsed, setCollapsed] = useState(false);
  const [filter, setFilter] = useState<SidebarFilter>("by-client");
  const [expandedClientIds, setExpandedClientIds] = useState<Set<string>>(new Set());
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedCollapsed = readStorage("sidebar-collapsed", "false");
    const storedFilter = readStorage("sidebar-filter", "by-client");
    const storedExpanded = readStorage("sidebar-expanded-clients", "");

    setCollapsed(storedCollapsed === "true");
    setFilter(storedFilter === "recent" ? "recent" : "by-client");
    if (storedExpanded) {
      setExpandedClientIds(new Set(storedExpanded.split(",").filter(Boolean)));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage("sidebar-collapsed", String(collapsed));
  }, [collapsed, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage("sidebar-filter", filter);
  }, [filter, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage("sidebar-expanded-clients", [...expandedClientIds].join(","));
  }, [expandedClientIds, hydrated]);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      if (!c) setPopoverOpen(false);
      return !c;
    });
  };

  const toggleClientExpanded = (clientId: string) => {
    setExpandedClientIds((prev) => {
      const next = new Set(prev);
      if (next.has(clientId)) next.delete(clientId);
      else next.add(clientId);
      return next;
    });
  };

  const collapseAllClients = () => setExpandedClientIds(new Set());

  return {
    collapsed,
    filter,
    expandedClientIds,
    popoverOpen,
    setCollapsed,
    setFilter,
    toggleCollapsed,
    toggleClientExpanded,
    collapseAllClients,
    setPopoverOpen,
  };
}
