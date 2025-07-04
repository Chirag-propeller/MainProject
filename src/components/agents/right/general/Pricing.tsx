import React, { useEffect, useState } from "react";
import { Agent } from "@/components/agents/types";
import { PRICING } from "@/components/agents/Constants";
import TooltipLabel from "@/components/ui/tooltip";
import { useUserData } from "@/components/profile/UserDataContext";
import {
  convert,
  format,
  CURRENCY_SYMBOLS,
  CurrencyCode,
} from "@/lib/currency";

interface CostBreakdown {
  propal: number;
  stt: number;
  llm: number;
  tts: number;
  total: number;
}

interface PricingData {
  llm_providers: any[];
  providers: any[];
  stt: any[];
}

const Pricing = ({ agent }: { agent: Agent }) => {
  const { user } = useUserData();
  const currency = user?.currency || "INR";
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown>({
    propal: PRICING.PropalCost,
    stt: 0,
    llm: 0,
    tts: 0,
    total: PRICING.PropalCost,
  });

  useEffect(() => {
    fetch("/config/LLM1.json")
      .then((response) => response.json())
      .then((data) => {
        setPricingData(data);
      })
      .catch((error) => console.error("Error loading pricing data:", error));
  }, []);

  const calculateCosts = React.useCallback(() => {
    if (!pricingData) return;

    let sttCost = 0;
    let ttsCost = 0;
    let llmCost = 0;

    // Calculate STT cost per minute (multiply by 60 if per second)
    if (agent.stt && agent.sttModel) {
      const sttProvider = pricingData.stt.find(
        (provider) => provider.value === agent.stt
      );
      if (sttProvider) {
        const sttModel = sttProvider.models.find(
          (model: any) => model.value === agent.sttModel
        );
        if (sttModel && sttModel.pricing) {
          sttCost = sttModel.pricing.per_second * 60; // Convert per second to per minute
        }
      }
    }

    // Calculate TTS cost per minute (using avg output tokens per minute)
    if (agent.tts && agent.ttsModel) {
      const ttsProvider = pricingData.providers.find(
        (provider) => provider.value === agent.tts
      );
      if (ttsProvider) {
        const ttsModel = ttsProvider.models.find(
          (model: any) => model.value === agent.ttsModel
        );
        if (ttsModel && ttsModel.pricing) {
          ttsCost = ttsModel.pricing.per_character * PRICING.avgOutputToken; // Using output tokens only
        }
      }
    }

    // Calculate LLM cost per minute (using avg input and output tokens per minute)
    if (agent.llm && agent.llmModel) {
      const llmProvider = pricingData.llm_providers.find(
        (provider) => provider.value === agent.llm
      );
      if (llmProvider) {
        const llmModel = llmProvider.models.find(
          (model: any) => model.value === agent.llmModel
        );
        if (llmModel && llmModel.pricing) {
          const inputCost = llmModel.pricing.input * PRICING.avgInputToken;
          const outputCost = llmModel.pricing.output * PRICING.avgOutputToken;
          llmCost = inputCost + outputCost;
        }
      }
    }

    const totalP = PRICING.PropalCost + sttCost + llmCost + ttsCost;

    const conv = (usd: number) => convert(usd, currency as CurrencyCode); // 👈 convert once per value

    setCostBreakdown({
      propal: conv(PRICING.PropalCost),
      stt: conv(sttCost),
      llm: conv(llmCost),
      tts: conv(ttsCost),
      total: conv(totalP),
    });
  }, [pricingData, agent, currency]);

  useEffect(() => {
    if (pricingData && agent) {
      calculateCosts();
    }
  }, [pricingData, agent, calculateCosts]);

  useEffect(() => {
    if (!pricingData) return;
    calculateCosts();
  }, [
    pricingData,
    agent.stt,
    agent.sttModel,
    agent.tts,
    agent.ttsModel,
    agent.llm,
    agent.llmModel,
    calculateCosts,
  ]);

  // const formatCost = (cost: number) => {
  //   return `$${cost.toFixed(4)}`;
  // };
  const formatCost = (cost: number) => format(cost, currency as CurrencyCode);

  const getPercentage = (cost: number) => {
    if (costBreakdown.total === 0) return 0;
    return (cost / costBreakdown.total) * 100;
  };

  const costItems = [
    {
      label: "ProPal",
      cost: costBreakdown.propal,
      color: "bg-indigo-500",
      description: "Platform Fee",
    },
    {
      label: "STT",
      cost: costBreakdown.stt,
      color: "bg-cyan-500",
      description: "Speech-to-Text",
      details: `${agent.stt || "Not configured"} - ${agent.sttModel || "No model"}`,
    },
    {
      label: "LLM",
      cost: costBreakdown.llm,
      color: "bg-indigo-300",
      description: "Language Model",
      details: `${agent.llm || "Not configured"} - ${agent.llmModel || "No model"}`,
    },
    {
      label: "TTS",
      cost: costBreakdown.tts,
      color: "bg-indigo-800",
      description: "Text-to-Speech",
      details: `${agent.tts || "Not configured"} - ${agent.ttsModel || "No model"}`,
    },
  ];

  return (
    <div className=" rounded-[6px] w-1/2 bg-gray-50">
      <div className="px-3 pb-1 justify-between flex flex-row">
        <div className="flex items-center space-x-1 group relative">
          {/* <h3 className="text-sm font-semibold text-gray-900">
          Cost per minute:
        </h3> */}
          <TooltipLabel
            label="Cost per minute: "
            fieldKey="costPer"
            className="font-light text-black text-xs"
            position="bottom"
          />
        </div>
        <h3 className="text-xs font-medium text-gray-900 pt-2 pb-1 flex items-center gap-1">
          {/* {CURRENCY_SYMBOLS[currency as CurrencyCode]} */}
          {formatCost(costBreakdown.total)}
        </h3>
      </div>

      {!pricingData ? (
        <div className="px-3 pb-2 bg-white">
          <div className="animate-pulse text-gray-500 text-xs">Loading...</div>
        </div>
      ) : (
        <div
          className="px-3 pb-2
         relative rounded-[6px]"
        >
          {/* Small stacked bar */}
          <div className="w-full rounded-full bg-gray-200 h-2 flex relative">
            {costItems.map((item, index) => {
              const tooltipPosition =
                index === 0
                  ? "left-0 translate-x-0"
                  : index === costItems.length - 1
                    ? ""
                    : "left-1/2 -translate-x-1/2";
              const percentage = getPercentage(item.cost);
              if (percentage === 0) return null;

              return (
                <div
                  key={index}
                  className={`${item.color} group relative cursor-pointer hover:brightness-110 hover:h-2.25 transition-all overflow-visible duration-200 min-w-[8px] ${index === 0 ? "rounded-l-full" : ""} ${index === costItems.length - 1 ? "rounded-r-full" : ""} `}
                  style={{ width: `${percentage}%` }}
                >
                  {/* Tooltip */}
                  <div
                    className={`absolute top-full mt-1 ${tooltipPosition} left-1/2 transform -translate-x-1/2 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-max max-w-[160px] text-center px-1 py-1 rounded-[6px] bg-gray-700 text-white text-[10px] shadow-lg border border-gray-700 overflow-visible `}
                  >
                    <div className="text-gray-300 text-[10px]">
                      {item?.details}
                    </div>
                    <div className="text-yellow-300 font-bold mt-1 text-[10px]">
                      {formatCost(item.cost)} ({percentage.toFixed(1)}%)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
