// models/agent.ts
import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IAgent extends Document {
  agentId: string;
  agentName: string;
  createdAt: Date;
  llm?: string;
  inputLanguage?: string;
  stt?: string;
  tts?: string;
  ttsVoiceName?: string;
  ttsModel?: string;
  speed?: number;
  backgroundSound?: string;
  welcomeMessage?: string;
  knowledgeBaseAttached?: boolean;
  knowledgeBase: mongoose.Types.ObjectId[];
  prompt?: string;
  userId: mongoose.Types.ObjectId;
}

const AgentSchema: Schema = new Schema({
  // userId : {}
  agentId: { type: String, required: true, unique: true },
  agentName: { type: String, required: false , default: "Agent 1"},
  llm: { type: String },
  inputLanguage: { type: String },
  stt: { type: String },
  tts: { type: String },
  ttsVoiceName: { type: String },
  ttsModel: { type: String },
  speed: { type: Number },
  backgroundSound: { type: String },
  welcomeMessage: { type: String },
  knowledgeBaseAttached: { type: Boolean, default: false },
  knowledgeBase: [{ type: Schema.Types.ObjectId, ref: 'KnowledgeBase' , default: []}],
  prompt: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {timestamps:true});

export default models.Agent || model<IAgent>('Agent', AgentSchema);
