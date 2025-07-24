import { Schema, model, models, Document } from 'mongoose';

interface IWorkflowNode {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
      data: {
      name: string;
      prompt?: string;
      endpoint?: string;
      method?: string;
      type: string;
      variables?: Record<string, string>;
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
      global?: {
        isGlobal?: boolean;
        pathwayCondition?: string;
        pathwayDescription?: string;
        autoGoBackToPrevious?: boolean;
        createPathwayLabelToPrevious?: boolean;
        previousNodePathwayLabel?: string;
        previousNodePathwayDescription?: string;
        redirectToNode?: boolean;
        redirectTargetNodeId?: string;
        [key: string]: any; // Allow additional global properties
      };
      knowledgeBaseAttached?: boolean;
      knowledgeBaseUrl?: string;
      whenToCallRag?: string;
    };
  style?: {
    width: number;
    height: number;
  };
}

interface IWorkflowEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  data: {
    label?: string;
    labelPosition?: 'up' | 'down' | 'center';
    pathOffset?: number;
  };
}

interface IWorkflow extends Document {
  userId: string;
  name: string;
  globalPrompt: string;
  nodes: IWorkflowNode[];
  edges: IWorkflowEdge[];
  nodeCounter: number;
  edgeCounter: number;
  globalNodes: string[]; // Array of node IDs that are global
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
  };
  variables: Record<string, string>;
  globalVariables: Record<string, string>; // Global variables with key-value pairs
  createdAt: Date;
  updatedAt: Date;
}

const WorkflowSchema = new Schema<IWorkflow>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  globalPrompt: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    required: true,
    default: 'Untitled Workflow'
  },
  nodes: [{
    id: { type: String, required: true },
    type: { type: String, required: true },
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true }
    },
    data: {
      name: { type: String, required: true },
      prompt: { type: String, default: '' },
      message: { type: String, default: '' },
      endpoint: { type: String, default: '' },
      method: { type: String, default: 'GET' },
      type: { type: String, required: true },
      description: { type: String, default: '' },
      headers: { type: Object, default: {} },
      urlParams: { type: Object, default: {} },
      variableToExtract: { type: String, default: '' },
      promptToExtractVariable: { type: String, default: '' },
      params: { type: Array, default: [] },
      response: { type: Object, default: {} },
      selectedApiId: { type: String, default: '' },
      selectedApi: { type: Object, default: null },
      knowledgeBaseAttached: { type: Boolean, default: false },
      knowledgeBaseUrl: { type: String, default: '' },
      whenToCallRag: { type: String, default: '' },
      variables: { 
        type: Object, 
        default: {} 
      },
      llm: {
        provider: { type: String, default: 'OpenAI' },
        model: { type: String, default: 'gpt-4o-mini' }
      },
      tts: {
        provider: { type: String, default: 'Google' },
        model: { type: String, default: 'Neural2' },
        language: { type: String, default: 'en-GB' },
        gender: { type: String, default: 'Female' },
        voice: { type: String, default: 'en-GB-Neural2-A' }
      },
      stt: {
        provider: { type: String, default: 'Deepgram' },
        model: { type: String, default: 'nova-2' },
        language: { type: String, default: 'en-US' }
      },
      global: { 
        type: Object, 
        default: {
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
      }
    },
    style: {
      width: { type: Number },
      height: { type: Number }
    }
  }],
  edges: [{
    id: { type: String, required: true },
    source: { type: String, required: true },
    target: { type: String, required: true },
    type: { type: String, required: true },
    data: {
      label: { type: String, default: '' },
      labelPosition: { type: String, enum: ['up', 'down', 'center'], default: 'center' },
      pathOffset: { type: Number, default: 0 }
    }
  }],
  nodeCounter: {
    type: Number,
    default: 1
  },
  edgeCounter: {
    type: Number,
    default: 1
  },
  globalNodes: {
    type: [String],
    default: []
  },
  config: {
    type: {
      llm: {
        provider: { type: String, default: 'OpenAI' },
        model: { type: String, default: 'gpt-4o-mini' }
      },
      tts: {
        provider: { type: String, default: 'Google' },
        model: { type: String, default: 'generative' },
        language: { type: String, default: 'en-GB' },
        gender: { type: String, default: 'Female' },
        voice: { type: String, default: 'Amy' }
      },
      stt: {
        provider: { type: String, default: 'Deepgram' },
        model: { type: String, default: 'nova-2' },
        language: { type: String, default: 'en-US' }
      }
    },
    default: {
      llm: {
        provider: 'OpenAI',
        model: 'gpt-4o-mini'
      },
      tts: {
        provider: 'Google',
        model: 'Neural2',
        language: 'en-GB',
        gender: 'Female',
        voice: 'en-GB-Neural2-A'
      },
      stt: {
        provider: 'Deepgram',
        model: 'nova-2',
        language: 'en-US'
      }
    }
  },
  variables: {
    type: Object,
    default: {}
  },
  globalVariables: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

// Create index for faster queries
WorkflowSchema.index({ userId: 1, updatedAt: -1 });

const Workflow = models.Workflow || model<IWorkflow>('Workflow', WorkflowSchema);

export default Workflow;
export type { IWorkflow, IWorkflowNode, IWorkflowEdge }; 