"use client";
import React, { useState, useRef, useEffect } from "react";
import { Agent } from "@/components/agents/types";
import { Upload, Code, X } from "lucide-react";
import { FaScrewdriverWrench } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "react-hot-toast";
import { RiArrowDropDownLine } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import ApiSelectionModal from "./ApiSelectionModal";
import { Api } from "@/components/apiTool/types";
import { fetchApis } from "@/components/apiTool/api";

const ToolsContent = ({
  agentId,
  agent,
  setAgent,
}: {
  agentId: string;
  agent: Agent;
  setAgent: (agent: Agent) => void;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFileUploaded, setIsFileUploaded] = useState(
    agent.knowledgeBaseAttached
  );
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(
    agent.knowledgeBaseUrl ?? null // fallback if you already store it on the agent
  );
  
  // API-related state
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [selectedApis, setSelectedApis] = useState<Api[]>([]);

  // Initialize selected APIs from agent data
  useEffect(() => {
    const initializeSelectedApis = async () => {
      if (agent.apis && agent.apis.length > 0) {
        try {
          const apisData = await fetchApis();
          const agentApis = apisData.filter((api: Api) => 
            agent.apis?.some(agentApiId => agentApiId.toString() === api._id)
          );
          setSelectedApis(agentApis);
        } catch (error) {
          console.error("Failed to load agent APIs:", error);
        }
      }
    };

    initializeSelectedApis();
  }, [agent.apis]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    const formData2 = new FormData();
    setIsUploading(true);
    formData.append("agent_id", agentId);
    formData.append("file", file);
    formData2.append("agentId", agentId);
    const url = process.env.NEXT_PUBLIC_AZURE_URL;
    let azureUrl = null;
    try {
      const response = await axios.post("/api/agents/file", formData);

      if (response.status === 200) {
        azureUrl = response.data.url;
        setFileUrl(azureUrl);
        formData2.append("url", azureUrl);
        console.log("File uploaded successfully");
      } else {
        console.error("Failed to upload file");
        toast.error("Failed to upload file");
        return;
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file. Please try again.");
      return;
    }

    try {
      const response = await axios.post(
        `${url}/upload-pdf`,
        {
          agentId: agentId,
          url: azureUrl,
        },
        {
          headers: {
            accept: "application/json",
            "x-api-key": "supersecretapikey123",
          },
        }
      );
      if (response.status === 200) {
        console.log("File uploaded successfully");
        setAgent({
          ...agent,
          knowledgeBaseAttached: true,
          knowledgeBaseUrl: azureUrl,
        });
        setIsFileUploaded(true);
        toast.success("File uploaded successfully");
        // setTimeout(() => setIsFileUploaded(false), 5000);
      } else {
        console.error("Failed to upload file");
        toast.error("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadKnowledgeBase = async () => {
    if (!fileUrl) return;
    // Extract filename from the Azure URL or however you store it
    const filename = fileUrl.split("/").pop();
    try {
      const response = await axios.get(
        `/api/knowledgeBase/download?filename=${encodeURIComponent(filename!)}`
      );
      if (response.data.url) {
        const link = document.createElement("a");
        link.href = response.data.url;
        link.download = filename || "knowledge-base.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.error("Download link not available.");
      }
    } catch (error) {
      toast.error("Failed to get download link.");
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      uploadFile(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // API-related handlers
  const handleApiSelect = (api: Api) => {
    setSelectedApis(prev => [...prev, api]);
    // Update agent with the new API
    setAgent({
      ...agent,
      apis: [...(agent.apis || []), api._id as any], // Add API ID to agent's apis array
    });
  };

  const handleRemoveApi = (apiId: string) => {
    const apiToRemove = selectedApis.find(api => api._id === apiId);
    setSelectedApis(prev => prev.filter(api => api._id !== apiId));
    // Update agent to remove the API
    setAgent({
      ...agent,
      apis: (agent.apis || []).filter(id => id.toString() !== apiId), // Remove API ID from agent's apis array
    });
    if (apiToRemove) {
      toast.success(`${apiToRemove.apiName} removed from agent tools`);
    }
  };

  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  return (
    <div className="w-full bg-white rounded-xl">
      <div className="flex flex-col gap-6">
        {/* Knowledge Base Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Knowledge Base</h3>
          {isFileUploaded ? (
            <div
              className="border-2 border-dashed border-gray-200 rounded-xl py-10 px-4 
                    flex flex-col items-center justify-center text-center gap-2"
            >
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                <img
                  src="https://img.icons8.com/fluency/48/folder-invoices.png"
                  alt="Uploaded"
                  className="w-8 h-8"
                />
              </div>
              <p className="text-green-600 font-semibold text-sm">
                File uploaded successfully
              </p>
              <p className="text-sm text-gray-500">
                Knowledge base is configured
              </p>
              {fileUrl && (
                <button
                  type="button"
                  onClick={handleDownloadKnowledgeBase}
                  className="mt-1 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                >
                  <RiArrowDropDownLine className="w-5 h-5" />
                  Download file
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2 items-center">
              <label className="text-sm font-medium text-gray-700">
                Upload PDF for Knowledge Base
              </label>
              <div className="flex gap-2">
                <Button
                  onClick={handleUploadClick}
                  variant="default"
                  size="sm"
                  className="rounded-lg"
                  disabled={isUploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? "Uploading..." : "Upload File"}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf"
                />
              </div>
              <p className="text-xs text-gray-500">
                Supported formats: .pdf only
              </p>
              <p className="text-xs text-gray-500">
                {selectedFile?.name || "No file selected"}
              </p>
            </div>
          )}
        </div>

        {/* API Tools Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">API Tools</h3>
            <Button
              onClick={() => setIsApiModalOpen(true)}
              variant="secondary"
              size="sm"
              className="rounded-lg"
            >
              <Code className="w-4 h-4 mr-2" />
              Add API
            </Button>
          </div>

          {selectedApis.length === 0 ? (
            <div className="p-6 border-2 border-dashed border-gray-200 rounded-[6px] bg-white text-center">
              <p className="text-sm text-gray-500">
                No APIs added yet. Click "Add API" to select from your saved APIs.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedApis.map((api) => (
                <div
                  key={api._id}
                  className="p-4 border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-base font-semibold text-gray-900">
                          {api.apiName}
                        </h4>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            api.method === "GET"
                              ? "bg-green-100 text-green-800"
                              : api.method === "POST"
                              ? "bg-blue-100 text-blue-800"
                              : api.method === "PUT"
                              ? "bg-yellow-100 text-yellow-800"
                              : api.method === "DELETE"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {api.method}
                        </span>
                      </div>
                      {api.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {api.description}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">
                        {api.endpoint}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveApi(api._id)}
                      className="ml-4 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* API Selection Modal */}
      <ApiSelectionModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        onApiSelect={handleApiSelect}
        selectedApis={selectedApis.map(api => api._id)}
      />
    </div>
  );
};

const Tools = ({
  agent,
  setAgent,
}: {
  agent: Agent;
  setAgent: (agent: Agent) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFileUpload = (file: File) => {
    console.log("File uploaded:", file.name);
    // TODO: Implement file upload logic
    // This could involve sending the file to an API endpoint
    // and storing the file reference in the agent configuration
  };

  return (
    <div className="border border-gray-200 rounded-[6px] bg-white shadow-sm hover:border-gray-300">
      <header
        className="cursor-pointer bg-white border-b-background px-2 py-1 m-1 rounded-[6px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between m-1.5">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-100 rounded-[6px] flex items-center justify-center">
              <span className="text-cyan-950 text-lg">
                <FaScrewdriverWrench />
              </span>
            </div>
            <div>
              <h2 className="text-[14px] text-gray-900 font-semibold ml-1.5">
                Tools
              </h2>
              <p className="font-light text-gray-500 text-sm pt-1 ml-1.5">
                Available tools and integrations
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
          <div className="p-4">
            <ToolsContent
              agentId={agent.agentId}
              agent={agent}
              setAgent={setAgent}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Tools;
