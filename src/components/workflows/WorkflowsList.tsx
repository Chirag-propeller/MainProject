import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Copy, Trash2, Eye, Calendar, MessageSquare, GitBranch, Settings, Play } from 'lucide-react';
import Test from './Canvas/others/Test';

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

const WorkflowsList: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isTestOpen, setIsTestOpen] = useState(false);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      // Get current user ID from localStorage or context
      const userId = localStorage.getItem('userId') || 'current-user'; // Replace with actual user ID logic
      
      const response = await fetch(`/api/workflow/get-all?userId=${userId}`);
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

  const handleEdit = (workflowId: string) => {
    // Navigate to workflow editor
    window.location.href = `/dashboard/workflows?workflowId=${workflowId}`;
  };

  const handleDuplicate = async (workflow: Workflow) => {
    try {
      const { _id, ...workflowWithoutId } = workflow;
      const duplicatedWorkflow = {
        ...workflowWithoutId,
        name: `${workflow.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const response = await fetch('/api/workflow/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(duplicatedWorkflow),
      });
      
      if (response.ok) {
        fetchWorkflows(); // Refresh the list
      }
    } catch (err) {
      console.error('Error duplicating workflow:', err);
    }
  };

  const handleDelete = async (workflowId: string) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      try {
        const response = await fetch(`/api/workflow/delete/${workflowId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          fetchWorkflows(); // Refresh the list
        }
      } catch (err) {
        console.error('Error deleting workflow:', err);
      }
    }
  };

  const handleTest = (workflow: Workflow) => {
    console.log('Test button clicked for workflow:', workflow.name);
    console.log('Current state - selectedWorkflow:', selectedWorkflow, 'isTestOpen:', isTestOpen);
    setSelectedWorkflow(workflow);
    setIsTestOpen(true);
    console.log('Modal state set to open - workflow:', workflow._id, 'isTestOpen will be true');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading workflows...</div>
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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Workflows</h1>
        <p className="text-gray-600">Manage and organize your workflow templates</p>
      </div>

      {workflows.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Settings className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows yet</h3>
            <p className="text-gray-600 mb-4">Create your first workflow to get started</p>
            <Button onClick={() => window.location.href = '/dashboard/workflows'}>
              Create Workflow
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {workflows.map((workflow) => (
            <Card key={workflow._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {workflow.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MessageSquare className="w-4 h-4" />
                        <span>{workflow.nodes.length} nodes</span>
                        <GitBranch className="w-4 h-4" />
                        <span>{workflow.edges.length} connections</span>
                        {workflow.globalNodes.length > 0 && (
                          <>
                            <Settings className="w-4 h-4" />
                            <span>{workflow.globalNodes.length} global</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {workflow.globalPrompt && (
                      <p className="text-sm text-gray-600 mb-3">
                        <strong>Global Prompt:</strong> {truncateText(workflow.globalPrompt, 100)}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Created: {formatDate(workflow.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Updated: {formatDate(workflow.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTest(workflow)}
                      className="flex items-center gap-1 border border-gray-300"
                    >
                      <Play className="w-3 h-3" />
                      Test
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(workflow._id)}
                      className="flex items-center gap-1 border border-gray-300"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDuplicate(workflow)}
                      className="flex items-center gap-1 border border-gray-300"
                    >
                      <Copy className="w-3 h-3" />
                      Duplicate
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(workflow._id)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Test Modal */}
      {selectedWorkflow && isTestOpen && (
        <Test
          isOpen={isTestOpen}
          onClose={() => {
            setIsTestOpen(false);
            setSelectedWorkflow(null);
          }}
          workflow={selectedWorkflow}
        />
      )}
    </div>
  );
};

export default WorkflowsList;
