"use client";
import CreateNewAgent from "@/components/agent/CreateNewAgent";
import Table from "@/components/agent/Table";
import Footer from "@/components/Footer";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { useState } from "react";

const page = () => {
  const [showCreateNewAgent, setShowCreateNewAgent] = useState<boolean>(false);

  return (
    <>
      <div className="flex">
        {/* <div className='fixed flex justify-between bg-white  '> */}
        {/* <div className="fixed top-0 left-0 w-full bg-white p-4 flex justify-between"> */}
        <Sidebar
          collapsed={false}
          setCollapsed={function (value: React.SetStateAction<boolean>): void {
            throw new Error("Function not implemented.");
          }}
        />
        <div className="ml-64 p-6 w-full">
          <div className="fixed left-64 top-0 right-0 z-50 bg-white p-4 flex justify-between items-center">
            <p className=""> Agent </p>
            {/* <Button className='cursor-pointer' onClick={()=> setShowCreateNewAgent(true)}>+ Create Agent</Button> */}

            <Link href="/dashboard/agent/newAgent">
              <Button className="cursor-pointer">+ Create Agent</Button>
            </Link>
          </div>
          <div>
            {showCreateNewAgent && (
              <CreateNewAgent onClose={() => setShowCreateNewAgent(false)} />
            )}
          </div>
          <Table />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default page;
