'use client'
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Calendar, MessageSquare, GitBranch, Eye, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createWorkflow } from '@/utils/workflow';

interface Workflow {
  _id: string;
  name: string;
  globalPrompt: string;
  nodes: any[];
  edges: any[];
  globalNodes: string[];
  createdAt: string;
  updatedAt: string;
}

interface WorkflowTableProps {
  onWorkflowSelect?: (workflowId: string) => void;
}

const WorkflowTable: React.FC<WorkflowTableProps> = ({ onWorkflowSelect }) => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      
      // Get the user ID from the getCurrentUser API
      const userResponse = await fetch('/api/user/getCurrentUser');
      if (!userResponse.ok) {
        throw new Error('Failed to get user data');
      }
      const userData = await userResponse.json();
      
      const response = await fetch(`/api/workflow/get-all?userId=${userData._id}`);
      const data = await response.json();
      
      if (data.success) {
        setWorkflows(data.data);
      } else {
        setError(data.error || 'Failed to load workflows');
      }
    } catch (err) {
      setError('Failed to load workflows');
      console.error('Error fetching workflows:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkflowClick = (workflowId: string) => {
    if (onWorkflowSelect) {
      onWorkflowSelect(workflowId);
    } else {
      // Navigate to the workflow editor
      router.push(`/dashboard/workflows/${workflowId}`);
    }
  };

  const handleEdit = (workflowId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    router.push(`/dashboard/workflows/${workflowId}`);
  };

  const handleDelete = async (workflowId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      try {
        const response = await fetch(`/api/workflow/${workflowId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          fetchWorkflows();
        }
      } catch (err) {
        console.error('Error deleting workflow:', err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleCreateNew = async () => {
    try {
      const result = await createWorkflow({ name: 'New Workflow' });
      if (result.success && result.data) {
        // Redirect to the new workflow
        router.push(`/dashboard/workflows/${result.data._id}`);
      }
    } catch (error) {
      console.error('Error creating workflow:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-t-transparent border-indigo-600 rounded-full animate-spin"></div>
          <span className="text-lg">Loading workflows...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex gap-1.5 items-center">
            <GitBranch className="w-5 h-5 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Workflows</h1>
          </div>
          <p className="text-gray-600 mt-1">Manage and organize your workflow templates</p>
        </div>
        <Button 
          onClick={handleCreateNew}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Workflow
        </Button>
      </div>

      {workflows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
          <MessageSquare className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows yet</h3>
          <p className="text-gray-600 mb-4">Create your first workflow to get started</p>
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Create Workflow
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="sticky top-0 bg-gray-50 z-10 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="sticky top-0 bg-gray-50 z-10 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="sticky top-0 bg-gray-50 z-10 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="sticky top-0 bg-gray-50 z-10 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nodes
                  </th>
                  <th className="sticky top-0 bg-gray-50 z-10 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Connections
                  </th>
                  <th className="sticky top-0 bg-gray-50 z-10 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="sticky top-0 bg-gray-50 z-10 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workflows.map((workflow, index) => (
                  <tr 
                    key={workflow._id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleWorkflowClick(workflow._id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <GitBranch className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {workflow.name || 'Untitled Workflow'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {workflow.globalPrompt ? 
                        truncateText(workflow.globalPrompt, 50) : 
                        <span className="text-gray-400">No description</span>
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4 text-gray-400" />
                        <span>{workflow.nodes.length}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <GitBranch className="w-4 h-4 text-gray-400" />
                        <span>{workflow.edges.length}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(workflow.updatedAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleEdit(workflow._id, e)}
                          className="flex items-center gap-1 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDelete(workflow._id, e)}
                          className="flex items-center gap-1 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowTable; 