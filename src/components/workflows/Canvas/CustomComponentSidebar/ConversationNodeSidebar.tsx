import React from 'react';
import { Node } from 'reactflow';

interface ConversationNodeData {
  name: string;
  prompt: string;
  type: string;
}

interface ConversationNodeSidebarProps {
  selectedNode: Node<ConversationNodeData> | null;
  onNodeUpdate: (nodeId: string, data: Partial<ConversationNodeData>) => void;
}

const ConversationNodeSidebar: React.FC<ConversationNodeSidebarProps> = ({ 
  selectedNode, 
  onNodeUpdate 
}) => {
  if (!selectedNode) {
    return null; // Don't render anything when no node is selected
  }

  const handleFieldChange = (field: keyof ConversationNodeData, value: string) => {
    onNodeUpdate(selectedNode.id, { [field]: value });
  };

  return (
    <div className="w-80 h-[calc(100vh-2rem)] bg-white border-l border-gray-200 p-4 overflow-y-auto rounded-lg shadow-lg scrollbar-hide">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Node Properties</h2>
        <div className="text-sm text-gray-500 bg-gray-100 p-2 rounded-lg mb-2">
          <strong>ID:</strong> {selectedNode.id} (unchangeable)
        </div>
      </div>

      <div className="space-y-4">
        {/* Type Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={selectedNode.data.type || 'Conversation'}
            onChange={(e) => handleFieldChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="Conversation">Conversation</option>
          </select>
        </div>

        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Node Name (Editable)
          </label>
          <input
            type="text"
            value={selectedNode.data.name || ''}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            placeholder="Enter custom node name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Prompt Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prompt
          </label>
          <textarea
            value={selectedNode.data.prompt || ''}
            onChange={(e) => handleFieldChange('prompt', e.target.value)}
            placeholder="Enter your prompt here..."
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Additional Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Position
          </label>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div>X: {Math.round(selectedNode.position.x)}</div>
            <div>Y: {Math.round(selectedNode.position.y)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationNodeSidebar; 