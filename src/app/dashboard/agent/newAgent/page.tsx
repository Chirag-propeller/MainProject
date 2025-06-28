"use client"
import React, { useState } from 'react'
import VoiceAssistant  from '@/components/agent/newAgent/VoiceAssistant'
import axios from 'axios';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useLLMConfig from "@/hooks/useLLMConfig";
import SelectOptions from '@/components/agent/newAgent/SelectOptions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ModalList from '@/components/agent/ModalList';
import { getUserFromRequest } from '@/lib/auth';

interface TtsOptions {
  [provider: string]: {
    [language: string]: {
      [gender: string]: string[]
    }
  }
  // [key: string]: string[]; // Assuming each provider maps to an array of voices
}
interface LLMConfig {
  llmOptions: string[];
  ttsOptions: TtsOptions;
  sttOptions: string[];
  loading: boolean,
  ttsLanguageOptions: string[]
}

interface KnowledgeBase {
  _id: string;
  name: string;
  files: any[];
  links: any[];
  [key: string]: any;
}

const Main = () => {
  const router = useRouter();
  const { llmOptions, ttsOptions, sttOptions, loading, ttsLanguageOptions } = useLLMConfig() as unknown as LLMConfig

  const [isKnowledgeBaseModalListOpen, setIsKnowledgeBaseModalListOpen] = useState<boolean>(false);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const providers = Object.keys(ttsOptions);
  const languages: string[] = Array.isArray(sttOptions) ? Array.from(sttOptions) : Object.values(sttOptions);
  const llm: string[] = Array.isArray(llmOptions) ? Array.from(llmOptions) : Object.values(llmOptions);
  const ttsLanguages: string[] = Array.isArray(ttsLanguageOptions) ? Array.from(ttsLanguageOptions) : Object.values(ttsLanguageOptions);
  const ttsProvider = Object.keys(ttsOptions);
  const [gender, setGender] = useState<string>("Male");
  const [selectedLang, setSelectedLang] = useState<string>(sttOptions[0])
  const [selectedLLM, setSelectedLLM] = useState<string>(llmOptions[0]);
  const [selectedTtsLanguage, setSelectedTtsLanguage] = useState<string>("English-US");
  const [selectedTtsProvider, setSelectedTtsProvider] = useState<string>(ttsProvider[0]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  
  const [selectedProvider, setSelectedProvider] = useState<string>(providers[0]); // Default to first provider
  const [voices, setVoices] = useState<string[]>([]); // Default voices

  

  useEffect (
    ()=>{
      setSelectedLang(sttOptions[0]);
      setSelectedLLM(llmOptions[0]);
      setSelectedProvider(providers[0]);
      // setVoices(ttsOptions[selectedProvider][selectedTtsLanguage][gender]);
      setSelectedTtsLanguage(ttsLanguageOptions[0]);
      // console.log(selectedLLM, selectedLang,selectedProvider);
    }
  ,[llmOptions, ttsOptions, sttOptions, loading, ttsLanguageOptions])
  useEffect(
    ()=> {
      if (voices.length > 0) {
        setSelectedVoice(voices[0]);
      } else {
        setSelectedVoice("");
      }
    } 
    ,[voices])

    useEffect(() => {
      const updateVoices = () => {
        const providerVoices = ttsOptions[selectedProvider];
        if (providerVoices && providerVoices[selectedTtsLanguage] && providerVoices[selectedTtsLanguage][gender]) {
          setVoices(providerVoices[selectedTtsLanguage][gender]);
        } else {
          setVoices([]);
        }
      };
      updateVoices();
    }, [selectedProvider, selectedTtsLanguage, gender, ttsOptions]);
    
  // Handle provider change
  const handleProviderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvider = event.target.value;
    setSelectedProvider(newProvider);
  };


  const [token, setToken] = useState("");
  const [agentName, setAgentName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [text, setText] = useState('');
  const [knowledgeBase, setKnowledgeBase] = useState(true);
  const [knowledgeBaseList, setKnowledgeBaseList] = useState<string[]>([]);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const room = "test-room"
  
  // const url = "https://livekitwebapp-abddetfvdfg2gaar.eastus2-01.azurewebsites.net"
  const url = process.env.NEXT_PUBLIC_AZURE_URL
  // const url = "https://serverforwindowvm2-dghvd3dkebd4excq.eastus2-01.azurewebsites.net"

  // const url = "livekitwebapp-abddetfvdfg2gaar.eastus2-01.azurewebsites.net"
  const sendData = async (roomName: string) => {
    try {
      const data = {
        text,     
        selectedLLM,
        selectedLang,
        selectedProvider,
        selectedVoice,
        roomName,
        knowledgeBaseList,
      };
      console.log(data);
      const response = await axios.post(`${url}/sendData`,data); 
      // Assuming the server sends a response
      console.log(text);
      // alert("Update Successful");
    } catch (error) {
      alert("Something went wrong")
      console.error("Error sending data:", error);
      
    }
  };

  const fetchToken = async () => {
    try {
      console.log("run");
      const response = await fetch(`${url}/getToken`);
      // console.log("Url ->", url);
      const data = await response.json();
      return{
        roomName: data.room_name,
        token: data.token
      }

    } catch (error) {
      alert("Something went wrong..")
      console.error("Error fetching token:", error);
    }
  };

  const handleTestClick = async () => {
    const user = await axios.get('/api/user/getCurrentUser');
    // console.log(user);
    const credits = parseFloat(user.data?.credits?.$numberDecimal) || 0;
    const creditsUsed = parseFloat(user.data?.creditsUsed?.$numberDecimal) || 0;
    // const credits = user.data?.credits || 0 ;
    // const creditsUsed = user.data?.creditsUsed || 0;
    if(credits - creditsUsed <= 0){
      alert("You have no credits left");
      return;
    }
    // console.log(user);

    // await getToken;
    const tokenData = await fetchToken();
    if (tokenData) {
      setRoomName(tokenData.roomName);
      setToken(tokenData.token);
      await sendData(tokenData.roomName);
      setShowVoiceAssistant(true);
    }
    
  };
  
  const createAgentHandler = async () => {
    
    const payload = {
      agentName: agentName.trim() === "" ? "Default Agent" : agentName,
      gender: gender,
      ttsLanguage: selectedTtsLanguage,
      prompt: text,
      llm: selectedLLM,
      inputLanguage: selectedLang,
      stt: selectedProvider,
      tts: selectedProvider,
      ttsVoiceName: selectedVoice,
      knowledgeBase: knowledgeBaseList,
      knowledgeBaseAttached: knowledgeBaseList.length > 0,
      ttsModel: selectedVoice, // or another var if different
      backgroundSound: "here we will store Background Sound",
      welcomeMessage: "This is temp Welcome Message", // or another var if different
      // roomName: roo
 
    };
  

    const res = await fetch('/api/agent/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      console.log('Agent created:', data);
      router.push('/dashboard/agent'); // redirect to another page (e.g., success screen)
    } else {
      alert('Failed to create agent');
    }
  };

  return (
    <div className='bg-gray-100 dark:bg-gray-900 h-fit min-h-screen'>
      <div className='flex bg-gray-100 dark:bg-gray-900 h-[90vh] w-full'>
        <div className='w-[45vw] bg-white dark:bg-gray-800 m-2 rounded-sm border border-gray-200 dark:border-gray-700'> 
          <div className='flex'>
          
          <Link href="/dashboard/agent">
          
            <Button className='cursor-pointer mt-2 ms-2 border-1 text-sm' variant="ghost" size="sm">Back</Button>
          </Link>
          <input placeholder='Agent Name' className='border-gray-300 dark:border-gray-600 px-2 m-2 rounded-sm mt-3 border-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none' value={agentName} onChange={(e) => setAgentName(e.target.value)}/>
          </div>
          <div className='flex mt-2 flex-wrap'>
            <div className='mx-1 p-1'>
              <p className='text-xs mx-3 text-gray-700 dark:text-gray-300'> Language </p>
              <SelectOptions options={languages} selectedOption={selectedLang} setOption={setSelectedLang} loading={loading} />
            </div>
            <div className='mx-1 p-1'>
              <p className='text-xs mx-3 text-gray-700 dark:text-gray-300'> LLM </p>
              <SelectOptions options={llm} selectedOption={selectedLLM} setOption={setSelectedLLM} loading={loading} />
            </div>
            <div className='mx-1 p-1'>
              <p className='text-xs mx-3 text-gray-700 dark:text-gray-300'> TTS Provider </p>
              <select className='p-1 m-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none' value={selectedProvider} onChange={handleProviderChange}>
                  {providers.map((provider) => (
                    <option key={provider} value={provider} className='p-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'>
                      {provider}
                    </option>
                  ))}
              </select>
            </div>
            <div className='mx-1 p-1'>
              <p className='text-xs mx-3 text-gray-700 dark:text-gray-300'> Gender </p>
              <SelectOptions  options={["Male", "Female"]} selectedOption={gender} setOption={setGender} loading={loading} />
            </div>
            <div className='mx-1 p-1'>
              <p className='text-xs mx-3 text-gray-700 dark:text-gray-300'> TTS Language </p>
              <SelectOptions options={ttsLanguages} selectedOption={selectedTtsLanguage} setOption={setSelectedTtsLanguage} loading={loading} />
            </div>
            <div className='mx-1 p-1'>
              <p className='text-xs mx-3 text-gray-700 dark:text-gray-300'> Select Voices </p>
              <SelectOptions options={voices} selectedOption={selectedVoice} setOption={setSelectedVoice} loading={loading} />
            </div>

          </div>
          <textarea 
            className='p-2 m-3 rounded-md w-[95%] text-sm border border-gray-300 dark:border-gray-600 h-[50vh] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none'
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your agent prompt..."
          />
          
        </div>
        <div className='w-[27vw] bg-white dark:bg-gray-800 m-2 rounded-sm border border-gray-200 dark:border-gray-700'> 
          <div className='cursor-pointer' onClick={() => setKnowledgeBase(!knowledgeBase)}> 
            <h1 className='m-3 text-sm text-black dark:text-gray-100 hover:underline'>Knowledge Base</h1> 
          </div>
          <div className='text-gray-500 dark:text-gray-400 m-2 mx-3'>
                <p className=' p-1  text-xs'> Add knowledge base to provide context to the agent.</p>
                <Button variant="ghost" size="sm" className=' relative border-1 border-gray-300 dark:border-gray-600 rounded-none'
                onClick={() => setIsKnowledgeBaseModalListOpen(true)}
                >Add
   
                
                </Button>
                {isKnowledgeBaseModalListOpen && (
                    <ModalList
                      // setKnowledgeBaselist={setKnowledgeBaseList}
                      knowledgeBases={knowledgeBases}
                      setKnowledgeBases={setKnowledgeBases}
                      
                      setKnowledgeBaseList={setKnowledgeBaseList}
                      isOpen={isKnowledgeBaseModalListOpen}
                      onClose={() => setIsKnowledgeBaseModalListOpen(false)}
                    />
                  )}

                <ul className='list-disc pl-5'>
                {
                  knowledgeBaseList.map((id) => {
                    const kb = knowledgeBases.find(k => k._id === id);
                    return (
                      <li key={id} className='text-sm text-gray-700 dark:text-gray-300'>
                        {kb?.name || 'Unknown'}
                      </li>
                    );
                  })
                }
                </ul>
              </div>

          {/* {
            knowledgeBase && (
              <div className='text-gray-500 m-2 mx-3 '>
                <p className=' p-1  text-xs'> Add knowledge base to provide context to the agent.</p>
                <div className='cursor-pointer inline-block text-black  border border-gray-300 p-2 rounded-sm px-3 text-sm'> 
                  <div className='relative'>
                    <div>Add </div>
                  </div>
                </div>
              </div>
            )
          } */}
        </div>
        <div className='w-[27vw] text-sm bg-white dark:bg-gray-800 m-2 rounded-sm border border-gray-200 dark:border-gray-700'> 
          <div className='flex justify-center'>
            <div className='flex bg-gray-100 dark:bg-gray-700 p-1 rounded-sm w-[40%] h-fit m-2 justify-between'>
              <div className={` p-1 cursor-pointer rounded-sm  mx-1 w-[100%] bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100`}>  
              Test your agent
              </div>
            </div>
          </div>
          <hr className='w-[80%] border-gray-700 dark:border-gray-600 mx-auto '/>

          {showVoiceAssistant  ?  ( 
              <VoiceAssistant token={token} setShowVoiceAssistant={setShowVoiceAssistant}  />) : 
              (<div className='flex flex-col justify-center items-center h-[90%]'>
              {/* <h1 className='text-xl text-black '> Test your agent</h1> */}
              <br/>
              <button 
                className='cursor-pointer text-black dark:text-gray-100 border border-gray-300 dark:border-gray-600 p-2 rounded-md px-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors'
                onClick={handleTestClick}
              > 
                Test
              </button>
            </div>

        )}
        </div>
      </div>
        <div className=' flex justify-center '>
          <button className='white cursor-pointer border-1 p-1 px-10 rounded-sm border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 mb-5 m-2 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors' onClick={createAgentHandler}>
            Create Agent
          </button>
        </div>


    </div>
  )
}

export default Main;