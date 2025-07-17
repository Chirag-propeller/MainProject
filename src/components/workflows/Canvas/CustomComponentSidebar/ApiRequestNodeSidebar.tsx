import React from 'react'
import { useWorkflowStore } from '@/store/workflowStore'

const ApiRequestNodeSidebar: React.FC = () => {
  const { selectedNode, updateNodeGlobal, updateNode, nodes } = useWorkflowStore()

  if (!selectedNode) {
    return null
  }

  const handleGlobalFieldChange = (field: string, value: string | boolean) => {
    updateNodeGlobal(selectedNode.id, { [field]: value })
  }

  const handleNodeFieldChange = (field: string, value: string) => {
    updateNode(selectedNode.id, { [field]: value })
  }

  // Type guard to check if this is an API node
  const isApiNode = (node: any): node is any => {
    return node.data.type === 'API'
  }

  // Get the API node data safely
  const getApiData = () => {
    if (isApiNode(selectedNode)) {
      return selectedNode.data as any
    }
    return null
  }

  const globalData = selectedNode.data.global || {}

  return (
    <div className="w-120 h-[calc(100vh-2rem)] bg-white border-l border-gray-200 p-4 overflow-y-auto rounded-lg shadow-lg scrollbar-hide">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">API Request Node Properties</h2>
        <div className="text-sm text-gray-500 bg-gray-100 p-2 rounded-lg mb-2">
          <strong>ID:</strong> {selectedNode.id} (unchangeable)
        </div>
        <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded-lg mb-2">
          <strong>Note:</strong> This node will make an API request
        </div>
      </div>

      <div className="space-y-4">
        {/* Type Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={selectedNode.data.type || 'API'}
            onChange={(e) => handleNodeFieldChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="API">API</option>
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
            onChange={(e) => handleNodeFieldChange('name', e.target.value)}
            placeholder="Enter custom node name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Endpoint Field - only show for API nodes */}
        {isApiNode(selectedNode) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Endpoint
            </label>
            <input
              type="text"
              value={getApiData()?.endpoint || ''}
              onChange={(e) => handleNodeFieldChange('endpoint', e.target.value)}
              placeholder="https://api.example.com/endpoint"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Method Field - only show for API nodes */}
        {isApiNode(selectedNode) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              HTTP Method
            </label>
            <select
              value={getApiData()?.method || 'GET'}
              onChange={(e) => handleNodeFieldChange('method', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
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
              checked={globalData.isGlobal || false}
              onChange={(e) => handleGlobalFieldChange('isGlobal', e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="globalNodeToggle" className="text-sm text-gray-600">
              Enable global node functionality
            </label>
          </div>

          {/* Global Node Options - shown only when toggle is true */}
          {globalData.isGlobal && (
            <div className="space-y-4 pl-6 border-l-2 border-indigo-200">
              {/* Global Node Pathway Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Global Node Pathway Condition
                </label>
                <textarea
                  value={globalData.pathwayCondition || ''}
                  onChange={(e) => handleGlobalFieldChange('pathwayCondition', e.target.value)}
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
                  value={globalData.pathwayDescription || ''}
                  onChange={(e) => handleGlobalFieldChange('pathwayDescription', e.target.value)}
                  placeholder="Describe the purpose and behavior of this global node pathway..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
                />
              </div>

              {/* Automatically Go Back to Previous Node Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Automatically Go Back to Previous Node
                </label>
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="checkbox"
                    id="autoGoBackToggle"
                    checked={globalData.autoGoBackToPrevious !== false} // Default to true
                    onChange={(e) => handleGlobalFieldChange('autoGoBackToPrevious', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="autoGoBackToggle" className="text-sm text-gray-600">
                    Automatically return to previous node after this global node
                  </label>
                </div>

                {/* Create Pathway Label to Previous Node - only shown when autoGoBackToPrevious is false */}
                {!globalData.autoGoBackToPrevious && (
                  <div className="ml-6 space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="createPathwayLabelToggle"
                        checked={globalData.createPathwayLabelToPrevious || false}
                        onChange={(e) => handleGlobalFieldChange('createPathwayLabelToPrevious', e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="createPathwayLabelToggle" className="text-sm text-gray-600">
                        Create Pathway Label to Previous Node
                      </label>
                    </div>

                    {/* Previous Node Pathway Options - shown only when createPathwayLabelToPrevious is true */}
                    {globalData.createPathwayLabelToPrevious && (
                      <div className="space-y-3 pl-4 border-l border-indigo-100">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Previous Node Pathway Label
                          </label>
                          <textarea
                            value={globalData.previousNodePathwayLabel || ''}
                            onChange={(e) => handleGlobalFieldChange('previousNodePathwayLabel', e.target.value)}
                            placeholder="Condition to path to the previous node, before coming to this global node..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Previous Node Pathway Description
                          </label>
                          <textarea
                            value={globalData.previousNodePathwayDescription || ''}
                            onChange={(e) => handleGlobalFieldChange('previousNodePathwayDescription', e.target.value)}
                            placeholder="Additional Description for when to choose this pathway..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Redirect to another node Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Redirect to another node
                </label>
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="checkbox"
                    id="redirectToNodeToggle"
                    checked={globalData.redirectToNode || false}
                    onChange={(e) => handleGlobalFieldChange('redirectToNode', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="redirectToNodeToggle" className="text-sm text-gray-600">
                    Redirect to a specific node after this global node
                  </label>
                </div>

                {/* Node Selection Dropdown - shown only when redirectToNode is true */}
                {globalData.redirectToNode && (
                  <div className="ml-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Target Node
                    </label>
                    <select
                      value={globalData.redirectTargetNodeId || ''}
                      onChange={(e) => handleGlobalFieldChange('redirectTargetNodeId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select a node...</option>
                      {nodes
                        .filter(node => node.id !== selectedNode.id) // Exclude current node
                        .map(node => (
                          <option key={node.id} value={node.id}>
                            {node.data.name || `Node ${node.id}`}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}
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

export default ApiRequestNodeSidebar; 