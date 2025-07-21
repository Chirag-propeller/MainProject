import React from 'react';
import { useWorkflowStore } from '@/store/workflowStore';
import RagSidebar from './RagSidebar';
import ApiRequestNodeSidebar from './ApiRequestNodeSidebar';
import ConversationNodeSidebar from './ConversationNodeSidebar';
import EndCallNodeSidebar from './EndCallNodeSidebar';
import EdgeSidebar from './EdgeSidebar';

const CustomComponentSidebar: React.FC = () => {
  const { selectedNode, selectedEdge } = useWorkflowStore();

  if (selectedEdge) {
    return <EdgeSidebar />;
  }
  if (!selectedNode) {
    return null;
  }
  switch (selectedNode.data.type) {
    case 'RAG':
      return <RagSidebar />;
    case 'API':
      return <ApiRequestNodeSidebar />;
    case 'Conversation':
      return <ConversationNodeSidebar />;
    case 'endcall':
      return <EndCallNodeSidebar />;
    default:
      return null;
  }
};

export default CustomComponentSidebar; 