import React, { useRef, useState, useEffect } from 'react';
import { useWorkflowStore } from '@/store/workflowStore';
import { Button } from '@/components/ui/button';
import Toggle from '@/components/ui/toggle';
import { Upload, Trash2, Download, X, ChevronDown, ChevronRight } from 'lucide-react';
import VariableExtractSection from './VariableExtractSection';

const RagSidebar: React.FC = () => {
  const { selectedNode, updateNode, updateNodeGlobal, currentWorkflowId, setSelectedNode } = useWorkflowStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAudioCollapsed, setIsAudioCollapsed] = useState(true);

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

  if (!selectedNode || selectedNode.data.type !== 'RAG') return null;
  const data = selectedNode.data;
  const globalData = data.global || {};
  const fileName = data.knowledgeBaseUrl ? (data.knowledgeBaseUrl.split('/').pop()?.split('?')[0] || 'Unknown file') : null;

  // Upload handler (now uses /api/workflow/file and then FastAPI /upload-pdf)
  const uploadFile = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('workflowId', currentWorkflowId || '');
    formData.append('nodeId', selectedNode.id);
    try {
      // 1. Upload to Azure via our backend
      const uploadRes = await fetch('/api/workflow/file', {
        method: 'POST',
        body: formData,
      });
      if (!uploadRes.ok) throw new Error('Upload to Azure failed');
      const uploadData = await uploadRes.json();
      const azureUrl = uploadData.url;
      // 2. Call FastAPI backend for PDF processing
      const fastApiUrl = process.env.NEXT_PUBLIC_AZURE_URL;
      const pdfRes = await fetch(`${fastApiUrl}/upload-pdf`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'x-api-key': 'supersecretapikey123',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: `${currentWorkflowId}-${selectedNode.id}`,
          url: azureUrl,
        }),
      });
      if (!pdfRes.ok) throw new Error('FastAPI PDF processing failed');
      updateNode(selectedNode.id, {
        knowledgeBaseAttached: true,
        knowledgeBaseUrl: azureUrl,
      });
      setSelectedFile(file);
    } catch (err) {
      alert('Error uploading or processing file.');
    } finally {
      setIsUploading(false);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!window.confirm('Delete the knowledge base file?')) return;
    setIsDeleting(true);
    try {
      updateNode(selectedNode.id, {
        knowledgeBaseAttached: false,
        knowledgeBaseUrl: '',
      });
      setSelectedFile(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Download handler
  const handleDownload = async () => {
    if (!data.knowledgeBaseUrl) return;
    try {
      const filename = fileName || data.knowledgeBaseUrl.split('/').pop();
      const response = await fetch(`/api/knowledgeBase/download?filename=${encodeURIComponent(filename!)}`);
      const resData = await response.json();
      if (resData.url) {
        const link = document.createElement('a');
        link.href = resData.url;
        link.download = filename || 'knowledge-base.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('Download link not available.');
      }
    } catch (err) {
      alert('Failed to get download link.');
    }
  };

  // File select handler
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      uploadFile(file);
    }
  };

  // Upload button click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Field change handlers
  const handleFieldChange = (field: string, value: any) => {
    updateNode(selectedNode.id, { [field]: value });
  };
  const handleGlobalFieldChange = (field: string, value: any) => {
    updateNodeGlobal(selectedNode.id, { [field]: value });
  };

  return (
    <div 
      ref={sidebarRef}
      className="w-120 h-[calc(100vh-4rem)] bg-white border-l border-gray-200 p-4 pt-0 overflow-y-auto rounded-lg shadow-lg scrollbar-hide"
    >
      <div className="mb-4 sticky top-0 pt-2 bg-white z-10 flex items-center justify-between">
        <div className="">  
        <h2 className="text-xl font-bold text-gray-800">RAG Node Properties</h2>
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
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Node Name</label>
          <input
            type="text"
            value={data.name || ''}
            onChange={e => handleFieldChange('name', e.target.value)}
            placeholder="Enter node name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        {/* Knowledge Base Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Knowledge Base PDF</label>
          {data.knowledgeBaseAttached && data.knowledgeBaseUrl ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-semibold text-xs">PDF uploaded</span>
                <Button size="sm" variant="ghost" onClick={handleDownload} title="Download">
                  <Download className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleDelete} title="Delete" disabled={isDeleting}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-xs text-gray-700 bg-gray-50 px-2 py-1 rounded">
                📄 {fileName}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 items-start mt-1">
              <Button
                onClick={handleUploadClick}
                variant="default"
                size="sm"
                className="rounded-[6px]"
                disabled={isUploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload PDF'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf"
              />
              <p className="text-xs text-gray-500">
                Supported format: .pdf only
              </p>
              <p className="text-xs text-gray-500">
                {selectedFile?.name || 'No file selected'}
              </p>
            </div>
          )}
        </div>
        {/* When to call RAG */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">When to call RAG</label>
          <textarea
            className="w-full h-16 border border-gray-200 rounded-lg p-2 text-xs"
            placeholder="Enter when to call RAG"
            value={data.whenToCallRag || ''}
            onChange={e => handleFieldChange('whenToCallRag', e.target.value)}
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
              {/* Filler Words Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filler Words
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Enable filler words in conversation
                  </span>
                  <Toggle
                    checked={selectedNode.data.fillerWords || false}
                    onChange={(checked) => handleFieldChange('fillerWords', checked)}
                    size="small"
                  />
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
                    onChange={(checked) => handleFieldChange('backgroundAudio', checked)}
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
          onVariablesChange={(variables) => handleFieldChange('variables', variables)}
        />

        {/* Global options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Make this node global</label>
          <div className="flex items-center space-x-2 mb-3">
            <input
              type="checkbox"
              id="globalNodeToggle"
              checked={globalData.isGlobal || false}
              onChange={e => handleGlobalFieldChange('isGlobal', e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="globalNodeToggle" className="text-sm text-gray-600">
              Enable global node functionality
            </label>
          </div>
          {globalData.isGlobal && (
            <div className="space-y-4 pl-6 border-l-2 border-green-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Global Node Pathway Condition</label>
                <textarea
                  value={globalData.pathwayCondition || ''}
                  onChange={e => handleGlobalFieldChange('pathwayCondition', e.target.value)}
                  placeholder="Enter pathway condition"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Global Node Pathway Description</label>
                <textarea
                  value={globalData.pathwayDescription || ''}
                  onChange={e => handleGlobalFieldChange('pathwayDescription', e.target.value)}
                  placeholder="Enter pathway description"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />  
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RagSidebar; 