'use client'
import React from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useWorkflowStore } from '@/store/workflowStore'
import { MessageSquare, PhoneOff, Globe, X } from 'lucide-react'

interface AddNodeModalProps {
  isOpen: boolean
  onClose: () => void
}

const AddNodeModal: React.FC<AddNodeModalProps> = ({ isOpen, onClose }) => {
  const { addNode } = useWorkflowStore()

  if (!isOpen) return null

  const handleNodeSelection = (nodeType: string) => {
    addNode(nodeType)
    onClose()
  }

  const nodeOptions = [
    {
      type: 'Conversation Node',
      title: 'Conversation Node',
      description: 'Create a conversation node for AI interactions',
      icon: MessageSquare,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-600',
      hoverColor: 'hover:bg-indigo-100'
    },
    {
      type: 'API Node',
      title: 'API Request Node',
      description: 'Make API calls to external services',
      icon: Globe,
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-600',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      type: 'End Call Node',
      title: 'End Call Node',
      description: 'Terminate the conversation flow',
      icon: PhoneOff,
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-600',
      hoverColor: 'hover:bg-red-100'
    }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 relative">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Add New Node</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1 h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Choose the type of node you want to add to your workflow
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {nodeOptions.map((option) => {
            const IconComponent = option.icon
            return (
              <button
                key={option.type}
                onClick={() => handleNodeSelection(option.type)}
                className={`w-full p-4 rounded-lg border-2 ${option.borderColor} ${option.bgColor} ${option.hoverColor} transition-colors text-left`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${option.bgColor} ${option.textColor}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${option.textColor} mb-1`}>
                      {option.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}

export default AddNodeModal 