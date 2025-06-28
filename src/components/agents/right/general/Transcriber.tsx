import React, { useEffect, useState } from 'react'
import { Agent } from '@/components/agents/types'
import useLLMConfig from "@/hooks/useLLMConfig";
import SelectOptions from '@/components/agent/newAgent/SelectOptions';
import { Triangle, Mic } from 'lucide-react';
import SelectionDropdown from '../../SelectionDropdown';
import STTModelDropdown from '../../STTModelDropdown';

interface Languages{
    name: string;
    value: string;
}

interface STTModel {
    name: string;
    value: string;
    features?: string;
    languages: Languages[];
}

interface STTConfig {
    name: string;
    value: string;
    features?: string;
    models: STTModel[];
}

interface LLMConfig {
    sttOptions: string[];
    sttModels: STTConfig[];
}

const Transcriber = ({agent, setAgent}: {agent: Agent, setAgent: (agent: Agent) => void}) => {
    const { sttOptions, sttModels } = useLLMConfig() as LLMConfig
    console.log("sttModels", sttModels)
    
    // Create provider options from sttModels
    let provider: {name: string, value: string}[] = [];
    for (let i = 0; i < sttModels.length; i++) {
        provider.push({name: sttModels[i].name , value: sttModels[i].value})
    }
    
    // State variables with defaults from agent or fallback values
    const [selectedProvider, setSelectedProvider] = useState<string>(agent.stt || (provider.length > 0 ? provider[0].value : ""))
    const [isOpen, setIsOpen] = useState(false)
    const [models, setModels] = useState<{name: string, value: string, features?: string}[]>([])
    const [selectedModel, setSelectedModel] = useState<string>(agent.sttModel || "")
    const [availableLanguages, setAvailableLanguages] = useState<{name: string, value: string}[]>([])
    const [selectedLanguage, setSelectedLanguage] = useState<string>(agent.sttLanguage || "")
    
    console.log("provider", provider)

    // Effect 1: Update models when provider changes
    useEffect(() => {
        console.log("selectedProvider:", selectedProvider);
        console.log("sttModels:", sttModels);
        let modelOptions: {name: string, value: string, features?: string}[] = [];
        for (let i = 0; i < sttModels.length; i++) {
            console.log("Checking provider:", sttModels[i].name, "vs selected:", selectedProvider);
            if (sttModels[i].value === selectedProvider || sttModels[i].name === selectedProvider) {
                console.log("Found matching provider:", sttModels[i]);
                const provider = sttModels[i];
                for (let j = 0; j < provider.models.length; j++) {
                    const model = provider.models[j];
                    modelOptions.push({
                        name: model.name, 
                        value: model.value,
                        features: model.features || provider.features
                    });
                }
            }
        }
        console.log("Final models:", modelOptions)
        setModels(modelOptions)
        
        // If agent has a saved model that exists in new provider, keep it; otherwise use first available
        if (agent.sttModel && modelOptions.some(m => m.value === agent.sttModel)) {
            setSelectedModel(agent.sttModel);
        } else if (modelOptions.length > 0) {
            setSelectedModel(modelOptions[0].value);
        }
    }, [selectedProvider, sttModels])

    // Effect 2: Update languages when provider or model changes
    useEffect(() => {
        let languageOptions: {name: string, value: string}[] = [];
        for (let i = 0; i < sttModels.length; i++) {
            if (sttModels[i].value === selectedProvider || sttModels[i].name === selectedProvider) {
                for (let j = 0; j < sttModels[i].models.length; j++) {
                    if (sttModels[i].models[j].value === selectedModel) {
                        const modelLanguages = sttModels[i].models[j].languages;
                        for (let k = 0; k < modelLanguages.length; k++) {
                            languageOptions.push({name: modelLanguages[k].name, value: modelLanguages[k].value})
                        }
                    }
                }
            }
        }
        console.log("languages", languageOptions)
        setAvailableLanguages(languageOptions)
        
        // If agent has a saved language that exists in new model, keep it; otherwise use first available
        if (agent.sttLanguage && languageOptions.some(l => l.value === agent.sttLanguage)) {
            setSelectedLanguage(agent.sttLanguage);
        } else if (languageOptions.length > 0) {
            setSelectedLanguage(languageOptions[0].value);
        }
    }, [selectedProvider, selectedModel, sttModels])

    // Update agent when provider changes
    useEffect(() => {
        console.log("Inside useEffect of selectedProvider for STT");
        let newModel = selectedModel;
        
        // Find models for the new provider
        let modelOptions: {name: string, value: string, features?: string}[] = [];
        for (let i = 0; i < sttModels.length; i++) {
            if (sttModels[i].value === selectedProvider || sttModels[i].name === selectedProvider) {
                const provider = sttModels[i];
                for (let j = 0; j < provider.models.length; j++) {
                    const model = provider.models[j];
                    modelOptions.push({
                        name: model.name, 
                        value: model.value,
                        features: model.features || provider.features
                    });
                }
            }
        }
        
        // If agent has a saved model that exists in new provider, keep it; otherwise use first available
        if (agent.sttModel && modelOptions.some(m => m.value === agent.sttModel)) {
            newModel = agent.sttModel;
        } else if (modelOptions.length > 0) {
            newModel = modelOptions[0].value;
        }

        if (agent.stt !== selectedProvider) {
            setAgent({...agent, stt: selectedProvider, sttModel: newModel})
        }
    }, [selectedProvider])

    // Update agent when model changes
    useEffect(() => {
        console.log("Inside useEffect of selectedModel for STT");
        if (agent.sttModel !== selectedModel) {
            setAgent({...agent, sttModel: selectedModel})
        }
    }, [selectedModel])
    
    // Update agent when language changes
    useEffect(() => {
        console.log("Inside useEffect of selectedLanguage for STT");
        if (agent.sttLanguage !== selectedLanguage) {
            setAgent({...agent, sttLanguage: selectedLanguage, inputLanguage: selectedLanguage})
        }
    }, [selectedLanguage])

    useEffect(() => {
        console.log("STT agent", agent)
    }, [agent])

    return (
        <div className='border border-gray-200 rounded-lg bg-white dark:border-gray-700 dark:bg-gray-950'>
                                                   <header 
                className='cursor-pointer bg-gray-100 dark:bg-gray-950 dark:border dark:border-indigo-400 rounded-t-lg p-2 text-gray-900 dark:text-white'
                onClick={() => {
                    setIsOpen(!isOpen)
                }}
            >
                <div className='flex justify-between'>
                    <div className='flex gap-2'>
                        <Mic className='w-3.5 h-3.5 text-gray-900 dark:text-white self-center' />
                        <h2 className='text-md text-gray-900 dark:text-white'>Transcriber</h2>
                    </div>
                    <Triangle className={`w-3 h-3 self-center text-gray-400 dark:text-white ${isOpen ? "rotate-180" : "rotate-90"}`} 
                    style={{ fill: "currentColor" }} />
                </div>
            </header>
            {isOpen && (
                <div className='p-2 flex flex-row flex-wrap gap-2 w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100'>
                    <div className='flex flex-col gap-2 mx-1 w-2/5'>
                        <div className='mx-1 p-1'>
                            <label className='mx-1 text-gray-700 dark:text-gray-300'>Provider</label>
                            <SelectionDropdown options={provider} selectedOption={selectedProvider} setOption={setSelectedProvider} />
                        </div>
                    </div>
                    <div className='flex flex-col gap-2 mx-1 w-2/5'>
                        <div className='mx-1 p-1'>
                            <label className='mx-1 text-gray-700 dark:text-gray-300'>Model</label>
                            <STTModelDropdown options={models} selectedOption={selectedModel} setOption={setSelectedModel} />
                        </div>
                    </div>
                    <div className='flex flex-col gap-2 mx-1 w-2/5'>
                        <div className='mx-1 p-1'>
                            <label className='mx-1 text-gray-700 dark:text-gray-300'>Language</label>
                            <SelectionDropdown options={availableLanguages} selectedOption={selectedLanguage} setOption={setSelectedLanguage} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Transcriber;


// import React, { useEffect, useState } from 'react'
// import { Agent } from '@/components/agents/types'
// import useLLMConfig from "@/hooks/useLLMConfig";
// import SelectOptions from '@/components/agent/newAgent/SelectOptions';
// import { Triangle, Mic } from 'lucide-react';
// import SelectionDropdown from '../../SelectionDropdown';

// interface Languages{
//     name: string;
//     value: string;
//   }
//   interface STTModel {
//     name: string;
//     value: string;
//     languages: Languages[];
//   }
  
//   interface STTConfig {
//     name: string;
//     value: string;
//     models: STTModel[];
//   }

// interface LLMConfig {
//     sttOptions: string[];
//     sttModels: STTConfig[];
// }

// const Transcriber = ({agent, setAgent}: {agent: Agent, setAgent: (agent: Agent) => void}) => {
//     const { sttOptions, sttModels } = useLLMConfig() as LLMConfig
//     console.log("sttModels", sttModels)
//     let provider: {name: string, value: string}[] = [];
//     let model: {name: string, value: string}[] = [];
//     for (let i = 0; i < sttModels.length; i++) {
//         provider.push({name: sttModels[i].name , value: sttModels[i].value})
//     }
//     const [selectedProvider, setSelectedProvider] = useState<string>(agent.stt || provider[0].value)
//     console.log("provider", provider)
//     const [isOpen, setIsOpen] = useState(false)
//     const [models, setModels] = useState<{name: string, value: string}[]>([])
//     const [selectedModel, setSelectedModel] = useState<string>(agent.sttModel || models[0]?.value)

    
//     useEffect(() => {
//         let models: {name: string, value: string}[] = [];
//         for (let i = 0; i < sttModels.length; i++) {
//             if (sttModels[i].name === selectedProvider) {
//                 for (let j = 0; j < sttModels[i].models.length; j++) {
//                     models.push({name: sttModels[i]?.models[j]?.name , value: sttModels[i]?.models[j]?.value})
//                 }

//             }

//         }
//         console.log("models", models)
//         setModels(models)
//     }, [selectedProvider])

//     // useEffect(() => {
//     //     if (agent.stt !== selectedLang) {
//     //         setAgent({...agent, inputLanguage: selectedLang, sttLanguage: selectedLanguage, sttModel: selectedModel})
//     //     }
//     // }, [selectedLang])
//   return (
//     <div className='border border-gray-200 rounded-lg'>
//         <header className='cursor-pointer bg-gray-100 p-2'
//          onClick={() => {
//             setIsOpen(!isOpen)
//          }}
//         >
//             <div className='flex justify-between'>
//                 <div className='flex gap-2'>
//                     <Mic className='w-3.5 h-3.5 text-gray-900 self-center' />
//                     <h2 className='text-md text-gray-900'>Transcriber</h2>
//                 </div>
//                 <Triangle className={`w-3 h-3  self-center 
//                 ${isOpen ? "rotate-180" : "rotate-90"}
//                 `} 
//                 style={{ fill: "lightgray" }} />
//             </div>
//         </header>
//         {isOpen && (
//             <div className='p-2 flex gap-2 w-full bg-gray-50 '>
//                 {/* <ModelLeft />
//                 <ModelRight languages={languages} selectedLang={selectedLang} setSelectedLang={setSelectedLang}/> */}
//                 <div className='flex flex-col gap-2 mx-1 w-1/2'>
//                     <div className='mx-1 p-1'>
//                     <label className='mx-1  '> Provider </label>
//                     <SelectionDropdown options={provider} selectedOption={selectedProvider} setOption={setSelectedProvider} />
//                     </div>
//                 </div>
//                 <div className='flex flex-col gap-2 mx-1 w-1/2'>
//                     <div className='mx-1 p-1'>
//                     <label className='mx-1  '> Model </label>
//                     <SelectionDropdown options={models} selectedOption={selectedModel} setOption={setSelectedModel} />
//                     </div>
//                 </div>
//             </div>
//         )}
//     </div>
//   )
// }

// export default Transcriber;
