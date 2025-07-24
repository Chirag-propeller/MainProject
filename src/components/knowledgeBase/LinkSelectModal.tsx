"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

const LinkSelectModal = ({
  links,
  selectedLinks,
  setSelectedLinks,
  onSave,
  onClose,
}: {
  links: string[];
  selectedLinks: string[];
  setSelectedLinks: React.Dispatch<React.SetStateAction<string[]>>;
  onSave: () => void;
  onClose: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // 🔁 Close on outside click
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

  const handleCheckboxChange = (link: string) => {
    setSelectedLinks((prev) =>
      prev.includes(link) ? prev.filter((l) => l !== link) : [...prev, link]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-gray-900/80 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="bg-white border border-gray-500 dark:border-gray-700 dark:bg-gray-900 p-2 rounded shadow w-[50vw] relative"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Select Pages to Add
        </h2>
        <div className="overflow-y-auto max-h-[60vh]">
          <ul className="space-y-2">
            {links.map((link, index) => (
              <li key={index} className="flex items-center">
                <input
                  type="checkbox"
                  id={`link-${index}`}
                  checked={selectedLinks.includes(link)}
                  onChange={() => handleCheckboxChange(link)}
                  className="mr-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                />
                <label
                  htmlFor={`link-${index}`}
                  className="cursor-pointer text-gray-900 dark:text-gray-200"
                >
                  {link}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="sticky -bottom-6 left-0 right-0 bg-white dark:bg-gray-900 pt-4 px-6 pb-2 flex gap-2 border-t border-gray-200 dark:border-gray-700 z-50">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save</Button>
        </div>
      </div>
    </div>
  );
};

export default LinkSelectModal;
