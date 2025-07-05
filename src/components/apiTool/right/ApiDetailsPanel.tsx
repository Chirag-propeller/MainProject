"use client";
import React, { useState, useEffect, useRef } from "react";
import { Api } from "../types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaRegEdit } from "react-icons/fa";
import _ from "lodash";
import ApiGeneralTab from "./ApiGeneralTab";

interface ApiDetailsPanelProps {
  api: Api;
  setApi: (api: Api) => void;
}

const ApiDetailsPanel: React.FC<ApiDetailsPanelProps> = ({ api, setApi }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("general");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isNameUpdating, setIsNameUpdating] = useState(false);
  const [name, setName] = useState(api.apiName);
  const [initialApi, setInitialApi] = useState<Api>(() => _.cloneDeep(api));
  const [isModified, setIsModified] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);


  const tabs = [
    { id: "general", label: "General" },
  ];

  useEffect(() => {
    setInitialApi(_.cloneDeep(api));
    setIsModified(false);
  }, [api._id]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    const newBaseline = _.cloneDeep(api);
    const res = await fetch(`/api/apiTool/${api._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(api),
    });

    if (res.ok) {
      const data = await res.json();
      setInitialApi(newBaseline);
      setIsModified(false);
      setIsUpdating(false);
      alert("API updated successfully");
      router.refresh();
    } else {
      alert("Failed to update API");
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsModified(!_.isEqual(api, initialApi));
    }, 300);

    return () => clearTimeout(timeout);
  }, [api, initialApi]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isNameUpdating &&
        nameRef.current &&
        !nameRef.current.contains(event.target as Node)
      ) {
        setIsNameUpdating(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNameUpdating]);

  // Sync local state when api changes from external source
  useEffect(() => {
    setName(api.apiName);
  }, [api.apiName]);

  // Debounced update for name input (avoids updating on every keystroke)
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (api.apiName !== name) {
        const updatedApi = { ...api, apiName: name };
        setApi(updatedApi);

        // Backend update
        await fetch(`/api/apiTool/${api._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedApi),
        });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [api, name, setApi]);

  return (
    <div className="flex flex-col bg-gray-50 border border-t-0 border-gray-200 h-full p-5">
      {/* Header with API name, ID and buttons */}
      <div className="flex justify-between items-start flex-wrap gap-y-1">
        {/* Left: API Name and ID */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            {isNameUpdating ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-gray-300 rounded-md border px-2 py-1"
                ref={nameRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsNameUpdating(false);
                    nameRef.current?.blur();
                  }
                }}
              />
            ) : (
              <h2 className="text-2xl font-semibold truncate overflow-hidden text-ellipsis max-w-80 text-gray-900 text-nowrap">
                {name}
              </h2>
            )}
            <FaRegEdit
              className="w-4 h-4 text-gray-500 cursor-pointer"
              onClick={() => setIsNameUpdating(true)}
            />
          </div>
          <div className="flex justify-between items-center px-1 mt-1">
            <p className="text-xs text-gray-500">ID: {api._id}</p>
          </div>
        </div>

        {/* Right: Buttons */}
        <div className="flex space-x-2 mt-1">
          <Button
            variant="default"
            size="md"
            onClick={handleUpdate}
            className="px-5 py-1 text-md rounded-[4px]"
            disabled={!isModified}
          >
            Update
          </Button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex text-sm space-x-4 px-4 pb-2 py-4 border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={` cursor-pointer ${activeTab === tab.id ? "text-indigo-600 border-b-1 border-indigo-600" : "text-gray-600"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-x-hidden">
        {activeTab === "general" && (
          <ApiGeneralTab api={api} setApi={setApi} />
        )}
        {/*  */}
      </div>
    </div>
  );
};

export default ApiDetailsPanel;
