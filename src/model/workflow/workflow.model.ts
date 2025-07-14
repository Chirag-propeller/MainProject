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
      endpoint: { type: String, default: '' },
      method: { type: String, default: 'GET' },
      type: { type: String, required: true },
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
  }
}, {
  timestamps: true
});

// Create index for faster queries
WorkflowSchema.index({ userId: 1, updatedAt: -1 });

const Workflow = models.Workflow || model<IWorkflow>('Workflow', WorkflowSchema);

export default Workflow;
export type { IWorkflow, IWorkflowNode, IWorkflowEdge }; 