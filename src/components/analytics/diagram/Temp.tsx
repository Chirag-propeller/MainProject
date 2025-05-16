import React from 'react';
import { Handle, Position } from 'reactflow';

export const HorizontalTableNode1 = ({ data }: any) => {
  return (
    <div className="bg-white border rounded shadow text-xs ">
      <table className="table-auto border-collapse w-full text-left">
        <tbody>
          <tr>
            <td rowSpan={3} className="font-bold text-center align-middle border-r px-2">
              {data.label}
            </td>
            <td className="pl-1 border-r border-b px-2">NLP Error Rate</td>
            <td className="text-right px-2 border-b">{data.lessThan10 || 0} (10%)</td>
          </tr>
          <tr>
            <td className="pl-1 border-r border-b px-2">Intent Success Rate</td>
            <td className="text-right px-2 border-b">{data.between10and1min || 0} (10%)</td>
          </tr>
          <tr>
            <td className="pl-1 border-r px-2">Resolution Success</td>
            <td className="text-right px-2">{data.moreThan1min || 0} (10%)</td>
          </tr>
        </tbody>
      </table>

      {/* React Flow handles */}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};
