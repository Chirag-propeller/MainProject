import React, { useEffect, useState } from 'react'
import { Agent } from '@/components/agents/types'
import useLLMConfig from "@/hooks/useLLMConfig";
import SelectOptions from '@/components/agent/newAgent/SelectOptions';
import { Brain, Triangle } from 'lucide-react';

interface LLMConfig {
    llmOptions: string[];
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

const ModelRight = ({llm, selectedLLM, setSelectedLLM}: {llm: string[], selectedLLM: string, setSelectedLLM: React.Dispatch<React.SetStateAction<string>>}) => {
    return (
        <div className='w-1/4'>
            <div className='flex flex-col gap-2 mx-1'>
                <div className='mx-1 p-1'>
                <label className='m-1 p-1'> LLM </label>
                <SelectOptions options={llm} selectedOption={selectedLLM} setOption={setSelectedLLM} />
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
    const { llmOptions } = useLLMConfig() as LLMConfig
    const [isOpen, setIsOpen] = useState(false)
    const llm: string[] = Array.isArray(llmOptions) ? Array.from(llmOptions) : Object.values(llmOptions);
    const [selectedLLM, setSelectedLLM] = useState<string>(agent.llm || llmOptions[0]);
    const [temperature, setTemperature] = useState<number>(1);
    const [firstMessage, setFirstMessage] = useState<string>(agent.welcomeMessage || "");
    const [systemPrompt, setSystemPrompt] = useState<string>(agent.prompt || "");

    useEffect(() => {
        setAgent({...agent, llm: selectedLLM})
    }, [selectedLLM])

    // useEffect(() => {
    //     setAgent({...agent, temperature: temperature})
    // }, [temperature])

    useEffect(() => {
        setAgent({...agent, welcomeMessage: firstMessage})
    }, [firstMessage])

    useEffect(() => {
        setAgent({...agent, prompt: systemPrompt})
    }, [systemPrompt])
    // useEffect(() => {
    //     setSelectedLLM(llm[0])
    // }, [llm])


    
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
                <ModelLeft firstMessage={firstMessage} setFirstMessage={setFirstMessage} systemPrompt={systemPrompt} setSystemPrompt={setSystemPrompt}/>
                <ModelRight llm={llm} selectedLLM={selectedLLM} setSelectedLLM={setSelectedLLM}/>
            </div>
        )}
    </div>
  )
}

export default Model