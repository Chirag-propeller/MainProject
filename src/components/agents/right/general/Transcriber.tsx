import React, { useEffect, useState } from "react";
import { Agent } from "@/components/agents/types";
import useLLMConfig from "@/hooks/useLLMConfig";
import { GiMicrophone } from "react-icons/gi";
import SelectionDropdown from "../../SelectionDropdown";
import { RiArrowDropDownLine } from "react-icons/ri";
import TooltipLabel from "@/components/ui/tooltip";
import { MdKeyboardArrowDown } from "react-icons/md";

interface Languages {
  name: string;
  value: string;
}

interface STTModel {
  name: string;
  value: string;
  languages: Languages[];
}

interface STTConfig {
  name: string;
  value: string;
  models: STTModel[];
}

interface LLMConfig {
  sttOptions: string[];
  sttModels: STTConfig[];
}

const Transcriber = ({
  agent,
  setAgent,
}: {
  agent: Agent;
  setAgent: (agent: Agent) => void;
}) => {
  const { sttOptions, sttModels } = useLLMConfig() as LLMConfig;
  console.log("sttModels", sttModels);

  // Create provider options from sttModels
  const provider: { name: string; value: string }[] = [];
  for (let i = 0; i < sttModels.length; i++) {
    provider.push({ name: sttModels[i].name, value: sttModels[i].value });
  }

  // State variables with defaults from agent or fallback values
  const [selectedProvider, setSelectedProvider] = useState<string>(
    agent.stt || (provider.length > 0 ? provider[0].value : "")
  );
  const [isOpen, setIsOpen] = useState(false);
  const [models, setModels] = useState<{ name: string; value: string }[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>(
    agent.sttModel || ""
  );
  const [availableLanguages, setAvailableLanguages] = useState<
    { name: string; value: string }[]
  >([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    agent.sttLanguage || ""
  );

  console.log("provider", provider);

  // Effect 1: Update models when provider changes
  useEffect(() => {
    console.log("selectedProvider:", selectedProvider);
    console.log("sttModels:", sttModels);
    const modelOptions: { name: string; value: string }[] = [];
    for (let i = 0; i < sttModels.length; i++) {
      console.log(
        "Checking provider:",
        sttModels[i].name,
        "vs selected:",
        selectedProvider
      );
      if (
        sttModels[i].value === selectedProvider ||
        sttModels[i].name === selectedProvider
      ) {
        console.log("Found matching provider:", sttModels[i]);
        for (let j = 0; j < sttModels[i].models.length; j++) {
          modelOptions.push({
            name: sttModels[i]?.models[j]?.name,
            value: sttModels[i]?.models[j]?.value,
          });
        }
      }
    }
    console.log("Final models:", modelOptions);
    setModels(modelOptions);

    // If agent has a saved model that exists in new provider, keep it; otherwise use first available
    if (
      agent.sttModel &&
      modelOptions.some((m) => m.value === agent.sttModel)
    ) {
      setSelectedModel(agent.sttModel);
    } else if (modelOptions.length > 0) {
      setSelectedModel(modelOptions[0].value);
    }
  }, [selectedProvider, sttModels]);

  // Effect 2: Update languages when provider or model changes
  useEffect(() => {
    const languageOptions: { name: string; value: string }[] = [];
    for (let i = 0; i < sttModels.length; i++) {
      if (
        sttModels[i].value === selectedProvider ||
        sttModels[i].name === selectedProvider
      ) {
        for (let j = 0; j < sttModels[i].models.length; j++) {
          if (sttModels[i].models[j].value === selectedModel) {
            const modelLanguages = sttModels[i].models[j].languages;
            for (let k = 0; k < modelLanguages.length; k++) {
              languageOptions.push({
                name: modelLanguages[k].name,
                value: modelLanguages[k].value,
              });
            }
          }
        }
      }
    }
    console.log("languages", languageOptions);
    setAvailableLanguages(languageOptions);

    // If agent has a saved language that exists in new model, keep it; otherwise use first available
    if (
      agent.sttLanguage &&
      languageOptions.some((l) => l.value === agent.sttLanguage)
    ) {
      setSelectedLanguage(agent.sttLanguage);
    } else if (languageOptions.length > 0) {
      setSelectedLanguage(languageOptions[0].value);
    }
  }, [selectedProvider, selectedModel, sttModels]);

  // Update agent when provider changes
  useEffect(() => {
    console.log("Inside useEffect of selectedProvider for STT");
    let newModel = selectedModel;

    // Find models for the new provider
    const modelOptions: { name: string; value: string }[] = [];
    for (let i = 0; i < sttModels.length; i++) {
      if (
        sttModels[i].value === selectedProvider ||
        sttModels[i].name === selectedProvider
      ) {
        for (let j = 0; j < sttModels[i].models.length; j++) {
          modelOptions.push({
            name: sttModels[i]?.models[j]?.name,
            value: sttModels[i]?.models[j]?.value,
          });
        }
      }
    }

    // If agent has a saved model that exists in new provider, keep it; otherwise use first available
    if (
      agent.sttModel &&
      modelOptions.some((m) => m.value === agent.sttModel)
    ) {
      newModel = agent.sttModel;
    } else if (modelOptions.length > 0) {
      newModel = modelOptions[0].value;
    }

    if (agent.stt !== selectedProvider) {
      setAgent({ ...agent, stt: selectedProvider, sttModel: newModel });
    }
  }, [selectedProvider]);

  // Update agent when model changes
  useEffect(() => {
    console.log("Inside useEffect of selectedModel for STT");
    if (agent.sttModel !== selectedModel) {
      setAgent({ ...agent, sttModel: selectedModel });
    }
  }, [selectedModel]);

  // Update agent when language changes
  useEffect(() => {
    console.log("Inside useEffect of selectedLanguage for STT");
    if (agent.sttLanguage !== selectedLanguage) {
      setAgent({
        ...agent,
        sttLanguage: selectedLanguage,
        inputLanguage: selectedLanguage,
      });
    }
  }, [selectedLanguage]);

  useEffect(() => {
    console.log("STT agent", agent);
  }, [agent]);

  return (
    <div className="border border-gray-200 rounded-[6px] bg-white shadow-sm hover:border-gray-300">
      <header
        className="cursor-pointer bg-white border-b-background px-2 py-1 m-1 rounded-[6px]"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div className="flex justify-between m-1.5">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-100 rounded-[6px] flex items-center justify-center">
              <span className="text-blue-400 text-lg">
                <GiMicrophone />
              </span>
            </div>
            <div>
              <h2 className="text-[14px] text-gray-900 font-semibold ml-1.5">
                Transcriber
              </h2>
              <p className="font-light text-gray-500 text-sm pt-1 ml-1.5">
                Speech-to-text configuration
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
          <hr className="border-t border-gray-200 my-2" />
          <div className="p-2 flex flex-row flex-wrap justify-between gap-2 w-full bg-white rounded-xl ">
            <div className="flex flex-col gap-2 mx-1 w-2/5">
              <div className="mx-1 p-1">
                <TooltipLabel label="Provider" fieldKey="transProvider" />
                <SelectionDropdown
                  options={provider}
                  selectedOption={selectedProvider}
                  setOption={setSelectedProvider}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 mx-1 w-2/5">
              <div className="mx-1 p-1">
                <TooltipLabel label="Model" fieldKey="transModel" />
                <SelectionDropdown
                  options={models}
                  selectedOption={selectedModel}
                  setOption={setSelectedModel}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 mx-1 w-2/5">
              <div className="mx-1 p-1">
                <TooltipLabel label="Language" fieldKey="transLang" />
                <SelectionDropdown
                  options={availableLanguages}
                  selectedOption={selectedLanguage}
                  setOption={setSelectedLanguage}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Transcriber;
