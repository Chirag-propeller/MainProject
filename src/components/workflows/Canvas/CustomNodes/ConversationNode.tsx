import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useWorkflowStore } from '@/store/workflowStore';

interface ConversationNodeData {
  name: string;
  prompt: string;
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

const ConversationNode: React.FC<NodeProps<ConversationNodeData>> = ({ data, id }) => {
  const isGlobal = data.global?.isGlobal || false;
  const hasRedirect = data.global?.redirectToNode && data.global?.redirectTargetNodeId;
  const hasPathwayLabel = data.global?.createPathwayLabelToPrevious;
  const { selectedNode } = useWorkflowStore();

  // Simple highlighting - darker border when selected
  const isSelected = selectedNode?.id === id;

  return (
    <div 
      className={`relative bg-white border-2 rounded-lg shadow-lg p-4 min-w-[200px] ${
        isGlobal 
          ? 'border-purple-500 bg-purple-50' 
          : isSelected 
            ? 'border-indigo-600' 
            : 'border-indigo-200'
      }`}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className={`!w-3 !h-3 !-top-[7px] ${
          isGlobal ? '!bg-purple-500' : '!bg-indigo-500'
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
          isGlobal ? 'text-purple-600' : 'text-indigo-600'
        }`}>
          {data.type || 'Conversation'}
        </div>
        <div className="text-lg font-bold text-gray-800 mb-2">
          {data.name || 'Untitled Node'}
        </div>  
        <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded-lg overflow-hidden">
          <div 
            className="line-clamp-2"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: '1.3em',
              maxHeight: '2.6em'
            }}
          >
            {data.prompt || 'No prompt set'}
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
            {hasRedirect && data.global && (
              <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                <strong>Redirect:</strong> To Node {data.global.redirectTargetNodeId}
              </div>
            )}
            
            {/* Pathway Label Indicator */}
            {hasPathwayLabel && (
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
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className={`!w-3 !h-3 !-bottom-[7px] ${
          isGlobal ? '!bg-purple-500' : '!bg-indigo-500'
        }`}
      />
    </div>
  );
};

export default ConversationNode;