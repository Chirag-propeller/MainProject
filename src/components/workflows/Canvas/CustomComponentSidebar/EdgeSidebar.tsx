import React from 'react'
import { useWorkflowStore } from '@/store/workflowStore'

const EdgeSidebar: React.FC = () => {
  const { selectedEdge, updateEdge } = useWorkflowStore()

  if (!selectedEdge) {
    return null
  }

  const handleFieldChange = (field: string, value: string | number) => {
    updateEdge(selectedEdge.id, { [field]: value })
  }

  return (
    <div className="w-80 h-[calc(100vh-2rem)] bg-white border-l border-gray-200 p-4 overflow-y-auto rounded-lg shadow-lg scrollbar-hide">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Edge Properties</h2>
        <div className="text-sm text-gray-500 bg-gray-100 p-2 rounded-lg mb-2">
          <strong>ID:</strong> {selectedEdge.id} (unchangeable)
        </div>
        <div className="text-sm text-gray-500 mb-1">From: {selectedEdge.source}</div>
        <div className="text-sm text-gray-500">To: {selectedEdge.target}</div>
      </div>

      <div className="space-y-4">
        {/* Label Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Edge Label (Editable)
          </label>
          <input
            type="text"
            value={selectedEdge.data?.label || ''}
            onChange={(e) => handleFieldChange('label', e.target.value)}
            placeholder="Enter custom edge label"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <div className="text-xs text-gray-500 mt-1">
            This label will appear on the connection line
          </div>
        </div>

        {/* Label Position Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Label Position
          </label>
          <select
            value={selectedEdge.data?.labelPosition || 'center'}
            onChange={(e) => handleFieldChange('labelPosition', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="center">Center</option>
            <option value="up">Above Line</option>
            <option value="down">Below Line</option>
          </select>
        </div>

        {/* Path Offset Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Path Offset
          </label>
          <input
            type="number"
            value={selectedEdge.data?.pathOffset || 0}
            onChange={(e) => handleFieldChange('pathOffset', parseFloat(e.target.value) || 0)}
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <div className="text-xs text-gray-500 mt-1">
            Offset in pixels to separate multiple edges between same nodes (positive/negative values)
          </div>
        </div>

        {/* Edge Type Info */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Edge Type
          </label>
          <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded-lg">
            {selectedEdge.type || 'default'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EdgeSidebar; 