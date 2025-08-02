import React, { useState, useEffect, useRef } from 'react'
import { useWorkflowStore } from '@/store/workflowStore'
import { Api } from '@/components/apiTool/types'
import { Button } from '@/components/ui/button'
import Toggle from '@/components/ui/toggle'
import { Plus, Trash2, X, ChevronDown, ChevronRight } from 'lucide-react'
import VariableExtractSection from './VariableExtractSection'
import TestApiModal from './TestApiModal'

// Helper functions for converting between array and object formats
const headersObjToArray = (headers: Record<string, string> | undefined): Array<{ id: number; key: string; value: string }> => {
  if (!headers) return [];
  return Object.entries(headers).map(([key, value], index) => ({
    id: index,
    key,
    value,
  }));
};

const headersArrayToObj = (headers: Array<{ id: number; key: string; value: string }>): Record<string, string> => {
  return headers.reduce((acc, header) => {
    if (header.key.trim()) {
      acc[header.key] = header.value;
    }
    return acc;
  }, {} as Record<string, string>);
};

const paramsApiToArray = (params: Api["params"] | undefined): Array<{ id: number; name: string; type: string; required: boolean; description: string }> =>
  params
    ? params.map((p, idx) => ({
        id: idx,
        name: p.name,
        type: p.type,
        required: Boolean(p.required),
        description: p.description || "",
      }))
    : [];

const paramsArrayToApi = (params: Array<{ id: number; name: string; type: string; required: boolean; description: string }>): Api["params"] =>
  params.map((p) => ({
    name: p.name,
    type: p.type,
    required: p.required,
    description: p.description,
  }));

const ApiRequestNodeSidebar: React.FC = () => {
  const { selectedNode, updateNodeGlobal, updateNode, nodes, setSelectedNode } = useWorkflowStore()
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Local state for form fields
  const [apiName, setApiName] = useState("")
  const [description, setDescription] = useState("")
  const [endpoint, setEndpoint] = useState("")
  const [method, setMethod] = useState<Api["method"]>("GET")
  const [headers, setHeaders] = useState<Array<{ id: number; key: string; value: string }>>([])
  const [urlParams, setUrlParams] = useState<Array<{ id: number; key: string; value: string }>>([])
  const [params, setParams] = useState<Array<{ id: number; name: string; type: string; required: boolean; description: string }>>([])
  const [response, setResponse] = useState({})
  const [variableToExtract, setVariableToExtract] = useState("")
  const [promptToExtractVariable, setPromptToExtractVariable] = useState("")
  const [preFetchRequired, setPreFetchRequired] = useState(false)
  const [isTestModalOpen, setIsTestModalOpen] = useState(false)
  const [isAudioCollapsed, setIsAudioCollapsed] = useState(true)

  if (!selectedNode) {
    return null
  }

  const handleGlobalFieldChange = (field: string, value: string | boolean) => {
    updateNodeGlobal(selectedNode.id, { [field]: value })
  }

  const handleNodeFieldChange = (field: string, value: any) => {
    updateNode(selectedNode.id, { [field]: value })
  }

  // Type guard to check if this is an API node
  const isApiNode = (node: any): node is any => {
    return node.data.type === 'API'
  }

  // Get the API node data safely
  const getApiData = () => {
    if (isApiNode(selectedNode)) {
      return selectedNode.data as any
    }
    return null
  }

  // Update local state when selectedNode changes
  useEffect(() => {
    if (selectedNode && isApiNode(selectedNode)) {
      const apiData = selectedNode.data as any;
      setApiName(apiData.name || "")
      setDescription(apiData.description || "")
      setEndpoint(apiData.endpoint || "")
      setMethod(apiData.method || "GET")
      setHeaders(headersObjToArray(apiData.headers))
      setUrlParams(headersObjToArray(apiData.urlParams))
      setParams(paramsApiToArray(apiData.params))
      setResponse(apiData.response || {})
      setVariableToExtract(apiData.variableToExtract || "")
      setPromptToExtractVariable(apiData.promptToExtractVariable || "")
      setPreFetchRequired(apiData.preFetchRequired || false)
    }
  }, [selectedNode?.id]) // Only trigger when node ID changes, not the entire node object

  // Auto-save changes
  useEffect(() => {
    if (selectedNode && isApiNode(selectedNode)) {
      const timeout = setTimeout(() => {
        updateNode(selectedNode.id, {
          name: apiName,
          description,
          endpoint,
          method,
          headers: headersArrayToObj(headers),
          urlParams: headersArrayToObj(urlParams),
          params: paramsArrayToApi(params),
          response,
          variableToExtract,
          promptToExtractVariable,
          preFetchRequired
        })
      }, 500) // Increased timeout to prevent rapid updates

      return () => clearTimeout(timeout)
    }
  }, [apiName, description, endpoint, method, headers, urlParams, params, response, variableToExtract, promptToExtractVariable, preFetchRequired, selectedNode])



  // Header management functions
  const addHeader = () => {
    const newId = Date.now();
    setHeaders((prev) => [
      { id: newId, key: "", value: "" },
      ...prev,
    ]);
  };

  const updateHeader = (id: number, field: "key" | "value", val: string) => {
    setHeaders((prev) =>
      prev.map((h) => (h.id === id ? { ...h, [field]: val } : h))
    );
  };

  const deleteHeader = (id: number) => {
    setHeaders((prev) => prev.filter((h) => h.id !== id));
  };

  // URL Parameters functions
  const addUrlParam = () => {
    setUrlParams((prev) => [
      { id: Date.now(), key: "", value: "" },
      ...prev,
    ]);
  };

  const updateUrlParam = (id: number, field: "key" | "value", val: string) => {
    setUrlParams((prev) =>
      prev.map((h) => (h.id === id ? { ...h, [field]: val } : h))
    );
  };

  const deleteUrlParam = (id: number) => {
    setUrlParams((prev) => prev.filter((h) => h.id !== id));
  };

  // Params functions
  const addParam = () => {
    setParams((prev) => [
      {
        id: Date.now(),
        name: "",
        type: "string",
        required: false,
        description: "",
      },
      ...prev,
    ]);
  };

  const updateParam = (id: number, field: string, val: string | boolean) => {
    setParams((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  const deleteParam = (id: number) => {
    setParams((prev) => prev.filter((p) => p.id !== id));
  };

  const globalData = selectedNode.data.global || {}

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

  return (
    <div 
      ref={sidebarRef}
      className="w-120 h-[calc(100vh-4rem)] bg-white border-l border-gray-200 p-4 pt-0 overflow-y-auto rounded-lg shadow-lg scrollbar-hide"
    >
      <div className="mb-4 sticky top-0 pt-2 bg-white z-10 flex items-center justify-between">
        <div className="">  
        <h2 className="text-xl font-bold text-gray-800">API Request Node Properties</h2>
        <div className="text-sm text-gray-500 rounded-lg mb-2">
          <strong>ID:</strong> {selectedNode.id}
        </div>
        
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs items-center justify-center border border-indigo-500 rounded-lg"
            onClick={() => setIsTestModalOpen(true)}
          >
            Test API
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedNode(null)}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        {/* <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded-lg mb-2">
          <strong>Note:</strong> This node will make an API request with full configuration
        </div> */}
      </div>

      <div className="space-y-4">
        {/* Basic Configuration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Name
          </label>
          <input
            type="text"
            value={apiName}
            onChange={(e) => setApiName(e.target.value)}
            placeholder="Enter API name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter API description"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Pre-fetch Required Toggle - Prominent Placement */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-orange-800 mb-1">
                Pre-fetch Required
              </label>
              <p className="text-xs text-orange-600">
                Enable this if the API needs to be called before the main workflow execution
              </p>
            </div>
            <div className="ml-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preFetchRequired}
                  onChange={(e) => setPreFetchRequired(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
          {preFetchRequired && (
            <div className="mt-3 p-2 bg-orange-100 border border-orange-300 rounded text-xs text-orange-700">
              <strong>⚠️ Note:</strong> This API will be executed before the main workflow begins.
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Endpoint URL
          </label>
          <input
            type="url"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="https://api.example.com/endpoint"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            HTTP Method
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as Api["method"])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
        </div>

        {/* Headers Configuration */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Headers
            </label>
            <Button
              size="sm"
              onClick={addHeader}
              className="text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Header
            </Button>
          </div>
          <div className="space-y-2">
            {headers.map((header) => (
              <div key={header.id} className="flex gap-2">
                <input
                  type="text"
                  value={header.key}
                  onChange={(e) => updateHeader(header.id, "key", e.target.value)}
                  placeholder="Header name"
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  value={header.value}
                  onChange={(e) => updateHeader(header.id, "value", e.target.value)}
                  placeholder="Header value"
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteHeader(header.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* URL Parameters Configuration */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              URL Parameters
            </label>
            <Button
              size="sm"
              onClick={addUrlParam}
              className="text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Param
            </Button>
          </div>
          <div className="space-y-2">
            {urlParams.map((param) => (
              <div key={param.id} className="flex gap-2">
                <input
                  type="text"
                  value={param.key}
                  onChange={(e) => updateUrlParam(param.id, "key", e.target.value)}
                  placeholder="Parameter name"
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  value={param.value}
                  onChange={(e) => updateUrlParam(param.id, "value", e.target.value)}
                  placeholder="Parameter value"
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteUrlParam(param.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Request Parameters Configuration */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Request Parameters
            </label>
            <Button
              size="sm"
              onClick={addParam}
              className="text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Param
            </Button>
          </div>
          <div className="space-y-2">
            {params.map((param) => (
              <div key={param.id} className="border border-gray-200 rounded p-2 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={param.name}
                    onChange={(e) => updateParam(param.id, "name", e.target.value)}
                    placeholder="Parameter name"
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <select
                    value={param.type}
                    onChange={(e) => updateParam(param.id, "type", e.target.value)}
                    className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="object">Object</option>
                    <option value="array">Array</option>
                  </select>
                  <label className="flex items-center text-xs">
                    <input
                      type="checkbox"
                      checked={param.required}
                      onChange={(e) => updateParam(param.id, "required", e.target.checked)}
                      className="mr-1"
                    />
                    Required
                  </label>
                </div>
                <input
                  type="text"
                  value={param.description}
                  onChange={(e) => updateParam(param.id, "description", e.target.value)}
                  placeholder="Parameter description"
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteParam(param.id)}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Response Configuration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expected Response Schema
          </label>
          <textarea
            value={typeof response === 'string' ? response : JSON.stringify(response, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                setResponse(parsed);
              } catch {
                setResponse(e.target.value);
              }
            }}
            placeholder="Enter expected response schema (JSON)"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-xs"
          />
        </div>

        {/* General Prompt Configuration */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="mb-3">
            <label className="block text-sm font-semibold text-blue-800 mb-1">
              General Prompt
            </label>
            <p className="text-xs text-blue-600 mb-2">
              This prompt will be sent to the LLM along with the API response to generate the final answer for the user. Use this to instruct the LLM on how to process and present the API data.
            </p>
          </div>
          <textarea
            value={selectedNode.data.prompt || ''}
            onChange={(e) => handleNodeFieldChange('prompt', e.target.value)}
            // placeholder="Enter your custom prompt here. You can use variables like {'{{variable_name}}'} to reference dynamic values..."
            rows={4}
            className="w-full px-1 py-0 text-sm border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
          {/* <div className="mt-2 text-xs text-blue-600">
            <strong>Tip:</strong> Use {'{{variable_name}}'} syntax to reference variables from previous nodes or extracted data.
          </div> */}
        </div>

        {/* Variable Extraction Configuration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Variables to Extract
          </label>
          <input
            type="text"
            value={variableToExtract}
            onChange={(e) => setVariableToExtract(e.target.value)}
            placeholder="e.g., user_id|email|phone"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Separate multiple variables with |</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prompt to Extract Variables
          </label>
          <textarea
            value={promptToExtractVariable}
            onChange={(e) => setPromptToExtractVariable(e.target.value)}
            placeholder="Enter prompt for variable extraction"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>



        {/* Other Settings */}
        <div className="space-y-4">
          <button
            onClick={() => setIsAudioCollapsed(!isAudioCollapsed)}
            className="flex items-center justify-between w-full text-left text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 hover:bg-gray-50 rounded-t-lg px-2 py-1 transition-colors"
          >
            <span>⚙️ Other Settings</span>
            {isAudioCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {!isAudioCollapsed && (
            <div className="space-y-4 pl-2">
              {/* Filler Phrases Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filler Phrases
                </label>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600 mb-2">
                    Add phrases that will be used as filler words during conversation
                  </div>
                  
                  {/* Filler Phrases List */}
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {(selectedNode.data.fillerPhrases || []).map((phrase: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <input
                          type="text"
                          value={phrase}
                          onChange={(e) => {
                            const updatedPhrases = [...(selectedNode.data.fillerPhrases || [])]
                            updatedPhrases[index] = e.target.value
                            handleNodeFieldChange('fillerPhrases', updatedPhrases)
                            // Auto-update fillerWords based on whether there are phrases
                            const hasValidPhrases = useWorkflowStore.getState().checkFillerWords(updatedPhrases)
                            handleNodeFieldChange('fillerWords', hasValidPhrases)
                          }}
                          placeholder="Enter filler phrase..."
                          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                          onClick={() => {
                            const updatedPhrases = (selectedNode.data.fillerPhrases || []).filter((_: string, i: number) => i !== index)
                            handleNodeFieldChange('fillerPhrases', updatedPhrases)
                            // Auto-update fillerWords based on whether there are phrases
                            const hasValidPhrases = useWorkflowStore.getState().checkFillerWords(updatedPhrases)
                            handleNodeFieldChange('fillerWords', hasValidPhrases)
                          }}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Remove phrase"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Add New Phrase Button */}
                  <Button
                    onClick={() => {
                      const currentPhrases = selectedNode.data.fillerPhrases || []
                      handleNodeFieldChange('fillerPhrases', [...currentPhrases, ''])
                      // Don't auto-enable fillerWords when adding empty phrase
                      // It will be enabled when user actually types something
                    }}
                    variant="secondary"
                    size="sm"
                    className="w-full flex items-center justify-center gap-2 text-sm border border-gray-300"
                  >
                    <Plus className="w-4 h-4" />
                    Add Filler Phrase
                  </Button>
                </div>
              </div>

              {/* Background Audio Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Audio
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Enable background audio during conversation
                  </span>
                  <Toggle
                    checked={selectedNode.data.backgroundAudio || false}
                    onChange={(checked) => handleNodeFieldChange('backgroundAudio', checked)}
                    size="small"
                  />
                </div>
              </div>
            </div>
          )}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent  text-sm"
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

      {/* Test API Modal */}
      <TestApiModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        apiData={{
          name: apiName,
          endpoint,
          method,
          headers: headersArrayToObj(headers),
          urlParams: headersArrayToObj(urlParams),
          params: paramsArrayToApi(params)
        }}
      />
    </div>
  );
};

export default ApiRequestNodeSidebar; 