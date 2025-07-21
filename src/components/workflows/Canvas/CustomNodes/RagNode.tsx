import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useWorkflowStore } from '@/store/workflowStore';

export interface RagNodeData {
  name: string;
  type: 'RAG';
  knowledgeBaseAttached?: boolean;
  knowledgeBaseUrl?: string;
  whenToCallRag?: string;
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

// All configuration for RAG node is handled in RagSidebar
const RagNode: React.FC<NodeProps<RagNodeData>> = ({ data, id }) => {
  const isGlobal = data.global?.isGlobal || false;
  const { selectedNode } = useWorkflowStore();
  const isSelected = selectedNode?.id === id;

  return (
    <div
      className={`relative bg-white border-2 rounded-lg shadow-lg p-4 min-w-[180px] ${
        isGlobal
          ? 'border-purple-500 bg-purple-50'
          : isSelected
            ? 'border-green-600 bg-green-50'
            : 'border-green-200 bg-green-50'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className={`!w-3 !h-3 !-top-[7px] ${
          isGlobal ? '!bg-purple-500' : '!bg-green-500'
        }`}
      />
      <div className="text-center">
        {isGlobal && (
          <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
            GLOBAL
          </div>
        )}
        <div className={`text-sm font-semibold mb-1 ${
          isGlobal ? 'text-purple-600' : 'text-green-600'
        }`}>
          {data.type || 'RAG'}
        </div>
        <div className="text-lg font-bold text-gray-800 mb-2">
          <p className='text-sm'>{data.name || 'RAG Node'}</p>
        </div>
        {/* All configuration is handled in RagSidebar */}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className={`!w-3 !h-3 !-bottom-[7px] ${
          isGlobal ? '!bg-purple-500' : '!bg-green-500'
        }`}
      />
    </div>
  );
};

export default RagNode; 