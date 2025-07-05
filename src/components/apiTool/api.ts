import axios from 'axios';
import { Api } from './types';

interface ApiPayload {
  apiName: string;
  description?: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  params?: Array<{
    name: string;
    type: string;
    required?: boolean;
    description?: string;
  }>;
  response?: any;
  userId?: string;
  createdAt?: string;
  usedByAgents?: any[];
}

// Fetch all APIs
export const fetchApis = async (): Promise<Api[]> => {
  try {
    const res = await fetch('/api/apiTool/get');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to fetch APIs:', err);
    return [];
  }
};

// Fetch a single API by ID
export const fetchApiById = async (id: string): Promise<Api | null> => {
  try {
    const res = await fetch(`/api/apiTool/${id}`);
    if (!res.ok) {
      throw new Error('Failed to fetch API');
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`Failed to fetch API with ID ${id}:`, err);
    return null;
  }
};

// Create a new API
export const createApi = async (apiData: ApiPayload): Promise<any> => {
  try {
    const res = await fetch('/api/apiTool/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiData),
    });

    if (!res.ok) {
      throw new Error('Failed to create API');
    }

    return await res.json();
  } catch (err) {
    console.error('Failed to create API:', err);
    throw err;
  }
};

// Delete an API by ID
export const deleteApi = async (id: string): Promise<boolean> => {
  try {
    const res = await axios.delete(`/api/apiTool/delete`, {
      data: { id },
    });

    console.log("API deleted successfully", res);

    return true;
  } catch (err) {
    console.error('Failed to delete API: ', err);
    return false;
  }
};