// models/agent.ts
import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IAgent extends Document {
  agentId: string;
  agentName: string;
  backgroundSound?: string;
  callHangup: boolean;
  callHangupPhase: string[];
  hangupMessage?: string;
  createdAt: Date;
  gender?: string;
  inputLanguage?: string;
  knowledgeBaseAttached?: boolean;
  knowledgeBaseUrl?: string;
  knowledgeBase: mongoose.Types.ObjectId[];
  llm?: string;
  llmModel?: string;
  maxCallDuration?: number;
  numberTransfer?: boolean;
  numberTransferNumber?: string;
  prompt?: string;
  speed?: number;
  stt?: string;
  sttModel?: string;
  sttLanguage?: string;
  tts?: string;
  ttsVoiceName?: string;
  ttsLanguage?: string;
  ttsModel?: string;
  apis: mongoose.Types.ObjectId[];
  userId: mongoose.Types.ObjectId;
  welcomeMessage?: string;
  userAwayTimeOut?: number;
  languageFillers?: object;
  isLanguageFillersActive?: boolean;
  whenToCallRag?: string;
}

const AgentSchema: Schema = new Schema({
  // userId : {}
  agentId: { type: String, required: true, unique: true },
  agentName: { type: String, required: false, default: "Agent 1" },
  callHangup: { type: Boolean, default: false },
  callHangupPhase: [{ type: String, default: [] }],
  hangupMessage: { type: String },
  backgroundSound: { type: String },
  gender: { type: String },
  inputLanguage: { type: String },
  knowledgeBaseAttached: { type: Boolean, default: false },
  knowledgeBaseUrl: { type: String, default: false },
  knowledgeBase: [{ type: Schema.Types.ObjectId, ref: 'KnowledgeBase', default: [] }],
  llm: { type: String },
  llmModel: { type: String },
  maxCallDuration: { type: Number, default: 120 },
  numberTransfer: { type: Boolean, default: false },
  numberTransferNumber: { type: String },
  prompt: { type: String },
  speed: { type: Number },
  stt: { type: String },
  sttModel: { type: String },
  sttLanguage: { type: String },
  tts: { type: String },
  apis: [{ type: Schema.Types.ObjectId, ref: 'Api', default: [] }],
  ttsLanguage: { type: String },
  ttsModel: { type: String },
  ttsVoiceName: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  welcomeMessage: { type: String },
  userAwayTimeOut: { type: Number, default: 5 },
  languageFillers: { type: Object, default: {} },
  isLanguageFillersActive: { type: Boolean, default: true },
  whenToCallRag: { type: String },
}, { timestamps: true });

export default models.Agent || model<IAgent>('Agent', AgentSchema);
