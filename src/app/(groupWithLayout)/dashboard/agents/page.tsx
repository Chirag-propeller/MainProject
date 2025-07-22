"use client";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// This is the main page for the agents section
export default function AgentsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/agents/get");
        const data = await response.json();
        if (
          data.message === "Unauthorized" ||
          data.message === "Authentication token missing"
        ) {
          router.push("/login");
          return;
        }
        setData(data);
        if (data.length > 0) {
          router.replace(`/dashboard/agents/${data[0]._id}`);
        }
      } catch (error: any) {
        console.error("Failed to load agents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [router]);

  // Show loading skeleton
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 bg-white dark:bg-gray-900 dark:text-gray-300">
        <div className="w-6 h-6 border-2 border-t-transparent border-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show message if no agents are found
  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 bg-white dark:bg-gray-900 dark:text-gray-300">
        No agents found.
      </div>
    );
  }

  // Render nothing while redirecting
  return null;
}
