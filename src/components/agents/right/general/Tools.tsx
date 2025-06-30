import React, { useState, useRef } from "react";
import { Agent } from "@/components/agents/types";
import { Wrench, Triangle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "react-hot-toast";
import { RiArrowDropDownLine } from "react-icons/ri";

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

  return (
    <div className="w-full bg-white rounded-xl">
      <div className="flex flex-col gap-4">
        {isFileUploaded ? (
          <p className="text-xs text-gray-500">File uploaded successfully</p>
        ) : (
          <div className="flex flex-col gap-2">
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
    <div className="border border-gray-200 rounded-[6px] bg-white shadow-sm">
      <header
        className="cursor-pointer bg-white p-2 rounded-[6px] border-b border-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between m-1.5">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-gray-900 self-center" />
            <h2 className="text-md text-gray-900 font-semibold">Tools</h2>
          </div>
          <RiArrowDropDownLine
            className={`w-10 h-10 transform transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            style={{ fill: "black" }}
          />
        </div>
      </header>
      {isOpen && (
        <div className="p-4">
          <ToolsContent
            agentId={agent.agentId}
            agent={agent}
            setAgent={setAgent}
          />
        </div>
      )}
    </div>
  );
};

export default Tools;
