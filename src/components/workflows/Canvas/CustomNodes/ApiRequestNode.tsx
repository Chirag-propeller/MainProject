import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useWorkflowStore } from '@/store/workflowStore';
import { Api } from '@/components/apiTool/types';
import { Globe, Settings, FileText, Code } from 'lucide-react';

interface ApiRequestNodeData {
  name: string;
  endpoint: string;
  method: string;
  type: string;
  description?: string;
  headers?: Record<string, string>;
  urlParams?: Record<string, string>;
  variableToExtract?: string;
  promptToExtractVariable?: string;
  params?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  response?: any;
  selectedApiId?: string;
  selectedApi?: Api;
  global?: {
    isGlobal?: boolean;
    pathwayCondition?: string;
    pathwayDescription?: string;
    autoGoBackToPrevious?: boolean;
    createPathwayLabelToPrevious?: boolean;
    previousNodePathwayLabel?: string;
    previousNodePathwayDescription?: string;
    redirectToNode?: boolean;
    redirectTargetNodeId?: string;
    [key: string]: any;
  };
}

const ApiRequestNode: React.FC<NodeProps<ApiRequestNodeData>> = ({ data, id }) => {
  const isGlobal = data.global?.isGlobal || false;
  const { selectedNode } = useWorkflowStore();

  // Simple highlighting - darker border when selected
  const isSelected = selectedNode?.id === id;

  // Get the selected API data
  const selectedApi = data.selectedApi;
  const hasHeaders = data.headers && Object.keys(data.headers).length > 0;
  const hasUrlParams = data.urlParams && Object.keys(data.urlParams).length > 0;
  const hasParams = data.params && data.params.length > 0;
  const hasResponse = data.response && Object.keys(data.response).length > 0;

  return (
    <div 
      className={`relative bg-white border-2 rounded-lg shadow-lg p-4 min-w-[220px] ${
        isGlobal 
          ? 'border-purple-500 bg-purple-50' 
          : isSelected 
            ? 'border-blue-600 bg-blue-50' 
            : 'border-blue-200 bg-blue-50'
      }`}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className={`!w-3 !h-3 !-top-[7px] ${
          isGlobal ? '!bg-purple-500' : '!bg-blue-500'
        }`}
      />
      <div className="text-center">
        {/* Global Node Indicator */}
        {isGlobal && (
          <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
            GLOBAL
          </div>
        )}
        <div className={`text-sm font-semibold mb-1 ${
          isGlobal ? 'text-purple-600' : 'text-blue-600'
        }`}>
          {data.type || 'API'}
        </div>
        <div className="text-lg font-bold text-gray-800 mb-2">
          <p className='text-sm'>{data.name || 'API Request Node'}</p>
        </div>  
        
        {/* API Information - Simplified */}
        <div className="text-xs text-gray-600">
          <div className="bg-gray-100 p-2 rounded-lg">
            {/* <div className="flex items-center gap-2 mb-1">
              <Globe className="w-3 h-3" />
              <strong>{data.name || 'API Request'}</strong>
            </div>
            <div className="text-gray-500">{data.method || 'GET'} {data.endpoint || '/api/endpoint'}</div> */}
          </div>
          

          <div className="flex justify-center mt-2">
            <div className="text-xs text-gray-500">
              {[
                hasHeaders && 'Headers',
                hasUrlParams && 'URL Params', 
                hasParams && 'Params',
                hasResponse && 'Response',
                data.variableToExtract && 'Variables'
              ].filter(Boolean).join(' • ')}
            </div>
          </div>
        </div>
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className={`!w-3 !h-3 !-bottom-[7px] ${
          isGlobal ? '!bg-purple-500' : '!bg-blue-500'
        }`}
      />
    </div>
  );
};

export default ApiRequestNode;
