import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface EndCallNodeData {
  name: string;
  type: string;
  prompt?: string; // Add prompt field to match the interface
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

const EndCallNode: React.FC<NodeProps<EndCallNodeData>> = ({ data }) => {
  const isGlobal = data.global?.isGlobal || false;

  const displayType = data.type === 'endcall' ? 'End Call' : data.type;

  return (
    <div className={`relative bg-white border-2 rounded-lg shadow-lg p-4 min-w-[200px] ${
      isGlobal ? 'border-purple-500 bg-purple-50' : 'border-red-500 bg-red-50'
    }`}>
      {/* Only target handle (input) - no source handle (output) */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className={`!w-3 !h-3 !-top-[7px] ${
          isGlobal ? '!bg-purple-500' : '!bg-red-500'
        }`}
      />
      
      <div className="text-center">
        {/* Global Node Indicator */}
        {isGlobal && (
          <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
            GLOBAL
          </div>
        )}
        
        {/* End Node Indicator */}
        <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
          END
        </div>
        
        <div className={`text-sm font-semibold mb-1 ${
          isGlobal ? 'text-purple-600' : 'text-red-600'
        }`}>
          {displayType}
        </div>
        <div className="text-lg font-bold text-gray-800 mb-2">
          {data.name || 'End Call Node'}
        </div>  
        
        {/* End Call Description */}
        <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded-lg">
          <div className="flex items-center justify-center gap-1">
            <svg 
              className="w-4 h-4 text-red-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" 
              />
            </svg>
            <span>Call will end here</span>
          </div>
        </div>

        {/* Global Node Features Indicators */}
        {isGlobal && (
          <div className="mt-2 space-y-1">
            {/* Pathway Condition */}
            {data.global?.pathwayCondition && (
              <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                <strong>Condition:</strong> {data.global.pathwayCondition.substring(0, 30)}...
              </div>
            )}
            
            {/* Redirect Indicator */}
            {data.global?.redirectToNode && data.global?.redirectTargetNodeId && (
              <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                <strong>Redirect:</strong> To Node {data.global.redirectTargetNodeId}
              </div>
            )}
            
            {/* Pathway Label Indicator */}
            {data.global?.createPathwayLabelToPrevious && (
              <div className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                <strong>Pathway Label:</strong> Enabled
              </div>
            )}
            
            {/* Auto Go Back Indicator */}
            {data.global && data.global.autoGoBackToPrevious !== false && (
              <div className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                <strong>Auto Return:</strong> To Previous Node
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EndCallNode;
