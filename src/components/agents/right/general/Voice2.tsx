import React, { useEffect, useState } from 'react'
import { Agent } from '@/components/agents/types'
import useLLMConfig from "@/hooks/useLLMConfig";
import SelectOptions from '@/components/agent/newAgent/SelectOptions';
import { Triangle, Speech  } from 'lucide-react';
interface TtsOptions {
    [provider: string]: {
      [language: string]: {
        [gender: string]: string[]
      }
    }
}

interface LLMConfig {
    ttsOptions: TtsOptions;
    ttsLanguageOptions: string[];
}


const Voice = ({agent, setAgent}: {agent: Agent, setAgent: (agent: Agent) => void}) => {
    const genders = ["Male", "Female"]
    const { ttsOptions , ttsLanguageOptions} = useLLMConfig() as unknown as LLMConfig
    const providers = Object.keys(ttsOptions);
    const ttsLanguages: string[] = Array.isArray(ttsLanguageOptions) ? Array.from(ttsLanguageOptions) : Object.values(ttsLanguageOptions);
    const [selectedProvider, setSelectedProvider] = useState<string>(agent.tts || "Celebras"); 
    const [gender, setGender] = useState<string>(agent.gender || "male");
    const [language, setLanguage] = useState<string>(agent.ttsLanguage || "English-US");
    const [voices, setVoices] = useState<string[]>([]);
    // const [voices, setVoices] = useState<string[]>(ttsOptions[selectedProvider]);
    const [selectedVoice, setSelectedVoice] = useState<string>(agent.ttsVoiceName || voices[0]);
    const [isOpen, setIsOpen] = useState(false)
    useEffect(() => {
        console.log(voices)
        console.log(ttsOptions)
        const updateVoices = () => {
          const providerVoices = ttsOptions[selectedProvider];
          if (providerVoices && providerVoices[language] && providerVoices[language][gender]) {
            setVoices(providerVoices[language][gender]);
          } else {
            setVoices([]);
          }
        };
        updateVoices();
      }, [selectedProvider, language, gender, ttsOptions]);
      useEffect(() => {
        if (voices.length > 0) {
          setSelectedVoice(prev => voices.includes(prev) ? prev : voices[0]);
        }
        console.log(selectedVoice)
      }, [voices]);
      
    useEffect(() => {
        setAgent({...agent, tts: selectedProvider})
    }, [selectedProvider])
    useEffect(() => {
        setAgent({...agent, gender: gender})
    }, [gender])
    useEffect(() => {
        setAgent({...agent, ttsLanguage: language})
    }, [language])
    useEffect(() => {
        setAgent({...agent, ttsVoiceName: selectedVoice})
    }, [selectedVoice])


  return (
    <div className='border border-gray-200 rounded-lg'>
        <header className='cursor-pointer bg-gray-100 p-2'
         onClick={() => {
            setIsOpen(!isOpen)
         }}
        >
            <div className='flex justify-between'>
                <div className='flex gap-2'>
                    <Speech className='w-3.5 h-3.5 text-gray-900 self-center' />
                    {/* <Music className='w-4 h-4 text-gray-900 self-center' /> */}
                    {/* <Speaker className='w-4 h-4 text-gray-900 self-center' /> */}
                    <h2 className='text-md text-gray-900'>Voice</h2>
                </div>

                <Triangle className={`w-3 h-3  self-center 
                ${isOpen ? "rotate-180" : "rotate-90"}
                `} 
                style={{ fill: "lightgray" }} />
            </div>
        </header>
        {isOpen && (
            <div className='p-2 flex flex-row flex-wrap gap-2 w-full bg-gray-50 '>
                <div className='flex flex-col gap-2 mx-1 w-2/5'>
                    <div className='mx-1 p-1'>
                    <label className='mx-1  '> Provider </label>
                    <SelectOptions options={providers} selectedOption={selectedProvider} setOption={setSelectedProvider} />
                    </div>
                </div>
                <div className='flex flex-col gap-2 mx-1 w-2/5'>
                    <div className='mx-1 p-1'>
                    <label className='mx-1  '> Gender </label>
                    <SelectOptions options={genders} selectedOption={gender} setOption={setGender} />
                    </div>
                </div>
                <div className='flex flex-col gap-2 mx-1 w-2/5'>
                    <div className='mx-1 p-1'>
                    <label className='mx-1  '> Language </label>
                    <SelectOptions options={ttsLanguages} selectedOption={language} setOption={setLanguage} />
                    </div>
                </div>
                <div className='flex flex-col gap-2 mx-1 w-2/5'>
                    <div className='mx-1 p-1'>
                    <label className='mx-1  '> Voice </label>
                    <SelectOptions options={voices} selectedOption={selectedVoice} setOption={setSelectedVoice} />
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default Voice;