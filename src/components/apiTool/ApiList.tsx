"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Api } from "./types";
import { createApi, deleteApi } from "./api";
import { Button } from "@/components/ui/button";
import { Copy, Server } from "lucide-react";

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
  const [showConfirm, setShowConfirm] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Hide on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setShowConfirm(false);
      }
    };

    if (showConfirm) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showConfirm]);

  return (
    <Link href={`/dashboard/apiTool/${api._id}`} className="block relative">
      <div
        className={`p-2 px-2 border rounded-[6px] mb-1 hover:border-indigo-500 transition-colors ${
          isSelected ? "border-indigo-500 bg-indigo-50" : "border-gray-200"
        }`}
      >
        <div className="flex justify-between items-start ">
          {/* Left: API Info */}
          <div>
            <h3 className="text-[14px] overflow-hidden text-ellipsis max-w-32 text-gray-900 text-nowrap p-1">
              {api.apiName}
            </h3>
            <p className="text-xs text-gray-600 pl-1">
              Created At:{" "}
              {api.createdAt
                ? new Date(api.createdAt).toLocaleDateString()
                : "Unknown"}
            </p>
          </div>

          {/* Right: Duplicate & Delete */}
          <div className="relative gap-2" ref={popoverRef}>
            <button
              disabled={isDuplicating === api._id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDuplicate(api);
              }}
              className="text-gray-500 hover:text-indigo-600 transition-colors p-1 pt-1"
            >
              {isDuplicating === api._id ? (
                <div className="w-6 h-6 border-t-transparent animate-spin"></div>
              ) : (
                <div className="w-6 h-6 relative">
                  <Copy className="pr-2" />
                </div>
              )}
            </button>
            <button
              disabled={isDeleting === api._id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowConfirm((prev) => !prev);
              }}
              className="text-gray-500 hover:text-red-600 transition-colors p-1 pt-5 group"
            >
              {isDeleting === api._id ? (
                <div className="w-4 h-4 border-t-transparent animate-spin"></div>
              ) : (
                <div className="w-6 h-6 relative">
                  <svg
                    viewBox="0 0 30 30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-full h-full text-current"
                  >
                    {/* Lid */}
                    <g className="transition-transform duration-300 ease-in-out group-hover:-translate-y-0.5 group-hover:-rotate-20 origin-center">
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <path d="M3 6h18" />
                    </g>
                    {/* Body */}
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    {/* Trash lines */}
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </div>
              )}
            </button>

            {/* Confirmation Box */}
            {showConfirm && (
              <div className="absolute top-8 right-0 w-max bg-white border border-gray-300 shadow-lg rounded-[6px] z-25">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(api._id);
                    setShowConfirm(false);
                  }}
                  className="text-red-600 hover:text-red-700 text-[10px] font-light px-1 pb-1 transition-colors rounded-[6px]"
                >
                  Delete API
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
      className="w-full border-gray-200 border-t-0 flex flex-col"
      style={{ height: "100%", overflow: "hidden" }}
    >
      {/* Header with title and create button */}
      <div className="sticky top-0 z-20 bg-white p-4 pt-6 border-b border-gray-200 flex justify-between items-center">
        <div className="flex gap-1.5">
          <Server className="w-3.5 h-3.5 self-center text-indigo-600" />
          <h1 className="text-lg self-center text-indigo-600">APIs</h1>
        </div>

        <Button
          onClick={handleCreateApi}
          disabled={createLoading}
          className="px-5 py-1 text-md rounded-[4px]"
        >
          {createLoading ? "Creating..." : "Create"}
        </Button>
      </div>

      {/* List of APIs */}
      <div className="flex-1 overflow-y-auto p-3">
        {apis.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
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
