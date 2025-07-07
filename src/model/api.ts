// models/voiceAgentApi.ts
import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IVoiceAgentApi extends Document {
  apiId: string;
  apiName: string;
  description?: string;
  endpoint: string;
  method: "GET" | "POST";
  headers?: Record<string, string>;
  urlParams?: Record<string, string>;
  params?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  variableToExtract?: string;
  promptToExtractVariable?: string;
  response?: any;
  userId: mongoose.Types.ObjectId;
  usedByAgents?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt?: Date;
}

const VoiceAgentApiSchema: Schema = new Schema(
  {
    apiId: { type: String, required: true, unique: true },
    apiName: { type: String, required: true },
    description: { type: String },
    endpoint: { type: String, required: true },
    method: {
      type: String,
      enum: ["GET", "POST"],
      required: true,
    },
    headers: { type: Map, of: String, default: {} },
    urlParams: { type: Map, of: String, default: {} },
    variableToExtract: { type: String },
    promptToExtractVariable: { type: String },
    params: [
      {
        name: { type: String, required: true },
        type: { type: String, required: true },
        required: { type: Boolean, default: false },
        description: { type: String, default: "" },
      },
    ],
    response: { type: Schema.Types.Mixed },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    usedByAgents: [{ type: Schema.Types.ObjectId, ref: "Agent" }],
  },
  { timestamps: true }
);

export default models.VoiceAgentApi ||
  model<IVoiceAgentApi>("VoiceAgentApi", VoiceAgentApiSchema);
