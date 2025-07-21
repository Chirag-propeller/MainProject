"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import axios from "axios";

interface DownloadButtonProps {
  callId: string;
  disabled?: boolean;
}

export default function DownloadButton({
  callId,
  disabled = false,
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!callId || disabled) return;

    try {
      setIsDownloading(true);

      const response = await axios.get(
        `/api/callHistory/download-transcript?callId=${callId}`,
        {
          responseType: "blob",
        }
      );

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: "text/plain" });

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `call_transcript_${callId}.txt`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading transcript:", error);
      // You could add a toast notification here if you have a toast system
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={disabled || isDownloading}
      className={`
        inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-md
        transition-colors duration-200
        ${
          disabled || isDownloading
            ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500"
            : "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 cursor-pointer dark:bg-gray-900 dark:text-blue-300 dark:hover:bg-gray-800"
        }
      `}
      title={disabled ? "No transcript available" : "Download transcript"}
    >
      {isDownloading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <Download className="w-3 h-3" />
      )}
    </button>
  );
}
