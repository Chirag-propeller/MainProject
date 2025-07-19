import React from "react";
import { Handle, Position } from "reactflow";

const SecondLevelLeg = ({ data }: any) => {
  let percentage = "";
  if (data.preValue === 0) {
    percentage = "0";
  } else {
    percentage = ((data.value / data.preValue) * 100).toFixed(0);
  }

  return (
    <>
      <div
        className={`${data.borderColor} relative h-[250px] w-42 border-gray-400 border-l-8  border rounded shadow bg-white dark:bg-indigo-950 text-xs font-medium flex flex-col justify-center items-center `}
      >
        <div className={`text-center text-xl ${data.textColor}`}>
          {data.value}{" "}
          <span className="text-sm text-gray-400">({percentage || 0}%)</span>
        </div>
        <div className=" text-center text-gray-400 text-lg text-wrap">
          {data.label}
        </div>

        {/* React Flow handles */}
      </div>
      <Handle type="target" position={Position.Left} className="!bg-gray-500" />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-gray-500"
      />
    </>
  );
};

export default SecondLevelLeg;
