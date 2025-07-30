import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useWorkflowStore } from '@/store/workflowStore'
import useLLMConfig from '@/hooks/useLLMConfig'
import SelectionDropdown from '@/components/agents/SelectionDropdown'
import TooltipLabel from '@/components/ui/tooltip'
import VariableExtractSection from './VariableExtractSection'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

// Define interfaces matching the LLM1.json structure
interface LLMProvider {
  name: string;
  value: string;
  models: LLMModel[];
}

interface LLMModel {
  name: string;
  value: string;
}

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

interface STTConfig {
  name: string;
  value: string;
  models: STTModel[];
}

interface STTModel {
  name: string;
  value: string;
  languages: { name: string; value: string }[];
}

const ConversationNodeSidebar: React.FC = () => {
  const { selectedNode, updateNodeGlobal, updateNode, nodes, setSelectedNode,  edges} = useWorkflowStore()
  const { llmProviders, ttsOptions, sttModels, ttsLanguageOptions, loading } = useLLMConfig()
  const sidebarRef = useRef<HTMLDivElement>(null)
  
  // Cast ttsOptions to the correct type
  const ttsProviders = (ttsOptions as any) as TtsProvider[]

  // State for LLM options
  const [selectedLLMProvider, setSelectedLLMProvider] = useState<string>('')
  const [selectedLLMModel, setSelectedLLMModel] = useState<string>('')
  const [llmModels, setLLMModels] = useState<{ name: string; value: string }[]>([])

  // State for TTS options (following Voice.tsx pattern)
  const [selectedTTSProvider, setSelectedTTSProvider] = useState<string>('')
  const [selectedTTSModel, setSelectedTTSModel] = useState<string>('')
  const [ttsModels, setTTSModels] = useState<{ name: string; value: string }[]>([])
  const [availableTTSLanguages, setAvailableTTSLanguages] = useState<{ name: string; value: string }[]>([])
  const [selectedTTSLanguage, setSelectedTTSLanguage] = useState<string>('')
  const [availableTTSGenders, setAvailableTTSGenders] = useState<string[]>([])
  const [selectedTTSGender, setSelectedTTSGender] = useState<string>('')
  const [ttsVoices, setTTSVoices] = useState<{ name: string; value: string }[]>([])
  const [selectedTTSVoice, setSelectedTTSVoice] = useState<string>('')

  // State for STT options
  const [selectedSTTProvider, setSelectedSTTProvider] = useState<string>('')
  const [selectedSTTModel, setSelectedSTTModel] = useState<string>('')
  const [sttModelsOptions, setSTTModelsOptions] = useState<{ name: string; value: string }[]>([])
  const [sttLanguages, setSTTLanguages] = useState<{ name: string; value: string }[]>([])
  const [selectedSTTLanguage, setSelectedSTTLanguage] = useState<string>('')

  const handleConfigFieldChange = useCallback((configType: 'llm' | 'tts' | 'stt', field: string, value: string) => {
    if (selectedNode) {
      const currentData = selectedNode.data
      const currentConfig = currentData[configType] || {}
      const updatedConfig = { ...currentConfig, [field]: value }
      
      // Update the configuration
      
      updateNode(selectedNode.id, {
        ...currentData,
        [configType]: updatedConfig
      })
    }
  }, [selectedNode, updateNode])

  const handleGlobalFieldChange = useCallback((field: string, value: string | boolean) => {
    if (selectedNode) {
      updateNodeGlobal(selectedNode.id, { [field]: value })
    }
  }, [selectedNode, updateNodeGlobal])

  const handleNodeFieldChange = useCallback((field: string, value: any) => {
    if (selectedNode) {
      updateNode(selectedNode.id, { [field]: value })
    }
  }, [selectedNode, updateNode])

  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSelectedNode(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setSelectedNode])

  if (!selectedNode) {
    return null
  }

  // Initialize values from node data with defaults
  useEffect(() => {
    if (selectedNode?.data) {
      const nodeData = selectedNode.data
      
      // Initialize configurations from saved data
      
      // Set default configurations if they don't exist
      const defaultLLM = { provider: 'OpenAI', model: 'gpt-4o-mini' }
      const defaultTTS = { 
        provider: 'AWS', 
        model: 'generative', 
        language: 'en-GB', 
        gender: 'Female', 
        voice: 'Amy' 
      }
      const defaultSTT = { 
        provider: 'Deepgram', 
        model: 'nova-2', 
        language: 'en-US' 
      }

      // Initialize or get existing values with defaults
      const llmConfig = nodeData.llm || defaultLLM
      const ttsConfig = nodeData.tts || defaultTTS
      const sttConfig = nodeData.stt || defaultSTT

      setSelectedLLMProvider(llmConfig.provider || defaultLLM.provider)
      setSelectedLLMModel(llmConfig.model || defaultLLM.model)
      setSelectedTTSProvider(ttsConfig.provider || defaultTTS.provider)
      setSelectedTTSModel(ttsConfig.model || defaultTTS.model)
      setSelectedTTSLanguage(ttsConfig.language || defaultTTS.language)
      setSelectedTTSGender(ttsConfig.gender || defaultTTS.gender)
      setSelectedTTSVoice(ttsConfig.voice || defaultTTS.voice)
      setSelectedSTTProvider(sttConfig.provider || defaultSTT.provider)
      setSelectedSTTModel(sttConfig.model || defaultSTT.model)
      setSelectedSTTLanguage(sttConfig.language || defaultSTT.language)

      // Update node data with defaults if they don't exist (but don't trigger infinite loop)
      if (!nodeData.llm || !nodeData.tts || !nodeData.stt) {
        updateNode(selectedNode.id, {
          ...nodeData,
          llm: llmConfig,
          tts: ttsConfig,
          stt: sttConfig
        })
      }

    }
  }, [selectedNode?.id]) // Only depend on node ID to avoid infinite loops

  // Update LLM models when provider changes
  useEffect(() => {
    if (selectedLLMProvider && Array.isArray(llmProviders)) {
      const provider = llmProviders.find((p: LLMProvider) => p.value === selectedLLMProvider)
      
      if (provider && provider.models) {
        const modelOptions = provider.models.map((model: LLMModel) => ({
          name: model.name,
          value: model.value,
        }))
        setLLMModels(modelOptions)
        
        if (!modelOptions.some((m: any) => m.value === selectedLLMModel) && modelOptions.length > 0) {
          setSelectedLLMModel(modelOptions[0].value)
        }
      }
    }
  }, [selectedLLMProvider, llmProviders, selectedLLMModel])

  // TTS Effects (following Voice.tsx pattern exactly)
  // Effect 1: Update TTS models when provider changes
  useEffect(() => {
    if (selectedTTSProvider && Array.isArray(ttsProviders)) {
      const provider = ttsProviders.find((p: TtsProvider) => p.value === selectedTTSProvider)
      
      if (provider && provider.models) {
        const modelOptions = provider.models.map((model: TtsModel) => ({
          name: model.name,
          value: model.value,
        }))
        setTTSModels(modelOptions)
        
        if (!modelOptions.some((m: any) => m.value === selectedTTSModel) && modelOptions.length > 0) {
          setSelectedTTSModel(modelOptions[0].value)
        }
      }
    }
  }, [selectedTTSProvider, ttsProviders, selectedTTSModel])

  // Effect 2: Update TTS languages when model changes
  useEffect(() => {
    if (selectedTTSProvider && selectedTTSModel && Array.isArray(ttsProviders)) {
      const provider = ttsProviders.find((p: TtsProvider) => p.value === selectedTTSProvider)
      if (provider) {
        const model = provider.models?.find((m: TtsModel) => m.value === selectedTTSModel)
        if (model && model.languages) {
          const languageOptions = model.languages.map((lang: TtsLanguage) => ({
            name: lang.name,
            value: lang.value,
          }))
          setAvailableTTSLanguages(languageOptions)
          if (!languageOptions.some((l: any) => l.value === selectedTTSLanguage) && languageOptions.length > 0) {
            setSelectedTTSLanguage(languageOptions[0].value)
          }
        }
      }
    }
  }, [selectedTTSModel, selectedTTSProvider, ttsProviders, selectedTTSLanguage])

  // Effect 3: Update TTS genders when language changes
  useEffect(() => {
    if (selectedTTSProvider && selectedTTSModel && selectedTTSLanguage && Array.isArray(ttsProviders)) {
      const provider = ttsProviders.find((p: TtsProvider) => p.value === selectedTTSProvider)
      if (provider) {
        const model = provider.models?.find((m: TtsModel) => m.value === selectedTTSModel)
        if (model) {
          const languageObj = model.languages?.find((l: TtsLanguage) => l.value === selectedTTSLanguage)
          if (languageObj && languageObj.gender) {
            const genderOptions = languageObj.gender.map((g: TtsGender) => g.value)
            setAvailableTTSGenders(genderOptions)
            if (!genderOptions.includes(selectedTTSGender) && genderOptions.length > 0) {
              setSelectedTTSGender(genderOptions[0])
            }
          }
        }
      }
    }
  }, [selectedTTSLanguage, selectedTTSModel, selectedTTSProvider, ttsProviders, selectedTTSGender])

  // Effect 4: Update TTS voices when gender changes
  useEffect(() => {
    if (selectedTTSProvider && selectedTTSModel && selectedTTSLanguage && selectedTTSGender && Array.isArray(ttsProviders)) {
      const provider = ttsProviders.find((p: TtsProvider) => p.value === selectedTTSProvider)
      if (provider) {
        const model = provider.models?.find((m: TtsModel) => m.value === selectedTTSModel)
        if (model) {
          const languageObj = model.languages?.find((l: TtsLanguage) => l.value === selectedTTSLanguage)
          if (languageObj) {
            const genderObj = languageObj.gender?.find((g: TtsGender) => g.value === selectedTTSGender)
            if (genderObj && genderObj.voices) {
              setTTSVoices(genderObj.voices)
              if (!genderObj.voices.some((v: any) => v.value === selectedTTSVoice) && genderObj.voices.length > 0) {
                setSelectedTTSVoice(genderObj.voices[0].value)
              }
            }
          }
        }
      }
    }
  }, [selectedTTSGender, selectedTTSLanguage, selectedTTSModel, selectedTTSProvider, ttsProviders, selectedTTSVoice])

  // Update STT models when provider changes
  useEffect(() => {
    if (selectedSTTProvider && Array.isArray(sttModels)) {
      const provider = sttModels.find((p: STTConfig) => p.value === selectedSTTProvider)
      if (provider && provider.models) {
        const modelOptions = provider.models.map((model: STTModel) => ({
          name: model.name,
          value: model.value,
        }))
        setSTTModelsOptions(modelOptions)
        if (modelOptions.length > 0 && !modelOptions.some((m: any) => m.value === selectedSTTModel)) {
          setSelectedSTTModel(modelOptions[0].value)
        }
      }
    }
  }, [selectedSTTProvider, sttModels, selectedSTTModel])

  // Update STT languages when model changes
  useEffect(() => {
    if (selectedSTTProvider && selectedSTTModel && Array.isArray(sttModels)) {
      const provider = sttModels.find((p: STTConfig) => p.value === selectedSTTProvider)
      if (provider) {
        const model = provider.models?.find((m: STTModel) => m.value === selectedSTTModel)
        if (model && model.languages) {
          setSTTLanguages(model.languages)
          if (model.languages.length > 0 && !model.languages.some((l: any) => l.value === selectedSTTLanguage)) {
            setSelectedSTTLanguage(model.languages[0].value)
          }
        }
      }
    }
  }, [selectedSTTModel, selectedSTTProvider, sttModels, selectedSTTLanguage])

  // Type guard to check if this is a conversation node
  const isConversationNode = (node: any): node is any => {
    return node.data.type === 'Conversation'
  }

  // Get the conversation node data safely
  const getConversationData = () => {
    if (isConversationNode(selectedNode)) {
      return selectedNode.data as any
    }
    return null
  }

  const globalData = selectedNode.data.global || {}

  // Get provider options for dropdowns
  const llmProviderOptions = Array.isArray(llmProviders) 
    ? llmProviders.map((provider: LLMProvider) => ({
        name: provider.name,
        value: provider.value,
      }))
    : []

  const ttsProviderOptions = Array.isArray(ttsProviders) 
    ? ttsProviders.map((provider: TtsProvider) => ({
        name: provider.name,
        value: provider.value,
      }))
    : []

  const sttProviderOptions = Array.isArray(sttModels) 
    ? sttModels.map((provider: STTConfig) => ({
        name: provider.name,
        value: provider.value,
      }))
    : []

  // Selection handlers that update configuration data
  const handleLLMProviderChange = useCallback((value: React.SetStateAction<string>) => {
    const newValue = typeof value === 'function' ? value(selectedLLMProvider) : value
    setSelectedLLMProvider(newValue)
    handleConfigFieldChange('llm', 'provider', newValue)
  }, [handleConfigFieldChange, selectedLLMProvider])

  const handleLLMModelChange = useCallback((value: React.SetStateAction<string>) => {
    const newValue = typeof value === 'function' ? value(selectedLLMModel) : value
    setSelectedLLMModel(newValue)
    handleConfigFieldChange('llm', 'model', newValue)
  }, [handleConfigFieldChange, selectedLLMModel])

  const handleTTSProviderChange = useCallback((value: React.SetStateAction<string>) => {
    const newValue = typeof value === 'function' ? value(selectedTTSProvider) : value
    setSelectedTTSProvider(newValue)
    handleConfigFieldChange('tts', 'provider', newValue)
  }, [handleConfigFieldChange, selectedTTSProvider])

  const handleTTSModelChange = useCallback((value: React.SetStateAction<string>) => {
    const newValue = typeof value === 'function' ? value(selectedTTSModel) : value
    setSelectedTTSModel(newValue)
    handleConfigFieldChange('tts', 'model', newValue)
  }, [handleConfigFieldChange, selectedTTSModel])

  const handleTTSLanguageChange = useCallback((value: React.SetStateAction<string>) => {
    const newValue = typeof value === 'function' ? value(selectedTTSLanguage) : value
    setSelectedTTSLanguage(newValue)
    handleConfigFieldChange('tts', 'language', newValue)
  }, [handleConfigFieldChange, selectedTTSLanguage])

  const handleTTSGenderChange = useCallback((value: React.SetStateAction<string>) => {
    const newValue = typeof value === 'function' ? value(selectedTTSGender) : value
    setSelectedTTSGender(newValue)
    handleConfigFieldChange('tts', 'gender', newValue)
  }, [handleConfigFieldChange, selectedTTSGender])

  const handleTTSVoiceChange = useCallback((value: React.SetStateAction<string>) => {
    const newValue = typeof value === 'function' ? value(selectedTTSVoice) : value
    setSelectedTTSVoice(newValue)
    handleConfigFieldChange('tts', 'voice', newValue)
  }, [handleConfigFieldChange, selectedTTSVoice])

  const handleSTTProviderChange = useCallback((value: React.SetStateAction<string>) => {
    const newValue = typeof value === 'function' ? value(selectedSTTProvider) : value
    setSelectedSTTProvider(newValue)
    handleConfigFieldChange('stt', 'provider', newValue)
  }, [handleConfigFieldChange, selectedSTTProvider])

  const handleSTTModelChange = useCallback((value: React.SetStateAction<string>) => {
    const newValue = typeof value === 'function' ? value(selectedSTTModel) : value
    setSelectedSTTModel(newValue)
    handleConfigFieldChange('stt', 'model', newValue)
  }, [handleConfigFieldChange, selectedSTTModel])

  const handleSTTLanguageChange = useCallback((value: React.SetStateAction<string>) => {
    const newValue = typeof value === 'function' ? value(selectedSTTLanguage) : value
    setSelectedSTTLanguage(newValue)
    handleConfigFieldChange('stt', 'language', newValue)
  }, [handleConfigFieldChange, selectedSTTLanguage])

  return (
    <div 
      ref={sidebarRef}
      className="w-120 h-[calc(100vh-4rem)] bg-white border-l border-gray-200 p-4 pt-0 overflow-y-auto rounded-lg shadow-lg scrollbar-hide"
    >
      <div className="mb-4 sticky top-0 pt-2 bg-white z-10 flex items-center justify-between">
        <div className="">  
        <h2 className="text-xl font-bold text-gray-800">Conversation Node Properties</h2>
        <div className="text-sm text-gray-500 rounded-lg mb-2">
          <strong>ID:</strong> {selectedNode.id}
        </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedNode(null)}
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Type Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={selectedNode.data.type || 'Conversation'}
            onChange={(e) => handleNodeFieldChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="Conversation">Conversation</option>
          </select>
        </div>

        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Node Name (Editable)
          </label>
          <input
            type="text"
            value={selectedNode.data.name || ''}
            onChange={(e) => handleNodeFieldChange('name', e.target.value)}
            placeholder="Enter custom node name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Prompt Field - only show for conversation nodes */}
        {isConversationNode(selectedNode) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prompt
            </label>
            <textarea
              value={getConversationData()?.prompt || ''}
              onChange={(e) => handleNodeFieldChange('prompt', e.target.value)}
              placeholder="Enter your prompt here..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>
        )}

        {/* LLM Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            🤖 LLM Configuration
          </h3>
          
          {/* LLM Provider */}
          <div>
            <TooltipLabel label="LLM Provider" fieldKey="llmProvider" />
            <SelectionDropdown
              options={llmProviderOptions}
              selectedOption={selectedLLMProvider}
              setOption={handleLLMProviderChange}
              loading={loading}
            />
          </div>

          {/* LLM Model */}
          <div>
            <TooltipLabel label="LLM Model" fieldKey="llmModel" />
            <SelectionDropdown
              options={llmModels}
              selectedOption={selectedLLMModel}
              setOption={handleLLMModelChange}
              loading={loading}
            />
          </div>
        </div>

        {/* TTS Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            🔊 TTS Configuration
          </h3>
          
          {/* TTS Provider & Model */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <TooltipLabel label="Provider" fieldKey="ttsProvider" />
              <SelectionDropdown
                options={ttsProviderOptions}
                selectedOption={selectedTTSProvider}
                setOption={handleTTSProviderChange}
                loading={loading}
              />
            </div>
            <div>
              <TooltipLabel label="Model" fieldKey="ttsModel" />
              <SelectionDropdown
                options={ttsModels}
                selectedOption={selectedTTSModel}
                setOption={handleTTSModelChange}
                loading={loading}
              />
            </div>
          </div>

          {/* TTS Language & Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <TooltipLabel label="Language" fieldKey="ttsLanguage" />
              <SelectionDropdown
                options={availableTTSLanguages}
                selectedOption={selectedTTSLanguage}
                setOption={handleTTSLanguageChange}
                loading={loading}
              />
            </div>
            <div>
              <TooltipLabel label="Gender" fieldKey="ttsGender" />
              <SelectionDropdown
                options={availableTTSGenders.map(g => ({ name: g, value: g }))}
                selectedOption={selectedTTSGender}
                setOption={handleTTSGenderChange}
                loading={loading}
              />
            </div>
          </div>

          {/* TTS Voice */}
          <div>
            <TooltipLabel label="Voice" fieldKey="ttsVoice" />
            <SelectionDropdown
              options={ttsVoices}
              selectedOption={selectedTTSVoice}
              setOption={handleTTSVoiceChange}
              loading={loading}
            />
          </div>
        </div>

        {/* STT Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            🎙️ STT Configuration
          </h3>
          
          {/* STT Provider & Model */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <TooltipLabel label="Provider" fieldKey="sttProvider" />
              <SelectionDropdown
                options={sttProviderOptions}
                selectedOption={selectedSTTProvider}
                setOption={handleSTTProviderChange}
                loading={loading}
              />
            </div>
            <div>
              <TooltipLabel label="Model" fieldKey="sttModel" />
              <SelectionDropdown
                options={sttModelsOptions}
                selectedOption={selectedSTTModel}
                setOption={handleSTTModelChange}
                loading={loading}
              />
            </div>
          </div>

          {/* STT Language */}
          <div>
            <TooltipLabel label="Language" fieldKey="sttLanguage" />
            <SelectionDropdown
              options={sttLanguages}
              selectedOption={selectedSTTLanguage}
              setOption={handleSTTLanguageChange}
              loading={loading}
            />
          </div>
        </div>

        {/* Variable Extraction Section */}
        <VariableExtractSection
          variables={selectedNode.data.variables || {}}
          onVariablesChange={(variables) => handleNodeFieldChange('variables', variables)}
        />

        {/* Global Node Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Make this node global
          </label>
          <div className="flex items-center space-x-2 mb-3">
            <input
              type="checkbox"
              id="globalNodeToggle"
              checked={globalData.isGlobal || false}
              onChange={(e) => handleGlobalFieldChange('isGlobal', e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="globalNodeToggle" className="text-sm text-gray-600">
              Enable global node functionality
            </label>
          </div>

          {/* Global Node Options - shown only when toggle is true */}
          {globalData.isGlobal && (
            <div className="space-y-4 pl-6 border-l-2 border-indigo-200">
              {/* Global Node Pathway Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Global Node Pathway Condition
                </label>
                <textarea
                  value={globalData.pathwayCondition || ''}
                  onChange={(e) => handleGlobalFieldChange('pathwayCondition', e.target.value)}
                  placeholder="Enter the condition for this global node pathway..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Global Node Pathway Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Global Node Pathway Description
                </label>
                <textarea
                  value={globalData.pathwayDescription || ''}
                  onChange={(e) => handleGlobalFieldChange('pathwayDescription', e.target.value)}
                  placeholder="Describe the purpose and behavior of this global node pathway..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Automatically Go Back to Previous Node Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Automatically Go Back to Previous Node
                </label>
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="checkbox"
                    id="autoGoBackToggle"
                    checked={globalData.autoGoBackToPrevious !== false} // Default to true
                    onChange={(e) => handleGlobalFieldChange('autoGoBackToPrevious', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="autoGoBackToggle" className="text-sm text-gray-600">
                    Automatically return to previous node after this global node
                  </label>
                </div>

                {/* Create Pathway Label to Previous Node - only shown when autoGoBackToPrevious is false */}
                {!globalData.autoGoBackToPrevious && (
                  <div className="ml-6 space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="createPathwayLabelToggle"
                        checked={globalData.createPathwayLabelToPrevious || false}
                        onChange={(e) => handleGlobalFieldChange('createPathwayLabelToPrevious', e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="createPathwayLabelToggle" className="text-sm text-gray-600">
                        Create Pathway Label to Previous Node
                      </label>
                    </div>

                    {/* Previous Node Pathway Options - shown only when createPathwayLabelToPrevious is true */}
                    {globalData.createPathwayLabelToPrevious && (
                      <div className="space-y-3 pl-4 border-l border-indigo-100">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Previous Node Pathway Label
                          </label>
                          <textarea
                            value={globalData.previousNodePathwayLabel || ''}
                            onChange={(e) => handleGlobalFieldChange('previousNodePathwayLabel', e.target.value)}
                            placeholder="Condition to path to the previous node, before coming to this global node..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent  text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Previous Node Pathway Description
                          </label>
                          <textarea
                            value={globalData.previousNodePathwayDescription || ''}
                            onChange={(e) => handleGlobalFieldChange('previousNodePathwayDescription', e.target.value)}
                            placeholder="Additional Description for when to choose this pathway..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent  text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Redirect to another node Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Redirect to another node
                </label>
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="checkbox"
                    id="redirectToNodeToggle"
                    checked={globalData.redirectToNode || false}
                    onChange={(e) => handleGlobalFieldChange('redirectToNode', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="redirectToNodeToggle" className="text-sm text-gray-600">
                    Redirect to a specific node after this global node
                  </label>
                </div>

                {/* Node Selection Dropdown - shown only when redirectToNode is true */}
                {globalData.redirectToNode && (
                  <div className="ml-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Target Node
                    </label>
                    <select
                      value={globalData.redirectTargetNodeId || ''}
                      onChange={(e) => handleGlobalFieldChange('redirectTargetNodeId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select a node...</option>
                      {nodes
                        .filter(node => node.id !== selectedNode.id) // Exclude current node
                        .map(node => (
                          <option key={node.id} value={node.id}>
                            {node.data.name || `Node ${node.id}`}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Additional Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Position
          </label>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div>X: {Math.round(selectedNode.position.x)}</div>
            <div>Y: {Math.round(selectedNode.position.y)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationNodeSidebar; 