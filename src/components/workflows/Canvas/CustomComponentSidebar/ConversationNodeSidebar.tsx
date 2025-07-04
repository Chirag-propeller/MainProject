import React from 'react'
import { useWorkflowStore } from '@/store/workflowStore'

const ConversationNodeSidebar: React.FC = () => {
  const { selectedNode, updateNode } = useWorkflowStore()

  if (!selectedNode) {
    return null
  }

  const handleFieldChange = (field: string, value: string | boolean) => {
    updateNode(selectedNode.id, { [field]: value })
  }

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

        {/* Prompt Field - only show for conversation nodes */}
        {selectedNode.data.type === 'Conversation' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prompt
            </label>
            <textarea
              value={(selectedNode.data as any).prompt || ''}
              onChange={(e) => handleFieldChange('prompt', e.target.value)}
              placeholder="Enter your prompt here..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>
        )}

        {/* Global Node Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Make this node global
          </label>
          <div className="flex items-center space-x-2 mb-3">
            <input
              type="checkbox"
              id="globalNodeToggle"
              checked={(selectedNode.data as any).isGlobalNode || false}
              onChange={(e) => handleFieldChange('isGlobalNode', e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="globalNodeToggle" className="text-sm text-gray-600">
              Enable global node functionality
            </label>
          </div>

          {/* Global Node Options - shown only when toggle is true */}
          {(selectedNode.data as any).isGlobalNode && (
            <div className="space-y-4 pl-6 border-l-2 border-indigo-200">
              {/* Global Node Pathway Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Global Node Pathway Condition
                </label>
                <textarea
                  value={(selectedNode.data as any).globalNodePathwayCondition || ''}
                  onChange={(e) => handleFieldChange('globalNodePathwayCondition', e.target.value)}
                  placeholder="Enter the condition for this global node pathway..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
                />
              </div>

              {/* Global Node Pathway Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Global Node Pathway Description
                </label>
                <textarea
                  value={(selectedNode.data as any).globalNodePathwayDescription || ''}
                  onChange={(e) => handleFieldChange('globalNodePathwayDescription', e.target.value)}
                  placeholder="Describe the purpose and behavior of this global node pathway..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Global Object Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Global Data (JSON)
          </label>
          <textarea
            value={JSON.stringify(selectedNode.data.global || {}, null, 2)}
            onChange={(e) => {
              try {
                const globalData = JSON.parse(e.target.value)
                updateNode(selectedNode.id, { global: globalData })
              } catch (error) {
                // Invalid JSON, don't update
              }
            }}
            placeholder='{"key": "value"}'
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm"
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