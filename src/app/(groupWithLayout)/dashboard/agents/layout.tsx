"use client";
import React, { useEffect, useState, createContext, useContext } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import AgentsList from "@/components/agents/AgentsList";
import { Agent } from "@/components/agents/types";
import { fetchAgents } from "@/components/agents/api";
import { UserDataProvider } from "@/components/profile/UserDataContext";
import { SessionProvider } from "next-auth/react";
import AgentListSkeleton from "@/components/agents/AgentListSkeleton";

// Create context for agents state
interface AgentsContextType {
  agents: Agent[];
  setAgents: (agents: Agent[]) => void;
  updateAgentInList: (updatedAgent: Agent) => void;
}

const AgentsContext = createContext<AgentsContextType | undefined>(undefined);

// Custom hook to use agents context
export const useAgentsContext = () => {
  const context = useContext(AgentsContext);
  if (context === undefined) {
    throw new Error("useAgentsContext must be used within an AgentsProvider");
  }
  return context;
};

// The layout for the agents section of the dashboard
export default function AgentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Extract the selected agent ID from the URL

  const selectedId = pathname?.split("/").pop();

  // Function to update a specific agent in the list
  const updateAgentInList = (updatedAgent: Agent) => {
    setAgents((prevAgents) =>
      prevAgents.map((agent) =>
        agent._id === updatedAgent._id ? updatedAgent : agent
      )
    );
  };

  // Fetch the list of agents when the component mounts
  useEffect(() => {
    const loadAgents = async () => {
      setLoading(true);
      try {
        const agentsData: any = await fetchAgents();
        if (
          agentsData.message === "Unauthorized" ||
          agentsData.message === "Authentication token missing"
        ) {
          router.push("/login");
          return;
        }
        setAgents(agentsData);
        // console.log("agentsData", agentsData);

        if (agentsData.length > 0) {
          router.push(`/dashboard/agents/${agentsData[0]._id}`);
        }
      } catch (error) {
        console.error("Failed to load agents:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
  }, []);

  return (
    <UserDataProvider>
      <AgentsContext.Provider value={{ agents, setAgents, updateAgentInList }}>
        <div
          className={`flex h-full transition-all duration-200 ${
            sidebarCollapsed ? "ml-16" : ""
          } bg-white dark:bg-gray-900`}
          style={{ height: "calc(100vh - 12px)" }}
        >
          {/* Left sidebar with agents list (25% width) */}
          <div
            className={`transition-all duration-200 ${sidebarCollapsed ? "w-40" : "w-1/4"} border-r border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800`}
          >
            {loading ? (
              <AgentListSkeleton />
            ) : (
              <AgentsList
                agents={agents}
                setAgents={setAgents}
                selectedId={selectedId}
                collapsed={sidebarCollapsed}
              />
            )}
          </div>

          {/* Main content area (75% width) */}
          <div className="flex-1 h-screen overflow-auto transition-all duration-200 bg-white dark:bg-gray-900 text-black dark:text-white">
            {children}
          </div>
        </div>
      </AgentsContext.Provider>
    </UserDataProvider>
  );
}
