"use client";

import { useState, useCallback } from "react";
import { X, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkflowCanvas } from "./workflow-canvas";
import { BambooHRView } from "./bamboo-hr-view";
import { Workflow, WorkflowTab } from "@/types/workflow";
import { cn } from "@/lib/utils";

interface WorkflowPanelProps {
  workflow: Workflow;
  onClose: () => void;
}

export function WorkflowPanel({ workflow, onClose }: WorkflowPanelProps) {
  const [tabs, setTabs] = useState<WorkflowTab[]>([
    {
      id: "workflow-main",
      type: "workflow",
      title: workflow.name,
      workflowId: workflow.id,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState("workflow-main");

  const handleOpenExternal = useCallback((stepId: string, stepTitle: string) => {
    const existingTab = tabs.find(
      (tab) => tab.type === "external" && tab.id === `bamboo-${stepId}`
    );

    if (existingTab) {
      setActiveTabId(existingTab.id);
    } else {
      const newTab: WorkflowTab = {
        id: `bamboo-${stepId}`,
        type: "external",
        title: "BambooHR",
        url: "www.bamboohr.com/payroll",
      };
      setTabs((prev) => [...prev, newTab]);
      setActiveTabId(newTab.id);
    }
  }, [tabs]);

  const handleCloseTab = useCallback((tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (tabs.length === 1) {
      onClose();
      return;
    }

    const tabIndex = tabs.findIndex((t) => t.id === tabId);
    const newTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(newTabs);

    if (activeTabId === tabId) {
      const newActiveIndex = Math.min(tabIndex, newTabs.length - 1);
      setActiveTabId(newTabs[newActiveIndex].id);
    }
  }, [tabs, activeTabId, onClose]);

  const activeTab = tabs.find((t) => t.id === activeTabId);

  return (
    <div className="flex h-full w-[600px] flex-col border-l border-stone-300 bg-stone-50">
      {/* Tab Bar */}
      <div className="flex items-center border-b border-stone-300 bg-stone-100">
        <div className="flex flex-1 items-center overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={cn(
                "flex items-center gap-2 border-r border-stone-300 px-4 py-2 text-sm transition-colors",
                activeTabId === tab.id
                  ? "bg-stone-50 text-stone-900"
                  : "bg-stone-200 text-stone-600 hover:bg-stone-150"
              )}
            >
              {tab.type === "workflow" ? (
                <ArrowUpDown className="h-4 w-4" />
              ) : (
                <span className="flex h-4 w-4 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white">
                  B
                </span>
              )}
              <span className="max-w-[150px] truncate">{tab.title}</span>
              <button
                onClick={(e) => handleCloseTab(tab.id, e)}
                className="ml-1 rounded p-0.5 hover:bg-stone-300"
              >
                <X className="h-3 w-3" />
              </button>
            </button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="m-1 h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab?.type === "workflow" ? (
          <WorkflowCanvas workflow={workflow} onOpenExternal={handleOpenExternal} />
        ) : activeTab?.type === "external" ? (
          <BambooHRView stepTitle={activeTab.title} />
        ) : null}
      </div>
    </div>
  );
}
