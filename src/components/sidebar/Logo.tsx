"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  collapsed: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", collapsed }) => {
  return (
    <div className="flex items-center justify-center">
      {!collapsed ? (
        <Image
          alt="proPAL AI Logo"
          src="/assets/logo1.png"
          width={720}
          height={720}
          className="h-12 w-auto object-contain"
          priority
        />
      ) : (
        <div className="h-12"></div>
      )}
    </div>
  );
};

export default Logo;
