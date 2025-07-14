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
        // console.log(data);
        setData(data);
        // if(data.length > 0) {
        //   redirect(`/dashboard/agents/${data[0]._id}`);
        // }
      } catch (error: any) {
        console.error("Failed to load agents:", error);
        if (error.message === "Unauthorized") {
          redirect("/login");
        }
        if (error.message === "Authentication token missing") {
          redirect("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
    // redirect(`/dashboard/agents/${data[0]._id}`);
  }, []);
  return (
    <div className="h-full flex items-center justify-center text-gray-500">
      {loading ? (
        <div className="w-6 h-6 border-2 border-t-transparent border-indigo-600 rounded-full animate-spin">
          {" "}
        </div>
      ) : data.length > 0 ? (
        <div>Redirecting to agent...</div>
      ) : (
        <div>No agents found</div>
      )}
    </div>
  );
}
