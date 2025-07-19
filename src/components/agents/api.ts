import axios from 'axios';
import { Agent } from './types';

interface AgentPayload {
  agentName: string;
  llm?: string;
  llmModel?: string;
  inputLanguage?: string;
  stt?: string;
  sttModel?: string;
  sttLanguage?: string;
  tts?: string;
  ttsVoiceName?: string;
  ttsModel?: string;
  speed?: number;
  backgroundSound?: string;
  welcomeMessage?: string;
  knowledgeBaseAttached?: boolean;
  knowledgeBase?: any[];
  prompt?: string;
  userId?: string;
  gender?: string;
  ttsLanguage?: string;
  languageFillers?: object;
}

export const fetchAgents = async (): Promise<Agent[]> => {
  try {
    const res = await fetch('/api/agents/get');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to fetch agents:', err);
    return [];
  }
};

// Function to fetch a single agent by ID
export const fetchAgentById = async (id: string): Promise<Agent | null> => {
  try {
    const res = await fetch(`/api/agents/${id}`);
    
    if (!res.ok) {
      throw new Error('Failed to fetch agent');
    }
    
    const data = await res.json();
    // console.log("data", data);
    return data;
  } catch (err) {
    console.error(`Failed to fetch agent with ID ${id}:`, err);
    return null;
  }
};

export const createAgent = async (agentData: AgentPayload): Promise<any> => {
  try {
    const res = await fetch('/api/agents/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agentData),
    });
    
    if (!res.ok) {
      throw new Error('Failed to create agent');
    }
    
    return await res.json();
  } catch (err) {
    console.error('Failed to create agent:', err);
    throw err;
  }
};

export const deleteAgent = async (id: string): Promise<boolean> => {
  try {
    const res = await axios.delete(`/api/agents/delete`, {  
      data: { id },
    });
    
    // console.log("Agent deleted successfully api", res);

    return true;
  } catch (err) {
    console.error('Failed to delete agent api: ', err);
    return false;
  }
}; 