import React, { useState, useEffect } from 'react';
import { ArrowLeft, GitBranch, Edit3, Check, X, AudioLines } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useWorkflowStore } from '@/store/workflowStore';
import { AudioTrack } from '@livekit/components-react';
import Test from './Canvas/others/Test';

interface WorkflowTopBarProps {
  clearNode : ()=> void ,
  handleSave : ()=> Promise<void>,
  isLoading: boolean,
}

const WorkflowTopBar: React.FC<WorkflowTopBarProps> = ( {clearNode, handleSave , isLoading}) => {
  const router = useRouter();
  const { 
    workflowName, 
    updateWorkflowName, 
    nodes, 
    edges, 
    globalPrompt, 
    globalNodes, 
    currentWorkflowId,
    setActiveNode
  } = useWorkflowStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(workflowName);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // Sync editedName when workflowName changes from store
  useEffect(() => {
    setEditedName(workflowName);
  }, [workflowName]);

  const handleBackClick = () => {
    router.push('/dashboard/workflows');
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedName(workflowName);
  };

  const handleSaveClick = async () => {
    if (editedName.trim() && editedName.trim() !== workflowName) {
      setIsUpdating(true);
      try {
        await updateWorkflowName(editedName.trim());
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to update workflow name:', error);
      } finally {
        setIsUpdating(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedName(workflowName);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveClick();
    } else if (e.key === 'Escape') {
      handleCancelClick();
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Left side: Back button and workflow info */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="flex items-center gap-2 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="h-6 w-px bg-gray-300" />
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-indigo-600" />
              
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="text-lg font-semibold text-gray-900 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    autoFocus
                    disabled={isUpdating}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSaveClick}
                    disabled={isUpdating}
                    className="p-1 h-auto hover:bg-green-50 hover:text-green-600"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelClick}
                    disabled={isUpdating}
                    className="p-1 h-auto hover:bg-red-50 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold text-gray-900">
                    {workflowName || 'Untitled Workflow'}
                  </h1>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEditClick}
                    className="p-1 h-auto hover:bg-gray-50"
                  >
                    <Edit3 className="w-4 h-4 text-gray-500" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Additional actions (future use) */}
        <div className="flex items-center gap-2">

          <Button variant='ghost' size='sm' className='border-1 rounded-[4px]' onClick={clearNode}>
            Clear All
          </Button>

          <Button 
              onClick={handleSave}
              disabled={isLoading}
              size='sm' 
              className='rounded-[4px]'
              // className='bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded'
          >
          {isLoading ? 'Saving...' : 'Save Workflow'}
          </Button>
          <Button
              size='sm' 
              className='rounded-[4px] px-6 ml-4'
              onClick={() => setIsTesting(true)}
          >
            Test
            <AudioLines className='pl-2 w-5 h-5'/>
          </Button>
          {isTesting && currentWorkflowId && (
            <Test
              isOpen={isTesting}
              onClose={() => {
                setIsTesting(false);
                setActiveNode(null);
              }}
              workflow={{
                _id: currentWorkflowId,
                name: workflowName || 'Untitled Workflow',
                globalPrompt: globalPrompt,
                nodes: nodes,
                edges: edges,
                globalNodes: globalNodes,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }}
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default WorkflowTopBar; 