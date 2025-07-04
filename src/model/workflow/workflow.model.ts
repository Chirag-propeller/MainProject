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
    prompt: string;
    type: string;
    isGlobalNode?: boolean;
    globalNodePathwayCondition?: string;
    globalNodePathwayDescription?: string;
    global?: Record<string, any>;
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
      type: { type: String, required: true },
      isGlobalNode: { type: Boolean, default: false },
      globalNodePathwayCondition: { type: String, default: '' },
      globalNodePathwayDescription: { type: String, default: '' },
      global: { type: Object, default: {} }
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
      label: { type: String, default: '' }
    }
  }],
  nodeCounter: {
    type: Number,
    default: 1
  },
  edgeCounter: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Create index for faster queries
WorkflowSchema.index({ userId: 1, updatedAt: -1 });

const Workflow = models.Workflow || model<IWorkflow>('Workflow', WorkflowSchema);

export default Workflow;
export type { IWorkflow, IWorkflowNode, IWorkflowEdge }; 