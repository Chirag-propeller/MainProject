// components/WorkflowEditor.tsx
"use client"
import React, { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  Position,
  applyNodeChanges,
  applyEdgeChanges,
  ConnectionMode
} from 'reactflow';

import 'reactflow/dist/style.css'; // Don't forget to import the styles!
import ConversationNode from './CustomNodes/ConversationNode';
import LabeledEdge from './CustomEdges/LabeledEdge';

interface ConversationNodeData {
  name: string;
  prompt: string;
  type: string;
}

interface EdgeData {
  label?: string;
}

interface MainCanvasProps {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onNodeSelect?: (node: Node | null) => void;
  onEdgeSelect?: (edge: Edge | null) => void;
  edgeCounter: number;
  setEdgeCounter: React.Dispatch<React.SetStateAction<number>>;
}

const MainCanvas: React.FC<MainCanvasProps> = ({ 
  nodes, 
  setNodes, 
  edges, 
  setEdges, 
  onNodeSelect,
  onEdgeSelect,
  edgeCounter,
  setEdgeCounter
}) => {
  // Memoize nodeTypes to prevent React Flow warnings
  const nodeTypes = useMemo(() => ({
    conversation: ConversationNode,
  }), []);

  // Memoize edgeTypes to prevent React Flow warnings
  const edgeTypes = useMemo(() => ({
    labeled: LabeledEdge,
  }), []);

  // Default edge options
  const defaultEdgeOptions = useMemo(() => ({
    type: 'labeled',
    animated: false,
    style: {
      strokeWidth: 2,
      stroke: '#6366f1', // indigo-500
    }
  }), []);

  // Debug: Log nodes when they change (but only once)
  useEffect(() => {
    console.log('MainCanvas received nodes:', nodes);
  }, [nodes.length]); // Only log when number of nodes changes

  const onNodesChange = useCallback(
    (changes: any) => {
      // Only log important changes, not every drag event
      const importantChanges = changes.filter((c: any) => c.type !== 'position');
      if (importantChanges.length > 0) {
        console.log('onNodesChange (important changes):', importantChanges);
      }
      
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: any) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );

  const onConnect = useCallback((params: Connection | Edge) => {
    const newEdge: Edge<EdgeData> = {
      id: `E${edgeCounter}`,
      source: params.source!,
      target: params.target!,
      type: 'labeled',
      data: { label: 'Custom Edge' },
    };
    
    setEdges((eds) => addEdge(newEdge, eds));
    setEdgeCounter(prev => prev + 1);
  }, [setEdges, edgeCounter, setEdgeCounter]);

  const onNodeClick = useCallback((event: any, node: Node) => {
    console.log('Node clicked:', node);
    onNodeSelect?.(node);
  }, [onNodeSelect]);

  const onPaneClick = useCallback(() => {
    onNodeSelect?.(null);
  }, [onNodeSelect]);

  const onEdgeClick = useCallback((event: any, edge: Edge) => {
    console.log('Edge clicked:', edge);
    onEdgeSelect?.(edge);
  }, [onEdgeSelect]);

  return (
    <div className='flex-1 h-[100vh]'>
    <ReactFlowProvider>
      <div className='w-full h-full'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          connectionMode={ConnectionMode.Loose}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onEdgeClick={onEdgeClick}
          fitView={false}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          snapToGrid={true}
          snapGrid={[20, 20]}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
    </div>
  );
};

export default MainCanvas;

// // components/WorkflowEditor.tsx
// "use client"
// import React, { useCallback, useState } from 'react';
// import ReactFlow, {
//   MiniMap,
//   Controls,
//   Background,
//   useNodesState,
//   useEdgesState,
//   addEdge,
//   Connection,
//   Edge,
//   Node,
//   ReactFlowProvider,
//   Position,
//   PanelPosition 
// } from 'reactflow';


// import 'reactflow/dist/style.css'; // Don't forget to import the styles!

// const initialNodes: Node[] = []; // Your initial nodes
// const initialEdges: Edge[] = []; // Your initial edges

// const WorkflowEditor: React.FC = () => {
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

//   const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

//   return (
//     <ReactFlowProvider>
//       <div style={{ width: '100vw', height: '100vh' }}> {/* Adjust dimensions */}
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           fitView
//         >
//           <MiniMap />
//           <Controls
//             position={PanelPosition.BottomCenter}
//             orientation="horizontal"
//             />

//           <Background />
//         </ReactFlow>
//       </div>
//     </ReactFlowProvider>
//   );
// };

// export default WorkflowEditor;

