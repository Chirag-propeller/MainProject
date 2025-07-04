'use client'
import React, { useState, useCallback, useEffect } from 'react'
import SideBar from './Canvas/SideBar'
import MainCanvas from './Canvas/MainCanvas'
import ConversationNodeSidebar from './Canvas/CustomComponentSidebar/ConversationNodeSidebar'
import EdgeSidebar from './Canvas/CustomComponentSidebar/EdgeSidebar'
import { Node, Edge } from 'reactflow'
import { saveWorkflow, loadWorkflow, convertMongoDataToFlow, autoSaveWorkflow } from '@/utils/workflow'

interface ConversationNodeData {
  name: string;
  prompt: string;
  type: string;
}

interface EdgeData {
  label?: string;
}

const MainComponent = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node<ConversationNodeData> | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge<EdgeData> | null>(null);
  const [nodeCounter, setNodeCounter] = useState(1);
  const [edgeCounter, setEdgeCounter] = useState(1);
  const [userId] = useState('user-123'); // TODO: Replace with actual user ID from auth
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load workflow on component mount
  useEffect(() => {
    const loadUserWorkflow = async () => {
      setIsLoading(true);
      try {
        const result = await loadWorkflow(userId);
        if (result.success && result.data) {
          const flowData = convertMongoDataToFlow(result.data);
          setNodes(flowData.nodes);
          setEdges(flowData.edges);
          setNodeCounter(flowData.nodeCounter);
          setEdgeCounter(flowData.edgeCounter);
          console.log('Workflow loaded successfully:', result.message);
        }
      } catch (error) {
        console.error('Failed to load workflow:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserWorkflow();
  }, [userId]);

  // Auto-save when nodes or edges change
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      autoSaveWorkflow({
        userId,
        nodes,
        edges,
        nodeCounter,
        edgeCounter
      });
    }
  }, [nodes, edges, nodeCounter, edgeCounter, userId]);

  // Auto-save every 5 minutes
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (nodes.length > 0 || edges.length > 0) {
        saveWorkflow({
          userId,
          nodes,
          edges,
          nodeCounter,
          edgeCounter
        }).then(result => {
          if (result.success) {
            setLastSaved(new Date());
            console.log('Auto-saved workflow at:', new Date().toLocaleTimeString());
          }
        });
      }
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    return () => clearInterval(autoSaveInterval);
  }, [userId, nodes, edges, nodeCounter, edgeCounter]);

  const addNode = useCallback((nodeType: string) => {
    // Create nodes in a more predictable position
    const nodeCount = nodes.length;
    const newNode: Node<ConversationNodeData> = {
      id: `N${nodeCounter}`, // Unchangeable nomenclature ID
      type: 'conversation',
      position: { 
        x: 100 + (nodeCount * 200), // Start at x=100, then 300, 500, etc.
        y: 100 + (nodeCount * 100)  // Start at y=100, then 200, 300, etc.
      },
      data: { 
        name: 'Custom Node', // Editable name with default value
        prompt: '',
        type: 'Conversation'
      },
      style: { width: 220, height: 120 },
    };
    
    console.log('Creating new conversation node:', newNode);
    setNodes((prevNodes) => {
      const newNodes = [...prevNodes, newNode];
      console.log('All nodes after adding:', newNodes);
      console.log('Node structure:', JSON.stringify(newNode, null, 2));
      return newNodes;
    });

    // Increment node counter for next node
    setNodeCounter(prev => prev + 1);

    // Auto-select the newly created node
    setSelectedNode(newNode);
    setSelectedEdge(null); // Clear edge selection
  }, [nodes.length, nodeCounter]);

  const clearNodes = useCallback(() => {
    console.log('Clearing all nodes and edges');
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setSelectedEdge(null);
    // Reset counters
    setNodeCounter(1);
    setEdgeCounter(1);
  }, []);

  const handleNodeSelect = useCallback((node: Node | null) => {
    console.log('Node selected:', node);
    setSelectedNode(node as Node<ConversationNodeData> | null);
    setSelectedEdge(null); // Clear edge selection when node is selected
  }, []);

  const handleEdgeSelect = useCallback((edge: Edge | null) => {
    console.log('Edge selected:', edge);
    setSelectedEdge(edge as Edge<EdgeData> | null);
    setSelectedNode(null); // Clear node selection when edge is selected
  }, []);

  const handleNodeUpdate = useCallback((nodeId: string, data: Partial<ConversationNodeData>) => {
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      );
      // Update selectedNode if it matches
      const updatedSelected = updatedNodes.find((n) => n.id === nodeId) as Node<ConversationNodeData> | undefined;
      if (updatedSelected) {
        setSelectedNode(updatedSelected);
      }
      return updatedNodes;
    });
  }, []);

  const handleEdgeUpdate = useCallback((edgeId: string, data: Partial<EdgeData>) => {
    setEdges((prevEdges) => {
      const updatedEdges = prevEdges.map((edge) =>
        edge.id === edgeId ? { ...edge, data: { ...edge.data, ...data } } : edge
      );
      // Update selectedEdge if it matches
      const updatedSelected = updatedEdges.find((e) => e.id === edgeId) as Edge<EdgeData> | undefined;
      if (updatedSelected) {
        setSelectedEdge(updatedSelected);
      }
      return updatedEdges;
    });
  }, []);

  const handleManualSave = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await saveWorkflow({
        userId,
        nodes,
        edges,
        nodeCounter,
        edgeCounter
      });
      
      if (result.success) {
        setLastSaved(new Date());
        alert('Workflow saved successfully!');
      } else {
        alert('Failed to save workflow: ' + result.message);
      }
    } catch (error) {
      alert('Failed to save workflow');
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, nodes, edges, nodeCounter, edgeCounter]);

  const handleManualLoad = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await loadWorkflow(userId);
      if (result.success && result.data) {
        const flowData = convertMongoDataToFlow(result.data);
        setNodes(flowData.nodes);
        setEdges(flowData.edges);
        setNodeCounter(flowData.nodeCounter);
        setEdgeCounter(flowData.edgeCounter);
        setSelectedNode(null);
        setSelectedEdge(null);
        alert('Workflow loaded successfully!');
      } else {
        alert('No saved workflow found');
      }
    } catch (error) {
      alert('Failed to load workflow');
      console.error('Load error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const printSystemData = useCallback(() => {
    const systemData = {
      nodes,
      edges,
      metadata: {
        nodeCount: nodes.length,
        edgeCount: edges.length,
        exportedAt: new Date().toISOString(),
        lastSaved: lastSaved?.toISOString()
      }
    };

    console.log('=== COMPLETE SYSTEM DATA ===');
    console.log(JSON.stringify(systemData, null, 2));
    console.log('=== SUMMARY ===');
    console.log(`Nodes: ${nodes.length}`);
    console.log(`Edges: ${edges.length}`);
    
    // Also copy to clipboard if possible
    if (navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(systemData, null, 2)).then(() => {
        console.log('System data copied to clipboard!');
        alert('Complete system data (nodes + edges) copied to clipboard!');
      }).catch(() => {
        alert('System data printed to console (clipboard failed)');
      });
    } else {
      alert('System data printed to console');
    }
  }, [nodes, edges, lastSaved]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-lg">Loading workflow...</div>
      </div>
    );
  }

  return (
    <div className='relative w-full h-full flex'>
        <SideBar onAddNode={addNode} /> 
        <MainCanvas 
          nodes={nodes} 
          setNodes={setNodes} 
          edges={edges} 
          setEdges={setEdges}
          onNodeSelect={handleNodeSelect}
          onEdgeSelect={handleEdgeSelect}
          edgeCounter={edgeCounter}
          setEdgeCounter={setEdgeCounter}
        />
        
        {/* Right panel container */}
        <div className="absolute top-4 right-4 flex flex-col gap-4 z-20">
          {/* Sidebars section */}
          {(selectedNode || selectedEdge) ? (
            <div className="flex flex-col gap-2">
              {selectedNode && (
                <ConversationNodeSidebar 
                  selectedNode={selectedNode}
                  onNodeUpdate={handleNodeUpdate}
                />
              )}
              {selectedEdge && (
                <EdgeSidebar 
                  selectedEdge={selectedEdge}
                  onEdgeUpdate={handleEdgeUpdate}
                />
              )}
            </div>
          ) : (
            /* Control buttons section - only shown when no sidebar is visible */
            <div className="flex flex-col gap-2">
              <button 
                onClick={handleManualSave}
                disabled={isLoading}
                className='bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded'
              >
                {isLoading ? 'Saving...' : 'Save Workflow'}
              </button>
              
              <button 
                onClick={handleManualLoad}
                disabled={isLoading}
                className='bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded'
              >
                {isLoading ? 'Loading...' : 'Load Workflow'}
              </button>
              
              <button 
                onClick={printSystemData}
                className='bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded'
              >
                Print System Data
              </button>
              
              <button 
                onClick={clearNodes}
                className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded'
              >
                Clear All
              </button>
            </div>
          )}
        </div>
        
        {/* Status info */}
        <div className='absolute bottom-10 left-10 bg-white p-3 rounded z-20 text-sm border shadow'>
          <div>Nodes: {nodes.length} | Edges: {edges.length}</div>
          {lastSaved && (
            <div className="text-xs text-gray-500">
              Last saved: {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </div>
    </div>
  )
}

export default MainComponent