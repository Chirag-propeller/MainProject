// models/agent.ts
import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IAgent extends Document {
  agentId: string;
  agentName: string;
  backgroundSound?: string;
  createdAt: Date;
  gender?: string;
  inputLanguage?: string;
  knowledgeBaseAttached?: boolean;
  knowledgeBase: mongoose.Types.ObjectId[];
  llm?: string;
  llmModel?: string;
  prompt?: string;
  speed?: number;
  stt?: string;
  tts?: string;
  ttsVoiceName?: string;
  ttsLanguage?: string;
  ttsModel?: string;
  userId: mongoose.Types.ObjectId;
  welcomeMessage?: string;
}

const AgentSchema: Schema = new Schema({
  // userId : {}
  agentId: { type: String, required: true, unique: true },
  agentName: { type: String, required: false , default: "Agent 1"},
  backgroundSound: { type: String },
  gender: { type: String },
  inputLanguage: { type: String },
  knowledgeBaseAttached: { type: Boolean, default: false },
  knowledgeBase: [{ type: Schema.Types.ObjectId, ref: 'KnowledgeBase' , default: []}],
  llm: { type: String },
  llmModel: { type: String },
  prompt: { type: String },
  speed: { type: Number },
  stt: { type: String },
  tts: { type: String },
  ttsLanguage: { type: String },
  ttsModel: { type: String },
  ttsVoiceName: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  welcomeMessage: { type: String },
}, {timestamps:true});

export default models.Agent || model<IAgent>('Agent', AgentSchema);
