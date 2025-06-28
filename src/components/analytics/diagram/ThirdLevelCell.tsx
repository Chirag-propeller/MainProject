import React from 'react';
import { Handle, Position } from 'reactflow';

const ThirdLevelCell = ({ data }: any) => {
  let percentage = "";
  if(data.preValue === 0) {
    percentage = '0';
  } else {
    percentage = ((data.value / data.preValue) * 100).toFixed(0);
  }
  return (
    <>
    <div className={`relative h-28 w-56 border-gray-400 dark:border-gray-600 border-l-8  border rounded shadow dark:shadow-gray-700/50 bg-white dark:bg-gray-800 text-xs font-medium flex ${data.borderColor}`}>
      {/* Left cell: Label */}
      <div className={`text-center font-bold flex-1 flex items-center justify-center border-r border-gray-400 dark:border-gray-600 ${data.textColor}`}>
        {data.label}
      </div>

      {/* Right cell: Count */}
      <div className="flex-1 flex items-center justify-center">
        <div className='flex flex-col items-center justify-center'>
          <p className={`text-center font-bold text-sm ${data.textColor}`}>{data.value || '0'}</p>
          <p className='text-xs text-gray-500 dark:text-gray-400'>({percentage || 0}%)</p>
        </div>
        
      </div>


    </div>
          {/* React Flow handles */}
      <Handle type="target" position={Position.Left} className="!bg-gray-500 dark:!bg-gray-400" />
      <Handle type="source" position={Position.Right} className="!bg-gray-500 dark:!bg-gray-400" />
    </>
  );
};

export default ThirdLevelCell;
