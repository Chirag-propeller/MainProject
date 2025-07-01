import React, { useEffect, useState } from 'react'
import { Agent } from "@/components/agents/types";
import { PRICING } from "@/components/agents/Constants";

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
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown>({
    propal: PRICING.PropalCost,
    stt: 0,
    llm: 0,
    tts: 0,
    total: PRICING.PropalCost
  });

  useEffect(() => {
    fetch('/config/LLM1.json')
      .then(response => response.json())
      .then(data => {
        setPricingData(data);
      })
      .catch(error => console.error('Error loading pricing data:', error));
  }, []);

  useEffect(() => {
    if (pricingData && agent) {
      calculateCosts();
    }
  }, [pricingData, agent]);

  const calculateCosts = () => {
    if (!pricingData) return;

    let sttCost = 0;
    let ttsCost = 0;
    let llmCost = 0;

    // Calculate STT cost per minute (multiply by 60 if per second)
    if (agent.stt && agent.sttModel) {
      const sttProvider = pricingData.stt.find(provider => provider.value === agent.stt);
      if (sttProvider) {
        const sttModel = sttProvider.models.find((model: any) => model.value === agent.sttModel);
        if (sttModel && sttModel.pricing) {
          sttCost = sttModel.pricing.per_second * 60; // Convert per second to per minute
        }
      }
    }

    // Calculate TTS cost per minute (using avg output tokens per minute)
    if (agent.tts && agent.ttsModel) {
      const ttsProvider = pricingData.providers.find(provider => provider.value === agent.tts);
      if (ttsProvider) {
        const ttsModel = ttsProvider.models.find((model: any) => model.value === agent.ttsModel);
        if (ttsModel && ttsModel.pricing) {
          ttsCost = ttsModel.pricing.per_character * PRICING.avgOutputToken; // Using output tokens only
        }
      }
    }

    // Calculate LLM cost per minute (using avg input and output tokens per minute)
    if (agent.llm && agent.llmModel) {
      const llmProvider = pricingData.llm_providers.find(provider => provider.value === agent.llm);
      if (llmProvider) {
        const llmModel = llmProvider.models.find((model: any) => model.value === agent.llmModel);
        if (llmModel && llmModel.pricing) {
          const inputCost = llmModel.pricing.input * PRICING.avgInputToken;
          const outputCost = llmModel.pricing.output * PRICING.avgOutputToken;
          llmCost = inputCost + outputCost;
        }
      }
    }

    const total = PRICING.PropalCost + sttCost + llmCost + ttsCost;

    setCostBreakdown({
      propal: PRICING.PropalCost,
      stt: sttCost,
      llm: llmCost,
      tts: ttsCost,
      total: total
    });
  };

  const formatCost = (cost: number) => {
    return `$${cost.toFixed(4)}`;
  };

  const getPercentage = (cost: number) => {
    if (costBreakdown.total === 0) return 0;
    return (cost / costBreakdown.total) * 100;
  };

  const costItems = [
    { 
      label: 'ProPal', 
      cost: costBreakdown.propal, 
      color: 'bg-orange-500',
      description: 'Platform Fee',
      details: 'Fixed ProPal platform cost per minute'
    },
    { 
      label: 'STT', 
      cost: costBreakdown.stt, 
      color: 'bg-blue-500',
      description: 'Speech-to-Text',
      details: `${agent.stt || 'Not configured'} - ${agent.sttModel || 'No model'}`
    },
    { 
      label: 'LLM', 
      cost: costBreakdown.llm, 
      color: 'bg-purple-500',
      description: 'Language Model',
      details: `${agent.llm || 'Not configured'} - ${agent.llmModel || 'No model'}`
    },
    { 
      label: 'TTS', 
      cost: costBreakdown.tts, 
      color: 'bg-green-500',
      description: 'Text-to-Speech',
      details: `${agent.tts || 'Not configured'} - ${agent.ttsModel || 'No model'}`
    }
  ];

  return (
    <div className="border border-gray-200 rounded-[6px]">
      <div className="p-3 bg-gray-100">
        <h3 className="text-sm font-medium text-gray-900">Cost per minute: {formatCost(costBreakdown.total)}</h3>
      </div>
      
      {!pricingData ? (
        <div className="p-3 bg-gray-50">
          <div className="animate-pulse text-gray-500 text-xs">Loading...</div>
        </div>
      ) : (
        <div className="p-3 bg-gray-50 relative">
          {/* Small stacked bar */}
          <div className="w-full rounded-full bg-gray-200 h-2 flex relative">
            {costItems.map((item, index) => {
              const percentage = getPercentage(item.cost);
              if (percentage === 0) return null;
              
              return (
                <div
                  key={index}
                  className={`${item.color} group cursor-pointer hover:brightness-110 transition-all duration-200 min-w-[8px]  ${index === 0 ? "rounded-l-full" : ""} ${index === costItems.length - 1 ? "rounded-r-full" : ""}`}
                  style={{ width: `${percentage}%` }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-1050 shadow-xl border w-40 border-gray-700">
                    <div className="text-xs font-medium text-white">{item.label} - {item.description}</div>
                    <div className="text-gray-300 text-xs text-wrap">{item.details}</div>
                    <div className="font-semibold text-yellow-300 text-xs">{formatCost(item.cost)} ({percentage.toFixed(1)}%)</div>
                    {/* Tooltip arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900"></div>
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
