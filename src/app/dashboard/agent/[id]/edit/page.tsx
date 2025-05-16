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
import { useParams } from 'next/navigation';
import ModalList from '@/components/agent/ModalList';
// import AddKnowledgeBaseModal from '@/components/knowledgeBase/AddKnowledgeBaseModal';


interface TtsOptions {
  [key: string]: string[]; // Assuming each provider maps to an array of voices
}
interface LLMConfig {
  llmOptions: string[];
  ttsOptions: TtsOptions;
  sttOptions: string[];
  loading: boolean
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
  const params = useParams();
  const agentId = params?.id as string;


  const [isKnowledgeBaseModalListOpen, setIsKnowledgeBaseModalListOpen] = useState<boolean>(false);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const { llmOptions, ttsOptions, sttOptions, loading } = useLLMConfig() as LLMConfig

  const providers = Object.keys(ttsOptions);
  const languages: string[] = Array.isArray(sttOptions) ? Array.from(sttOptions) : Object.values(sttOptions);
  const llm: string[] = Array.isArray(llmOptions) ? Array.from(llmOptions) : Object.values(llmOptions);
  const ttsProvider = Object.keys(ttsOptions);

  const [selectedLang, setSelectedLang] = useState<string>(sttOptions[0])
  const [selectedLLM, setSelectedLLM] = useState<string>(llmOptions[0]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  
  const [gender, setGender] = useState<string>("Male");
  const [selectedTtsLanguage, setSelectedTtsLanguage] = useState<string>("English-US");
  const [selectedProvider, setSelectedProvider] = useState<string>(providers[0]); // Default to first provider
  const [voices, setVoices] = useState<string[]>(ttsOptions[selectedProvider]); // Default voices
  useEffect (
    ()=>{
      setSelectedLang(sttOptions[0]);
      setSelectedLLM(llmOptions[0]);
      setSelectedProvider(providers[0]);
      setVoices(ttsOptions[providers[0]]);
    }
  ,[llmOptions, ttsOptions, sttOptions, loading])
  useEffect(
    ()=>{
      setVoices(ttsOptions[selectedProvider]);
    }
  , [selectedProvider])
  // Handle provider change
  const handleProviderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvider = event.target.value;
    setSelectedProvider(newProvider);
    setVoices(ttsOptions[newProvider]); // Update voices dropdown
    setSelectedVoice(voices[0]);
    console.log(voices, selectedVoice);
  };


  const [token, setToken] = useState("");
  const [agentName, setAgentName] = useState("");
  const [agent, setAgent] = useState<any>();
  const [roomName, setRoomName] = useState("");
  const [text, setText] = useState('');
  const [knowledgeBase, setKnowledgeBase] = useState(true);
  const [knowledgeBaseList, setKnowledgeBaseList] = useState<string[]>([]);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  

  const url = process.env.NEXT_PUBLIC_AZURE_URL
  // const url = "https://serverforwindowvm2-dghvd3dkebd4excq.eastus2-01.azurewebsites.net"


  useEffect(
    () => {
    const fetchAgent = async () => {
      try {
        const res = await fetch(`/api/agent/${agentId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch agent details');
        }
        const agent = await res.json();
        console.log(agent);
        setAgent(agent);
        // Pre-fill fields
        setGender(agent.gender || "Male");
        setSelectedTtsLanguage(agent.ttsLanguage || "English-US");
        setText(agent.prompt || '');
        setSelectedLang(agent.inputLanguage || sttOptions[0]);
        setSelectedLLM(agent.llm || llmOptions[0]);
        setSelectedProvider(agent.stt || providers[0]);
        setSelectedVoice(agent.ttsVoiceName || voices[0]);
        setKnowledgeBaseList(agent.knowledgeBase || []);
        setAgentName(agent.agentName );
      } catch (error) {
        console.error('Error fetching agent:', error);
      }
    };

    const fetchKnowledgeBases = async () => {
      try {
        const res = await fetch("/api/knowledgeBase/get", { method: "GET" });
        const data = await res.json();
        setKnowledgeBases(data.knowledgeBases);
      } catch (err) {
        console.error("Error fetching knowledge bases:", err);
      }
    };
  
    if (agentId) fetchAgent();
    fetchKnowledgeBases();
  }, []);
  

  const sendData =
   async (roomName: string = "hello") => {
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
    const credits = user.data?.credits || 0 ;
    const creditsUsed = user.data?.creditsUsed || 0;
    if(credits - creditsUsed <= 0){
      alert("You have no credits left");
      return;
    }
    // await getToken;
    const tokenData = await fetchToken();
    if (tokenData) {
      setRoomName(tokenData.roomName);
      setToken(tokenData.token);
      await sendData(tokenData.roomName);
      setShowVoiceAssistant(true);
    }
    
  };

  const updateAgentHandler = async () => {
    const payload = {
      agentName:agentName,
      prompt: text,
      llm: selectedLLM,
      inputLanguage: selectedLang,
      stt: selectedProvider,
      tts: selectedProvider,
      ttsVoiceName: selectedVoice,
      ttsModel: selectedVoice,
      knowledgeBase: knowledgeBaseList,
      knowledgeBaseAttached: knowledgeBaseList.length > 0,
      backgroundSound: agent?.backgroundSound,
      welcomeMessage: agent?.welcomeMessage,
    };
  
    const res = await fetch(`/api/agent/${agentId}`, {
      method: 'PUT', // or PATCH if your backend prefers
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  
    if (res.ok) {
      const data = await res.json();
      console.log('Agent updated:', data);
      router.push('/dashboard/agent');
    } else {
      alert('Failed to update agent');
    }
  };
  

  useEffect(
    ()=>{
      console.log(knowledgeBaseList);
    }
    ,[knowledgeBaseList])


  return (
    <div className='bg-gray-100 h-fit '>
      <div className='flex bg-gray-100 h-[90vh] w-full'>
        <div className='w-[45vw] bg-white m-2 rounded-sm '> 
          <div className='flex'>
          
          <Link href="/dashboard/agent">
          
            <Button className='cursor-pointer mt-2 ms-2 border-1 text-sm ' variant="ghost" size="sm">Back</Button>
          </Link>
          <input placeholder='Agent Name' className='border-gray-300 px-2 m-2 rounded-sm mt-3 border-1' value={agentName} onChange={(e) => setAgentName(e.target.value)}/>
          </div>
          <div className='flex mt-2'>

          <div className='mx-1 p-1'>
            <p className='text-xs mx-3  '> Language </p>
            <SelectOptions options={languages} selectedOption={selectedLang} setOption={setSelectedLang} loading={loading} />
          </div>
          <div className='mx-1 p-1'>
            <p className='text-xs mx-3  '> LLM </p>
            <SelectOptions options={llm} selectedOption={selectedLLM} setOption={setSelectedLLM} loading={loading} />
          </div>
          <div className='mx-1 p-1'>
            <p className='text-xs mx-3  '> TTS Provider </p>
            <select className='p-1 m-1 rounded-full  text-sm bg-gray-100 border border-gray-300 ' value={selectedProvider} onChange={handleProviderChange}>
                {providers.map((provider) => (
                  <option key={provider} value={provider} className='p-1'>
                    {provider}
                  </option>
                ))}
            </select>
          </div>

          <div className='mx-1 p-1'>
            <p className='text-xs mx-3 '> Select Voices </p>
            <SelectOptions options={voices} selectedOption={selectedVoice} setOption={setSelectedVoice} loading={loading} />
          </div>
          </div>
          <textarea 
            className='p-2 m-3 rounded-md w-[95%] text-sm border border-gray-300 h-[50vh]'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
        </div>
        <div className='w-[27vw] bg-white m-2 rounded-sm '> 
          <div className='cursor-pointer' onClick={() => setKnowledgeBase(!knowledgeBase)}> 
            <h1 className='m-3 text-sm text-black hover:underline'>Knowledge Base</h1> 
          </div>
              <div className='text-gray-500 m-2 mx-3 '>
                <p className=' p-1  text-xs'> Add knowledge base to provide context to the agent.</p>
                <Button variant="ghost" size="sm" className=' relative border-1 border-gray-300 rounded-none'
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
                  knowledgeBaseList.map((li) => {
                    const kb = knowledgeBases.find(kb => kb._id === li)
                    return (
                      <li key={li} className='text-sm'>
                      {kb?.name || 'Unknown'}
                    </li>
                    )
                  }
                  )
                }
                </ul>
              </div>
  
        </div>
        <div className='w-[27vw] text-sm bg-white m-2 rounded-sm '> 
          <div className='flex justify-center'>
            <div className='flex bg-gray-100 p-1 rounded-sm w-[40%] h-fit m-2 justify-between'>
              <div className={` p-1 cursor-pointer rounded-sm  mx-1 w-[100%] bg-white`}>  
              Test your agent
              </div>
            </div>
          </div>
          <hr className='w-[80%] border-gray-700 mx-auto '/>

          {showVoiceAssistant  ?  ( 
              <VoiceAssistant token={token} setShowVoiceAssistant={setShowVoiceAssistant}  />) : 
              (<div className='flex flex-col justify-center items-center h-[90%]'>
              {/* <h1 className='text-xl text-black '> Test your agent</h1> */}
              <br/>
              <button 
                className='cursor-pointer text-black border border-gray-300 p-2 rounded-md px-4'
                onClick={handleTestClick}
              > 
                Test
              </button>
            </div>

        )}
        </div>
      </div>
        <div className=' flex justify-center '>

          <button
            className="white cursor-pointer border-1 p-1 px-10 rounded-sm border-gray-400 bg-white mb-5 m-2"
            onClick={updateAgentHandler}
          >
            Update Agent
          </button>

        </div>


    </div>
  )
}

export default Main;