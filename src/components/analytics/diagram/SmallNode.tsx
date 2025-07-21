// SmallNode.tsx
import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import "reactflow/dist/style.css";

export const SmallNode = ({ data }: NodeProps) => {
  return (
    <div className="bg-blue-100 dark:bg-indigo-950 text-xs w-42 h-6 rounded shadow flex items-center justify-center text-center p-1">
      {data.label}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};
