import { Node, Edge } from 'reactflow';

interface WorkflowData {
  nodes: Node[];
  edges: Edge[];
  nodeCounter: number;
  edgeCounter: number;
  globalPrompt: string;
  globalNodes: string[];
  globalVariables?: Record<string, string>;
  config?: {
    llm?: {
      provider: string;
      model: string;
    };
    tts?: {
      provider: string;
      model: string;
      language: string;
      gender: string;
      voice: string;
    };
    stt?: {
      provider: string;
      model: string;
      language: string;
    };
    other?: {
      maxCallDuration: number;
      userAwayTimeout: number;
      backgroundAudio: boolean;
    };
  };
}

interface SaveWorkflowParams {
  workflowId: string;
  name?: string;
  nodes: Node[];
  edges: Edge[];
  nodeCounter: number;
  edgeCounter: number;
  globalPrompt: string;
  globalNodes: string[];
  globalVariables?: Record<string, string>;
  config?: WorkflowData['config'];
  variables?: Record<string, string>;
}

interface CreateWorkflowParams {
  name?: string;
}

interface LoadWorkflowResponse {
  success: boolean;
  data: WorkflowData & {
    workflowId?: string;
    name?: string;
    updatedAt?: string;
  };
  message: string;
}

// Create a new workflow
export const createWorkflow = async (params: CreateWorkflowParams): Promise<{ success: boolean; data?: any; message: string }> => {
  try {
    const response = await fetch('/api/workflow/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create workflow');
    }

    return {
      success: true,
      data: result.data,
      message: result.message || 'Workflow created successfully'
    };

  } catch (error) {
    console.error('Error creating workflow:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create workflow'
    };
  }
};

// Save workflow to MongoDB
export const saveWorkflow = async (params: SaveWorkflowParams): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`/api/workflow/${params.workflowId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to save workflow');
    }

    return {
      success: true,
      message: result.message || 'Workflow saved successfully'
    };

  } catch (error) {
    console.error('Error saving workflow:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to save workflow'
    };
  }
};

// Load workflow from MongoDB
export const loadWorkflow = async (workflowId: string): Promise<LoadWorkflowResponse> => {
  try {
    const response = await fetch(`/api/workflow/${workflowId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to load workflow');
    }

    return {
      success: true,
      data: result.data,
      message: result.message || 'Workflow loaded successfully'
    };

  } catch (error) {
    console.error('Error loading workflow:', error);
    return {
      success: false,
      data: {
        nodes: [],
        edges: [],
        nodeCounter: 1,
        edgeCounter: 1,
        globalPrompt: '',
        globalNodes: []
      },
      message: error instanceof Error ? error.message : 'Failed to load workflow'
    };
  }
};

// Convert MongoDB data to ReactFlow format
export const convertMongoDataToFlow = (mongoData: any): WorkflowData => {
  try {
    // Ensure nodes have all required ReactFlow properties
    const nodes = mongoData.nodes.map((node: any) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
      style: node.style || { width: 220, height: 120 },
      selected: false,
      dragging: false,
    }));

    // Ensure edges have all required ReactFlow properties
    const edges = mongoData.edges.map((edge: any) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.type,
      data: edge.data,
      selected: false,
    }));

    return {
      nodes,
      edges,
      nodeCounter: mongoData.nodeCounter || 1,
      edgeCounter: mongoData.edgeCounter || 1,
      globalPrompt: mongoData.globalPrompt || '',
      globalNodes: mongoData.globalNodes || [],
      config: mongoData.config || {}
    };
  } catch (error) {
    console.error('Error converting MongoDB data to flow:', error);
    return {
      nodes: [],
      edges: [],
      nodeCounter: 1,
      edgeCounter: 1,
      globalPrompt: '',
      globalNodes: [],
      config: {}
    };
  }
};

// Auto-save workflow (debounced)
let saveTimeout: NodeJS.Timeout;
export const autoSaveWorkflow = (params: SaveWorkflowParams, delay: number = 2000) => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveWorkflow(params).then(result => {
      if (result.success) {
        console.log('Workflow auto-saved successfully');
      } else {
        console.error('Auto-save failed:', result.message);
      }
    });
  }, delay);
}; 