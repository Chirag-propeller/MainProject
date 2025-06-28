// SmallNode.tsx
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import 'reactflow/dist/style.css';

export const SmallNode = ({ data }: NodeProps) => {
  return (
    <div className="bg-blue-100 dark:bg-blue-900/50 text-xs w-42 h-6 rounded shadow dark:shadow-gray-700/50 flex items-center justify-center text-center p-1 text-gray-900 dark:text-gray-100">
      {data.label}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};
