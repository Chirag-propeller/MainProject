import { create } from 'zustand'
// import { temporal } from 'zustand/middleware' 
import { Node, Edge, Connection, applyNodeChanges, applyEdgeChanges } from 'reactflow'
import { saveWorkflow, loadWorkflow as loadWorkflowUtil, convertMongoDataToFlow, createWorkflow } from '@/utils/workflow'
import _ from 'lodash'

// Base interfaces for extensible node types
interface BaseNodeData {
  name: string
  type: string
  llm?: {
    provider: string
    model: string
  }
  tts?: {
    provider: string
    model: string
    language: string
    gender: string
    voice: string
  }
  stt?: {
    provider: string
    model: string
    language: string
  }
  variables?: Record<string, string>
  global?: {
    isGlobal?: boolean
    pathwayCondition?: string
    pathwayDescription?: string
    autoGoBackToPrevious?: boolean
    createPathwayLabelToPrevious?: boolean
    previousNodePathwayLabel?: string
    previousNodePathwayDescription?: string
    redirectToNode?: boolean
    redirectTargetNodeId?: string
    [key: string]: any // Allow additional global properties
  }
}

interface ConversationNodeData extends BaseNodeData {
  prompt: string
  type: 'Conversation'
}

// Future node types can extend BaseNodeData
interface APINodeData extends BaseNodeData {
  endpoint: string
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  type: 'API'
  description?: string
  headers?: Record<string, string>
  urlParams?: Record<string, string>
  variableToExtract?: string
  promptToExtractVariable?: string
  params?: Array<{
    name: string
    type: string
    required: boolean
    description: string
  }>
  response?: any
  selectedApiId?: string // ID of the selected API from apiTool
  selectedApi?: any // Full API data from apiTool
  preFetchRequired?: boolean // Toggle for pre-fetch requirement
}

interface TransferNodeData extends BaseNodeData {
  phoneNumber: string
  type: 'transfer'
  transferMessage?: string
}

interface ConditionalNodeData extends BaseNodeData {
  condition: string
  type: 'Conditional'
}

interface EndCallNodeData extends BaseNodeData {
  type: 'endcall'
  message?: string
}

// Add RagNodeData interface
interface RagNodeData extends BaseNodeData {
  type: 'RAG';
  knowledgeBaseAttached?: boolean;
  knowledgeBaseUrl?: string;
  whenToCallRag?: string;
}

// Union type for all possible node data types
type NodeData = ConversationNodeData | APINodeData | ConditionalNodeData | EndCallNodeData | RagNodeData | TransferNodeData;

interface EdgeData {
  label?: string
  labelPosition?: 'up' | 'down' | 'center'
  pathOffset?: number
}

interface WorkflowState {
  // Core workflow data
  nodes: Node<NodeData>[]
  edges: Edge<EdgeData>[]
  globalPrompt: string
  globalNodes: string[] // Array of node IDs that are global
  globalVariables: Record<string, string> // Global variables with key-value pairs
  config: {
    llm?: {
      provider: string
      model: string
    }
    tts?: {
      provider: string
      model: string
      language: string
      gender: string
      voice: string
    }
    stt?: {
      provider: string
      model: string
      language: string
    }
    other?: {
      maxCallDuration: number
      userAwayTimeout: number
      backgroundAudio: boolean
    }
  }
  
  // Counters
  nodeCounter: number
  edgeCounter: number
  
  // Selection state
  selectedNode: Node<NodeData> | null
  selectedEdge: Edge<EdgeData> | null
  

  //Active Node
  activeNode: string | null
  // UI state
  isGlobalPromptOpen: boolean
  isLoading: boolean
  lastSaved: Date | null
  userId: string
  currentWorkflowId: string | null
  workflowName: string
  
  // Unsaved changes tracking
  hasUnsavedChanges: boolean
  initialState: {
    nodes: Node<NodeData>[]
    edges: Edge<EdgeData>[]
    globalPrompt: string
    globalNodes: string[]
    globalVariables: Record<string, string>
    config: WorkflowState['config']
    workflowName: string
  } | null
  
  // Setters
  setNodes: (nodes: Node<NodeData>[]) => void
  setEdges: (edges: Edge<EdgeData>[]) => void
  setGlobalPrompt: (prompt: string) => void
  setGlobalNodes: (globalNodes: string[]) => void
  setGlobalVariables: (globalVariables: Record<string, string>) => void
  setConfig: (config: Partial<WorkflowState['config']>) => void
  setSelectedNode: (node: Node<NodeData> | null) => void
  setSelectedEdge: (edge: Edge<EdgeData> | null) => void
  setIsGlobalPromptOpen: (open: boolean) => void
  setUserId: (userId: string) => void
  setCurrentWorkflowId: (workflowId: string | null) => void
  setWorkflowName: (name: string) => void
  setActiveNode: (activeNode: string | null) => void
  setNodeData: (nodeId: string, data: NodeData) => void;
  
  // Unsaved changes functions
  setInitialState: () => void
  checkForUnsavedChanges: () => void
  setHasUnsavedChanges: (hasChanges: boolean) => void
  
  // Workflow creation
  createWorkflow: (name?: string) => Promise<any>
  
  // User initialization
  initializeUser: () => Promise<void>
  
  // Node actions
  addNode: (nodeType: string) => void
  updateNode: (nodeId: string, data: Partial<NodeData> | Record<string, any>) => void
  updateNodeGlobal: (nodeId: string, globalData: Record<string, any>) => void
  selectApiForNode: (nodeId: string, api: any) => void
  deleteNode: (nodeId: string) => void
  clearNodes: () => void
  
  // Edge actions
  addEdge: (connection: Connection) => void
  updateEdge: (edgeId: string, data: Partial<EdgeData>) => void
  
  // Workflow actions
  saveWorkflow: () => Promise<any>
  loadWorkflow: (workflowId: string) => Promise<any>
  updateWorkflowName: (name: string) => Promise<any>
  // autoSave: () => void
  
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
    x: 100 + (nodeCount * 50),
    y: 100 + (nodeCount * 50)
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
          global: {
            isGlobal: false,
            pathwayCondition: '',
            pathwayDescription: '',
            autoGoBackToPrevious: true,
            createPathwayLabelToPrevious: false,
            previousNodePathwayLabel: '',
            previousNodePathwayDescription: '',
            redirectToNode: false,
            redirectTargetNodeId: ''
          }
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
          description: '',
          headers: {},
          urlParams: {},
          variableToExtract: '',
          promptToExtractVariable: '',
          params: [],
          response: {},
          preFetchRequired: false,
          global: {
            isGlobal: false,
            pathwayCondition: '',
            pathwayDescription: '',
            autoGoBackToPrevious: true,
            createPathwayLabelToPrevious: false,
            previousNodePathwayLabel: '',
            previousNodePathwayDescription: '',
            redirectToNode: false,
            redirectTargetNodeId: ''
          }
        } as APINodeData,
        style: baseStyle,
      }
    
    case 'RAG Node':
    case 'rag':
      return {
        id: `N${nodeCounter}`,
        type: 'rag',
        position: basePosition,
        data: {
          name: 'RAG Node',
          type: 'RAG',
          knowledgeBaseAttached: false,
          knowledgeBaseUrl: '',
          whenToCallRag: '',
          global: {
            isGlobal: false,
            pathwayCondition: '',
            pathwayDescription: '',
            autoGoBackToPrevious: true,
            createPathwayLabelToPrevious: false,
            previousNodePathwayLabel: '',
            previousNodePathwayDescription: '',
            redirectToNode: false,
            redirectTargetNodeId: ''
          }
        },
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
          global: {
            isGlobal: false,
            pathwayCondition: '',
            pathwayDescription: '',
            autoGoBackToPrevious: true,
            createPathwayLabelToPrevious: false,
            previousNodePathwayLabel: '',
            previousNodePathwayDescription: '',
            redirectToNode: false,
            redirectTargetNodeId: ''
          }
        } as ConditionalNodeData,
        style: baseStyle,
      }
    
    case 'End Call Node':
    case 'endcall':
      return {
        id: `N${nodeCounter}`,
        type: 'endcall',
        position: basePosition,
        data: {
          name: 'End Call Node',
          type: 'endcall',
          message: 'Thank you for calling. Have a great day!',
          global: {
            isGlobal: false,
            pathwayCondition: '',
            pathwayDescription: '',
            autoGoBackToPrevious: true,
            createPathwayLabelToPrevious: false,
            previousNodePathwayLabel: '',
            previousNodePathwayDescription: '',
            redirectToNode: false,
            redirectTargetNodeId: ''
          }
        } as EndCallNodeData,
        style: baseStyle,
      }
    
    case 'Transfer Node':
    case 'transfer':
      return {
        id: `N${nodeCounter}`,
        type: 'transfer',
        position: basePosition,
        data: {
          name: 'Transfer Node',
          type: 'transfer',
          phoneNumber: '',
          transferMessage: 'Transferring your call...',
          global: {
            isGlobal: false,
            pathwayCondition: '',
            pathwayDescription: '',
            autoGoBackToPrevious: true,
            createPathwayLabelToPrevious: false,
            previousNodePathwayLabel: '',
            previousNodePathwayDescription: '',
            redirectToNode: false,
            redirectTargetNodeId: ''
          }
        } as TransferNodeData,
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
          global: {
            isGlobal: false,
            pathwayCondition: '',
            pathwayDescription: '',
            autoGoBackToPrevious: true,
            createPathwayLabelToPrevious: false,
            previousNodePathwayLabel: '',
            previousNodePathwayDescription: '',
            redirectToNode: false,
            redirectTargetNodeId: ''
          }
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
  globalNodes: [],
  globalVariables: {},
  config: {},
  nodeCounter: 1,
  edgeCounter: 1,
  selectedNode: null,
  selectedEdge: null,
  isGlobalPromptOpen: false,
  isLoading: false,
  lastSaved: null,
  userId: '',
  currentWorkflowId: null,
  workflowName: '',
  activeNode: null,
  
  // Unsaved changes tracking
  hasUnsavedChanges: false,
  initialState: null,
  
  // Setters
  setNodes: (nodes) => {
    set({ nodes });
    setTimeout(() => get().checkForUnsavedChanges(), 100);
  },
  setEdges: (edges) => {
    set({ edges });
    setTimeout(() => get().checkForUnsavedChanges(), 100);
  },
  setGlobalPrompt: (globalPrompt) => {
    set({ globalPrompt });
    setTimeout(() => get().checkForUnsavedChanges(), 100);
  },
  setGlobalNodes: (globalNodes) => {
    set({ globalNodes });
    setTimeout(() => get().checkForUnsavedChanges(), 100);
  },
  setGlobalVariables: (globalVariables: Record<string, string>) => {
    set({ globalVariables });
    setTimeout(() => get().checkForUnsavedChanges(), 100);
  },
  setConfig: (config) => {
    set({ config });
    setTimeout(() => get().checkForUnsavedChanges(), 100);
  },
  setSelectedNode: (selectedNode) => set({ selectedNode, selectedEdge: null }),
  setSelectedEdge: (selectedEdge) => set({ selectedEdge, selectedNode: null }),
  setIsGlobalPromptOpen: (isGlobalPromptOpen) => set({ isGlobalPromptOpen }),
  setUserId: (userId) => set({ userId }),
  setCurrentWorkflowId: (currentWorkflowId) => set({ currentWorkflowId }),
  setWorkflowName: (workflowName) => {
    set({ workflowName });
    setTimeout(() => get().checkForUnsavedChanges(), 100);
  },
  setActiveNode: (activeNode) => set({ activeNode }),
  setNodeData: (nodeId, data) => {
    set((state) => {
      const updatedNodes = state.nodes.map((node) =>
        node.id === nodeId ? { ...node, data } : node
      );
      const updatedSelected = updatedNodes.find((n) => n.id === nodeId);
      return {
        nodes: updatedNodes,
        selectedNode: updatedSelected || state.selectedNode,
      };
    });
    setTimeout(() => get().checkForUnsavedChanges(), 100);
  },
  // Unsaved changes functions
  setInitialState: () => {
    const currentState = {
      nodes: _.cloneDeep(get().nodes),
      edges: _.cloneDeep(get().edges),
      globalPrompt: get().globalPrompt,
      globalNodes: _.cloneDeep(get().globalNodes),
      globalVariables: _.cloneDeep(get().globalVariables),
      config: _.cloneDeep(get().config),
      workflowName: get().workflowName,
    };
    
    set({
      initialState: currentState,
      hasUnsavedChanges: false, // Always reset to false when setting initial state
    });
  },
  checkForUnsavedChanges: () => {
    const currentState = {
      nodes: _.cloneDeep(get().nodes),
      edges: _.cloneDeep(get().edges),
      globalPrompt: get().globalPrompt,
      globalNodes: _.cloneDeep(get().globalNodes),
      globalVariables: _.cloneDeep(get().globalVariables),
      config: _.cloneDeep(get().config),
      workflowName: get().workflowName,
    };
    const initial = get().initialState;
    
    if (initial) {
      const hasChanges = !_.isEqual(currentState, initial);
      set({ hasUnsavedChanges: hasChanges });
    } else {
      // If no initial state is set, assume no changes
      set({ hasUnsavedChanges: false });
    }
  },
  setHasUnsavedChanges: (hasChanges: boolean) => {
    set({ hasUnsavedChanges: hasChanges });
  },
  // Workflow creation
  createWorkflow: async (name?: string) => {
    set({ isLoading: true })
    
    try {
      const result = await createWorkflow({ name })
      if (result.success && result.data) {
        set({ 
          currentWorkflowId: result.data._id,
          workflowName: result.data.name || 'New Workflow',
          nodes: [],
          edges: [],
          nodeCounter: 1,
          edgeCounter: 1,
          globalPrompt: '',
          globalNodes: [],
          globalVariables: {},
          config: {},
          selectedNode: null,
          selectedEdge: null,
          hasUnsavedChanges: false // Reset unsaved changes when creating new workflow
        })
        
        // Set the baseline after creating new workflow
        setTimeout(() => {
          get().setInitialState()
        }, 0)
        
        console.log('Workflow created successfully!')
        return result
      } else {
        console.error('Failed to create workflow:', result.message)
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('Create error:', error)
      throw error
    } finally {
      set({ isLoading: false })
    }
  },
  
  // User initialization
  initializeUser: async () => {
    try {
      const response = await fetch('/api/user/getCurrentUser');
      if (response.ok) {
        const userData = await response.json();
        set({ userId: userData._id });
        console.log('User initialized with ID:', userData._id);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error initializing user:', error);
    }
  },
  
  // Node actions
  addNode: (nodeType: string) => {
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
    setTimeout(() => get().checkForUnsavedChanges(), 100);
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
    
    setTimeout(() => get().checkForUnsavedChanges(), 100);
  },
  
  updateNodeGlobal: (nodeId, globalData) => {
    set((state) => {
      const updatedNodes = state.nodes.map((node) =>
        node.id === nodeId 
          ? { ...node, data: { ...node.data, global: { ...node.data.global, ...globalData } } }
          : node
      )
      
      const updatedSelected = updatedNodes.find((n) => n.id === nodeId)
      
      // Update globalNodes array if isGlobal status changed
      let updatedGlobalNodes = [...state.globalNodes]
      const node = updatedNodes.find((n) => n.id === nodeId)
      
      if (node) {
        const isGlobal = node.data.global?.isGlobal || false
        const isCurrentlyGlobal = state.globalNodes.includes(nodeId)
        
        if (isGlobal && !isCurrentlyGlobal) {
          updatedGlobalNodes.push(nodeId)
        } else if (!isGlobal && isCurrentlyGlobal) {
          updatedGlobalNodes = updatedGlobalNodes.filter(id => id !== nodeId)
        }
      }
      
      return {
        nodes: updatedNodes,
        selectedNode: updatedSelected || state.selectedNode,
        globalNodes: updatedGlobalNodes
      }
    })
    
    setTimeout(() => get().checkForUnsavedChanges(), 100);
  },
  
  selectApiForNode: (nodeId, api) => {
    set((state) => {
      const updatedNodes = state.nodes.map((node) =>
        node.id === nodeId 
          ? { 
              ...node, 
              data: { 
                ...node.data, 
                selectedApiId: api._id,
                selectedApi: api,
                endpoint: api.endpoint,
                method: api.method,
                name: api.apiName,
                description: api.description,
                headers: api.headers,
                urlParams: api.urlParams,
                params: api.params,
                response: api.response,
                variableToExtract: api.variableToExtract,
                promptToExtractVariable: api.promptToExtractVariable,
                preFetchRequired: (node.data as APINodeData).preFetchRequired || false // Preserve existing preFetchRequired value
              } 
            }
          : node
      )
      
      const updatedSelected = updatedNodes.find((n) => n.id === nodeId)
      
      return {
        nodes: updatedNodes,
        selectedNode: updatedSelected || state.selectedNode
      }
    })
    
    setTimeout(() => get().checkForUnsavedChanges(), 100);
  },
  
  deleteNode: (nodeId: string) => {
    set((state) => ({
      nodes: state.nodes.filter(node => node.id !== nodeId),
      edges: state.edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId),
      selectedNode: state.selectedNode?.id === nodeId ? null : state.selectedNode,
    }))
    setTimeout(() => get().checkForUnsavedChanges(), 100);
  },
  
  clearNodes: () => {
    set({ 
      nodes: [], 
      edges: [], 
      selectedNode: null, 
      selectedEdge: null 
    })
    setTimeout(() => get().checkForUnsavedChanges(), 100);
  },
  
  // Edge actions
  addEdge: (connection) => {
    const { edges, edgeCounter } = get()
    const newEdge: Edge<EdgeData> = {
      id: `E${edgeCounter}`,
      source: connection.source!,
      target: connection.target!,
      type: 'labeled',
      data: { 
        label: 'Custom Edge',
        labelPosition: 'center',
        pathOffset: 0
      },
    }
    
    set((state) => ({
      edges: [...state.edges, newEdge],
      edgeCounter: state.edgeCounter + 1
    }))
    setTimeout(() => get().checkForUnsavedChanges(), 100);
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
    setTimeout(() => get().checkForUnsavedChanges(), 100);
  },
  
  // Workflow actions
  saveWorkflow: async () => {
    const { nodes, edges, nodeCounter, edgeCounter, globalPrompt, globalNodes, globalVariables, currentWorkflowId, config } = get()
    
    if (!currentWorkflowId) {
      throw new Error('No workflow ID available for saving')
    }

    // Aggregate variables from all nodes
    const aggregatedVariables: Record<string, string> = {};
    nodes.forEach(node => {
      if (node.data && node.data.variables) {
        Object.entries(node.data.variables).forEach(([key, value]) => {
          aggregatedVariables[key] = value;
        });
      }
    });
    
    try {
      const result = await saveWorkflow({
        workflowId: currentWorkflowId,
        nodes,
        edges,
        nodeCounter,
        edgeCounter,
        globalPrompt,
        globalNodes,
        globalVariables,
        config,
        variables: aggregatedVariables
      })
      
      if (result.success) {
        set({ lastSaved: new Date() })
        get().setInitialState() // Set the baseline after successful save
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
  
  loadWorkflow: async (workflowId: string) => {
    set({ isLoading: true })
    
    try {
      const result = await loadWorkflowUtil(workflowId)
      if (result.success && result.data) {
        const flowData = convertMongoDataToFlow(result.data)
        set({
          currentWorkflowId: workflowId,
          workflowName: result.data.name || 'Untitled Workflow',
          nodes: flowData.nodes,
          edges: flowData.edges,
          nodeCounter: flowData.nodeCounter,
          edgeCounter: flowData.edgeCounter,
          globalPrompt: flowData.globalPrompt,
          globalNodes: flowData.globalNodes || [],
          globalVariables: result.data.globalVariables || {},
          config: result.data.config || {},
          selectedNode: null,
          selectedEdge: null,
          hasUnsavedChanges: false // Reset unsaved changes when loading
        })
        
        // Set the baseline after successful load - use setTimeout to ensure state is updated first
        setTimeout(() => {
          get().setInitialState()
        }, 0)
        
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
  
  updateWorkflowName: async (name: string) => {
    const { currentWorkflowId } = get()
    
    if (!currentWorkflowId) {
      throw new Error('No workflow ID available for updating name')
    }
    
    try {
      const response = await fetch(`/api/workflow/${currentWorkflowId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        set({ workflowName: name })
        return result
      } else {
        throw new Error(result.error || 'Failed to update workflow name')
      }
    } catch (error) {
      console.error('Error updating workflow name:', error)
      throw error
    }
  },
  
  autoSave: () => {
    // const { nodes, edges, nodeCounter, edgeCounter, globalPrompt, globalNodes, globalVariables, currentWorkflowId, config } = get()
    
    // if (currentWorkflowId && (nodes.length > 0 || edges.length > 0)) {
    //   autoSaveWorkflow({
    //     workflowId: currentWorkflowId,
    //     nodes,
    //     edges,
    //     nodeCounter,
    //     edgeCounter,
    //     globalPrompt,
    //     globalNodes,
    //     globalVariables,
    //     config
    //   })
    // }
  },
  
  // ReactFlow handlers
  onNodesChange: (changes) => {
    set((state) => ({ 
      nodes: applyNodeChanges(changes, state.nodes) 
    }))
    setTimeout(() => get().checkForUnsavedChanges(), 100);
  },
  
  onEdgesChange: (changes) => {
    set((state) => ({ 
      edges: applyEdgeChanges(changes, state.edges) 
    }))
    setTimeout(() => get().checkForUnsavedChanges(), 100);
  },
  
  onConnect: (params: Connection | Edge) => {
    if ('source' in params && 'target' in params && !('id' in params)) {
      // This is a Connection
      const connection = params as Connection
      const { edgeCounter } = get()
      const newEdge: Edge<EdgeData> = {
        id: `edge-${edgeCounter}`,
        source: connection.source!,
        target: connection.target!,
        sourceHandle: connection.sourceHandle || null,
        targetHandle: connection.targetHandle || null,
        type: 'custom',
        data: {
          label: `Edge ${edgeCounter}`,
        }
      }
      
      set((state) => ({
        edges: [...state.edges, newEdge],
        edgeCounter: state.edgeCounter + 1,
      }))
      setTimeout(() => get().checkForUnsavedChanges(), 100);
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
export type { NodeData, ConversationNodeData, APINodeData, ConditionalNodeData, EndCallNodeData, EdgeData }
