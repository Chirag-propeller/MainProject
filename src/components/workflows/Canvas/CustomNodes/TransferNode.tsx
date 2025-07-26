import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useWorkflowStore } from '@/store/workflowStore';

interface TransferNodeData {
  name: string;
  type: string;
  phoneNumber?: string;
  transferMessage?: string;
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

const TransferNode: React.FC<NodeProps<TransferNodeData>> = ({ data, id }) => {
  const isGlobal = data.global?.isGlobal || false;
  const { selectedNode, activeNode } = useWorkflowStore();

  const displayType = data.type === 'transfer' ? 'Transfer' : data.type;

  // Simple highlighting - darker border when selected
  const isSelected = selectedNode?.id === id;
  const isActive = activeNode === id;
  
  return (
    <div 
      className={`relative bg-white border-2 rounded-lg shadow-lg p-4 min-w-[200px] ${
        isActive ? 'border-green-500 bg-green-50 shadow-md shadow-green-500/50 ' : 
        isGlobal 
          ? 'border-purple-500 bg-purple-50' 
          : isSelected 
            ? 'border-orange-600 bg-orange-50' 
            : 'border-orange-200 bg-orange-50'
      }`}
    >
      {/* Input handle */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className={`!w-3 !h-3 !-top-[7px] ${
          isGlobal ? '!bg-purple-500' : '!bg-orange-500'
        }`}
      />
      
      {/* Output handle */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className={`!w-3 !h-3 !-bottom-[7px] ${
          isGlobal ? '!bg-purple-500' : '!bg-orange-500'
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
          isGlobal ? 'text-purple-600' : 'text-orange-600'
        }`}>
          {displayType}
        </div>
        <div className="text-lg font-bold text-gray-800 mb-2">
          {data.name || 'Transfer Node'}
        </div>  
        
        {/* Transfer Details */}
        <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <svg 
              className="w-4 h-4 text-orange-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 7.72V9a2 2 0 01-2 2h-1a2 2 0 01-2-2v-1a2 2 0 00-2-2H5a2 2 0 01-2-2z" 
              />
            </svg>
            <span>Call will be transferred</span>
          </div>
          {data.phoneNumber && (
            <div className="text-gray-700 text-xs font-medium">
              To: {data.phoneNumber}
            </div>
          )}
          {data.transferMessage && (
            <div className="text-gray-700 text-xs italic mt-1">
              "{data.transferMessage}"
            </div>
          )}
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

export default TransferNode; 