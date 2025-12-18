"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

function WorkflowEndNode() {
  return (
    <div className="flex items-center gap-2">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-stone-400 dark:!bg-stone-500 !w-2 !h-2 !border-0"
      />
      <span className="text-2xl">🎉</span>
      <span className="font-bold text-stone-800 dark:text-stone-100">Done!!!</span>
    </div>
  );
}

export default memo(WorkflowEndNode);
