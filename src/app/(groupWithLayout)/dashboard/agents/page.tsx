'use client'
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

// This is the main page for the agents section
export default function AgentsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  useEffect(() => {

    const fetchAgents = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/agents/get');
        const data = await response.json();
        console.log(data);
        setData(data);
        // if(data.length > 0) {
        //   redirect(`/dashboard/agents/${data[0]._id}`);
        // }
        
      } catch (error) {
        console.error('Failed to load agents:', error);
      }finally{
        setLoading(false);
      }

    };

    fetchAgents();
    // redirect(`/dashboard/agents/${data[0]._id}`);
  }, []);
  return (
    <div className="h-full flex items-center justify-center text-gray-500">
      {loading ? (
        <div className="w-6 h-6 border-2 border-t-transparent border-indigo-600 rounded-full animate-spin"> </div>
      ) : data.length > 0 ? (
        <div>
          Redirecting to agent...
        </div>
      ) : (
        <div>
          No agents found
        </div>
      )}
    </div>
  );
} 