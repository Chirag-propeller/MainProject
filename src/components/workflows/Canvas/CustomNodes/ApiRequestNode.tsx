import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface ApiRequestNodeData {
  name: string;
  endpoint: string;
  method: string;
  type: string;
  global?: {
    isGlobal?: boolean;
    pathwayCondition?: string;
    pathwayDescription?: string;
    autoGoBackToPrevious?: boolean;
    createPathwayLabelToPrevious?: boolean;
    previousNodePathwayLabel?: string;
    previousNodePathwayDescription?: string;
    redirectToNode?: boolean;
    redirectTargetNodeId?: string;
    [key: string]: any;
  };
}

const ApiRequestNode: React.FC<NodeProps<ApiRequestNodeData>> = ({ data }) => {
  const isGlobal = data.global?.isGlobal || false;

  return (
    <div className={`relative bg-white border-2 rounded-lg shadow-lg p-4 min-w-[220px] ${
      isGlobal ? 'border-purple-500 bg-purple-50' : 'border-blue-500 bg-blue-50'
    }`}>
      <Handle 
        type="target" 
        position={Position.Top} 
        className={`!w-3 !h-3 !-top-[7px] ${
          isGlobal ? '!bg-purple-500' : '!bg-blue-500'
        }`}
      />
      <div className="text-center">
        {/* Global Node Indicator */}
        {isGlobal && (
          <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
            GLOBAL
          </div>
        )}
        <div className={`text-sm font-semibold mb-1 ${
          isGlobal ? 'text-purple-600' : 'text-blue-600'
        }`}>
          {data.type || 'API'}
        </div>
        <div className="text-lg font-bold text-gray-800 mb-2">
          {data.name || 'API Request Node'}
        </div>  
        <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded-lg">
          <div><strong>Endpoint:</strong> {data.endpoint || '/api/endpoint'}</div>
          <div><strong>Method:</strong> {data.method || 'GET'}</div>
        </div>
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className={`!w-3 !h-3 !-bottom-[7px] ${
          isGlobal ? '!bg-purple-500' : '!bg-blue-500'
        }`}
      />
    </div>
  );
};

export default ApiRequestNode; 