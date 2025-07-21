'use client'
import React, { useEffect, useMemo } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
  ConnectionMode
} from 'reactflow'
import 'reactflow/dist/style.css'
import ConversationNode from './CustomNodes/ConversationNode'
import EndCallNode from './CustomNodes/EndCallNode'
import ApiRequestNode from './CustomNodes/ApiRequestNode'
import RagNode from './CustomNodes/RagNode';
import LabeledEdge from './CustomEdges/LabeledEdge'
import { useWorkflowStore } from '@/store/workflowStore'
import CustomComponentSidebar from './CustomComponentSidebar';

const MainCanvas: React.FC = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onEdgeClick,
    onPaneClick
  } = useWorkflowStore()
  // Memoize nodeTypes to prevent React Flow warnings
  const nodeTypes = useMemo(() => ({
    conversation: ConversationNode,
    endcall: EndCallNode,
    api: ApiRequestNode,
    rag: RagNode,
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
    console.log('MainCanvas received nodes:', nodes)
  }, [nodes.length]) // Only log when number of nodes changes

  return (
    <div className='flex-1 h-[100vh] relative'>
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
          {/* Sidebar for node/edge properties */}
          <div className="absolute top-0 right-0 z-20">
            <CustomComponentSidebar />
          </div>
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

