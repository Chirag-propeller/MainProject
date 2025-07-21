"use client";

import Sidebar from "@/components/sidebar";
import { ReactNode, useState } from "react";
import Footer from "@/components/Footer";
import { DarkModeProvider } from "@/contexts/DarkModeContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <DarkModeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 custom-scrollbar">
        <div className="flex min-h-screen">
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          <main
            className={`${collapsed ? "ml-16" : "ml-45"} w-full transition-all duration-200 bg-white dark:bg-gray-900`}
          >
            {children}
          </main>
        </div>
        {/* <Footer/> */}
      </div>
    </DarkModeProvider>
  );
};

export default DashboardLayout;
