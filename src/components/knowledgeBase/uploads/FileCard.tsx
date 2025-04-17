import { X } from 'lucide-react';
import React from 'react';

interface FileCardProps {
  file: File;
  onRemove: () => void;
}

const FileCard: React.FC<FileCardProps> = ({ file, onRemove }) => {
  const getFileIcon = () => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return '🖼️';
    if (['pdf'].includes(ext || '')) return '📄';
    if (['doc', 'docx'].includes(ext || '')) return '📝';
    if (['txt'].includes(ext || '')) return '📃';
    return '📄';
  };

  return (
    <div className="flex items-center justify-between p-0.5 border rounded-md shadow-sm bg-gray-50 text-sm">
      <div className="flex items-center gap-1 overflow-hidden">
        <span className="text-lg">{getFileIcon()}</span>
        <div className="text-sm truncate max-w-[200px]">{file.name}</div>
      </div>
      <button onClick={onRemove} className="text-gray-400 hover:text-red-500">
        <X size={16} />
      </button>
    </div>
  );
};

export default FileCard;
