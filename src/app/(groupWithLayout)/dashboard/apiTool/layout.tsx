"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserDataProvider } from "@/components/profile/UserDataContext";
import ApiList from "@/components/apiTool/ApiList"; // You should create this component
import { fetchApis } from "@/components/apiTool/api"; // You should create this function
import { Api } from "@/components/apiTool/types"; // Define your Api type

export default function ApiLayout({ children }: { children: React.ReactNode }) {
  const [apis, setApis] = useState<Api[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Extract the selected API ID from the URL
  const selectedId = pathname?.split("/").pop();

  // Fetch the list of APIs when the component mounts
  useEffect(() => {
    const loadApis = async () => {
      setLoading(true);
      try {
        const apisData: any = await fetchApis();
        if (
          apisData.message === "Unauthorized" ||
          apisData.message === "Authentication token missing"
        ) {
          router.push("/login");
          return;
        }
        setApis(apisData);

        if (apisData.length > 0) {
          router.push(`/dashboard/apiTool/${apisData[0]._id}`);
        }
      } catch (error) {
        console.error("Failed to load APIs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadApis();
  }, []);

  return (
    <UserDataProvider>
      <div
        className={`flex h-full transition-all duration-200 ${
          sidebarCollapsed ? "ml-16" : ""
        }`}
        style={{ height: "calc(100vh - 12px)" }}
      >
        {/* Left sidebar with API list (25% width) */}
        <div
          className={`transition-all duration-200 ${sidebarCollapsed ? "w-40" : "w-1/4"} border-r border-gray-100`}
        >
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="w-6 h-6 border-2 border-t-transparent border-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <ApiList
              apis={apis}
              setApis={setApis}
              selectedId={selectedId}
              collapsed={sidebarCollapsed}
            />
          )}
        </div>

        {/* Main content area (75% width) */}
        <div className="flex-1 overflow-auto transition-all duration-200">
          {children}
        </div>
      </div>
    </UserDataProvider>
  );
}
