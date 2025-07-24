"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  onClose: () => void;
  onSave: (textFile: File) => void;
}

const TextInputModal: React.FC<Props> = ({ onClose, onSave }) => {
  const [text, setText] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSave = () => {
    if (!text.trim()) {
      alert("Please type something");
      return;
    }

    const blob = new Blob([text], { type: "text/plain" });
    const file = new File([blob], `Text file-${Date.now()}.txt`, {
      type: "text/plain",
    });

    onSave(file);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-700/50 dark:bg-gray-900/80 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="bg-white border border-gray-500 dark:border-gray-700 dark:bg-gray-900 p-6 rounded-[6px] w-[400px] shadow-lg flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Add Text
        </h2>
        <textarea
          className="w-full h-40 p-2 border rounded resize-none bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
          placeholder="Type your content here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
};

export default TextInputModal;
