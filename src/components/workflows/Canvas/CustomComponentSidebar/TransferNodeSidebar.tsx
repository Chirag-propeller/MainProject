import React, { useEffect, useRef, useState } from 'react'
import { useWorkflowStore } from '@/store/workflowStore'
import { Button } from '@/components/ui/button'
import Toggle from '@/components/ui/toggle'
import { X, ChevronDown, ChevronRight } from 'lucide-react'

const TransferNodeSidebar: React.FC = () => {
  const { selectedNode, updateNodeGlobal, updateNode, nodes, setSelectedNode } = useWorkflowStore()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [isAudioCollapsed, setIsAudioCollapsed] = useState(true)

  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSelectedNode(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setSelectedNode])

  if (!selectedNode) {
    return null
  }

  const handleGlobalFieldChange = (field: string, value: string | boolean) => {
    updateNodeGlobal(selectedNode.id, { [field]: value })
  }

  const handleNodeFieldChange = (field: string, value: string) => {
    updateNode(selectedNode.id, { [field]: value })
  }

  const globalData = selectedNode.data.global || {}

  return (
    <div 
      ref={sidebarRef}
      className="w-120 h-[calc(100vh-4rem)] bg-white border-l border-gray-200 p-4 pt-0 overflow-y-auto rounded-lg shadow-lg scrollbar-hide"
    >
      <div className="mb-4 sticky top-0 pt-2 bg-white z-10 flex items-center justify-between">
        <div className="">  
        <h2 className="text-xl font-bold text-gray-800">Transfer Node Properties</h2>
        <div className="text-sm text-gray-500 rounded-lg mb-2">
          <strong>ID:</strong> {selectedNode.id}
        </div>
        <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded-lg mb-2">
          <strong>Note:</strong> This node will transfer the call to another phone number
        </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedNode(null)}
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={selectedNode.data.type || 'transfer'}
            onChange={(e) => handleNodeFieldChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="transfer">Transfer</option>
          </select>
        </div>

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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number to Transfer To
          </label>
          <input
            type="tel"
            value={(selectedNode.data as any).phoneNumber || ''}
            onChange={(e) => handleNodeFieldChange('phoneNumber', e.target.value)}
            placeholder="Enter phone number (e.g., +1234567890)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            The phone number where the call will be transferred
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transfer Message
          </label>
          <textarea
            value={(selectedNode.data as any).transferMessage || ''}
            onChange={(e) => handleNodeFieldChange('transferMessage', e.target.value)}
            placeholder="Enter the message which is said when transferring the call..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            This message will be played to the caller before the transfer
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prompt
          </label>
          <textarea
            value={(selectedNode.data as any).prompt || ''}
            onChange={(e) => handleNodeFieldChange('prompt', e.target.value)}
            placeholder="Enter your prompt here..."
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            This prompt will be used for any AI processing related to this transfer node
          </p>
        </div>

        {/* Other Settings */}
        <div className="space-y-4">
          <button
            onClick={() => setIsAudioCollapsed(!isAudioCollapsed)}
            className="flex items-center justify-between w-full text-left text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 hover:bg-gray-50 rounded-t-lg px-2 py-1 transition-colors"
          >
            <span>⚙️ Other Settings</span>
            {isAudioCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {!isAudioCollapsed && (
            <div className="space-y-4 pl-2">
              {/* Filler Words Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filler Words
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Enable filler words in conversation
                  </span>
                  <Toggle
                    checked={selectedNode.data.fillerWords || false}
                    onChange={(checked) => handleNodeFieldChange('fillerWords', checked)}
                    size="small"
                  />
                </div>
              </div>

              {/* Background Audio Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Audio
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Enable background audio during conversation
                  </span>
                  <Toggle
                    checked={selectedNode.data.backgroundAudio || false}
                    onChange={(checked) => handleNodeFieldChange('backgroundAudio', checked)}
                    size="small"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

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

          {globalData.isGlobal && (
            <div className="space-y-4 pl-6 border-l-2 border-indigo-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Global Node Pathway Condition
                </label>
                <textarea
                  value={globalData.pathwayCondition || ''}
                  onChange={(e) => handleGlobalFieldChange('pathwayCondition', e.target.value)}
                  placeholder="Enter the condition for this global node pathway..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Global Node Pathway Description
                </label>
                <textarea
                  value={globalData.pathwayDescription || ''}
                  onChange={(e) => handleGlobalFieldChange('pathwayDescription', e.target.value)}
                  placeholder="Describe the purpose and behavior of this global node pathway..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Automatically Go Back to Previous Node
                </label>
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="checkbox"
                    id="autoGoBackToggle"
                    checked={globalData.autoGoBackToPrevious !== false}
                    onChange={(e) => handleGlobalFieldChange('autoGoBackToPrevious', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="autoGoBackToggle" className="text-sm text-gray-600">
                    Automatically return to previous node after this global node
                  </label>
                </div>

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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

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
                        .filter(node => node.id !== selectedNode.id)
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

export default TransferNodeSidebar; 