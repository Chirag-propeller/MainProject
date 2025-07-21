import React from "react";
import { Handle, Position } from "reactflow";

const ThirdLevelCell = ({ data }: any) => {
  return (
    <div
      className={`relative h-[530px] w-80 border border-gray-400 border-l-8 border-l-indigo-400 rounded shadow bg-white dark:bg-indigo-950 text-xs font-medium flex flex-col justify-center items-center`}
    >
      <div className="text-center text-4xl text-indigo-500">{data.value}</div>
      <div className=" text-center text-xl text-wrap text-gray-400">
        {data.label
          .toLowerCase()
          .split(" ")
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </div>

      {/* React Flow handles */}
      <Handle type="target" position={Position.Left} className="!bg-gray-500" />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-gray-500"
      />
    </div>
  );
};

export default ThirdLevelCell;
