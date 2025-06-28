import React, { useState, useEffect } from 'react';
import { Campaign, Agent as CampaignAgent } from '../../types';
import { Agent } from '../../../agents/types';
import { fetchAgentById } from '../../../agents/api';
import { Bot, Triangle, User, Brain, Speech } from 'lucide-react';

interface AgentConfigurationProps {
  campaign: Campaign;
  agents: CampaignAgent[];
}

const AgentConfiguration: React.FC<AgentConfigurationProps> = ({ campaign, agents }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [agentDetails, setAgentDetails] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(false);

  const campaignAgent = agents.find(a => a._id === campaign.agentId);
  const agentName = campaignAgent?.agentName || 'No Agent Attached';

  useEffect(() => {
    const loadAgentDetails = async () => {
      if (isOpen && campaign.agentId && !agentDetails) {
        setLoading(true);
        try {
          const details = await fetchAgentById(campaign.agentId);
          setAgentDetails(details);
        } catch (error) {
          console.error('Failed to load agent details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadAgentDetails();
  }, [isOpen, campaign.agentId, agentDetails]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='border border-gray-200 dark:border-gray-700 rounded-lg'>
      <header 
        className='cursor-pointer bg-gray-100 dark:bg-indigo-600 p-2'
        onClick={handleToggle}
      >
        <div className='flex justify-between'>
          <div className='flex gap-2'>
            <Bot className='w-3.5 h-3.5 text-gray-900 dark:text-white self-center' />
            <h2 className='text-md text-gray-900 dark:text-white'>Agent Configuration</h2>
          </div>
          <Triangle 
            className={`w-3 h-3 self-center fill-gray-400 dark:fill-white ${isOpen ? "rotate-180" : "rotate-90"}`}
          />
        </div>
      </header>
      {isOpen && (
        <div className='p-4 bg-gray-50 dark:bg-gray-950'>
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <div className="w-6 h-6 border-2 border-t-transparent border-indigo-600 dark:border-indigo-400 rounded-full animate-spin"></div>
            </div>
          ) : !campaign.agentId ? (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              No agent attached to this campaign
            </div>
          ) : agentDetails ? (
            <div className='space-y-4'>
              {/* Basic Agent Info */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700'>
                  <div className='flex flex-col'>
                    <div className='flex items-center gap-1 mb-1'>
                      <User className='w-3 h-3 text-gray-500 dark:text-gray-400' />
                      <span className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide'>Agent Name</span>
                    </div>
                    <span className='text-sm text-gray-900 dark:text-gray-100 font-medium'>{agentDetails.agentName}</span>
                  </div>
                </div>
                
                <div className='bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700'>
                  <div className='flex flex-col'>
                    <span className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1'>Agent ID</span>
                    <span className='text-sm text-gray-900 dark:text-gray-100 font-mono'>{agentDetails.agentId}</span>
                  </div>
                </div>
              </div>

              {/* Model Configuration */}
              {(agentDetails.llm || agentDetails.llmModel) && (
                <div className='border-t border-gray-200 dark:border-gray-700 pt-4'>
                  <div className='flex items-center gap-1 mb-3'>
                    <Brain className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                    <h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Model Configuration</h3>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {agentDetails.llm && (
                      <div className='bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700'>
                        <div className='flex flex-col'>
                          <span className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1'>LLM Provider</span>
                          <span className='text-sm text-gray-900 dark:text-gray-100'>{agentDetails.llm}</span>
                        </div>
                      </div>
                    )}
                    {agentDetails.llmModel && (
                      <div className='bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700'>
                        <div className='flex flex-col'>
                          <span className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1'>LLM Model</span>
                          <span className='text-sm text-gray-900 dark:text-gray-100'>{agentDetails.llmModel}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Voice Configuration */}
              {(agentDetails.tts || agentDetails.ttsVoiceName || agentDetails.ttsLanguage) && (
                <div className='border-t border-gray-200 dark:border-gray-700 pt-4'>
                  <div className='flex items-center gap-1 mb-3'>
                    <Speech className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                    <h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Voice Configuration</h3>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    {agentDetails.tts && (
                      <div className='bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700'>
                        <div className='flex flex-col'>
                          <span className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1'>TTS Provider</span>
                          <span className='text-sm text-gray-900 dark:text-gray-100'>{agentDetails.tts}</span>
                        </div>
                      </div>
                    )}
                    {agentDetails.ttsLanguage && (
                      <div className='bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700'>
                        <div className='flex flex-col'>
                          <span className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1'>Language</span>
                          <span className='text-sm text-gray-900 dark:text-gray-100'>{agentDetails.ttsLanguage}</span>
                        </div>
                      </div>
                    )}
                    {agentDetails.ttsVoiceName && (
                      <div className='bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700'>
                        <div className='flex flex-col'>
                          <span className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1'>Voice</span>
                          <span className='text-sm text-gray-900 dark:text-gray-100'>{agentDetails.ttsVoiceName}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {agentDetails.gender && (
                    <div className='mt-4 max-w-xs'>
                      <div className='bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700'>
                        <div className='flex flex-col'>
                          <span className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1'>Gender</span>
                          <span className='text-sm text-gray-900 dark:text-gray-100'>{agentDetails.gender}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Welcome Message */}
              {agentDetails.welcomeMessage && (
                <div className='border-t border-gray-200 dark:border-gray-700 pt-4'>
                  <h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3'>Welcome Message</h3>
                  <div className='bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700'>
                    <span className='text-sm text-gray-900 dark:text-gray-100 leading-relaxed'>{agentDetails.welcomeMessage}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-red-500 dark:text-red-400">
              Failed to load agent details
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentConfiguration; 