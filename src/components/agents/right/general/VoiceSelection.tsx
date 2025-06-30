import { useState, useRef, useEffect } from "react";
import { Play } from "lucide-react"; // Adjust import path
import axios from "axios";

const VoiceSelector = ({
  voices,
  selectedVoice,
  setSelectedVoice,
  agent,
}: {
  voices: any;
  selectedVoice: any;
  setSelectedVoice: any;
  agent: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null); // Track which voice is loading
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null); // Track current playing audio

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      setAudioUrl(null);
      // Stop any playing audio when component unmounts
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    };
  }, []);

  // Find selected voice name
  const selectedName =
    voices.find((v: any) => v.value === selectedVoice)?.name || "Select voice";

  const playAudio = (url: string) => {
    // Stop any currently playing audio safely
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      } catch (error) {
        // Ignore errors when trying to pause audio that hasn't started
        console.log("Audio pause handled:", error);
      }
      currentAudioRef.current = null;
    }

    // Create and play new audio
    const audio = new Audio(url);
    currentAudioRef.current = audio;

    // Clean up reference when audio ends
    audio.addEventListener("ended", () => {
      if (currentAudioRef.current === audio) {
        currentAudioRef.current = null;
      }
    });

    // Handle any errors during playback
    audio.addEventListener("error", () => {
      if (currentAudioRef.current === audio) {
        currentAudioRef.current = null;
      }
    });

    audio.play().catch((error) => {
      console.error("Audio playback failed:", error);
      if (currentAudioRef.current === audio) {
        currentAudioRef.current = null;
      }
      // Only show alert for actual playback failures, not interruptions
      if (!error.message.includes("interrupted")) {
        alert("Please click the play button again to hear the preview");
      }
    });
  };

  const PlayHandler = (e: any, option: any) => {
    e.stopPropagation();

    // Prevent multiple simultaneous requests for the same voice
    if (isLoading === option.value) return;

    // Stop any currently playing audio immediately and safely
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      } catch (error) {
        // Ignore errors when trying to pause audio that hasn't started
        console.log("Audio pause handled:", error);
      }
      currentAudioRef.current = null;
    }

    setIsLoading(option.value);

    const playVoice = axios
      .post(`/api/agents/voice`, {
        provider: agent.tts,
        model: agent.ttsModel,
        voice: option.value,
        text: "Hello! I'm here to help you get things done, one step at a time.It's currently 3:30 PM, and your next meeting starts in 15 minutes.",
        language: agent.ttsLanguage,
      })
      .then((res: any) => {
        // console.log("res", res)
        const url = res.data.audioUrl;
        // console.log("url", url)
        playAudio(url);
        // const audioBytes = new Uint8Array(res.data.audioData);
        // const blob = new Blob([audioBytes], { type: 'audio/mpeg' });
        // const url = URL.createObjectURL(blob);
        // setAudioUrl(url);
        // console.log("url", url)
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => {
        setIsLoading(null);
      });
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Custom dropdown trigger */}
      <div
        className="p-2.25 rounded-[6px] w-full text-sm bg-white border border-gray-300 flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedName}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-0" : "rotate-0"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Custom dropdown menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-[6px] shadow-lg text-sm max-h-[250px] overflow-y-auto">
          {voices.length > 0 ? (
            voices.map((option: any, idx: any) => (
              <div
                key={idx}
                className={`flex items-center gap-4 p-2 cursor-pointer text-sm py-1 ${
                  option.value === selectedVoice
                    ? "bg-indigo-500 text-white "
                    : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  setSelectedVoice(option.value);
                  setIsOpen(false);
                }}
              >
                {/* <span className={option.value === selectedVoice ? 'font-medium' : ''}>{option.name}</span> */}
                <button
                  className={`p-2  rounded-full hover:bg-gray-200 focus:outline-none flex items-center gap-1 border  cursor-pointer  ${option.value === selectedVoice ? "border-white" : "border-indigo-500"} ${
                    isLoading === option.value
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={(e) => PlayHandler(e, option)}
                  disabled={isLoading === option.value}
                >
                  {/* <p className={option.value === selectedVoice ? 'text-white text-sm' : 'text-gray-900 text-sm'}>Play</p> */}

                  <Play
                    className={`${option.value === selectedVoice ? " text-white w-4 h-4" : "text-indigo-500 w-4 h-4"} ${
                      isLoading === option.value ? "animate-spin" : ""
                    }`}
                  />
                </button>
                <span
                  className={
                    option.value === selectedVoice ? "font-medium" : ""
                  }
                >
                  {option.name}
                </span>
                {/* {audioUrl && (
                        <audio 
                        // controls 
                        src={audioUrl} 
                        autoPlay
                        className="mt-4"
                        onEnded={() => {
                            URL.revokeObjectURL(audioUrl); // Clean up
                            setAudioUrl(null);
                        }}
                        />
                    )} */}
                {/* {audioUrl && <audio src={audioUrl} controls />} */}
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500">No options available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceSelector;
