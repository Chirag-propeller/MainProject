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
  prompt?: string;
}

const AgentSchema: Schema = new Schema({
  // userId : {}
  agentId: { type: String, required: true, unique: true },
  agentName: { type: String, required: true , default: "Agent 1"},
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
  prompt: { type: String },
}, {timestamps:true});

export default models.Agent || model<IAgent>('Agent', AgentSchema);
