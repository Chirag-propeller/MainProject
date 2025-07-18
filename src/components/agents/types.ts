import mongoose from 'mongoose';


export interface Agent {
  _id: string;
  agentId: string;
  agentName: string;
  createdAt: string;
  llm?: string;
  llmModel?: string;
  inputLanguage?: string;
  stt?: string;
  sttModel?: string;
  sttLanguage?: string;
  tts?: string;
  ttsLanguage?: string;
  ttsVoiceName?: string;
  ttsModel?: string;
  prompt?: string;
  gender?: string;
  userId: string;
  speed?: number;
  backgroundSound?: string;
  welcomeMessage?: string;
  knowledgeBaseAttached?: boolean;
  knowledgeBaseUrl?: string;
  knowledgeBase: mongoose.Types.ObjectId[];
  apis?: mongoose.Types.ObjectId[];
  maxCallDuration?: number;
  numberTransfer?: boolean;
  numberTransferNumber?: string;
  callHangup?: boolean;
  callHangupPhase?: string[];
  userAwayTimeOut?: number;
  languageFillers?: object;
  isLanguageFillersActive?: boolean;
  whenToCallRag?: string;
} 