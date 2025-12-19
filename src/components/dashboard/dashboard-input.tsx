"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Plus, Mic, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Client } from "@/types/chat";
import { cn } from "@/lib/utils";

interface DashboardInputProps {
  clients: Client[];
  onSend: (message: string, client: Client | null, chipPosition: number) => void;
}

const models = [
  "GPT-4o",
  "GPT-4 Turbo",
  "Claude 3.5 Sonnet",
  "Claude 3 Opus",
  "Gemini 1.5 Pro",
  "Gemini 2.0 Flash",
];

export function DashboardInput({ clients, onSend }: DashboardInputProps) {
  const [selectedModel, setSelectedModel] = useState("GPT-4o");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [autocompleteVisible, setAutocompleteVisible] = useState(false);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const editableRef = useRef<HTMLDivElement>(null);
  const atMentionRangeRef = useRef<{ node: Node; start: number; end: number } | null>(null);

  // Get text content with chip position
  const getTextContentWithChipPosition = useCallback(() => {
    if (!editableRef.current) return { text: "", chipPosition: -1 };
    
    let text = "";
    let chipPosition = -1;
    
    editableRef.current.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent || "";
      } else if ((node as HTMLElement).classList?.contains("inline-client-chip")) {
        chipPosition = text.length;
        // Include the client name in the text
        const chipName = (node as HTMLElement).querySelector(".chip-name");
        if (chipName && selectedClient) {
          text += selectedClient.name;
        }
      } else {
        text += node.textContent || "";
      }
    });
    
    return { text: text.trim(), chipPosition };
  }, [selectedClient]);

  // Detect @ mention at cursor
  const getAtMentionSearch = useCallback(() => {
    const selection = window.getSelection();
    if (!selection?.rangeCount || !editableRef.current) return null;
    
    const range = selection.getRangeAt(0);
    if (!editableRef.current.contains(range.startContainer)) return null;
    
    const node = range.startContainer;
    if (node.nodeType !== Node.TEXT_NODE) return null;
    
    const textBeforeCursor = (node.textContent || "").substring(0, range.startOffset);
    const match = textBeforeCursor.match(/@([A-Za-z]*)$/);
    
    if (match) {
      atMentionRangeRef.current = {
        node,
        start: range.startOffset - match[0].length,
        end: range.startOffset,
      };
      return match[1] || "";
    }
    return null;
  }, []);

  // Filter clients
  const filterClients = useCallback((searchTerm: string) => {
    if (!searchTerm) return clients;
    const term = searchTerm.toLowerCase();
    return clients.filter((c) => c.name.toLowerCase().includes(term));
  }, [clients]);

  // Show autocomplete
  const showAutocomplete = useCallback((searchTerm: string) => {
    const filtered = filterClients(searchTerm);
    if (filtered.length === 0) {
      setAutocompleteVisible(false);
      return;
    }
    setFilteredClients(filtered);
    setSelectedIndex(0);
    setAutocompleteVisible(true);
  }, [filterClients]);

  // Hide autocomplete
  const hideAutocomplete = useCallback(() => {
    setAutocompleteVisible(false);
    setSelectedIndex(0);
  }, []);

  // Select client from autocomplete
  const selectClient = useCallback((client: Client) => {
    if (!atMentionRangeRef.current || !editableRef.current) return;
    
    // Remove existing chip if any
    const existingChip = editableRef.current.querySelector(".inline-client-chip");
    if (existingChip) {
      existingChip.remove();
    }
    
    const { node, start, end } = atMentionRangeRef.current;
    const textContent = node.textContent || "";
    const beforeText = textContent.substring(0, start);
    const afterText = textContent.substring(end);
    
    // Create chip element
    const chip = document.createElement("span");
    chip.className = "inline-client-chip";
    chip.contentEditable = "false";
    chip.innerHTML = `
      <span class="chip-name">${client.name}</span>
      <button class="chip-remove" type="button">
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    `;
    
    // Add click handler for remove button
    const removeBtn = chip.querySelector(".chip-remove");
    if (removeBtn) {
      removeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        chip.remove();
        setSelectedClient(null);
        editableRef.current?.focus();
      });
    }
    
    // Replace text node
    const beforeNode = document.createTextNode(beforeText);
    const afterNode = document.createTextNode(afterText + " ");
    
    node.parentNode?.insertBefore(beforeNode, node);
    node.parentNode?.insertBefore(chip, node);
    node.parentNode?.insertBefore(afterNode, node);
    node.parentNode?.removeChild(node);
    
    // Place cursor after chip
    const selection = window.getSelection();
    const range = document.createRange();
    range.setStart(afterNode, 1);
    range.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(range);
    
    setSelectedClient(client);
    atMentionRangeRef.current = null;
    hideAutocomplete();
  }, [hideAutocomplete]);

  // Handle input
  const handleInput = useCallback(() => {
    const searchTerm = getAtMentionSearch();
    if (searchTerm !== null && !selectedClient) {
      showAutocomplete(searchTerm);
    } else {
      hideAutocomplete();
    }
  }, [getAtMentionSearch, selectedClient, showAutocomplete, hideAutocomplete]);

  // Handle keydown
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (autocompleteVisible) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredClients.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredClients[selectedIndex]) {
          selectClient(filteredClients[selectedIndex]);
        }
      } else if (e.key === "Escape") {
        hideAutocomplete();
      }
    } else {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    }
  }, [autocompleteVisible, filteredClients, selectedIndex, selectClient, hideAutocomplete]);

  // Handle submit
  const handleSubmit = useCallback(() => {
    const { text, chipPosition } = getTextContentWithChipPosition();
    if (!text && !selectedClient) return;
    
    onSend(text, selectedClient, chipPosition);
    
    // Clear input
    if (editableRef.current) {
      editableRef.current.innerHTML = "";
    }
    setSelectedClient(null);
  }, [getTextContentWithChipPosition, selectedClient, onSend]);

  // Close autocomplete on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".dashboard-input-container")) {
        hideAutocomplete();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [hideAutocomplete]);

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="w-full max-w-2xl dashboard-input-container">
      <div className="rounded-xl border border-border bg-card p-3">
        <div className="relative">
          <div
            ref={editableRef}
            contentEditable
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            data-placeholder="Ask anything... (type @ to mention a client)"
            className="min-h-[24px] w-full resize-none bg-transparent text-sm outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:pointer-events-none"
          />
          
          {/* Autocomplete dropdown */}
          {autocompleteVisible && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50">
              <div className="text-xs text-muted-foreground px-3 py-2 border-b border-border">
                Clients
              </div>
              <div className="max-h-48 overflow-y-auto">
                {filteredClients.map((client, index) => (
                  <div
                    key={client.id}
                    onClick={() => selectClient(client)}
                    className={cn(
                      "px-3 py-2 cursor-pointer flex items-center gap-2",
                      index === selectedIndex && "bg-accent"
                    )}
                  >
                    <span>{client.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
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
