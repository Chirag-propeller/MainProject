"use client";
import React, { useState, useEffect } from "react";
import { X, Search, Check, Plus } from "lucide-react";
import { Api } from "@/components/apiTool/types";
import { fetchApis } from "@/components/apiTool/api";
import { toast } from "react-hot-toast";

interface ApiSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApiSelect: (api: Api) => void;
  selectedApis?: string[]; // Array of API IDs that are already selected
}

const ApiSelectionModal: React.FC<ApiSelectionModalProps> = ({
  isOpen,
  onClose,
  onApiSelect,
  selectedApis = [],
}) => {
  const [apis, setApis] = useState<Api[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredApis, setFilteredApis] = useState<Api[]>([]);

  // Fetch APIs from database
  useEffect(() => {
    if (isOpen) {
      fetchApisFromDatabase();
    }
  }, [isOpen]);

  // Filter APIs based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredApis(apis);
    } else {
      const filtered = apis.filter(
        (api) =>
          api.apiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          api.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          api.endpoint.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredApis(filtered);
    }
  }, [searchTerm, apis]);

  const fetchApisFromDatabase = async () => {
    setLoading(true);
    try {
      const apisData = await fetchApis();
      setApis(apisData);
      setFilteredApis(apisData);
    } catch (error) {
      console.error("Failed to fetch APIs:", error);
      toast.error("Failed to load APIs");
    } finally {
      setLoading(false);
    }
  };

  const handleApiSelect = (api: Api) => {
    onApiSelect(api);
    toast.success(`${api.apiName} added to agent tools`);
  };

  const isApiSelected = (apiId: string) => {
    return selectedApis.includes(apiId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Add API to Agent
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Select APIs from your database to add to this agent's tools
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-4 h-4" />
            <input
              type="text"
              placeholder="Search APIs by name, description, or endpoint..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-1 border border-gray-200 dark:border-gray-700 rounded-[6px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all duration-200"
            />
          </div>
        </div>

        {/* API List */}
        <div className="flex-1 overflow-y-scroll p-6 max-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-300">
                Loading APIs...
              </span>
            </div>
          ) : filteredApis.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400 dark:text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm ? "No APIs found" : "No APIs available"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Create your first API in the API Tool section"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredApis.map((api) => (
                <div
                  key={api._id}
                  className={`p-2 border-2 rounded-[6px] transition-all duration-200 cursor-pointer hover:border-blue-300 hover:shadow-md ${
                    isApiSelected(api._id)
                      ? "border-green-300 bg-green-50 dark:border-indigo-900 dark:bg-indigo-950/50"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  }`}
                  onClick={() =>
                    !isApiSelected(api._id) && handleApiSelect(api)
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {api.apiName}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-light rounded-full ${
                            api.method === "GET"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                              : api.method === "POST"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : api.method === "PUT"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                  : api.method === "DELETE"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {api.method}
                        </span>
                        {isApiSelected(api._id) && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-indigo-900 text-indigo-800 dark:text-green-200 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Added
                          </span>
                        )}
                      </div>
                      {api.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {api.description}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-900/50 px-2 py-1 rounded">
                        {api.endpoint}
                      </p>
                      {api.params && api.params.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {api.params.slice(0, 3).map((param, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded"
                            >
                              {param.name}: {param.type}
                            </span>
                          ))}
                          {api.params.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded">
                              +{api.params.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {!isApiSelected(api._id) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApiSelect(api);
                        }}
                        className="ml-4 p-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-[6px]">
          <div className="flex justify-between items-center">
            <p className="pl-4 text-sm text-gray-600 dark:text-gray-300">
              {filteredApis.length} API{filteredApis.length !== 1 ? "s" : ""}{" "}
              found
            </p>
            <button
              onClick={onClose}
              className="px-4 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-[6px] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiSelectionModal;
