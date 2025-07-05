import mongoose from 'mongoose';

export interface Api {
  _id: string;
  apiId: string;
  apiName: string;
  description?: string;
  endpoint: string;                // The API endpoint URL
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"; // HTTP method
  headers?: Record<string, string>; // Optional headers for the API call
  urlParams?: Record<string, string>; // Optional URL parameters for the API call
  params?: Array<{                // Query or body parameters
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  response?: any;                 // Example or schema of the expected response
  createdAt: string;
  updatedAt?: string;
  userId: string;
  usedByAgents?: mongoose.Types.ObjectId[];
} 