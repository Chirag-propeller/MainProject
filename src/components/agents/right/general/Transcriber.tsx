import React, { useEffect, useState } from 'react'
import { Agent } from '@/components/agents/types'
import useLLMConfig from "@/hooks/useLLMConfig";
import SelectOptions from '@/components/agent/newAgent/SelectOptions';

interface LLMConfig {
    sttOptions: string[];
}

const ModelLeft = () => {
    return (
        <div className='w-3/4 my-3'>
            <div className='flex flex-col gap-2 mb-3'>
                <label htmlFor='firstMessage'>First Message</label>
                <input id='firstMessage' type='text' className='w-full p-1 rounded-md border border-gray-300 text-sm px-2' />
            </div>
            <div className='flex flex-col gap-2'>
                <label htmlFor='systemPrompt'>System Prompt</label>
                <textarea id='systemPrompt' className='w-full p-2 rounded-md border border-gray-300' rows={7}/>
            </div>
        </div>
    )
}

const ModelRight = ({languages, selectedLang, setSelectedLang}: {languages: string[], selectedLang: string, setSelectedLang: React.Dispatch<React.SetStateAction<string>>}) => {
    return (
        <div className='w-1/4'>
            <div className='flex flex-col gap-2 mx-1'>
                <div className='mx-1 p-1'>
                <label className='mx-1  '> Language </label>
                <SelectOptions options={languages} selectedOption={selectedLang} setOption={setSelectedLang} />
            </div>
            <div className='flex flex-col gap-2'>
                <label htmlFor='temperature' className='mx-1'>Temperature</label>
                <input id='temperature' type='number' className='w-full p-1 rounded-md border border-gray-300 text-sm px-2' />
            </div>
            </div>
        </div>
    )
}

const Transcriber = ({agent, setAgent}: {agent: Agent, setAgent: (agent: Agent) => void}) => {
    const { sttOptions } = useLLMConfig() as LLMConfig
    const [isOpen, setIsOpen] = useState(false)
    const languages: string[] = Array.isArray(sttOptions) ? Array.from(sttOptions) : Object.values(sttOptions);
    const [selectedLang, setSelectedLang] = useState<string>(agent.stt || sttOptions[0])

    // useEffect(() => {
    //     setSelectedLang(languages[0])
    // }, [languages])

    useEffect(() => {
        setAgent({...agent, stt: selectedLang})
    }, [selectedLang])
  return (
    <div className='border border-gray-600 rounded-lg'>
        <header className='cursor-pointer bg-gray-200 p-2'
         onClick={() => {
            setIsOpen(!isOpen)
         }}
        >
            <h2 className='text-lg font-semibold'>Transcriber</h2>
        </header>
        {isOpen && (
            <div className='p-2 flex gap-2 w-full bg-gray-50 '>
                {/* <ModelLeft />
                <ModelRight languages={languages} selectedLang={selectedLang} setSelectedLang={setSelectedLang}/> */}
                <div className='flex flex-col gap-2 mx-1 w-1/2'>
                    <div className='mx-1 p-1'>
                    <label className='mx-1  '> Language </label>
                    <SelectOptions options={languages} selectedOption={selectedLang} setOption={setSelectedLang} />
                    </div>
                </div>
                
            </div>
        )}
    </div>
  )
}

export default Transcriber;