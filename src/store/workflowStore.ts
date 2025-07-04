import { create } from 'zustand'
import { Node, Edge, Connection, applyNodeChanges, applyEdgeChanges } from 'reactflow'
import { saveWorkflow, loadWorkflow, convertMongoDataToFlow, autoSaveWorkflow } from '@/utils/workflow'

// Base interfaces for extensible node types
interface BaseNodeData {
  name: string
  type: string
  global?: Record<string, any> // Global object for any additional data
}

interface ConversationNodeData extends BaseNodeData {
  prompt: string
  type: 'Conversation'
  isGlobalNode?: boolean
  globalNodePathwayCondition?: string
  globalNodePathwayDescription?: string
}

// Future node types can extend BaseNodeData
interface APINodeData extends BaseNodeData {
  endpoint: string
  method: string
  type: 'API'
}

interface ConditionalNodeData extends BaseNodeData {
  condition: string
  type: 'Conditional'
}

// Union type for all possible node data types
type NodeData = ConversationNodeData | APINodeData | ConditionalNodeData

interface EdgeData {
  label?: string
  labelPosition?: 'up' | 'down' | 'center'
}

interface WorkflowState {
  // Core workflow data
  nodes: Node<NodeData>[]
  edges: Edge<EdgeData>[]
  globalPrompt: string
  
  // Counters
  nodeCounter: number
  edgeCounter: number
  
  // Selection state
  selectedNode: Node<NodeData> | null
  selectedEdge: Edge<EdgeData> | null
  
  // UI state
  isGlobalPromptOpen: boolean
  isLoading: boolean
  lastSaved: Date | null
  userId: string
  
  // Setters
  setNodes: (nodes: Node<NodeData>[]) => void
  setEdges: (edges: Edge<EdgeData>[]) => void
  setGlobalPrompt: (prompt: string) => void
  setSelectedNode: (node: Node<NodeData> | null) => void
  setSelectedEdge: (edge: Edge<EdgeData> | null) => void
  setIsGlobalPromptOpen: (open: boolean) => void
  setUserId: (userId: string) => void
  
  // Node actions
  addNode: (nodeType: string) => void
  updateNode: (nodeId: string, data: Partial<NodeData> | Record<string, any>) => void
  updateNodeGlobal: (nodeId: string, globalData: Record<string, any>) => void
  clearNodes: () => void
  
  // Edge actions
  addEdge: (connection: Connection) => void
  updateEdge: (edgeId: string, data: Partial<EdgeData>) => void
  
  // Workflow actions
  saveWorkflow: () => Promise<any>
  loadWorkflow: () => Promise<any>
  autoSave: () => void
  
  // ReactFlow handlers
  onNodesChange: (changes: any) => void
  onEdgesChange: (changes: any) => void
  onConnect: (params: Connection | Edge) => void
  onNodeClick: (event: any, node: Node) => void
  onEdgeClick: (event: any, edge: Edge) => void
  onPaneClick: () => void
}

// Helper function to create node based on type
const createNodeByType = (nodeType: string, nodeCounter: number, nodeCount: number): Node<NodeData> => {
  const basePosition = {
    x: 100 + (nodeCount * 200),
    y: 100 + (nodeCount * 100)
  }
  
  const baseStyle = { width: 220, height: 120 }
  
  switch (nodeType) {
    case 'Conversation Node':
    case 'conversation':
      return {
        id: `N${nodeCounter}`,
        type: 'conversation',
        position: basePosition,
        data: {
          name: 'Custom Node',
          prompt: '',
          type: 'Conversation',
          isGlobalNode: false,
          globalNodePathwayCondition: '',
          globalNodePathwayDescription: '',
          global: {}
        } as ConversationNodeData,
        style: baseStyle,
      }
    
    case 'API Node':
    case 'api':
      return {
        id: `N${nodeCounter}`,
        type: 'api',
        position: basePosition,
        data: {
          name: 'API Node',
          endpoint: '',
          method: 'GET',
          type: 'API',
          global: {}
        } as APINodeData,
        style: baseStyle,
      }
    
    case 'Conditional Node':
    case 'conditional':
      return {
        id: `N${nodeCounter}`,
        type: 'conditional',
        position: basePosition,
        data: {
          name: 'Conditional Node',
          condition: '',
          type: 'Conditional',
          global: {}
        } as ConditionalNodeData,
        style: baseStyle,
      }
    
    default:
      // Default to conversation node
      return {
        id: `N${nodeCounter}`,
        type: 'conversation',
        position: basePosition,
        data: {
          name: 'Custom Node',
          prompt: '',
          type: 'Conversation',
          isGlobalNode: false,
          globalNodePathwayCondition: '',
          globalNodePathwayDescription: '',
          global: {}
        } as ConversationNodeData,
        style: baseStyle,
      }
  }
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  // Initial state
  nodes: [],
  edges: [],
  globalPrompt: '',
  nodeCounter: 1,
  edgeCounter: 1,
  selectedNode: null,
  selectedEdge: null,
  isGlobalPromptOpen: false,
  isLoading: false,
  lastSaved: null,
  userId: 'user-123', // TODO: Get from auth
  
  // Setters
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setGlobalPrompt: (globalPrompt) => set({ globalPrompt }),
  setSelectedNode: (selectedNode) => set({ selectedNode, selectedEdge: null }),
  setSelectedEdge: (selectedEdge) => set({ selectedEdge, selectedNode: null }),
  setIsGlobalPromptOpen: (isGlobalPromptOpen) => set({ isGlobalPromptOpen }),
  setUserId: (userId) => set({ userId }),
  
  // Node actions
  addNode: (nodeType) => {
    const { nodes, nodeCounter } = get()
    const nodeCount = nodes.length
    
    const newNode = createNodeByType(nodeType, nodeCounter, nodeCount)
    
    set((state) => ({
      nodes: [...state.nodes, newNode],
      nodeCounter: state.nodeCounter + 1,
      selectedNode: newNode,
      selectedEdge: null
    }))
    
    console.log('Creating new node:', newNode)
  },
  
  updateNode: (nodeId, data) => {
    set((state) => {
      const updatedNodes = state.nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } as NodeData } : node
      )
      
      const updatedSelected = updatedNodes.find((n) => n.id === nodeId)
      
      return {
        nodes: updatedNodes,
        selectedNode: updatedSelected || state.selectedNode
      }
    })
  },
  
  updateNodeGlobal: (nodeId, globalData) => {
    set((state) => {
      const updatedNodes = state.nodes.map((node) =>
        node.id === nodeId 
          ? { ...node, data: { ...node.data, global: { ...node.data.global, ...globalData } } }
          : node
      )
      
      const updatedSelected = updatedNodes.find((n) => n.id === nodeId)
      
      return {
        nodes: updatedNodes,
        selectedNode: updatedSelected || state.selectedNode
      }
    })
  },
  
  clearNodes: () => {
    set({
      nodes: [],
      edges: [],
      selectedNode: null,
      selectedEdge: null,
      nodeCounter: 1,
      edgeCounter: 1
    })
    console.log('Clearing all nodes and edges')
  },
  
  // Edge actions
  addEdge: (connection) => {
    const { edges, edgeCounter } = get()
    const newEdge: Edge<EdgeData> = {
      id: `E${edgeCounter}`,
      source: connection.source!,
      target: connection.target!,
      type: 'labeled',
      data: { label: 'Custom Edge' },
    }
    
    set((state) => ({
      edges: [...state.edges, newEdge],
      edgeCounter: state.edgeCounter + 1
    }))
  },
  
  updateEdge: (edgeId, data) => {
    set((state) => {
      const updatedEdges = state.edges.map((edge) =>
        edge.id === edgeId ? { ...edge, data: { ...edge.data, ...data } } : edge
      )
      
      const updatedSelected = updatedEdges.find((e) => e.id === edgeId)
      
      return {
        edges: updatedEdges,
        selectedEdge: updatedSelected || state.selectedEdge
      }
    })
  },
  
  // Workflow actions
  saveWorkflow: async () => {
    const { nodes, edges, nodeCounter, edgeCounter, globalPrompt, userId } = get()
    
    set({ isLoading: true })
    
    try {
      const result = await saveWorkflow({
        userId,
        nodes,
        edges,
        nodeCounter,
        edgeCounter,
        globalPrompt
      })
      
      if (result.success) {
        set({ lastSaved: new Date() })
        console.log('Workflow saved successfully!')
        return result
      } else {
        console.error('Failed to save workflow:', result.message)
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('Save error:', error)
      throw error
    } finally {
      set({ isLoading: false })
    }
  },
  
  loadWorkflow: async () => {
    const { userId } = get()
    
    set({ isLoading: true })
    
    try {
      const result = await loadWorkflow(userId)
      if (result.success && result.data) {
        const flowData = convertMongoDataToFlow(result.data)
        set({
          nodes: flowData.nodes,
          edges: flowData.edges,
          nodeCounter: flowData.nodeCounter,
          edgeCounter: flowData.edgeCounter,
          globalPrompt: flowData.globalPrompt,
          selectedNode: null,
          selectedEdge: null
        })
        console.log('Workflow loaded successfully!')
        return result
      } else {
        console.log('No saved workflow found')
        return result
      }
    } catch (error) {
      console.error('Load error:', error)
      throw error
    } finally {
      set({ isLoading: false })
    }
  },
  
  autoSave: () => {
    const { nodes, edges, nodeCounter, edgeCounter, globalPrompt, userId } = get()
    
    if (nodes.length > 0 || edges.length > 0) {
      autoSaveWorkflow({
        userId,
        nodes,
        edges,
        nodeCounter,
        edgeCounter,
        globalPrompt
      })
    }
  },
  
  // ReactFlow handlers
  onNodesChange: (changes) => {
    const { nodes } = get()
    
    // Only log important changes, not every drag event
    const importantChanges = changes.filter((c: any) => c.type !== 'position')
    if (importantChanges.length > 0) {
      console.log('onNodesChange (important changes):', importantChanges)
    }
    
    set({ nodes: applyNodeChanges(changes, nodes) })
  },
  
  onEdgesChange: (changes) => {
    const { edges } = get()
    set({ edges: applyEdgeChanges(changes, edges) })
  },
  
  onConnect: (params) => {
    if ('source' in params && 'target' in params) {
      get().addEdge(params as Connection)
    }
  },
  
  onNodeClick: (event, node) => {
    console.log('Node clicked:', node)
    get().setSelectedNode(node as Node<NodeData>)
  },
  
  onEdgeClick: (event, edge) => {
    console.log('Edge clicked:', edge)
    get().setSelectedEdge(edge as Edge<EdgeData>)
  },
  
  onPaneClick: () => {
    get().setSelectedNode(null)
  }
}))

// Export types for use in components
export type { NodeData, ConversationNodeData, APINodeData, ConditionalNodeData, EdgeData }
