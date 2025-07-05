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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-scroll">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add API to Agent</h2>
            <p className="text-sm text-gray-600 mt-1">
              Select APIs from your database to add to this agent's tools
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search APIs by name, description, or endpoint..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
            />
          </div>
        </div>

        {/* API List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Loading APIs...</span>
            </div>
          ) : filteredApis.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No APIs found" : "No APIs available"}
              </h3>
              <p className="text-gray-600">
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
                  className={`p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer hover:border-blue-300 hover:shadow-md ${
                    isApiSelected(api._id)
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200 bg-white"
                  }`}
                  onClick={() => !isApiSelected(api._id) && handleApiSelect(api)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {api.apiName}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            api.method === "GET"
                              ? "bg-green-100 text-green-800"
                              : api.method === "POST"
                              ? "bg-blue-100 text-blue-800"
                              : api.method === "PUT"
                              ? "bg-yellow-100 text-yellow-800"
                              : api.method === "DELETE"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {api.method}
                        </span>
                        {isApiSelected(api._id) && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Added
                          </span>
                        )}
                      </div>
                      {api.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {api.description}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">
                        {api.endpoint}
                      </p>
                      {api.params && api.params.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {api.params.slice(0, 3).map((param, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                            >
                              {param.name}: {param.type}
                            </span>
                          ))}
                          {api.params.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
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
                        className="ml-4 p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
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
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {filteredApis.length} API{filteredApis.length !== 1 ? "s" : ""}{" "}
              found
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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