import React from 'react';
import { Handle, Position } from 'reactflow';

const Sentiment = ({ data }: any) => {
  return (
    <div className={`bg-white border rounded shadow text-xs border-gray-400 border-l-8 border-l-${data.borderColor}`}>
      <table className="table-auto border-collapse w-full text-left ">
        <tbody>
          <tr>
            <td rowSpan={3} className={`font-bold text-center align-middle border-r border-gray-400  px-2 text-wrap w-32 ${data.textColor}`}>
              {data.label}
            </td>
            <td className="pl-1 border-r border-b border-gray-400 text-green-400 px-2 w-32">{data?.tableHeading[0]}</td>
            <td className= {`text-right px-2 text-sm  border-gray-400 text-green-400 font-bold border-b w-32` }>{data?.tableValues[0] || 0}<span className='text-xs font-medium text-gray-500'>  (10%) </span></td>
          </tr>
          <tr>
            <td className="text-red-400 pl-1 border-r border-b border-gray-400 px-2 w-32">{data?.tableHeading[1]}</td>
            <td className= {`text-right px-2 text-sm  border-gray-400 text-red-400 font-bold border-b` }>{data?.tableValues[1] || 0}<span className='text-xs font-medium text-gray-500'>  (10%) </span></td>
          </tr>
          <tr>

              
                  <td className="pl-1 text-yellow-600 border-r border-gray-400 px-2 w-32">{data?.tableHeading[2]}</td>
                  <td className= {`text-right px-2 text-sm  border-gray-400 text-yellow-600 font-bold`}>{data?.tableValues[2] || 0}<span className='text-xs font-medium text-gray-500'>  (10%) </span></td>
              

          </tr>
        </tbody>
      </table>

      {/* React Flow handles */}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default Sentiment;
