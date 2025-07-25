import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Play, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { Api } from '@/components/apiTool/types'

interface TestApiModalProps {
  isOpen: boolean
  onClose: () => void
  apiData: {
    name: string
    endpoint: string
    method: Api["method"]
    headers: Record<string, string>
    urlParams: Record<string, string>
    params: Api["params"]
  }
}

interface TestValues {
  urlParams: Record<string, string>
  requestParams: Record<string, any>
  headers: Record<string, string>
}

const TestApiModal: React.FC<TestApiModalProps> = ({ isOpen, onClose, apiData }) => {
  const [testValues, setTestValues] = useState<TestValues>({
    urlParams: {},
    requestParams: {},
    headers: { ...apiData.headers }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<{
    success: boolean
    status: number
    data: any
    error?: string
  } | null>(null)

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTestValues({
        urlParams: {},
        requestParams: {},
        headers: { ...apiData.headers }
      })
      setTestResult(null)
    }
  }, [isOpen]) // Removed apiData dependency to prevent unnecessary resets

  const updateTestValue = (type: keyof TestValues, key: string, value: string) => {
    setTestValues(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: value
      }
    }))
  }

  const buildUrl = () => {
    let url = apiData.endpoint
    
    // Add URL parameters
    const urlParams = Object.entries(testValues.urlParams)
      .filter(([_, value]) => value.trim() !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')
    
    if (urlParams) {
      url += (url.includes('?') ? '&' : '?') + urlParams
    }
    
    return url
  }

  const testApi = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      const url = buildUrl()
      const headers = { ...testValues.headers }
      
      // Remove empty headers
      Object.keys(headers).forEach(key => {
        if (!headers[key] || headers[key].trim() === '') {
          delete headers[key]
        }
      })

      const requestBody = apiData.method !== 'GET' ? testValues.requestParams : undefined

      const response = await fetch(url, {
        method: apiData.method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: requestBody ? JSON.stringify(requestBody) : undefined
      })

      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        // If response is not JSON, get as text
        data = await response.text()
      }

      setTestResult({
        success: response.ok,
        status: response.status,
        data: data
      })
    } catch (error) {
      setTestResult({
        success: false,
        status: 0,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
          <h1>Component in development</h1>
            <h2 className="text-xl font-bold text-gray-800">Test API: {apiData.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{apiData.method} {apiData.endpoint}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - Form */}
          <div className="w-1/2 p-6 overflow-y-auto border-r border-gray-200">
            <div className="space-y-6">
              {/* URL Parameters */}
              {apiData.urlParams && Object.keys(apiData.urlParams).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">URL Parameters</h3>
                  <div className="space-y-3">
                    {Object.entries(apiData.urlParams).map(([key, defaultValue]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          {key}
                        </label>
                        <input
                          type="text"
                          value={testValues.urlParams[key] || defaultValue || ''}
                          onChange={(e) => updateTestValue('urlParams', key, e.target.value)}
                          placeholder={`Enter value for ${key}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Request Parameters */}
              {apiData.params && apiData.params.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Request Parameters</h3>
                  <div className="space-y-3">
                    {apiData.params.map((param) => (
                      <div key={param.name}>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          {param.name}
                          {param.required && <span className="text-red-500 ml-1">*</span>}
                          <span className="text-xs text-gray-400 ml-2">({param.type})</span>
                        </label>
                        {param.description && (
                          <p className="text-xs text-gray-500 mb-1">{param.description}</p>
                        )}
                        <input
                          type={param.type === 'number' ? 'number' : 'text'}
                          value={testValues.requestParams[param.name] || ''}
                          onChange={(e) => updateTestValue('requestParams', param.name, e.target.value)}
                          placeholder={`Enter ${param.name}`}
                          required={param.required}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Headers */}
              {apiData.headers && Object.keys(apiData.headers).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Headers</h3>
                  <div className="space-y-3">
                    {Object.entries(apiData.headers).map(([key, defaultValue]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          {key}
                        </label>
                        <input
                          type="text"
                          value={testValues.headers[key] || defaultValue || ''}
                          onChange={(e) => updateTestValue('headers', key, e.target.value)}
                          placeholder={`Enter value for ${key}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

                             {/* Test Button */}
               <div className="pt-4 space-y-2">
                 <Button
                   onClick={testApi}
                   disabled={isLoading}
                   className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                 >
                   {isLoading ? (
                     <>
                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                       Testing API...
                     </>
                   ) : (
                     <>
                       <Play className="w-4 h-4 mr-2" />
                       {testResult ? 'Test Again' : 'Test API'}
                     </>
                   )}
                 </Button>
                 
                 {testResult && (
                   <Button
                     onClick={() => setTestResult(null)}
                     variant="secondary"
                     className="w-full"
                   >
                     Clear Results
                   </Button>
                 )}
               </div>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="w-1/2 p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Test Results</h3>
            
            {!testResult && (
              <div className="text-center text-gray-500 py-8">
                <Play className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Click "Test API" to see results here</p>
              </div>
            )}

            {testResult && (
              <div className="space-y-4">
                {/* Status */}
                <div className={`flex items-center p-3 rounded-lg ${
                  testResult.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  {testResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  )}
                  <span className={`font-medium ${
                    testResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    Status: {testResult.status} {testResult.success ? 'Success' : 'Error'}
                  </span>
                </div>

                {/* Error Message */}
                {testResult.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <h4 className="font-medium text-red-800 mb-2">Error</h4>
                    <p className="text-red-700 text-sm">{testResult.error}</p>
                  </div>
                )}

                {/* Response Data */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Response</h4>
                  <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs overflow-x-auto max-h-64 overflow-y-auto">
                    {JSON.stringify(testResult.data, null, 2)}
                  </pre>
                </div>

                                 {/* Request URL */}
                 <div>
                   <h4 className="font-medium text-gray-700 mb-2">Request URL</h4>
                   <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs break-all">
                     {buildUrl()}
                   </div>
                 </div>

                 {/* Try Again Button */}
                 <div className="pt-4">
                   <Button
                     onClick={testApi}
                     disabled={isLoading}
                     className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                   >
                     {isLoading ? (
                       <>
                         <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                         Testing API...
                       </>
                     ) : (
                       <>
                         <Play className="w-4 h-4 mr-2" />
                         Try Again
                       </>
                     )}
                   </Button>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestApiModal 