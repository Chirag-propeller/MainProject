import VoiceAssistant from "@/components/agent/newAgent/VoiceAssistant";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Agent } from "../types";
import { Button } from "@/components/ui/button";
import Logo from "@/components/sidebar/Logo";
import { languageFillers as fillers } from "../Constants";

interface TestProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent;
}

const Test: React.FC<TestProps> = ({ isOpen, onClose, agent }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [token, setToken] = useState("");
  const [roomName, setRoomName] = useState("");
  const [apis, setApis] = useState([]);

  // Ensure the component is mounted before animations start
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const fetchApis = async () => {
      const response = await axios.get("/api/apiTool/get");
      const apis = response.data;
      const agentApis = apis.filter((api: any) =>
        agent.apis?.includes(api._id)
      );
      setApis(agentApis);
    };
    // Add body overflow hidden when modal is open
    if (isOpen) {
      fetchApis();
      document.body.style.overflow = "hidden";
    }

    // Handle click outside to close modal
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevent animation on initial render
  if (!mounted) {
    return null;
  }

  const url = process.env.NEXT_PUBLIC_AZURE_URL;

  // llm?: string;
  // llmModel?: string;
  // inputLanguage?: string;
  // stt?: string;
  // tts?: string;
  // ttsVoiceName?: string;
  // ttsModel?: string;
  // speed?: number;
  // backgroundSound?: string;
  // welcomeMessage?: string;
  // knowledgeBaseAttached?: boolean;
  // knowledgeBase?: any[];
  // prompt?: string;
  // userId?: string;
  // gender?: string;
  // ttsLanguage?: string;
  // const sendData = async (roomName: string) => {
  //   try {
  //     const data = {
  //       selectedLLM: agent.llm,
  //       selectedLLMModel: agent.llmModel,
  //       selectedInputLang: agent.inputLanguage,
  //       selectedStt : agent.stt,
  //       selectedTts : agent.tts,
  //       selectedTtsModel : agent.ttsModel,
  //       selectedTtsVoice : agent.ttsVoiceName,
  //       selectedSpeed : agent.speed,
  //       selectedBackgroundSound : agent.backgroundSound,
  //       selectedWelcomeMessage : agent.welcomeMessage,
  //       selectedKnowledgeBase : agent.knowledgeBaseAttached,
  //       selectedPrompt : agent.prompt,
  //       selectedUserId : agent.userId,
  //       selectedGender : agent.gender,
  //       selectedTtsLanguage : agent.ttsLanguage,
  //       roomName,
  //     };
  //     console.log(data);
  //     const response = await axios.post(`${url}/sendData`,data);
  //     // Assuming the server sends a response
  //     // console.log(text);
  //     // alert("Update Successful");
  //   } catch (error) {
  //     alert("Something went wrong")
  //     console.error("Error sending data:", error);

  //   }
  // };
  // console.log(fillers);

  // console.log(languageFillers);

  const fetchToken = async () => {
    const languageFillers =
      fillers[agent?.ttsLanguage as keyof typeof fillers]?.[
        agent?.gender as keyof (typeof fillers)["en-IN"]
      ] || fillers["en-IN"]["Male"];
    try {
      const dataToSend = {
        agentId: agent.agentId,
        llm: agent.llm,
        llmModel: agent.llmModel,
        inputLanguage: agent.inputLanguage,
        stt: agent.stt,
        sttModel: agent.sttModel,
        sttLanguage: agent.sttLanguage,
        tts: agent.tts,
        ttsModel: agent.ttsModel,
        ttsVoiceName: agent.ttsVoiceName,
        speed: agent.speed,
        backgroundSound: agent.backgroundSound,
        welcomeMessage: agent.welcomeMessage,
        knowledgeBaseAttached: agent.knowledgeBaseAttached,
        prompt: agent.prompt,
        userId: agent.userId,
        gender: agent.gender,
        ttsLanguage: agent.ttsLanguage,
        roomName,
        apis: apis,
        callHangup: agent.callHangup || false,
        callHangupPhase: agent.callHangupPhase || [],
        maxCallDuration: agent.maxCallDuration,
        numberTransfer: agent.numberTransfer || false,
        numberTransferNumber: agent.numberTransferNumber || "",
        userAwayTimeOut: agent.userAwayTimeOut || 5,
        languageFillers: languageFillers,
        isLanguageFillersActive: agent.isLanguageFillersActive || true,
        whenToCallRag: agent.whenToCallRag || "",
      };
      console.log(dataToSend);
      console.log("run");
      const tempUrl = "/api/livekit/getToken";
      // const response = await axios.post(`${url}/getToken`, dataToSend);
      const response = await axios.post(tempUrl, dataToSend);
      // const response = await fetch(`${url}/getToken`);
      // console.log("Url ->", url);
      const data = response.data;
      return {
        roomName: data.room_name,
        token: data.token,
      };
    } catch (error) {
      alert("Something went wrong..");
      console.error("Error fetching token:", error);
    }
  };

  const handleTestClick = async () => {
    const user = await axios.get("/api/user/getCurrentUser");
    // console.log(user);
    const credits = parseFloat(user.data?.credits?.$numberDecimal) || 0;
    const creditsUsed = parseFloat(user.data?.creditsUsed?.$numberDecimal) || 0;
    // const credits = user.data?.credits || 0 ;
    // const creditsUsed = user.data?.creditsUsed || 0;
    if (credits - creditsUsed <= 0) {
      alert("You have no credits left");
      return;
    }
    // console.log(user);

    // await getToken;
    const tokenData = await fetchToken();
    if (tokenData) {
      setRoomName(tokenData.roomName);
      setToken(tokenData.token);
      // await sendData(tokenData.roomName);
      setShowVoiceAssistant(true);
    }
  };

  // Render the component regardless of isOpen state
  // but use opacity and pointer-events to hide it when closed
  return (
    <div
      className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-700 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{
        transition: "opacity 700ms ease",
      }}
    >
      <div
        ref={modalRef}
        className={`fixed top-0 right-0 h-full w-1/2 bg-white shadow-lg will-change-transform`}
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform",
        }}
      >
        <div className="h-full overflow-auto ">
          <div className="sticky top-0 flex justify-between items-center mb-6">
            {/* <h2 className="text-xl font-semibold">Test Agent</h2> */}
            <Logo collapsed={false} />
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="w-[95%] h-[90%] text-sm bg-white m-2 rounded-sm ">
            {/* <div className='flex justify-center'>
            <div className='flex bg-gray-100 p-1 rounded-sm w-[40%] h-fit m-2 justify-between'>
              <div className={` p-1 cursor-pointer rounded-sm  mx-1 w-[100%] bg-white`}>  
              Test your agent
              </div>
            </div>
          </div>
          <hr className='w-[80%] border-gray-700 mx-auto '/> */}

            {showVoiceAssistant ? (
              <VoiceAssistant
                token={token}
                setShowVoiceAssistant={setShowVoiceAssistant}
              />
            ) : (
              <div className="flex flex-col justify-center items-center h-[95%]">
                {/* <Logo className='w-10 h-10' /> */}
                {/* <h1 className='text-xl text-black '> Test your agent</h1> */}
                <br />
                <Button
                  variant="default"
                  size="md"
                  className="px-8 py-2 text-md rounded-[4px] shadow-xs shadow-indigo-100 border-1 border-gray-300"
                  onClick={handleTestClick}
                >
                  Start a conversation
                </Button>
                {/* <button 
                className='px-5 py-1 text-md rounded-[4px] shadow-xs shadow-indigo-100 border-1 border-gray-300'
                onClick={handleTestClick}
              > 
                Test
              </button> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
