"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// This is the main page for the APIs section
export default function ApiPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchApis = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/apiTool/get");
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
          router.push(`/dashboard/apiTool/${data[0]._id}`);
        }
      } catch (error: any) {
        console.error("Failed to load APIs:", error);
        if (
          error.message === "Unauthorized" ||
          error.message === "Authentication token missing"
        ) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApis();
  }, []);

  return (
    <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-900">
      {loading ? (
        <div className="w-6 h-6 border-2 border-t-transparent border-indigo-600 rounded-full animate-spin"></div>
      ) : data.length > 0 ? (
        <div>Redirecting to API...</div>
      ) : (
        <div>No APIs found</div>
      )}
    </div>
  );
}
