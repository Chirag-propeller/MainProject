import React, { useEffect, useState } from 'react'
import { Agent } from '@/components/agents/types'
import useLLMConfig from "@/hooks/useLLMConfig";
import SelectOptions from '@/components/agent/newAgent/SelectOptions';
import { Triangle, Speaker, Music, Speech, Play  } from 'lucide-react';
import SelectionDropdown from '@/components/agents/SelectionDropdown';
import VoiceSelector from './VoiceSelection';

interface TtsProvider {
  name: string;
  value: string;
  models: TtsModel[];
}

interface TtsModel {
  name: string;
  value: string;
  languages: TtsLanguage[];
}

interface TtsLanguage {
  name: string;
  value: string;
  gender: TtsGender[];
}

interface TtsGender {
  name: string;
  value: string;
  voices: TtsVoice[];
}

interface TtsVoice {
  name: string;
  value: string;
}

interface LLMConfig {
    ttsOptions: TtsProvider[];
    ttsLanguageOptions: string[];
}

const Voice = ({agent, setAgent}: {agent: Agent, setAgent: (agent: Agent) => void}) => {
    const genders = ["Male", "Female"]
    const { ttsOptions , ttsLanguageOptions} = useLLMConfig() as unknown as LLMConfig
    
    // Get providers list
    const providers = Array.isArray(ttsOptions) ? ttsOptions.map((provider: TtsProvider) => ({
        name: provider.name,
        value: provider.value
    })) : [];

    // State variables with defaults from agent or fallback values
    const [selectedProvider, setSelectedProvider] = useState<string>(agent.tts || (providers.length > 0 ? providers[0].value : "")); 
    const [models, setModels] = useState<{name: string, value: string}[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>(agent.ttsModel || "");
    const [availableLanguages, setAvailableLanguages] = useState<{name: string, value: string}[]>([]);
    const [language, setLanguage] = useState<string>(agent.ttsLanguage || "");
    const [availableGenders, setAvailableGenders] = useState<string[]>([]);
    const [gender, setGender] = useState<string>(agent.gender || "");
    const [voices, setVoices] = useState<{name: string, value: string}[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<string>(agent.ttsVoiceName || "");
    const [isOpen, setIsOpen] = useState(false)
    // const [isPlaying, setIsPlaying] = useState(false)

    // Effect 1: Update models when provider changes
    useEffect(() => {
        if (selectedProvider && Array.isArray(ttsOptions)) {
            const provider = ttsOptions.find((p: TtsProvider) => p.value === selectedProvider);
            if (provider && provider.models) {
                const modelOptions = provider.models.map((model: TtsModel) => ({
                    name: model.name,
                    value: model.value
                }));
                console.log("modelOptions", modelOptions);
                console.log("provider", provider);
                setModels(modelOptions);
                // setSelectedModel(modelOptions[0].value);
                
                // If agent has a saved model that exists in new provider, keep it; otherwise use first available
                if (agent.ttsModel && modelOptions.some(m => m.value === agent.ttsModel)) {
                    console.log("agent.ttsModel", agent.ttsModel);
                    setSelectedModel(agent.ttsModel);

                } else if (modelOptions.length > 0) {
                    console.log("modelOptions", modelOptions[0].value);
                    setSelectedModel(modelOptions[0].value);
                }
                // if(modelOptions && modelOptions.length > 0) {
                    
                // }
            } 
            // else {
            //     setModels([]);
            //     setSelectedModel("");
            // }
        }
    }, [selectedProvider, ttsOptions]);
    useEffect(() => {

        console.log("selectedModel", selectedModel);
        console.log("agent.ttsModel", agent.ttsModel);
    }, [selectedModel])
    // useEffect(() => {
    //     const provider = ttsOptions.find((p: TtsProvider) => p.value === selectedProvider);
    //     const modelOptions = provider?.models.map((model: TtsModel) => ({
    //         name: model.name,
    //         value: model.value
    //     }));
    //     if(modelOptions && modelOptions.length > 0) {
    //         setSelectedModel(modelOptions[0].value);
    //     }
    // }, [selectedProvider, ttsOptions])

    // Effect 2: Update languages when provider or model changes
    useEffect(() => {
        if (selectedProvider && selectedModel && Array.isArray(ttsOptions)) {
            const provider = ttsOptions.find((p: TtsProvider) => p.value === selectedProvider);
            if (provider) {
                const model = provider.models?.find((m: TtsModel) => m.value === selectedModel);
                if (model && model.languages) {
                    const languageOptions = model.languages.map((lang: TtsLanguage) => ({
                        name: lang.name,
                        value: lang.value
                    }));
                    setAvailableLanguages(languageOptions);
                    
                    // If agent has a saved language that exists in new model, keep it; otherwise use first available
                    if (agent.ttsLanguage && languageOptions.some(l => l.value === agent.ttsLanguage)) {
                        setLanguage(agent.ttsLanguage);
                    } else if (languageOptions.length > 0) {
                        setLanguage(languageOptions[0].value);
                    }
                } else {
                    setAvailableLanguages([]);
                    setLanguage("");
                }
            }
        }
    }, [selectedProvider, selectedModel, ttsOptions, agent.ttsLanguage]);

    // Effect 3: Update genders when provider, model, or language changes
    useEffect(() => {
        if (selectedProvider && selectedModel && language && Array.isArray(ttsOptions)) {
            const provider = ttsOptions.find((p: TtsProvider) => p.value === selectedProvider);
            if (provider) {
                const model = provider.models?.find((m: TtsModel) => m.value === selectedModel);
                if (model) {
                    const languageObj = model.languages?.find((l: TtsLanguage) => l.value === language);
                    if (languageObj && languageObj.gender) {
                        const genderOptions = languageObj.gender.map((g: TtsGender) => g.value);
                        setAvailableGenders(genderOptions);
                        
                        // If agent has a saved gender that exists, keep it; otherwise use first available
                        if (agent.gender && genderOptions.includes(agent.gender)) {
                            setGender(agent.gender);
                        } else if (genderOptions.length > 0) {
                            setGender(genderOptions[0]);
                        }
                    } else {
                        setAvailableGenders([]);
                        setGender("");
                    }
                }
            }
        }
    }, [selectedProvider, selectedModel, language, ttsOptions, agent.gender]);

    // Effect 4: Update voices when provider, model, language, or gender changes
    useEffect(() => {
        if (selectedProvider && selectedModel && language && gender && Array.isArray(ttsOptions)) {
            const provider = ttsOptions.find((p: TtsProvider) => p.value === selectedProvider);
            if (provider) {
                const model = provider.models?.find((m: TtsModel) => m.value === selectedModel);
                if (model) {
                    const languageObj = model.languages?.find((l: TtsLanguage) => l.value === language);
                    if (languageObj) {
                        const genderObj = languageObj.gender?.find((g: TtsGender) => g.value === gender);
                        if (genderObj && genderObj.voices) {
                            setVoices(genderObj.voices);
                            
                            // If agent has a saved voice that exists, keep it; otherwise use first available
                            if (agent.ttsVoiceName && genderObj.voices.some(v => v.value === agent.ttsVoiceName)) {
                                setSelectedVoice(agent.ttsVoiceName);
                            } else if (genderObj.voices.length > 0) {
                                setSelectedVoice(genderObj.voices[0].value);
                            }
                        } else {
                            setVoices([]);
                            setSelectedVoice("");
                        }
                    }
                }
            }
        }
    }, [selectedProvider, selectedModel, language, gender, ttsOptions, agent.ttsVoiceName]);

    // Update agent when selections change
    useEffect(() => {
        console.log("Inside useEffect of selectedProvider");
        let newModel = selectedModel;
        if (selectedProvider && Array.isArray(ttsOptions)) {
            const provider = ttsOptions.find((p: TtsProvider) => p.value === selectedProvider);
            if (provider && provider.models) {
                const modelOptions = provider.models.map((model: TtsModel) => ({
                    name: model.name,
                    value: model.value
                }));
                // setSelectedModel(modelOptions[0].value);
                
                // If agent has a saved model that exists in new provider, keep it; otherwise use first available
                if (agent.ttsModel && modelOptions.some(m => m.value === agent.ttsModel)) {
                    console.log("agent.ttsModel", agent.ttsModel);
                    newModel = agent.ttsModel;

                } else if (modelOptions.length > 0) {
                    console.log("modelOptions", modelOptions[0].value);
                    newModel = modelOptions[0].value;
                }
            } 

        }

        
        if (agent.tts !== selectedProvider) {
            // console.log("Inside useEffect of selectedProvider");
            // console.log("selectedModel", selectedModel);
            // console.log("selectedProvider", selectedProvider);
            setAgent({...agent, tts: selectedProvider, ttsModel: newModel})
        }
    }, [selectedProvider])

    useEffect(() => {
        console.log("agent", agent)
    }, [agent])
    
    useEffect(() => {
        // console.log("=== DEBUGGING SETAGENT ===");
        // console.log("selectedModel:", selectedModel);
        // console.log("agent.ttsModel:", agent.ttsModel);
        // console.log("Comparison result:", agent.ttsModel !== selectedModel);
        console.log("Inside useEffect of selectedModel");
        if (agent.ttsModel !== selectedModel) {
            // console.log("BEFORE setAgent - agent:", agent);
            // console.log("NEW OBJECT:", {...agent, ttsModel: selectedModel});
            
            setAgent({...agent, ttsModel: selectedModel});
            
            // Add a timeout to check if it updated
            // setTimeout(() => {
            //     console.log("AFTER setAgent - check if updated");
            // }, 100);
        }
    }, [selectedModel])
    
    useEffect(() => {
        if (agent.gender !== gender) {
            setAgent({...agent, gender: gender})
        }
    }, [gender])
    
    useEffect(() => {
        if (agent.ttsLanguage !== language) {
            setAgent({...agent, ttsLanguage: language})
        }
    }, [language])
    
    useEffect(() => {
        if (agent.ttsVoiceName !== selectedVoice) {
            setAgent({...agent, ttsVoiceName: selectedVoice})
        }
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
                    <SelectionDropdown options={providers} selectedOption={selectedProvider} setOption={setSelectedProvider} />
                    </div>
                </div>
                <div className='flex flex-col gap-2 mx-1 w-2/5'>
                    <div className='mx-1 p-1'>
                    <label className='mx-1  '> Model </label>
                    <SelectionDropdown options={models} selectedOption={selectedModel} setOption={setSelectedModel} />
                    </div>
                </div>
                <div className='flex flex-col gap-2 mx-1 w-2/5'>
                    <div className='mx-1 p-1'>
                    <label className='mx-1  '> Language </label>
                    <SelectionDropdown options={availableLanguages} selectedOption={language} setOption={setLanguage} />
                    </div>
                </div>
                <div className='flex flex-col gap-2 mx-1 w-2/5'>
                    <div className='mx-1 p-1'>
                    <label className='mx-1  '> Gender </label>
                    <SelectOptions options={availableGenders} selectedOption={gender} setOption={setGender} />
                    </div>
                </div>
                <div className='flex flex-col gap-2 mx-1 w-9/11'>
                    <div className='mx-1 p-1'>
                    <label className='mx-1  '> Voice </label>
                    <VoiceSelector voices={voices} selectedVoice={selectedVoice} setSelectedVoice={setSelectedVoice} agent={agent} />

                    {/* <select 
                        className='p-1.5  rounded-lg w-full text-sm bg-gray-100 border border-gray-300 '
                        value={selectedVoice}
                        onChange={(e) => setSelectedVoice(e.target.value)}
                    >
                        {voices.length > 0 ? voices?.map((option: any, idx:any) => (
                            <option key={idx} value={option.value} className='p-1 flex flex-row '> <p>{option.name}</p>
                            <Play className='w-4 h-4 text-gray-900 self-center' onClick={() => {
                                console.log("option", option)
                            }}/>
                             </option>
                        )) : <option value="">No options available</option>}
                    </select> */}
                    {/* <SelectionDropdown options={voices} selectedOption={selectedVoice} setOption={setSelectedVoice} /> */}
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default Voice;