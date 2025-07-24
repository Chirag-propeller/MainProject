"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Api } from "./types";
import { createApi, deleteApi } from "./api";
import { Button } from "@/components/ui/button";
import { Copy, MoreVertical, Server, X } from "lucide-react";

// Simple API card component for the list
const ApiListItem = ({
  api,
  isSelected,
  onDelete,
  onDuplicate,
  isDeleting,
  isDuplicating,
}: {
  api: Api;
  isSelected: boolean;
  onDelete: (id: string) => Promise<void>;
  onDuplicate: (api: Api) => Promise<void>;
  isDeleting: string | null;
  isDuplicating: string | null;
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hide dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <Link href={`/dashboard/apiTool/${api._id}`} className="block relative">
      <div
        className={`p-2 px-2 border rounded-[6px] mb-1 transition-colors ${
          isSelected
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50"
            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-indigo-500 dark:hover:border-indigo-400"
        }`}
      >
        <div className="flex justify-between items-start ">
          {/* Left: API Info */}
          <div>
            <h3 className="text-[14px] overflow-hidden text-ellipsis max-w-32 text-gray-900 dark:text-white text-nowrap p-1">
              {api.apiName}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 pl-1">
              Created At:{" "}
              {api.createdAt
                ? new Date(api.createdAt).toLocaleDateString()
                : "Unknown"}
            </p>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDropdownOpen((open) => !open);
              }}
              className="p-1 text-gray-500 hover:text-indigo-600"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-7 w-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg rounded-[6px] z-30 flex flex-col py-1">
                <button
                  disabled={isDuplicating === api._id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDropdownOpen(false);
                    onDuplicate(api);
                  }}
                  className="flex items-center gap-2 px-3 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                >
                  <Copy className="w-4 h-4" /> Copy
                </button>
                <button
                  disabled={isDeleting === api._id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDropdownOpen(false);
                    onDelete(api._id);
                  }}
                  className="flex items-center gap-2 px-3 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 disabled:opacity-50"
                >
                  <X className="w-4 h-4" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

// Main ApiList component
const ApiList = ({
  apis,
  selectedId,
  setApis,
  collapsed,
}: {
  apis: Api[];
  selectedId?: string;
  setApis: (apis: Api[]) => void;
  collapsed?: boolean;
}) => {
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [dupLoading, setDupLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleCreateApi = async () => {
    setCreateLoading(true);
    try {
      const res = await createApi({
        apiName: "New API",
        description: "Describe your API",
        endpoint: "/api/endpoint",
        method: "GET",
        params: [],
        response: {},
        createdAt: new Date().toISOString(),
      });

      setApis([res.data, ...apis]);
      router.push(`/dashboard/apiTool/${res.data._id}`);
    } catch (err) {
      console.error("Create failed:", err);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDuplicateApi = async (src: Api) => {
    setDupLoading(src._id);
    try {
      const { _id, createdAt, updatedAt, __v, ...cloneable } = src as any;

      const duplicatedApi = {
        ...cloneable,
        apiName: `${src.apiName} (copy)`,
        apiId: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      const res = await createApi(duplicatedApi);

      setApis([res.data, ...apis]);
      router.push(`/dashboard/apiTool/${res.data._id}`);
    } catch (err) {
      console.error("Duplication failed:", err);
      alert("Could not duplicate API.");
    } finally {
      setDupLoading(null);
    }
  };

  const handleDeleteApi = async (id: string) => {
    if (!confirm("Are you sure you want to delete this API?")) return;

    setDeleteLoading(id);

    try {
      const success = await deleteApi(id);
      if (success) {
        const updatedApis = apis.filter((api) => api._id !== id);
        setApis(updatedApis);

        if (selectedId === id) {
          if (updatedApis.length > 0) {
            router.push(`/dashboard/apiTool/${updatedApis[0]._id}`);
          } else {
            router.push(`/dashboard/apiTool`);
          }
        }
      } else {
        alert("Failed to delete API");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div
      className="w-full border-gray-200 dark:border-gray-800 border-t-0 flex flex-col bg-white dark:bg-gray-900"
      style={{ height: "100%", overflow: "hidden" }}
    >
      {/* Header with title and create button */}
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 p-4 pt-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <div className="flex gap-1.5">
          <Server className="w-3.5 h-3.5 self-center text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-lg self-center text-indigo-600 dark:text-indigo-400">
            APIs
          </h1>
        </div>

        <Button
          onClick={handleCreateApi}
          disabled={createLoading}
          className="px-5 py-1 text-md rounded-[4px] bg-indigo-500 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-700"
        >
          {createLoading ? "Creating..." : "Create"}
        </Button>
      </div>

      {/* List of APIs */}
      <div className="flex-1 overflow-y-auto p-3 bg-white dark:bg-gray-900">
        {apis.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-300">
            No APIs found. Click Create to add your first API.
          </div>
        ) : (
          apis.map((api) => (
            <ApiListItem
              key={api._id}
              api={api}
              isSelected={selectedId === api._id}
              onDelete={handleDeleteApi}
              onDuplicate={handleDuplicateApi}
              isDeleting={deleteLoading}
              isDuplicating={dupLoading}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ApiList;
