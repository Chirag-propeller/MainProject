import { useState, useEffect } from "react";

// Define the structure of the expected config data
interface TtsOptions {
  [key: string]: string[]; // Each provider has an array of voice options
}

interface LLMProvider {
  name: string;
  value: string;
  models: LLMModel[];
}

interface LLMModel {
  name: string;
  value: string;
}

interface LLMConfig {
  llmOptions: string[];
  llmProviders: LLMProvider[];
  ttsOptions: TtsOptions;
  sttOptions: string[];
  loading: boolean;
  ttsLanguageOptions: string[];
  sttModels: STTConfig[];
}

interface Languages{
  name: string;
  value: string;
}
interface STTModel {
  name: string;
  value: string;
  languages: Languages[];
}

interface STTConfig {
  name: string;
  value: string;
  models: STTModel[];
}

export default function useLLMConfig(): LLMConfig {
  const [llmOptions, setLLMOptions] = useState<string[]>([]);
  const [llmProviders, setLLMProviders] = useState<LLMProvider[]>([]);
  const [ttsOptions, setTTSOptions] = useState<TtsOptions>({});
  const [ttsLanguageOptions, setTTSLanguageOptions] = useState<string[]>([]);
  const [sttOptions, setSTTOptions] = useState<string[]>([]);
  const [sttModels, setSTTModels] = useState<STTConfig[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchConfig() {
      try {
        // const response = await fetch("/config/LLM.json");
        const response = await fetch("/config/LLM1.json");
        const data = await response.json();

        // Ensure data structure matches expected types
        setLLMOptions(data.llm_models || []);
        setLLMProviders(data.llm_providers || []);
        // setTTSOptions(data.tts_providers || {});
        setTTSOptions(data.providers || {});
        setSTTOptions(data.stt_languages || []);
        setTTSLanguageOptions(data.tts_languages || []);
        setSTTModels(data.stt || []);
      } catch (error) {
        console.error("Error loading config:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchConfig();
  }, []);

  return { llmOptions, llmProviders, ttsOptions, sttOptions, loading, ttsLanguageOptions, sttModels: sttModels };
}
