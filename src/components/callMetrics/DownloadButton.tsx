import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

interface DownloadButtonProps {
  callId: string;
  disabled?: boolean;
}

export default function DownloadButton({ callId, disabled = false }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (isDownloading || disabled) return;

    setIsDownloading(true);
    try {
      const response = await axios.post('/api/callHistory/downloadTranscript', {
        callId: callId
      }, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const contentDisposition = response.headers['content-disposition'];
      let filename = 'transcript.pdf';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // You could add a toast notification here
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="secondary"
      onClick={handleDownload}
      disabled={disabled || isDownloading}
      className="h-8 w-8 p-0"
      title="Download Transcript (PDF)"
    >
      {isDownloading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
    </Button>
  );
} 