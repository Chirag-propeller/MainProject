"use client";
import React, { useState, useRef, useEffect } from "react";
import { Agent } from "@/components/agents/types";
import { Upload, Code, X, Trash2 } from "lucide-react";
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
  agent,
  setAgent,
}: {
  agent: Agent;
  setAgent: (agent: Agent) => void;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFileUploaded, setIsFileUploaded] = useState(
    agent.knowledgeBaseAttached
  );
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(
    agent.knowledgeBaseUrl ?? null
  );
  const [fileName, setFileName] = useState<string | null>(null);

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
            agent.apis?.some((agentApiId) => agentApiId.toString() === api._id)
          );
          setSelectedApis(agentApis);
        } catch (error) {
          console.error("Failed to load agent APIs:", error);
        }
      }
    };

    initializeSelectedApis();
  }, [agent.apis]);

  // Extract filename from URL when component mounts
  useEffect(() => {
    if (fileUrl && !fileName) {
      const extractedName =
        fileUrl.split("/").pop()?.split("?")[0] || "Unknown file";
      setFileName(extractedName);
    }
  }, [fileUrl, fileName]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    const formData2 = new FormData();
    setIsUploading(true);
    formData.append("agentId", agent._id);
    formData.append("file", file);
    formData2.append("agentId", agent._id);
    const url = process.env.NEXT_PUBLIC_AZURE_URL;
    let azureUrl = null;
    let uploadedFileName = null;
    try {
      const response = await axios.post("/api/agents/file", formData);

      if (response.status === 200) {
        azureUrl = response.data.url;
        uploadedFileName = response.data.filename || file.name;
        setFileUrl(azureUrl);
        setFileName(uploadedFileName);
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
          agentId: agent.agentId,
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

  const handleDeleteKnowledgeBase = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete the knowledge base file? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await axios.delete("/api/agents/file", {
        data: { agentId: agent._id },
      });

      if (response.data.success) {
        setAgent({
          ...agent,
          knowledgeBaseAttached: false,
          knowledgeBaseUrl: "",
        });
        setIsFileUploaded(false);
        setFileUrl(null);
        setFileName(null);
        toast.success("Knowledge base deleted successfully");
      } else {
        toast.error("Failed to delete knowledge base");
      }
    } catch (error) {
      console.error("Error deleting knowledge base:", error);
      toast.error("Error deleting knowledge base. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownloadKnowledgeBase = async () => {
    if (!fileUrl) return;
    const filename = fileName || fileUrl.split("/").pop();
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
    setSelectedApis((prev) => [...prev, api]);
    setAgent({
      ...agent,
      apis: [...(agent.apis || []), api._id as any],
    });
  };

  const handleRemoveApi = (apiId: string) => {
    const apiToRemove = selectedApis.find((api) => api._id === apiId);
    setSelectedApis((prev) => prev.filter((api) => api._id !== apiId));
    setAgent({
      ...agent,
      apis: (agent.apis || []).filter((id) => id.toString() !== apiId),
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
    <div className="w-full bg-white dark:bg-gray-900 rounded-[6px]">
      <div className="flex flex-col gap-6">
        {/* Knowledge Base Section */}
        <div className="space-y-4">
          <h3 className="text-[16px] font-semibold text-gray-900 dark:text-gray-400">
            Knowledge Base
          </h3>
          {isFileUploaded ? (
            <div
              className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 
                    flex flex-col items-center justify-center text-center gap-2"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                <img
                  src="https://img.icons8.com/fluency/48/folder-invoices.png"
                  alt="Uploaded"
                  className="w-8 h-8"
                />
              </div>
              <p className="text-green-600 dark:text-green-400 font-semibold text-sm">
                File uploaded successfully
              </p>
              {fileName && (
                <p className="text-sm text-gray-700 dark:text-gray-200 font-medium bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded">
                  📄 {fileName}
                </p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Knowledge base is configured
              </p>
              <div className="flex gap-2 mt-2">
                {fileUrl && (
                  <button
                    type="button"
                    onClick={handleDownloadKnowledgeBase}
                    className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    {/* <RiArrowDropDownLine className="w-5 h-5" /> */}
                    Download file
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleDeleteKnowledgeBase}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:underline disabled:opacity-50 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 items-center">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Upload PDF for Knowledge Base
              </label>
              <div className="flex gap-2">
                <Button
                  onClick={handleUploadClick}
                  variant="default"
                  size="sm"
                  className="rounded-[6px]"
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
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Supported formats: .pdf only
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {selectedFile?.name || "No file selected"}
              </p>
            </div>
          )}
        </div>

        {/* API Tools Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-semibold text-gray-900 dark:text-gray-400">
              API Tools
            </h3>
            <Button
              onClick={() => setIsApiModalOpen(true)}
              variant="secondary"
              size="sm"
              className="rounded-[6px] bg-indigo-500 text-white hover:bg-indigo-600"
            >
              <Code className="w-4 h-4 mr-2" />
              Add API
            </Button>
          </div>

          {selectedApis.length === 0 ? (
            <div className="p-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[6px] bg-white dark:bg-gray-900 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No APIs added yet. Click "Add API" to select from your saved
                APIs.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedApis.map((api) => (
                <div
                  key={api._id}
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded-[6px] bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                          {api.apiName}
                        </h4>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            api.method === "GET"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : api.method === "POST"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : api.method === "PUT"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                  : api.method === "DELETE"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {api.method}
                        </span>
                      </div>
                      {api.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {api.description}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                        {api.endpoint}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveApi(api._id)}
                      className="ml-4 p-1 text-gray-400 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
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
        selectedApis={selectedApis.map((api) => api._id)}
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
    <div className="border border-gray-200 dark:border-gray-700 rounded-[6px] bg-white dark:bg-gray-900 shadow-sm hover:border-gray-300 dark:hover:border-gray-500 mr-2">
      <header
        className="cursor-pointer bg-white dark:bg-gray-900 border-b-background px-2 py-1 m-1 rounded-[6px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between m-1.5">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-[6px] flex items-center justify-center">
              <span className="text-cyan-950 dark:text-cyan-200 text-lg">
                <FaScrewdriverWrench />
              </span>
            </div>
            <div>
              <h2 className="text-[14px] text-gray-900 dark:text-white font-semibold ml-1.5">
                Tools
              </h2>
              <p className="font-light text-gray-500 dark:text-gray-300 text-sm pt-1 ml-1.5">
                Available tools and integrations
              </p>
            </div>
          </div>
          <MdKeyboardArrowDown
            className={`w-8 h-8 transform transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            } text-gray-700 dark:text-gray-200`}
            style={{ fill: "gray" }}
          />
        </div>
      </header>
      {isOpen && (
        <>
          <hr className="border-t border-gray-200 dark:border-gray-700 my-2" />
          <div className="p-4 bg-white dark:bg-gray-900 rounded-[6px]">
            <ToolsContent agent={agent} setAgent={setAgent} />
          </div>
        </>
      )}
    </div>
  );
};

export default Tools;
