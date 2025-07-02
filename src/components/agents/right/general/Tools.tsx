import React, { useState, useRef, useEffect } from "react";
import { Agent } from "@/components/agents/types";
import { Upload } from "lucide-react";
import { FaScrewdriverWrench } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "react-hot-toast";
import { RiArrowDropDownLine } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";

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
      <div className="flex flex-col gap-4">
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
              Tools and integrations are configured
            </p>
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
            <p className="text-xs text-gray-500">
              Supported formats: .pdf only
            </p>
            <p className="text-xs text-gray-500">
              {selectedFile?.name || "No file selected"}
            </p>
          </div>
        )}
      </div>
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
