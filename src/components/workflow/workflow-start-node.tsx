"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

function WorkflowStartNode() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded-full bg-green-500" />
      <span className="font-semibold text-stone-800 dark:text-stone-100">Start</span>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-stone-400 dark:!bg-stone-500 !w-2 !h-2 !border-0"
      />
    </div>
  );
}

export default memo(WorkflowStartNode);
