import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface ConversationNodeData {
  name: string;
  prompt: string;
  type: string;
}

const ConversationNode: React.FC<NodeProps<ConversationNodeData>> = ({ data }) => {
  return (
    <div className="relative bg-white border-2 border-indigo-500 rounded-lg shadow-lg p-4 min-w-[200px]">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!w-3 !h-3 !bg-indigo-500 !-top-[7px]" 
      />
      
      <div className="text-center">
        <div className="text-sm font-semibold text-indigo-600 mb-1">
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
      </div>
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!w-3 !h-3 !bg-indigo-500 !-bottom-[7px]" 
      />
    </div>
  );
};

export default ConversationNode;