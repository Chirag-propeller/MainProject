"use client";

import Sidebar from "@/components/sidebar";
import { ReactNode, useState } from "react";
import Footer from "@/components/Footer";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="">
      <div className="flex">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main
          className={`${collapsed ? "ml-16" : "ml-45"} w-full transition-all duration-200`}
        >
          {children}
        </main>
      </div>
      {/* <Footer/> */}
    </div>
  );
};

export default DashboardLayout;
