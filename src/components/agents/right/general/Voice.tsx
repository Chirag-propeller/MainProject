import React, { useEffect, useState } from "react";
import { Agent } from "@/components/agents/types";
import useLLMConfig from "@/hooks/useLLMConfig";
import SelectOptions from "@/components/agent/newAgent/SelectOptions";
import { MdKeyboardArrowDown, MdRecordVoiceOver } from "react-icons/md";
import SelectionDropdown from "@/components/agents/SelectionDropdown";
import VoiceSelector from "./VoiceSelection";
import { RiArrowDropDownLine } from "react-icons/ri";
import TooltipLabel from "@/components/ui/tooltip";

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

const Voice = ({
  agent,
  setAgent,
}: {
  agent: Agent;
  setAgent: (agent: Agent) => void;
}) => {
  const genders = ["Male", "Female"];
  const { ttsOptions, ttsLanguageOptions } =
    useLLMConfig() as unknown as LLMConfig;

  // Get providers list
  const providers = Array.isArray(ttsOptions)
    ? ttsOptions.map((provider: TtsProvider) => ({
        name: provider.name,
        value: provider.value,
      }))
    : [];

  // State variables with defaults from agent or fallback values
  const [selectedProvider, setSelectedProvider] = useState<string>(
    agent.tts || (providers.length > 0 ? providers[0].value : "")
  );
  const [models, setModels] = useState<{ name: string; value: string }[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>(
    agent.ttsModel || ""
  );
  const [availableLanguages, setAvailableLanguages] = useState<
    { name: string; value: string }[]
  >([]);
  const [language, setLanguage] = useState<string>(agent.ttsLanguage || "");
  const [availableGenders, setAvailableGenders] = useState<string[]>([]);
  const [gender, setGender] = useState<string>(agent.gender || "");
  const [voices, setVoices] = useState<{ name: string; value: string }[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>(
    agent.ttsVoiceName || ""
  );
  const [isOpen, setIsOpen] = useState(false);
  // const [isPlaying, setIsPlaying] = useState(false)

  // Effect 1: Update models when provider changes
  useEffect(() => {
    if (selectedProvider && Array.isArray(ttsOptions)) {
      const provider = ttsOptions.find(
        (p: TtsProvider) => p.value === selectedProvider
      );
      if (provider && provider.models) {
        const modelOptions = provider.models.map((model: TtsModel) => ({
          name: model.name,
          value: model.value,
        }));
        console.log("modelOptions", modelOptions);
        console.log("provider", provider);
        setModels(modelOptions);
        // setSelectedModel(modelOptions[0].value);

        // If agent has a saved model that exists in new provider, keep it; otherwise use first available
        if (
          agent.ttsModel &&
          modelOptions.some((m) => m.value === agent.ttsModel)
        ) {
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
  }, [selectedModel]);
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
      const provider = ttsOptions.find(
        (p: TtsProvider) => p.value === selectedProvider
      );
      if (provider) {
        const model = provider.models?.find(
          (m: TtsModel) => m.value === selectedModel
        );
        if (model && model.languages) {
          const languageOptions = model.languages.map((lang: TtsLanguage) => ({
            name: lang.name,
            value: lang.value,
          }));
          setAvailableLanguages(languageOptions);

          // If agent has a saved language that exists in new model, keep it; otherwise use first available
          if (
            agent.ttsLanguage &&
            languageOptions.some((l) => l.value === agent.ttsLanguage)
          ) {
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
    if (
      selectedProvider &&
      selectedModel &&
      language &&
      Array.isArray(ttsOptions)
    ) {
      const provider = ttsOptions.find(
        (p: TtsProvider) => p.value === selectedProvider
      );
      if (provider) {
        const model = provider.models?.find(
          (m: TtsModel) => m.value === selectedModel
        );
        if (model) {
          const languageObj = model.languages?.find(
            (l: TtsLanguage) => l.value === language
          );
          if (languageObj && languageObj.gender) {
            const genderOptions = languageObj.gender.map(
              (g: TtsGender) => g.value
            );
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
    if (
      selectedProvider &&
      selectedModel &&
      language &&
      gender &&
      Array.isArray(ttsOptions)
    ) {
      const provider = ttsOptions.find(
        (p: TtsProvider) => p.value === selectedProvider
      );
      if (provider) {
        const model = provider.models?.find(
          (m: TtsModel) => m.value === selectedModel
        );
        if (model) {
          const languageObj = model.languages?.find(
            (l: TtsLanguage) => l.value === language
          );
          if (languageObj) {
            const genderObj = languageObj.gender?.find(
              (g: TtsGender) => g.value === gender
            );
            if (genderObj && genderObj.voices) {
              setVoices(genderObj.voices);

              // If agent has a saved voice that exists, keep it; otherwise use first available
              if (
                agent.ttsVoiceName &&
                genderObj.voices.some((v) => v.value === agent.ttsVoiceName)
              ) {
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
  }, [
    selectedProvider,
    selectedModel,
    language,
    gender,
    ttsOptions,
    agent.ttsVoiceName,
  ]);

  // Update agent when selections change
  useEffect(() => {
    console.log("Inside useEffect of selectedProvider");
    let newModel = selectedModel;
    if (selectedProvider && Array.isArray(ttsOptions)) {
      const provider = ttsOptions.find(
        (p: TtsProvider) => p.value === selectedProvider
      );
      if (provider && provider.models) {
        const modelOptions = provider.models.map((model: TtsModel) => ({
          name: model.name,
          value: model.value,
        }));
        // setSelectedModel(modelOptions[0].value);

        // If agent has a saved model that exists in new provider, keep it; otherwise use first available
        if (
          agent.ttsModel &&
          modelOptions.some((m) => m.value === agent.ttsModel)
        ) {
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
      setAgent({ ...agent, tts: selectedProvider, ttsModel: newModel });
    }
  }, [selectedProvider]);

  useEffect(() => {
    console.log("agent", agent);
  }, [agent]);

  useEffect(() => {
    // console.log("=== DEBUGGING SETAGENT ===");
    // console.log("selectedModel:", selectedModel);
    // console.log("agent.ttsModel:", agent.ttsModel);
    // console.log("Comparison result:", agent.ttsModel !== selectedModel);
    console.log("Inside useEffect of selectedModel");
    if (agent.ttsModel !== selectedModel) {
      // console.log("BEFORE setAgent - agent:", agent);
      // console.log("NEW OBJECT:", {...agent, ttsModel: selectedModel});

      setAgent({ ...agent, ttsModel: selectedModel });

      // Add a timeout to check if it updated
      // setTimeout(() => {
      //     console.log("AFTER setAgent - check if updated");
      // }, 100);
    }
  }, [selectedModel]);

  useEffect(() => {
    if (agent.gender !== gender) {
      setAgent({ ...agent, gender: gender });
    }
  }, [gender]);

  useEffect(() => {
    if (agent.ttsLanguage !== language) {
      setAgent({ ...agent, ttsLanguage: language });
    }
  }, [language]);

  useEffect(() => {
    if (agent.ttsVoiceName !== selectedVoice) {
      setAgent({ ...agent, ttsVoiceName: selectedVoice });
    }
  }, [selectedVoice]);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-[6px] bg-white dark:bg-gray-900 shadow-sm hover:border-gray-300 dark:hover:border-gray-500 mr-2">
      <header
        className="cursor-pointer bg-white dark:bg-gray-900 border-b-background px-2 py-1 m-1 rounded-[6px]"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div className="flex justify-between m-1.5">
          <div className="flex gap-2 items-center">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-[6px] flex items-center justify-center">
              <span className="text-indigo-300 dark:text-indigo-200 text-lg">
                <MdRecordVoiceOver />
              </span>
            </div>
            {/* <Music className='w-4 h-4 text-gray-900 self-center' /> */}
            {/* <Speaker className='w-4 h-4 text-gray-900 self-center' /> */}
            <div>
              <h2 className="text-[14px] text-gray-900 dark:text-white font-semibold ml-1.5">
                Voice
              </h2>
              <p className="font-light text-gray-500 dark:text-gray-300 text-sm pt-1 ml-1.5">
                Voice synthesis settings
              </p>
            </div>
          </div>

          <MdKeyboardArrowDown
            className={`w-8 h-8 transform transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            style={{ fill: "gray" }}
          />
        </div>
      </header>
      {isOpen && (
        <>
          <hr className="border-t border-gray-200 dark:border-gray-700 my-2" />
          <div className="w-full bg-white dark:bg-gray-900 rounded-xl flex flex-col gap-4 p-5">
            {/* Provider & Model side by side */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <TooltipLabel label="Provider" fieldKey="voiceProvider" />
                <SelectionDropdown
                  options={providers}
                  selectedOption={selectedProvider}
                  setOption={setSelectedProvider}
                />
              </div>
              <div className="w-full md:w-1/2">
                <TooltipLabel label="Model" fieldKey="voiceModel" />
                <SelectionDropdown
                  options={models}
                  selectedOption={selectedModel}
                  setOption={setSelectedModel}
                />
              </div>
            </div>
            {/* Language & Gender side by side */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <TooltipLabel label="Language" fieldKey="voiceLang" />
                <SelectionDropdown
                  options={availableLanguages}
                  selectedOption={language}
                  setOption={setLanguage}
                />
              </div>
              <div className="w-full md:w-1/2">
                <TooltipLabel label="Gender" fieldKey="voiceGender" />
                <SelectionDropdown
                  options={availableGenders.map((g) => ({ name: g, value: g }))}
                  selectedOption={gender}
                  setOption={setGender}
                />
              </div>
            </div>
            {/* Voice full width */}
            <div>
              <TooltipLabel label="Voice" fieldKey="voiceVoice" />
              <VoiceSelector
                voices={voices}
                selectedVoice={selectedVoice}
                setSelectedVoice={setSelectedVoice}
                agent={agent}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Voice;
