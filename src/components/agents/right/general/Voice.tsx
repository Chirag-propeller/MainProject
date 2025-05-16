import React, { useEffect, useState } from 'react'
import { Agent } from '@/components/agents/types'
import useLLMConfig from "@/hooks/useLLMConfig";
import SelectOptions from '@/components/agent/newAgent/SelectOptions';

interface TtsOptions {
    [provider: string]: {
      [language: string]: {
        [gender: string]: string[]
      }
    }
    // [key: string]: string[]; // Assuming each provider maps to an array of voices
  }

interface LLMConfig {
    ttsOptions: TtsOptions;
    ttsLanguageOptions: string[];
}

const ModelLeft = ({providers, selectedProvider, setSelectedProvider}: {providers: string[], selectedProvider: string, setSelectedProvider: React.Dispatch<React.SetStateAction<string>>}) => {
    return (
        <div className='w-1/2 my-3'>
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
        // console.log(ttsOptions[selectedProvider])
        // console.log(ttsOptions[selectedProvider][language])
        // console.log("ttsOptions[selectedProvider][language][gender]",ttsOptions[selectedProvider][language][gender])
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
    
    // const [selectedLang, setSelectedLang] = useState<string>(ttsOptions[0])
    // useEffect(
    //     ()=>{
    //       setVoices(ttsOptions[selectedProvider][language][gender])
    //     }
    //   , )

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
    <div className='border border-gray-600 rounded-lg'>
        <header className='cursor-pointer bg-gray-200 p-2'
         onClick={() => {
            setIsOpen(!isOpen)
         }}
        >
            <h2 className='text-lg font-semibold'>Voice</h2>
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