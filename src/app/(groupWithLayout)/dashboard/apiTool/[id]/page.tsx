"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchApiById } from "@/components/apiTool/api"; // You should implement this function
import { Api } from "@/components/apiTool/types"; // Define your Api type
import ApiDetailsPanel from "@/components/apiTool/right/ApiDetailsPanel"; // Create this component

export default function ApiDetailsPage() {
  const [api, setApi] = useState<Api | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const apiId = params?.id as string;

  useEffect(() => {
    const loadApi = async () => {
      setLoading(true);
      try {
        const apiData = await fetchApiById(apiId);
        setApi(apiData);
      } catch (error) {
        console.error("Failed to load API:", error);
      } finally {
        setLoading(false);
      }
    };

    if (apiId) {
      loadApi();
    }
  }, [apiId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="w-6 h-6 border-2 border-t-transparent border-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!api) {
    return (
      <div className="text-center py-10 text-red-500">
        API not found. It may have been deleted or the ID is invalid.
      </div>
    );
  }

  return <ApiDetailsPanel api={api} setApi={setApi} />;
}
