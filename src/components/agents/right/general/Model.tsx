import React, { useEffect, useState } from 'react'
import { Agent } from '@/components/agents/types'
import useLLMConfig from "@/hooks/useLLMConfig";
import SelectOptions from '@/components/agent/newAgent/SelectOptions';
import SelectionDropdown from '@/components/agents/SelectionDropdown';
import { Brain, Triangle } from 'lucide-react';

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
}

const ModelLeft = ({firstMessage, setFirstMessage, systemPrompt, setSystemPrompt}: {firstMessage: string, setFirstMessage: React.Dispatch<React.SetStateAction<string>>, systemPrompt: string, setSystemPrompt: React.Dispatch<React.SetStateAction<string>>}) => {
    return (
        <div className='w-3/4'>
            <div className='flex flex-col gap-2 mb-3'>
                <label htmlFor='firstMessage'>First Message</label>
                <input id='firstMessage' type='text' className='w-full p-1 rounded-md border border-gray-300 text-sm px-2' value={firstMessage} onChange={(e) => setFirstMessage(e.target.value)} />
            </div>
            <div className='flex flex-col gap-2'>
                <label htmlFor='systemPrompt'>System Prompt</label>
                <textarea id='systemPrompt' className='w-full p-2 rounded-md border border-gray-300' rows={7} value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)}/>
            </div>
        </div>
    )
}

const ModelRight = ({
    llmProviders, 
    selectedProvider, 
    setSelectedProvider, 
    models, 
    selectedModel, 
    setSelectedModel
}: {
    llmProviders: {name: string, value: string}[], 
    selectedProvider: string, 
    setSelectedProvider: React.Dispatch<React.SetStateAction<string>>,
    models: {name: string, value: string}[],
    selectedModel: string,
    setSelectedModel: React.Dispatch<React.SetStateAction<string>>
}) => {
    return (
        <div className='w-1/4'>
            <div className='flex flex-col gap-2 mx-1'>
                <div className='mx-1 p-1'>
                    <label className='m-1 p-1'> LLM Provider </label>
                    <SelectionDropdown options={llmProviders} selectedOption={selectedProvider} setOption={setSelectedProvider} />
                </div>
                <div className='mx-1 p-1'>
                    <label className='m-1 p-1'> LLM Model </label>
                    <SelectionDropdown options={models} selectedOption={selectedModel} setOption={setSelectedModel} />
                </div>
                {/* <div className='flex flex-col gap-2'>
                    <label htmlFor='temperature' className='mx-1'>Temperature</label>
                    <input id='temperature' type='number' className='w-full p-1 rounded-md border border-gray-300 text-sm px-2' />
                </div> */}
            </div>
        </div>
    )
}

const Model = ({agent, setAgent}: {agent: Agent, setAgent:(agent: Agent) => void}) => {
    // console.log("agent", agent);
    const { llmOptions, llmProviders } = useLLMConfig() as LLMConfig
    const [isOpen, setIsOpen] = useState(false)
    
    // Get providers list
    const providers = Array.isArray(llmProviders) ? llmProviders.map((provider: LLMProvider) => ({
        name: provider.name,
        value: provider.value
    })) : [];

    // State variables with defaults from agent or fallback values
    const [selectedProvider, setSelectedProvider] = useState<string>(agent.llm || "");
    const [models, setModels] = useState<{name: string, value: string}[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>(agent.llmModel || "");
    const [temperature, setTemperature] = useState<number>(1);
    
    // Local state for text inputs (provides immediate UI feedback)
    const [firstMessage, setFirstMessage] = useState<string>(agent.welcomeMessage || "");
    const [systemPrompt, setSystemPrompt] = useState<string>(agent.prompt || "");

    // Effect 1: Update models when provider changes (similar to Voice.tsx Effect 1)
    useEffect(() => {

        
        if (selectedProvider && Array.isArray(llmProviders)) {
            const provider = llmProviders.find((p: LLMProvider) => p.value === selectedProvider);
            console.log("provider without if", provider);

            if (provider && provider.models) {
                console.log("provider", provider);
                const modelOptions = provider.models.map((model: LLMModel) => ({
                    name: model.name,
                    value: model.value
                }));
                setModels(modelOptions);
                
                // If agent has a saved model that exists in new provider, keep it; otherwise use first available
                if (agent.llmModel && modelOptions.some(m => m.value === agent.llmModel)) {
                    setSelectedModel(agent.llmModel);
                } else if (modelOptions.length > 0) {
                    setSelectedModel(modelOptions[0].value);
                }
            } 
            // else {
            //     console.log("no models found");
            //     setModels([]);
            //     setSelectedModel("");
            // }
        }
    }, [selectedProvider, llmProviders, agent.llmModel]);

    // Effect 2: Handle initial provider selection when llmProviders loads
    useEffect(() => {
        if (Array.isArray(llmProviders) && llmProviders.length > 0) {
            // If agent has a saved provider that exists, use it; otherwise use first available
            if (agent.llm && llmProviders.some(p => p.value === agent.llm)) {
                setSelectedProvider(agent.llm);
            } else if (llmProviders.length > 0) {
                setSelectedProvider(llmProviders[0].value);
            }
        }
    }, [llmProviders, agent.llm]);

    // Effect 3: Handle initial model selection when agent data loads
    useEffect(() => {
        if (agent.llmModel && models.length > 0 && models.some(m => m.value === agent.llmModel)) {
            setSelectedModel(agent.llmModel);
        }
    }, [agent.llmModel, models]);

    // Sync local state when agent changes from external source
    useEffect(() => {
        setFirstMessage(agent.welcomeMessage || "");
    }, [agent.welcomeMessage]);

    useEffect(() => {
        setSystemPrompt(agent.prompt || "");
    }, [agent.prompt]);

    // Update agent when dropdown selections change (immediate updates for dropdowns)
    useEffect(() => {
        if (agent.llm !== selectedProvider) {
            setAgent({...agent, llm: selectedProvider})
        }
    }, [selectedProvider])

    useEffect(() => {
        if (agent.llmModel !== selectedModel) {
            setAgent({...agent, llmModel: selectedModel})
        }
    }, [selectedModel])

    // Debounced updates for text inputs (avoids updating on every keystroke)
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (agent.welcomeMessage !== firstMessage) {
                setAgent({...agent, welcomeMessage: firstMessage});
            }
        }, 500); // 500ms delay

        return () => clearTimeout(timeout);
    }, [firstMessage]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (agent.prompt !== systemPrompt) {
                setAgent({...agent, prompt: systemPrompt});
            }
        }, 500); // 500ms delay

        return () => clearTimeout(timeout);
    }, [systemPrompt]);
    
  return (
    <div className='border border-gray-200 rounded-lg'>
        <header className='cursor-pointer bg-gray-100 p-2'
         onClick={() => {
            setIsOpen(!isOpen)
         }}
        >
            <div className='flex justify-between'>
                <div className='flex gap-2'>
                <Brain className='w-3.5 h-3.5 text-gray-900 self-center' />
                <h2 className='text-md text-gray-900'>Model  
                    <span className='text-sm ml-1'>
                        (Large Language Model)
                    </span>
                </h2>

                </div>

            <Triangle className={`w-3 h-3  self-center 
                ${isOpen ? "rotate-180" : "rotate-90"}
                `} 
                style={{ fill: "lightgray" }}
                 />
            {/* <Triangle className='w-4 h-4 ml-1'  /> */}
            </div>
        </header>
        {isOpen && (
            <div className='p-2 flex gap-2  '>
                <ModelLeft 
                    firstMessage={firstMessage} 
                    setFirstMessage={setFirstMessage} 
                    systemPrompt={systemPrompt} 
                    setSystemPrompt={setSystemPrompt}
                />
                <ModelRight llmProviders={providers} selectedProvider={selectedProvider} setSelectedProvider={setSelectedProvider} models={models} selectedModel={selectedModel} setSelectedModel={setSelectedModel}/>
            </div>
        )}
    </div>
  )
}

export default Model