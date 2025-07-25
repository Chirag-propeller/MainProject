import React, { useEffect, useRef } from 'react'
import { useWorkflowStore } from '@/store/workflowStore'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

const EdgeSidebar: React.FC = () => {
  const { selectedEdge, updateEdge, setSelectedEdge } = useWorkflowStore()
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSelectedEdge(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setSelectedEdge])

  if (!selectedEdge) {
    return null
  }

  const handleFieldChange = (field: string, value: string | number) => {
    updateEdge(selectedEdge.id, { [field]: value })
  }

  return (
    <div 
      ref={sidebarRef}
      className="w-120 h-[calc(100vh-4rem)] bg-white border-l border-gray-200 p-4 pt-0 overflow-y-auto rounded-lg shadow-lg scrollbar-hide"
    >
      <div className="mb-4 sticky top-0 pt-2 bg-white z-10 flex items-center justify-between">
        <div className="">  
        <h2 className="text-xl font-bold text-gray-800">Edge Properties</h2>
        <div className="text-sm text-gray-500 rounded-lg mb-2">
          <strong>ID:</strong> {selectedEdge.id}
        </div>
        <div className="text-sm text-gray-500 mb-1">From: {selectedEdge.source}</div>
        <div className="text-sm text-gray-500">To: {selectedEdge.target}</div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedEdge(null)}
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4 text-sm">
        {/* Label Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Edge Label (Editable)
          </label>
          <textarea
            // type="text"
            value={selectedEdge.data?.label || ''}
            onChange={(e) => handleFieldChange('label', e.target.value)}
            placeholder="Enter custom edge label"
            className="w-full px-1 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            cols={7}
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
            className="w-full px-1 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
            className="w-full px-1 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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