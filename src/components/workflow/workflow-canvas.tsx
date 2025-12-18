"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import WorkflowStepNode, { StepNodeData } from "./workflow-step-node";
import WorkflowStartNode from "./workflow-start-node";
import WorkflowEndNode from "./workflow-end-node";
import { Workflow } from "@/types/workflow";

const nodeTypes = {
  stepNode: WorkflowStepNode,
  startNode: WorkflowStartNode,
  endNode: WorkflowEndNode,
};

interface WorkflowCanvasProps {
  workflow: Workflow;
  onOpenExternal: (stepId: string, stepTitle: string) => void;
}

export function WorkflowCanvas({ workflow, onOpenExternal }: WorkflowCanvasProps) {
  const [editingStepId, setEditingStepId] = useState<string | null>(null);

  const handleEdit = useCallback((stepId: string) => {
    setEditingStepId((prev) => (prev === stepId ? null : stepId));
  }, []);

  const initialNodes: Node[] = useMemo(() => {
    const nodes: Node[] = [
      {
        id: "start",
        type: "startNode",
        position: { x: 250, y: 0 },
        data: {},
      },
    ];

    workflow.steps.forEach((step, index) => {
      nodes.push({
        id: step.id,
        type: "stepNode",
        position: { x: 150, y: 80 + index * 140 },
        data: {
          step,
          stepNumber: index + 1,
          onEdit: handleEdit,
          onOpenExternal,
          isEditing: editingStepId === step.id,
        } as StepNodeData,
      });
    });

    nodes.push({
      id: "end",
      type: "endNode",
      position: { x: 250, y: 80 + workflow.steps.length * 140 },
      data: {},
    });

    return nodes;
  }, [workflow.steps, handleEdit, onOpenExternal, editingStepId]);

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [
      {
        id: "start-to-first",
        source: "start",
        target: workflow.steps[0]?.id || "end",
        type: "smoothstep",
        style: { stroke: "#a8a29e", strokeWidth: 2 },
        markerEnd: {
          type: "arrowclosed" as const,
          color: "#a8a29e",
        },
      },
    ];

    workflow.steps.forEach((step, index) => {
      const nextTarget = workflow.steps[index + 1]?.id || "end";
      edges.push({
        id: `${step.id}-to-${nextTarget}`,
        source: step.id,
        target: nextTarget,
        type: "smoothstep",
        style: { stroke: "#a8a29e", strokeWidth: 2 },
        markerEnd: {
          type: "arrowclosed" as const,
          color: "#a8a29e",
        },
      });
    });

    return edges;
  }, [workflow.steps]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when editingStepId changes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === "stepNode") {
          return {
            ...node,
            data: {
              ...node.data,
              isEditing: editingStepId === node.id,
            },
          };
        }
        return node;
      })
    );
  }, [editingStepId, setNodes]);

  return (
    <div className="h-full w-full bg-stone-100">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.5}
        maxZoom={2}
        panOnScroll
        selectionOnDrag
        panOnDrag
      >
        <Controls
          position="top-right"
          showInteractive={false}
          className="!bg-white !border-stone-300 !shadow-sm"
        />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#d6d3d1" />
      </ReactFlow>
    </div>
  );
}
