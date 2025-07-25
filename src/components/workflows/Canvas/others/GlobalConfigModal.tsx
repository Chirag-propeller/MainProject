'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useWorkflowStore } from '@/store/workflowStore'
import useLLMConfig from '@/hooks/useLLMConfig'
import SelectionDropdown from '@/components/agents/SelectionDropdown'
import TooltipLabel from '@/components/ui/tooltip'
import { Bot, Users, Mic, Settings } from 'lucide-react'
import { MdKeyboardArrowDown } from 'react-icons/md'

interface GlobalConfigModalProps {
  isOpen: boolean
  onClose: () => void
}

// Move CollapsibleSection outside to prevent re-creation on every render
const CollapsibleSection = ({ 
  title, 
  icon: Icon, 
  isOpen, 
  onToggle, 
  children,
  iconClassname = "text-gray-600"
}: { 
  title: string; 
  icon: any; 
  isOpen: boolean; 
  onToggle: () => void; 
  children: React.ReactNode;
  iconClassname?: string;
}) => (
  <div className="border border-gray-200 rounded-[6px] bg-white hover:border-gray-300 mb-1 shadow-sm dark:bg-gray-900 dark:border-gray-700">
    <header
      className="cursor-pointer bg-white border-b-background px-2 py-1 rounded-[6px] dark:bg-gray-900"
      onClick={onToggle}
    >
      <div className="flex justify-between items-center m-2 rounded-[6px]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-100 rounded-[6px] dark:bg-gray-800 flex items-center justify-center">
            <Icon className={`w-4 h-4 ${iconClassname}`} />
          </div>
          <div className="ml-1.5 flex flex-col">
            <h3 className="text-[14px] text-gray-900 dark:text-indigo-300 font-semibold">
              {title}
            </h3>
          </div>
        </div>
        <MdKeyboardArrowDown
          className={`w-6 h-6 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          style={{ fill: "gray" }}
        />
      </div>
    </header>
    {isOpen && (
      <>
        <hr className="border-t border-gray-200 my-0 dark:border-gray-700" />
        <div className="px-4 py-2 flex flex-col gap-2">{children}</div>
      </>
    )}
  </div>
)

const GlobalConfigModal: React.FC<GlobalConfigModalProps> = ({ isOpen, onClose }) => {
  const { config, setConfig } = useWorkflowStore()
  const { llmProviders, ttsOptions, sttModels, loading } = useLLMConfig()
  const ttsProviders = (ttsOptions as any) as any[]

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    llm: true,
    tts: true,
    stt: true,
    other: true
  })

  // LLM state
  const [selectedLLMProvider, setSelectedLLMProvider] = useState(config.llm?.provider || '')
  const [selectedLLMModel, setSelectedLLMModel] = useState(config.llm?.model || '')
  const [llmModels, setLLMModels] = useState<{ name: string; value: string }[]>([])

  // TTS state
  const [selectedTTSProvider, setSelectedTTSProvider] = useState(config.tts?.provider || '')
  const [selectedTTSModel, setSelectedTTSModel] = useState(config.tts?.model || '')
  const [ttsModels, setTTSModels] = useState<{ name: string; value: string }[]>([])
  const [availableTTSLanguages, setAvailableTTSLanguages] = useState<{ name: string; value: string }[]>([])
  const [selectedTTSLanguage, setSelectedTTSLanguage] = useState(config.tts?.language || '')
  const [availableTTSGenders, setAvailableTTSGenders] = useState<string[]>([])
  const [selectedTTSGender, setSelectedTTSGender] = useState(config.tts?.gender || '')
  const [ttsVoices, setTTSVoices] = useState<{ name: string; value: string }[]>([])
  const [selectedTTSVoice, setSelectedTTSVoice] = useState(config.tts?.voice || '')

  // STT state
  const [selectedSTTProvider, setSelectedSTTProvider] = useState(config.stt?.provider || '')
  const [selectedSTTModel, setSelectedSTTModel] = useState(config.stt?.model || '')
  const [sttModelsOptions, setSTTModelsOptions] = useState<{ name: string; value: string }[]>([])
  const [sttLanguages, setSTTLanguages] = useState<{ name: string; value: string }[]>([])
  const [selectedSTTLanguage, setSelectedSTTLanguage] = useState(config.stt?.language || '')

  // Other settings state
  const [maxCallDuration, setMaxCallDuration] = useState(config.other?.maxCallDuration || 1200)
  const [userAwayTimeout, setUserAwayTimeout] = useState(config.other?.userAwayTimeout || 5)
  const [backgroundAudio, setBackgroundAudio] = useState(config.other?.backgroundAudio || false)

  // Sync config to state when config changes
  useEffect(() => {
    setSelectedLLMProvider(config.llm?.provider || '')
    setSelectedLLMModel(config.llm?.model || '')
    setSelectedTTSProvider(config.tts?.provider || '')
    setSelectedTTSModel(config.tts?.model || '')
    setSelectedTTSLanguage(config.tts?.language || '')
    setSelectedTTSGender(config.tts?.gender || '')
    setSelectedTTSVoice(config.tts?.voice || '')
    setSelectedSTTProvider(config.stt?.provider || '')
    setSelectedSTTModel(config.stt?.model || '')
    setSelectedSTTLanguage(config.stt?.language || '')
  }, [config])

  // Initialize other settings only when modal opens (no continuous sync to avoid input focus loss)
  useEffect(() => {
    if (isOpen) {
      setMaxCallDuration(config.other?.maxCallDuration || 1200)
      setUserAwayTimeout(config.other?.userAwayTimeout || 5)
      setBackgroundAudio(config.other?.backgroundAudio || false)
    }
  }, [isOpen])

  // LLM models update
  useEffect(() => {
    if (selectedLLMProvider && Array.isArray(llmProviders)) {
      const provider = llmProviders.find((p: any) => p.value === selectedLLMProvider)
      if (provider && provider.models) {
        const modelOptions = provider.models.map((model: any) => ({ name: model.name, value: model.value }))
        setLLMModels(modelOptions)
        if (!modelOptions.some((m: any) => m.value === selectedLLMModel) && modelOptions.length > 0) {
          setSelectedLLMModel(modelOptions[0].value)
        }
      }
    }
  }, [selectedLLMProvider, llmProviders, selectedLLMModel])

  // TTS models update
  useEffect(() => {
    if (selectedTTSProvider && Array.isArray(ttsProviders)) {
      const provider = ttsProviders.find((p: any) => p.value === selectedTTSProvider)
      if (provider && provider.models) {
        const modelOptions = provider.models.map((model: any) => ({ name: model.name, value: model.value }))
        setTTSModels(modelOptions)
        if (!modelOptions.some((m: any) => m.value === selectedTTSModel) && modelOptions.length > 0) {
          setSelectedTTSModel(modelOptions[0].value)
        }
      }
    }
  }, [selectedTTSProvider, ttsProviders, selectedTTSModel])

  useEffect(() => {
    if (selectedTTSProvider && selectedTTSModel && Array.isArray(ttsProviders)) {
      const provider = ttsProviders.find((p: any) => p.value === selectedTTSProvider)
      if (provider) {
        const model = provider.models?.find((m: any) => m.value === selectedTTSModel)
        if (model && model.languages) {
          const languageOptions = model.languages.map((lang: any) => ({ name: lang.name, value: lang.value }))
          setAvailableTTSLanguages(languageOptions)
          if (!languageOptions.some((l: any) => l.value === selectedTTSLanguage) && languageOptions.length > 0) {
            setSelectedTTSLanguage(languageOptions[0].value)
          }
        }
      }
    }
  }, [selectedTTSModel, selectedTTSProvider, ttsProviders, selectedTTSLanguage])

  useEffect(() => {
    if (selectedTTSProvider && selectedTTSModel && selectedTTSLanguage && Array.isArray(ttsProviders)) {
      const provider = ttsProviders.find((p: any) => p.value === selectedTTSProvider)
      if (provider) {
        const model = provider.models?.find((m: any) => m.value === selectedTTSModel)
        if (model) {
          const languageObj = model.languages?.find((l: any) => l.value === selectedTTSLanguage)
          if (languageObj && languageObj.gender) {
            const genderOptions = languageObj.gender.map((g: any) => g.value)
            setAvailableTTSGenders(genderOptions)
            if (!genderOptions.includes(selectedTTSGender) && genderOptions.length > 0) {
              setSelectedTTSGender(genderOptions[0])
            }
          }
        }
      }
    }
  }, [selectedTTSLanguage, selectedTTSModel, selectedTTSProvider, ttsProviders, selectedTTSGender])

  useEffect(() => {
    if (selectedTTSProvider && selectedTTSModel && selectedTTSLanguage && selectedTTSGender && Array.isArray(ttsProviders)) {
      const provider = ttsProviders.find((p: any) => p.value === selectedTTSProvider)
      if (provider) {
        const model = provider.models?.find((m: any) => m.value === selectedTTSModel)
        if (model) {
          const languageObj = model.languages?.find((l: any) => l.value === selectedTTSLanguage)
          if (languageObj) {
            const genderObj = languageObj.gender?.find((g: any) => g.value === selectedTTSGender)
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

  // STT models update
  useEffect(() => {
    if (selectedSTTProvider && Array.isArray(sttModels)) {
      const provider = sttModels.find((p: any) => p.value === selectedSTTProvider)
      if (provider && provider.models) {
        const modelOptions = provider.models.map((model: any) => ({ name: model.name, value: model.value }))
        setSTTModelsOptions(modelOptions)
        if (modelOptions.length > 0 && !modelOptions.some((m: any) => m.value === selectedSTTModel)) {
          setSelectedSTTModel(modelOptions[0].value)
        }
      }
    }
  }, [selectedSTTProvider, sttModels, selectedSTTModel])

  useEffect(() => {
    if (selectedSTTProvider && selectedSTTModel && Array.isArray(sttModels)) {
      const provider = sttModels.find((p: any) => p.value === selectedSTTProvider)
      if (provider) {
        const model = provider.models?.find((m: any) => m.value === selectedSTTModel)
        if (model && model.languages) {
          setSTTLanguages(model.languages)
          if (model.languages.length > 0 && !model.languages.some((l: any) => l.value === selectedSTTLanguage)) {
            setSelectedSTTLanguage(model.languages[0].value)
          }
        }
      }
    }
  }, [selectedSTTModel, selectedSTTProvider, sttModels, selectedSTTLanguage])

  // Provider options
  const llmProviderOptions = Array.isArray(llmProviders)
    ? llmProviders.map((provider: any) => ({ name: provider.name, value: provider.value }))
    : []
  const ttsProviderOptions = Array.isArray(ttsProviders)
    ? ttsProviders.map((provider: any) => ({ name: provider.name, value: provider.value }))
    : []
  const sttProviderOptions = Array.isArray(sttModels)
    ? sttModels.map((provider: any) => ({ name: provider.name, value: provider.value }))
    : []

  // Save config handler
  const handleSaveConfig = () => {
    setConfig({
      llm: {
        provider: selectedLLMProvider,
        model: selectedLLMModel,
      },
      tts: {
        provider: selectedTTSProvider,
        model: selectedTTSModel,
        language: selectedTTSLanguage,
        gender: selectedTTSGender,
        voice: selectedTTSVoice,
      },
      stt: {
        provider: selectedSTTProvider,
        model: selectedSTTModel,
        language: selectedSTTLanguage,
      },
      other: {
        maxCallDuration,
        userAwayTimeout,
        backgroundAudio,
      },
    })
    onClose()
  }

  // Toggle section expansion
  const toggleSection = (section: 'llm' | 'tts' | 'stt' | 'other') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }



  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-500/30 flex items-center justify-center z-[60]">
      <Card className="w-full max-w-2xl mx-4 relative max-h-[90vh]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Global Configuration</h3>
            <div className="flex items-center gap-2">
              <Button onClick={handleSaveConfig} size="sm">
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-1 h-8 w-8"
              >
                <span className="text-xl">×</span>
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Set workflow-level LLM, TTS, and STT configuration. These settings apply to all nodes unless overridden.
          </p>
        </CardHeader>
        <CardContent className="space-y-2 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Model Config */}
          <CollapsibleSection
            title="Model"
            icon={Bot}
            isOpen={expandedSections.llm}
            onToggle={() => toggleSection('llm')}
            iconClassname="text-blue-600"
          >
            <div className="grid grid-cols-2 gap-2">
              <div>
                <TooltipLabel label="Provider" fieldKey="llmProvider" />
                <SelectionDropdown
                  options={llmProviderOptions}
                  selectedOption={selectedLLMProvider}
                  setOption={setSelectedLLMProvider}
                  loading={loading}
                />
              </div>
              <div>
                <TooltipLabel label="Model" fieldKey="llmModel" />
                <SelectionDropdown
                  options={llmModels}
                  selectedOption={selectedLLMModel}
                  setOption={setSelectedLLMModel}
                  loading={loading}
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Voice Config */}
          <CollapsibleSection
            title="Voice"
            icon={Users}
            isOpen={expandedSections.tts}
            onToggle={() => toggleSection('tts')}
            iconClassname="text-green-600"
          >
            <div className="grid grid-cols-2 gap-2">
              <div>
                <TooltipLabel label="Provider" fieldKey="ttsProvider" />
                <SelectionDropdown
                  options={ttsProviderOptions}
                  selectedOption={selectedTTSProvider}
                  setOption={setSelectedTTSProvider}
                  loading={loading}
                />
              </div>
              <div>
                <TooltipLabel label="Model" fieldKey="ttsModel" />
                <SelectionDropdown
                  options={ttsModels}
                  selectedOption={selectedTTSModel}
                  setOption={setSelectedTTSModel}
                  loading={loading}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <TooltipLabel label="Language" fieldKey="ttsLanguage" />
                <SelectionDropdown
                  options={availableTTSLanguages}
                  selectedOption={selectedTTSLanguage}
                  setOption={setSelectedTTSLanguage}
                  loading={loading}
                />
              </div>
              <div>
                <TooltipLabel label="Gender" fieldKey="ttsGender" />
                <SelectionDropdown
                  options={availableTTSGenders.map(g => ({ name: g, value: g }))}
                  selectedOption={selectedTTSGender}
                  setOption={setSelectedTTSGender}
                  loading={loading}
                />
              </div>
            </div>
            <TooltipLabel label="Voice" fieldKey="ttsVoice" />
            <SelectionDropdown
              options={ttsVoices}
              selectedOption={selectedTTSVoice}
              setOption={setSelectedTTSVoice}
              loading={loading}
            />
          </CollapsibleSection>

          {/* Transcriber Config */}
          <CollapsibleSection
            title="Transcriber"
            icon={Mic}
            isOpen={expandedSections.stt}
            onToggle={() => toggleSection('stt')}
            iconClassname="text-purple-600"
          >
            <div className="grid grid-cols-2 gap-2">
              <div>
                <TooltipLabel label="Provider" fieldKey="sttProvider" />
                <SelectionDropdown
                  options={sttProviderOptions}
                  selectedOption={selectedSTTProvider}
                  setOption={setSelectedSTTProvider}
                  loading={loading}
                />
              </div>
              <div>
                <TooltipLabel label="Model" fieldKey="sttModel" />
                <SelectionDropdown
                  options={sttModelsOptions}
                  selectedOption={selectedSTTModel}
                  setOption={setSelectedSTTModel}
                  loading={loading}
                />
              </div>
            </div>
            <TooltipLabel label="Language" fieldKey="sttLanguage" />
            <SelectionDropdown
              options={sttLanguages}
              selectedOption={selectedSTTLanguage}
              setOption={setSelectedSTTLanguage}
              loading={loading}
            />
          </CollapsibleSection>

          {/* Other Settings Config */}
          <CollapsibleSection
            title="Other Settings"
            icon={Settings}
            isOpen={expandedSections.other}
            onToggle={() => toggleSection('other')}
            iconClassname="text-orange-600"
          >
            {/* Call Duration */}
            <div className="space-y-4">
              <div>
                <TooltipLabel 
                  label="Maximum Call Duration (seconds)" 
                  fieldKey="MaxCallDuration" 
                  className="font-semibold"
                />
                <input
                  type="number"
                  min="20"
                  max="3600"
                  value={maxCallDuration}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value)) {
                      setMaxCallDuration(value);
                    }
                  }}
                  className="w-full max-w-xs p-2 rounded-[6px] border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm"
                />
                <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                  Default: 1200 seconds (20 minutes)
                </p>
              </div>

              {/* User Away Timeout */}
              <div>
                <TooltipLabel 
                  label="User Away Timeout (seconds)" 
                  fieldKey="UserAwayTimeout" 
                  className="font-semibold"
                />
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={userAwayTimeout}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value)) {
                      setUserAwayTimeout(value);
                    }
                  }}
                  className="w-full max-w-xs p-2 rounded-[6px] border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm"
                />
                <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                  Default: 5 seconds
                </p>
              </div>

              {/* Background Audio */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Background Audio
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-300">
                    Enable background audio during calls
                  </p>
                </div>
                <div
                  className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${
                    backgroundAudio ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"
                  }`}
                  onClick={() => setBackgroundAudio(!backgroundAudio)}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-900 transition-transform ${
                      backgroundAudio ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </div>
              </div>
            </div>
          </CollapsibleSection>
        </CardContent>
      </Card>
    </div>
  )
}

export default GlobalConfigModal 