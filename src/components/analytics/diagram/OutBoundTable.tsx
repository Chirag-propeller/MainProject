import React from 'react';
import { Handle, Position } from 'reactflow';

export const OutBoundTable = ({ data }: any) => {
  return (
    <div className={`bg-white dark:bg-gray-800 border rounded shadow dark:shadow-gray-700/50 text-xs border-gray-400 dark:border-gray-600 border-l-8 ${data.borderColor}`}>
      <table className="table-auto border-collapse w-full text-left h-28 text-gray-500 dark:text-gray-400">
        <tbody>
          <tr>
            <td rowSpan={3} className={`font-bold text-center align-middle border-r px-2 text-wrap w-16 border-gray-400 dark:border-gray-600 ${data.textColor}`} >
              {data.label}
            </td>
            <td className="pl-1 border-gray-400 dark:border-gray-600 border-r text-center border-b px-2 w-14 h-1/2 ">{data?.tableHeading[0]}</td>
            <td className= {`px-2 text-wrap text-center border-gray-400 dark:border-gray-600 text-sm border-b w-20 font-bold ${data.textColor}`}>{data?.tableValues[0] || 0} <br /> <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">(0%)</span> </td>
          </tr>
          <tr>
            <td className="pl-1 border-gray-400 dark:border-gray-600 border-r text-center  px-2 w-14 ">{data?.tableHeading[1]}</td>
            <td className= {`px-2 text-wrap text-center border-gray-400 dark:border-gray-600 border-b w-20 text-sm font-bold ${data.textColor}`}>{data?.tableValues[1] ||0} <br/> <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">(0%)</span> </td>
          </tr>

        </tbody>
      </table>

      {/* React Flow handles */}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};
